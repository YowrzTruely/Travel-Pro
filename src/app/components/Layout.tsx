import imgAvatar from "figma:asset/3e33ffb968ecb98f421cfb68a6d08fed3e8bf007.png";
import imgLogo from "figma:asset/b655d2164f14a54b258c6a8a069f10a88a1c4640.png";
import { useMutation } from "convex/react";
import type { LucideIcon } from "lucide-react";
import {
  Box,
  Calendar,
  CheckCircle,
  ClipboardList,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Settings,
  Shield,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { useAuth } from "./AuthContext";
import { Breadcrumbs } from "./Breadcrumbs";
import { FormField, FormSelect, rules } from "./FormField";
import { GlobalSearch } from "./GlobalSearch";
import { NotificationsPanel } from "./NotificationsPanel";

interface NewProjectForm {
  client: string;
  name: string;
  participants: string;
  region: string;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

const producerNavItems: NavItem[] = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/projects", label: "פרויקטים", icon: FolderOpen },
  { path: "/suppliers", label: "בנק ספקים", icon: Users },
  { path: "/clients", label: "לקוחות", icon: UserCircle },
  { path: "/documents", label: "מסמכים", icon: FileText },
  { path: "/calendar", label: "יומן", icon: Calendar },
];

const supplierNavItems: NavItem[] = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/products", label: "מוצרים", icon: Box },
  { path: "/documents", label: "מסמכים", icon: FileText },
  { path: "/availability", label: "זמינות", icon: Calendar },
  { path: "/requests", label: "בקשות", icon: ClipboardList },
  { path: "/profile", label: "פרופיל", icon: UserCircle },
];

const adminNavItems: NavItem[] = [
  { path: "/", label: "דשבורד", icon: Shield },
  { path: "/approve-suppliers", label: "אישור ספקים", icon: CheckCircle },
  { path: "/users", label: "משתמשים", icon: Users },
];

const bottomNavItems: NavItem[] = [
  { path: "/settings", label: "הגדרות", icon: Settings },
];

