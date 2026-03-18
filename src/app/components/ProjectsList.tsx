import { useMutation, useQuery } from "convex/react";
import {
  ArrowRightLeft,
  ChevronLeft,
  Copy,
  DollarSign,
  Edit2,
  FolderOpen,
  Loader2,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { useConfirmDelete } from "./ConfirmDeleteModal";
import { regionDisplayLabel } from "./constants/supplierConstants";
import type { Project } from "./data";
import { FormField, rules } from "./FormField";

const STATUS_OPTIONS_ALL = [
  "הכל",
  "ליד חדש",
  "בניית הצעה",
  "הצעה נשלחה",
  "אושר",
  "מחיר בהערכה",
  "בביצוע",
];
const STATUS_CHANGE_OPTIONS = [
  "ליד חדש",
  "בניית הצעה",
  "הצעה נשלחה",
  "אושר",
  "מחיר בהערכה",
  "בביצוע",
];

const STATUS_COLORS: Record<string, string> = {
  "ליד חדש": "#3b82f6",
  "בניית הצעה": "#f97316",
  "הצעה נשלחה": "#8b5cf6",
  אושר: "#22c55e",
  "מחיר בהערכה": "#eab308",
  בביצוע: "#ff8c00",
};

interface EditProjectForm {
  client: string;
  name: string;
  participants: string;
  region: string;
}

export function ProjectsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get("status") || "הכל";
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [search, setSearch] = useState("");

  // Convex query — returns undefined while loading, then an array
  const projects = useQuery(api.projects.list);
  const loading = projects === undefined;

  // Convex mutations
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const removeProject = useMutation(api.projects.remove);

  // Action state
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusProject, setStatusProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  // Edit form
  const editForm = useForm<EditProjectForm>({
    mode: "onChange",
    defaultValues: { name: "", client: "", participants: "", region: "" },
  });

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    if (openMenu) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openMenu]);

  const filtered = (projects ?? []).filter((p) => {
    const matchesStatus = statusFilter === "הכל" || p.status === statusFilter;
    const matchesSearch =
      !search || p.name.includes(search) || (p.company || "").includes(search);
    return matchesStatus && matchesSearch;
  });

  // ─── Edit project ───
  const openEdit = (project: Project) => {
    setEditingProject(project);
    editForm.reset({
      name: project.name,
      client: project.client || project.company,
      participants: String(project.participants || ""),
      region: project.region,
    });
    setOpenMenu(null);
  };

  const onSaveEdit = async (data: EditProjectForm) => {
    if (!editingProject) {
      return;
    }
    try {
      setSaving(true);
      await updateProject({
        id: editingProject.id,
        name: data.name.trim(),
        client: data.client.trim(),
        company: data.client.trim(),
        participants: Number.parseInt(data.participants, 10) || 0,
        region: data.region.trim(),
      });
      setEditingProject(null);
      editForm.reset();
      appToast.success("פרויקט עודכן", `"${data.name.trim()}" עודכן בהצלחה`);
    } catch (err) {
      console.error("[ProjectsList] Update failed:", err);
      appToast.error("שגיאה", "לא ניתן לעדכן את הפרויקט");
    } finally {
      setSaving(false);
    }
  };

  // ─── Change status ───
  const openStatusChange = (project: Project) => {
    setStatusProject(project);
    setOpenMenu(null);
  };

  const changeStatus = async (newStatus: string) => {
    if (!statusProject) {
      return;
    }
    try {
      setSaving(true);
      await updateProject({
        id: statusProject.id,
        status: newStatus,
        statusColor: STATUS_COLORS[newStatus] || "#8d785e",
      });
      setStatusProject(null);
      appToast.success("סטטוס עודכן", `"${statusProject.name}" → ${newStatus}`);
    } catch (err) {
      console.error("[ProjectsList] Status change failed:", err);
      appToast.error("שגיאה", "לא ניתן לשנות את הסטטוס");
    } finally {
      setSaving(false);
    }
  };

  // ─── Duplicate project ───
  const duplicateProject = async (project: Project) => {
    setOpenMenu(null);
    try {
      await createProject({
        name: `${project.name} (עותק)`,
        client: project.client,
        company: project.company,
        participants: project.participants,
        region: project.region,
      });
      appToast.success("פרויקט שוכפל", `"${project.name} (עותק)" נוצר בהצלחה`);
    } catch (err) {
      console.error("[ProjectsList] Duplicate failed:", err);
      appToast.error("שגיאה בשכפול פרויקט");
    }
  };

  // ─── Delete project ───
  const openDelete = (project: Project) => {
    setOpenMenu(null);
    requestDelete({
      title: "מחיקת פרויקט",
      itemName: project.name,
      onConfirm: async () => {
        await removeProject({ id: project.id });
        appToast.success("פרויקט נמחק", `"${project.name}" הוסר מהמערכת`);
      },
    });
  };

  return (
    <div className="mx-auto p-4 font-['Assistant',sans-serif] lg:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <FolderOpen className="text-primary" size={20} />
          </div>
          <h1
            className="text-[26px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            פרויקטים
          </h1>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[14px] text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover"
          onClick={() => navigate("/projects?newProject=true")}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <Plus size={16} /> פרויקט חדש
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            className="w-full rounded-lg border border-border bg-card py-2.5 pr-9 pl-3 text-[14px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש פרויקט..."
            value={search}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
          {STATUS_OPTIONS_ALL.map((status) => (
            <button
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[12px] transition-all ${
                statusFilter === status
                  ? "bg-foreground text-white"
                  : "text-muted-foreground hover:bg-accent"
              }`}
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{ fontWeight: statusFilter === status ? 600 : 400 }}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="mb-3 animate-spin text-primary" size={32} />
          <p className="text-[14px] text-muted-foreground">טוען פרויקטים...</p>
        </div>
      )}

      {/* Projects grid */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div
              className="group relative rounded-xl border border-border bg-card p-5 text-right transition-all hover:border-tertiary hover:shadow-lg"
              key={project.id}
            >
              {/* Action menu trigger */}
              <div
                className="absolute top-3 left-3 z-10"
                ref={openMenu === project.id ? menuRef : undefined}
              >
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === project.id ? null : project.id);
                  }}
                  type="button"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown menu */}
                {openMenu === project.id && (
                  <div className="absolute top-9 left-0 z-50 w-44 rounded-xl border border-border bg-card py-1 shadow-xl">
                    <button
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] text-foreground transition-colors hover:bg-accent"
                      onClick={() => openEdit(project as unknown as Project)}
                      type="button"
                    >
                      <Edit2 className="text-muted-foreground" size={14} />
                      ערוך פרטים
                    </button>
                    <button
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] text-foreground transition-colors hover:bg-accent"
                      onClick={() =>
                        openStatusChange(project as unknown as Project)
                      }
                      type="button"
                    >
                      <ArrowRightLeft
                        className="text-muted-foreground"
                        size={14}
                      />
                      שנה סטטוס
                    </button>
                    <button
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] text-foreground transition-colors hover:bg-accent"
                      onClick={() =>
                        duplicateProject(project as unknown as Project)
                      }
                      type="button"
                    >
                      <Copy className="text-muted-foreground" size={14} />
                      שכפל פרויקט
                    </button>
                    <div className="my-1 border-accent border-t" />
                    <button
                      className="flex w-full items-center gap-2.5 px-3 py-2.5 text-[13px] text-destructive transition-colors hover:bg-destructive/10"
                      onClick={() => openDelete(project as unknown as Project)}
                      type="button"
                    >
                      <Trash2 size={14} />
                      מחק פרויקט
                    </button>
                  </div>
                )}
              </div>

              {/* Card content — clickable */}
              <button
                className="w-full text-right"
                onClick={() => navigate(`/projects/${project.id}`)}
                type="button"
              >
                <div className="mb-3 flex items-center justify-between pl-9">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px]"
                    style={{
                      backgroundColor: `${project.statusColor}15`,
                      color: project.statusColor,
                      fontWeight: 600,
                    }}
                  >
                    {project.status}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    #{project.id}
                  </span>
                </div>
                <h3
                  className="mb-1 text-[16px] text-foreground transition-colors group-hover:text-primary"
                  style={{ fontWeight: 600 }}
                >
                  {project.name}
                </h3>
                <p className="mb-3 text-[12px] text-muted-foreground">
                  {project.company}
                </p>
                <div className="flex flex-wrap gap-3 text-[12px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {project.participants}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />{" "}
                    {regionDisplayLabel(project.region) || project.region}
                  </span>
                  {project.totalPrice > 0 && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} /> ₪
                      {project.totalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {project.profitMargin > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-accent">
                      <div
                        className="h-full rounded-full bg-green-400"
                        style={{ width: `${project.profitMargin}%` }}
                      />
                    </div>
                    <span
                      className="text-[11px] text-success"
                      style={{ fontWeight: 600 }}
                    >
                      {project.profitMargin}%
                    </span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-end text-[12px] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  פתח פרויקט <ChevronLeft size={12} />
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <div className="mb-3 text-[40px]">📁</div>
          <p className="text-[16px] text-muted-foreground">לא נמצאו פרויקטים</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            נסה לשנות את הסינון או ליצור פרויקט חדש
          </p>
        </div>
      )}

      {/* ═══ Edit Project Modal ═══ */}
      {editingProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setEditingProject(null);
            editForm.reset();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3
                className="text-[20px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                עריכת פרויקט
              </h3>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setEditingProject(null);
                  editForm.reset();
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-4"
              onSubmit={editForm.handleSubmit(onSaveEdit)}
            >
              <FormField
                error={editForm.formState.errors.name}
                isDirty={editForm.formState.dirtyFields.name}
                label="שם פרויקט"
                required
                {...editForm.register(
                  "name",
                  rules.requiredMin("שם פרויקט", 2)
                )}
              />
              <FormField
                error={editForm.formState.errors.client}
                isDirty={editForm.formState.dirtyFields.client}
                label="לקוח / חברה"
                required
                {...editForm.register("client", rules.requiredMin("לקוח", 2))}
              />
              <FormField
                error={editForm.formState.errors.participants}
                isDirty={editForm.formState.dirtyFields.participants}
                label="מספר משתתפים"
                required
                type="number"
                {...editForm.register(
                  "participants",
                  rules.positiveInt("מספר משתתפים")
                )}
              />
              <FormField
                error={editForm.formState.errors.region}
                isDirty={editForm.formState.dirtyFields.region}
                label="אזור"
                {...editForm.register("region")}
              />
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
                  disabled={saving || !editForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Edit2 size={16} />
                  )}
                  {saving ? "שומר..." : "שמור שינויים"}
                </button>
                <button
                  className="rounded-xl border border-border px-5 transition-colors hover:bg-accent"
                  onClick={() => {
                    setEditingProject(null);
                    editForm.reset();
                  }}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Change Status Modal ═══ */}
      {statusProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setStatusProject(null)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="text-[20px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                שינוי סטטוס
              </h3>
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setStatusProject(null)}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-[13px] text-muted-foreground">
              פרויקט:{" "}
              <span style={{ fontWeight: 600, color: "#181510" }}>
                {statusProject.name}
              </span>
            </p>
            <div className="space-y-2">
              {STATUS_CHANGE_OPTIONS.map((status) => {
                const color = STATUS_COLORS[status] || "#8d785e";
                const isCurrent = statusProject.status === status;
                return (
                  <button
                    className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all ${
                      isCurrent
                        ? "cursor-default border-primary bg-primary/5"
                        : "border-border hover:border-tertiary hover:bg-accent"
                    }`}
                    disabled={isCurrent || saving}
                    key={status}
                    onClick={() => !isCurrent && changeStatus(status)}
                    type="button"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span
                        className="text-[14px] text-foreground"
                        style={{ fontWeight: isCurrent ? 600 : 400 }}
                      >
                        {status}
                      </span>
                    </div>
                    {isCurrent && (
                      <span
                        className="text-[11px] text-primary"
                        style={{ fontWeight: 600 }}
                      >
                        נוכחי
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal}
    </div>
  );
}