function getNavItemsForRole(role?: string): NavItem[] {
  switch (role) {
    case "supplier":
      return supplierNavItems;
    case "admin":
      return adminNavItems;
    default:
      return producerNavItems;
  }
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout, user, profile } = useAuth();
  const mainNavItems = getNavItemsForRole(profile?.role);
  const isProducer = !profile?.role || profile.role === "producer";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [npSaving, setNpSaving] = useState(false);

  const createProject = useMutation(api.projects.create);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isValid },
    reset,
  } = useForm<NewProjectForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      client: "",
      participants: "",
      region: "גליל עליון",
    },
  });

  // Auto-open new project modal from URL param
  useEffect(() => {
    if (searchParams.get("newProject") === "true") {
      setShowNewProject(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Don't show layout for client quote pages
  if (location.pathname.startsWith("/quote/") || location.pathname === "/prd") {
    return <Outlet />;
  }

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const onSubmitProject = async (data: NewProjectForm) => {
    try {
      setNpSaving(true);
      const projectId = await createProject({
        name: data.name.trim(),
        client: data.client.trim(),
        company: data.client.trim(),
        participants: Number.parseInt(data.participants, 10) || 0,
        region: data.region,
      });
      appToast.success(
        "פרויקט חדש נוצר בהצלחה!",
        "תוכל להתחיל להוסיף רכיבים וספקים"
      );
      setShowNewProject(false);
      reset();
      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error("[Layout] Failed to create project:", err);
      appToast.error("שגיאה ביצירת פרויקט", String(err));
    } finally {
      setNpSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowNewProject(false);
    reset();
  };

  return (
    <div
      className="flex h-screen bg-[#f8f7f5] font-['Assistant',sans-serif]"
      dir="rtl"
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-[256px] transform bg-white transition-transform duration-300 ease-in-out lg:static ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"} flex flex-col border-[#e7e1da] border-l`}
      >
        {/* Logo */}
        <div className="border-[#f5f3f0] border-b">
          <button
            className="flex w-full cursor-pointer items-center gap-3 px-6 py-6 text-left"
            onClick={() => navigate("/")}
            type="button"
          >
            <img
              alt="יום כיף - ערן לוי"
              className="h-10 w-10 shrink-0 rounded-lg object-contain"
              height="600"
              src={imgLogo}
              width="800"
            />
            <div>
              <div
                className="text-[#181510] text-[18px]"
                style={{ fontWeight: 700 }}
              >
                יום כיף
              </div>
              <div className="text-[#8d785e] text-[12px]">
                ערן לוי - הפקת אירועים
              </div>
            </div>
          </button>
          <button
            className="absolute top-5 left-4 text-[#8d785e] lg:hidden"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-1 flex-col px-4 py-4">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-all ${
                    active
                      ? "bg-[rgba(255,140,0,0.1)] text-[#ff8c00]"
                      : "text-[#181510] hover:bg-[#f5f3f0]"
                  }
                  `}
                  dir="rtl"
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  style={{ fontWeight: active ? 600 : 400 }}
                  type="button"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          <div className="border-[#f5f3f0] border-t pt-4">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-all ${
                    active
                      ? "bg-[rgba(255,140,0,0.1)] text-[#ff8c00]"
                      : "text-[#181510] hover:bg-[#f5f3f0]"
                  }
                  `}
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  style={{ fontWeight: active ? 600 : 400 }}
                  type="button"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User + New project */}
        <div className="space-y-3 border-[#f5f3f0] border-t bg-[#fcfbf9] p-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 shrink-0 rounded-full border-2 border-white bg-center bg-cover shadow-sm"
              style={{ backgroundImage: `url('${imgAvatar}')` }}
            />
            <div className="min-w-0 flex-1">
              <div
                className="truncate text-[#181510] text-[14px]"
                style={{ fontWeight: 600 }}
              >
                {profile?.name || user?.email?.split("@")[0] || "משתמש"}
              </div>
              <div className="truncate text-[#8d785e] text-[12px]">
                {profile?.role === "supplier"
                  ? "ספק"
                  : profile?.role === "admin"
                    ? "מנהל מערכת"
                    : "מפיק"}
              </div>
            </div>
            <button
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8d785e] transition-colors hover:bg-red-50 hover:text-[#ef4444]"
              onClick={logout}
              title="התנתק"
              type="button"
            >
              <LogOut size={16} />
            </button>
          </div>
          {isProducer && (
            <button
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff8c00] py-2.5 text-white shadow-sm transition-all hover:bg-[#e67e00]"
              onClick={() => setShowNewProject(true)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <span className="text-[16px]">+ פרויקט חדש</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-[#e7e1da] border-b bg-white px-4 lg:px-8">
          <button
            className="shrink-0 text-[#181510] lg:hidden"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <GlobalSearch />
          <div className="flex-1" />
          <div className="flex shrink-0 items-center gap-1">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-[#181510] transition-colors hover:bg-[#f5f3f0]"
              onClick={() => navigate("/prd")}
              title="עזרה ומידע"
              type="button"
            >
              <HelpCircle size={20} />
            </button>
            <NotificationsPanel />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* New project modal */}
      {showNewProject && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={handleCloseModal}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            dir="rtl"
            role="dialog"
          >
            <h2
              className="mb-4 text-[#181510] text-[22px]"
              style={{ fontWeight: 700 }}
            >
              פרויקט חדש
            </h2>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmitProject)}
            >
              <FormField
                error={errors.name}
                isDirty={dirtyFields.name}
                label="שם הפרויקט"
                placeholder="למשל: נופש שנתי חברת XYZ"
                required
                {...register("name", rules.requiredMin("שם הפרויקט", 2))}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  error={errors.client}
                  isDirty={dirtyFields.client}
                  label="לקוח"
                  placeholder="שם החברה"
                  required
                  {...register("client", rules.required("לקוח"))}
                />
                <FormField
                  error={errors.participants}
                  isDirty={dirtyFields.participants}
                  label="מספר משתתפים"
                  placeholder="120"
                  type="number"
                  {...register(
                    "participants",
                    rules.optionalPositiveInt("מספר משתתפים")
                  )}
                />
              </div>
              <FormSelect
                error={errors.region}
                isDirty={dirtyFields.region}
                label="אזור"
                {...register("region")}
              >
                <option>גליל עליון</option>
                <option>מרכז</option>
                <option>ירושלים</option>
                <option>דרום</option>
                <option>אילת</option>
                <option>גולן</option>
              </FormSelect>
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={npSaving || !isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {npSaving && <Loader2 className="animate-spin" size={16} />}
                  {npSaving ? "יוצר..." : "צור פרויקט"}
                </button>
                <button
                  className="rounded-lg border border-[#e7e1da] px-6 py-2.5 text-[#181510] transition-colors hover:bg-[#f5f3f0]"
                  onClick={handleCloseModal}
                  type="button"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
