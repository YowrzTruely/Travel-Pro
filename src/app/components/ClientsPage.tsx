import { useMutation, useQuery } from "convex/react";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit2,
  Filter,
  Loader2,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import type { Client } from "./data";
import { FormField, FormSelect, FormTextarea, rules } from "./FormField";

interface ClientForm {
  company: string;
  email: string;
  name: string;
  notes: string;
  phone: string;
  status: "active" | "lead" | "inactive";
}

const STATUS_OPTIONS = [
  "\u05d4\u05db\u05dc",
  "\u05e4\u05e2\u05d9\u05dc",
  "\u05dc\u05d9\u05d3",
  "\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc",
] as const;

const STATUS_MAP: Record<string, Client["status"]> = {
  "\u05e4\u05e2\u05d9\u05dc": "active",
  "\u05dc\u05d9\u05d3": "lead",
  "\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc": "inactive",
};

const STATUS_DISPLAY: Record<
  Client["status"],
  { label: string; color: string }
> = {
  active: { label: "\u05e4\u05e2\u05d9\u05dc", color: "#22c55e" },
  lead: { label: "\u05dc\u05d9\u05d3", color: "#3b82f6" },
  inactive: {
    label: "\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc",
    color: "#8d785e",
  },
};

const ITEMS_PER_PAGE = 10;

export function ClientsPage() {
  const clients = useQuery(api.clients.list);
  const createClient = useMutation(api.clients.create);
  const updateClient = useMutation(api.clients.update);
  const removeClient = useMutation(api.clients.remove);

  const loading = clients === undefined;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("\u05d4\u05db\u05dc");
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  const addForm = useForm<ClientForm>({
    mode: "onChange",
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      status: "lead",
      notes: "",
    },
  });

  const editForm = useForm<ClientForm>({
    mode: "onChange",
  });

  // --- Filtering ---
  const clientList = clients ?? [];
  const filtered = clientList.filter((c) => {
    const matchesSearch =
      !search ||
      c.name.includes(search) ||
      (c.company || "").includes(search) ||
      (c.phone || "").includes(search) ||
      (c.email || "").includes(search);
    const matchesStatus =
      statusFilter === "\u05d4\u05db\u05dc" ||
      c.status === STATUS_MAP[statusFilter];
    return matchesSearch && matchesStatus;
  });

  // --- Stats ---
  const totalClients = clientList.length;
  const activeCount = clientList.filter((c) => c.status === "active").length;
  const leadCount = clientList.filter((c) => c.status === "lead").length;
  const totalRevenue = clientList.reduce(
    (sum, c) => sum + (c.totalRevenue || 0),
    0
  );

  // --- CRUD ---
  const onSubmitAdd = async (data: ClientForm) => {
    try {
      setSaving(true);
      await createClient({
        name: data.name.trim(),
        company: data.company.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        status: data.status,
        notes: data.notes.trim(),
      });
      appToast.success(
        "\u05d4\u05dc\u05e7\u05d5\u05d7 \u05e0\u05d5\u05e1\u05e3 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4",
        "\u05e0\u05d9\u05ea\u05df \u05db\u05e2\u05ea \u05dc\u05e9\u05d9\u05d9\u05da \u05d0\u05d5\u05ea\u05d5 \u05dc\u05e4\u05e8\u05d5\u05d9\u05e7\u05d8\u05d9\u05dd"
      );
      setShowAddClient(false);
      addForm.reset();
    } catch (err) {
      console.error("[ClientsPage] Failed to create client:", err);
      appToast.error(
        "\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d9\u05e6\u05d9\u05e8\u05ea \u05dc\u05e7\u05d5\u05d7",
        String(err)
      );
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    editForm.reset({
      name: client.name,
      company: client.company,
      phone: client.phone,
      email: client.email,
      status: client.status,
      notes: client.notes || "",
    });
  };

  const onSaveEdit = async (data: ClientForm) => {
    if (!editingClient) {
      return;
    }
    try {
      setSaving(true);
      await updateClient({
        id: editingClient.id as any,
        name: data.name.trim(),
        company: data.company.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        status: data.status,
        notes: data.notes.trim(),
      });
      setEditingClient(null);
      editForm.reset();
      appToast.success(
        "\u05dc\u05e7\u05d5\u05d7 \u05e2\u05d5\u05d3\u05db\u05df",
        `"${data.name.trim()}" \u05e2\u05d5\u05d3\u05db\u05df \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4`
      );
    } catch (err) {
      console.error("[ClientsPage] Update failed:", err);
      appToast.error(
        "\u05e9\u05d2\u05d9\u05d0\u05d4",
        "\u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05e2\u05d3\u05db\u05df \u05d0\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7"
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingClient) {
      return;
    }
    try {
      setSaving(true);
      await removeClient({ id: deletingClient.id as any });
      appToast.success(
        "\u05dc\u05e7\u05d5\u05d7 \u05e0\u05de\u05d7\u05e7",
        `"${deletingClient.name}" \u05d4\u05d5\u05e1\u05e8 \u05de\u05d4\u05de\u05e2\u05e8\u05db\u05ea`
      );
      setDeletingClient(null);
    } catch (err) {
      console.error("[ClientsPage] Delete failed:", err);
      appToast.error(
        "\u05e9\u05d2\u05d9\u05d0\u05d4",
        "\u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05de\u05d7\u05d5\u05e7 \u05d0\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto p-4 font-['Assistant',sans-serif] lg:p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff8c00]/10">
            <UserCircle className="text-[#ff8c00]" size={22} />
          </div>
          <h1
            className="text-[#181510] text-[26px]"
            style={{ fontWeight: 700 }}
          >
            {
              "\u05e0\u05d9\u05d4\u05d5\u05dc \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea"
            }
          </h1>
        </div>
        <button
          className="flex items-center gap-2 rounded-xl bg-[#ff8c00] px-4 py-2.5 text-[14px] text-white shadow-[#ff8c00]/20 shadow-lg transition-all hover:bg-[#e67e00]"
          onClick={() => setShowAddClient(true)}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <Plus size={16} />
          {
            "\u05d4\u05d5\u05e1\u05e4\u05ea \u05dc\u05e7\u05d5\u05d7 \u05d7\u05d3\u05e9"
          }
        </button>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-[#e7e1da] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-[#8d785e] text-[12px]"
              style={{ fontWeight: 600 }}
            >
              {'\u05e1\u05d4"\u05db \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea'}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff8c00]/10">
              <Users className="text-[#ff8c00]" size={16} />
            </div>
          </div>
          <div
            className="text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            {totalClients}
          </div>
        </div>
        <div className="rounded-xl border border-[#e7e1da] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-[#8d785e] text-[12px]"
              style={{ fontWeight: 600 }}
            >
              {
                "\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05e4\u05e2\u05d9\u05dc\u05d9\u05dd"
              }
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22c55e]/10">
              <UserCircle className="text-[#22c55e]" size={16} />
            </div>
          </div>
          <div
            className="text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            {activeCount}
          </div>
        </div>
        <div className="rounded-xl border border-[#e7e1da] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-[#8d785e] text-[12px]"
              style={{ fontWeight: 600 }}
            >
              {"\u05dc\u05d9\u05d3\u05d9\u05dd"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/10">
              <TrendingUp className="text-[#3b82f6]" size={16} />
            </div>
          </div>
          <div
            className="text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            {leadCount}
          </div>
        </div>
        <div className="rounded-xl border border-[#e7e1da] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-[#8d785e] text-[12px]"
              style={{ fontWeight: 600 }}
            >
              {"\u05d4\u05db\u05e0\u05e1\u05d4 \u05db\u05d5\u05dc\u05dc\u05ea"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8b5cf6]/10">
              <DollarSign className="text-[#8b5cf6]" size={16} />
            </div>
          </div>
          <div
            className="text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            {"\u20aa"}
            {totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search
          className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8d785e]"
          size={18}
        />
        <input
          className="w-full rounded-xl border border-[#e7e1da] bg-white py-3 pr-10 pl-4 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder={
            "\u05d7\u05d9\u05e4\u05d5\u05e9 \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea, \u05d7\u05d1\u05e8\u05d5\u05ea \u05d0\u05d5 \u05d8\u05dc\u05e4\u05d5\u05df..."
          }
          value={search}
        />
      </div>

      {/* Status filter pills */}
      <div className="mb-5 flex items-center gap-2">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-[#e7e1da] bg-white p-1">
          {STATUS_OPTIONS.map((status) => (
            <button
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-[12px] transition-all ${
                statusFilter === status
                  ? "bg-[#181510] text-white"
                  : "text-[#8d785e] hover:bg-[#f5f3f0]"
              }`}
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              style={{ fontWeight: statusFilter === status ? 600 : 400 }}
              type="button"
            >
              {status}
            </button>
          ))}
        </div>
        {(search || statusFilter !== "\u05d4\u05db\u05dc") && (
          <button
            className="flex items-center gap-1 rounded-lg border border-[#e7e1da] px-3 py-1.5 text-[#8d785e] text-[12px] transition-colors hover:text-[#ff8c00]"
            onClick={() => {
              setSearch("");
              setStatusFilter("\u05d4\u05db\u05dc");
              setCurrentPage(1);
            }}
            type="button"
          >
            <Filter size={13} />
            {
              "\u05e0\u05d9\u05e7\u05d5\u05d9 \u05de\u05e1\u05e0\u05e0\u05d9\u05dd"
            }
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="mb-5 flex flex-col items-center justify-center rounded-2xl border border-[#e7e1da] bg-white py-16 shadow-sm">
          <Loader2 className="mb-3 animate-spin text-[#ff8c00]" size={32} />
          <p className="text-[#8d785e] text-[14px]">
            {"\u05d8\u05d5\u05e2\u05df \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea..."}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mb-5 flex flex-col items-center justify-center rounded-2xl border border-[#e7e1da] bg-white py-16 shadow-sm">
          <span className="mb-3 text-[40px]">{"\ud83d\udc65"}</span>
          <p className="text-[#8d785e] text-[16px]" style={{ fontWeight: 600 }}>
            {
              "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea"
            }
          </p>
          <p className="mt-1 text-[#8d785e] text-[13px]">
            {
              "\u05e0\u05e1\u05d4 \u05dc\u05e9\u05e0\u05d5\u05ea \u05d0\u05ea \u05d4\u05e1\u05d9\u05e0\u05d5\u05df \u05d0\u05d5 \u05dc\u05d4\u05d5\u05e1\u05d9\u05e3 \u05dc\u05e7\u05d5\u05d7 \u05d7\u05d3\u05e9"
            }
          </p>
        </div>
      ) : (
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#e7e1da] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-[#e7e1da] border-b bg-[#f5f3f0]">
                  {[
                    "\u05dc\u05e7\u05d5\u05d7",
                    "\u05d8\u05dc\u05e4\u05d5\u05df",
                    "\u05d0\u05d9\u05de\u05d9\u05d9\u05dc",
                    "\u05e1\u05d8\u05d8\u05d5\u05e1",
                    "\u05e4\u05e8\u05d5\u05d9\u05e7\u05d8\u05d9\u05dd",
                    "\u05d4\u05db\u05e0\u05e1\u05d4",
                    "\u05e4\u05e2\u05d5\u05dc\u05d5\u05ea",
                  ].map((h) => (
                    <th
                      className="whitespace-nowrap p-3 text-right text-[#8d785e] text-[12px]"
                      key={h}
                      style={{ fontWeight: 600 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice(
                    (currentPage - 1) * ITEMS_PER_PAGE,
                    currentPage * ITEMS_PER_PAGE
                  )
                  .map((client) => (
                    <tr
                      className="border-[#ece8e3] border-b transition-colors hover:bg-[#f5f3f0]/50"
                      key={client.id}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#06b6d4]/10">
                            <UserCircle className="text-[#06b6d4]" size={18} />
                          </div>
                          <div>
                            <div
                              className="text-[#181510] text-[14px]"
                              style={{ fontWeight: 600 }}
                            >
                              {client.name}
                            </div>
                            <div className="text-[#8d785e] text-[11px]">
                              {client.company}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-[#6b5d45] text-[13px]">
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {client.phone || "-"}
                        </span>
                      </td>
                      <td className="max-w-[200px] p-3 text-[#6b5d45] text-[13px]">
                        <span className="flex items-center gap-1 truncate">
                          <Mail size={12} /> {client.email || "-"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className="rounded-full px-2.5 py-1 text-[12px]"
                          style={{
                            backgroundColor: `${STATUS_DISPLAY[client.status].color}15`,
                            color: STATUS_DISPLAY[client.status].color,
                            fontWeight: 600,
                          }}
                        >
                          {STATUS_DISPLAY[client.status].label}
                        </span>
                      </td>
                      <td
                        className="p-3 text-[#181510] text-[13px]"
                        style={{ fontWeight: 600 }}
                      >
                        {client.totalProjects || 0}
                      </td>
                      <td
                        className="p-3 text-[#181510] text-[13px]"
                        style={{ fontWeight: 600 }}
                      >
                        {client.totalRevenue
                          ? `\u20aa${client.totalRevenue.toLocaleString()}`
                          : "-"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded-lg p-1.5 text-[#8d785e] transition-all hover:bg-[#ff8c00]/10 hover:text-[#ff8c00]"
                            onClick={() => openEdit(client as any)}
                            type="button"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            className="rounded-lg p-1.5 text-[#8d785e] transition-all hover:bg-red-50 hover:text-red-500"
                            onClick={() => setDeletingClient(client as any)}
                            type="button"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-[#e7e1da] border-t bg-[#f5f3f0] p-3">
            <span className="text-[#8d785e] text-[12px]">
              {"\u05de\u05e6\u05d9\u05d2"}{" "}
              {Math.min(
                (currentPage - 1) * ITEMS_PER_PAGE + 1,
                filtered.length
              )}
              -{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}{" "}
              {"\u05de\u05ea\u05d5\u05da"} {filtered.length}{" "}
              {"\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea"}
            </span>
            {(() => {
              const totalPages = Math.max(
                1,
                Math.ceil(filtered.length / ITEMS_PER_PAGE)
              );
              return (
                <div className="flex items-center gap-1">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#8d785e] transition-colors hover:bg-white disabled:opacity-30"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    type="button"
                  >
                    <ChevronRight size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        className={`flex h-7 w-7 items-center justify-center rounded-md text-[12px] transition-colors ${
                          currentPage === page
                            ? "bg-[#ff8c00] text-white"
                            : "text-[#8d785e] hover:bg-white"
                        }`}
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{ fontWeight: currentPage === page ? 600 : 400 }}
                        type="button"
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-[#8d785e] transition-colors hover:bg-white disabled:opacity-30"
                    disabled={currentPage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    type="button"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setShowAddClient(false);
            addForm.reset();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[#181510] text-[20px]"
                style={{ fontWeight: 700 }}
              >
                {
                  "\u05d4\u05d5\u05e1\u05e4\u05ea \u05dc\u05e7\u05d5\u05d7 \u05d7\u05d3\u05e9"
                }
              </h2>
              <button
                className="text-[#8d785e] hover:text-[#181510]"
                onClick={() => {
                  setShowAddClient(false);
                  addForm.reset();
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-3"
              onSubmit={addForm.handleSubmit(onSubmitAdd)}
            >
              <FormField
                error={addForm.formState.errors.name}
                isDirty={addForm.formState.dirtyFields.name}
                label="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05e7\u05e9\u05e8"
                placeholder="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05d4\u05e7\u05e9\u05e8"
                required
                {...addForm.register(
                  "name",
                  rules.requiredMin("\u05e9\u05dd", 2)
                )}
              />
              <FormField
                error={addForm.formState.errors.company}
                isDirty={addForm.formState.dirtyFields.company}
                label="\u05e9\u05dd \u05d7\u05d1\u05e8\u05d4"
                placeholder="\u05e9\u05dd \u05d4\u05d7\u05d1\u05e8\u05d4"
                required
                {...addForm.register(
                  "company",
                  rules.requiredMin("\u05d7\u05d1\u05e8\u05d4", 2)
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  error={addForm.formState.errors.phone}
                  isDirty={addForm.formState.dirtyFields.phone}
                  label="\u05d8\u05dc\u05e4\u05d5\u05df"
                  placeholder="05X-XXXXXXX"
                  {...addForm.register("phone", rules.israeliPhone(false))}
                />
                <FormField
                  error={addForm.formState.errors.email}
                  isDirty={addForm.formState.dirtyFields.email}
                  label="\u05d0\u05d9\u05de\u05d9\u05d9\u05dc"
                  placeholder="email@example.com"
                  {...addForm.register("email", rules.email(false))}
                />
              </div>
              <FormSelect
                error={addForm.formState.errors.status}
                isDirty={addForm.formState.dirtyFields.status}
                label="\u05e1\u05d8\u05d8\u05d5\u05e1"
                {...addForm.register("status")}
              >
                <option value="lead">{"\u05dc\u05d9\u05d3"}</option>
                <option value="active">{"\u05e4\u05e2\u05d9\u05dc"}</option>
                <option value="inactive">
                  {"\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc"}
                </option>
              </FormSelect>
              <FormTextarea
                error={addForm.formState.errors.notes}
                isDirty={addForm.formState.dirtyFields.notes}
                label="\u05d4\u05e2\u05e8\u05d5\u05ea"
                placeholder="\u05d4\u05e2\u05e8\u05d5\u05ea \u05e0\u05d5\u05e1\u05e4\u05d5\u05ea..."
                rows={3}
                {...addForm.register("notes")}
              />
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={saving || !addForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e7\u05d5\u05d7"
                  )}
                </button>
                <button
                  className="rounded-xl border border-[#e7e1da] px-5 transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => {
                    setShowAddClient(false);
                    addForm.reset();
                  }}
                  type="button"
                >
                  {"\u05d1\u05d9\u05d8\u05d5\u05dc"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setEditingClient(null);
            editForm.reset();
          }}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            role="dialog"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-[#181510] text-[20px]"
                style={{ fontWeight: 700 }}
              >
                {"\u05e2\u05e8\u05d9\u05db\u05ea \u05dc\u05e7\u05d5\u05d7"}
              </h2>
              <button
                className="text-[#8d785e] hover:text-[#181510]"
                onClick={() => {
                  setEditingClient(null);
                  editForm.reset();
                }}
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="space-y-3"
              onSubmit={editForm.handleSubmit(onSaveEdit)}
            >
              <FormField
                error={editForm.formState.errors.name}
                isDirty={editForm.formState.dirtyFields.name}
                label="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05e7\u05e9\u05e8"
                placeholder="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05d4\u05e7\u05e9\u05e8"
                required
                {...editForm.register(
                  "name",
                  rules.requiredMin("\u05e9\u05dd", 2)
                )}
              />
              <FormField
                error={editForm.formState.errors.company}
                isDirty={editForm.formState.dirtyFields.company}
                label="\u05e9\u05dd \u05d7\u05d1\u05e8\u05d4"
                placeholder="\u05e9\u05dd \u05d4\u05d7\u05d1\u05e8\u05d4"
                required
                {...editForm.register(
                  "company",
                  rules.requiredMin("\u05d7\u05d1\u05e8\u05d4", 2)
                )}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  error={editForm.formState.errors.phone}
                  isDirty={editForm.formState.dirtyFields.phone}
                  label="\u05d8\u05dc\u05e4\u05d5\u05df"
                  placeholder="05X-XXXXXXX"
                  {...editForm.register("phone", rules.israeliPhone(false))}
                />
                <FormField
                  error={editForm.formState.errors.email}
                  isDirty={editForm.formState.dirtyFields.email}
                  label="\u05d0\u05d9\u05de\u05d9\u05d9\u05dc"
                  placeholder="email@example.com"
                  {...editForm.register("email", rules.email(false))}
                />
              </div>
              <FormSelect
                error={editForm.formState.errors.status}
                isDirty={editForm.formState.dirtyFields.status}
                label="\u05e1\u05d8\u05d8\u05d5\u05e1"
                {...editForm.register("status")}
              >
                <option value="lead">{"\u05dc\u05d9\u05d3"}</option>
                <option value="active">{"\u05e4\u05e2\u05d9\u05dc"}</option>
                <option value="inactive">
                  {"\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc"}
                </option>
              </FormSelect>
              <FormTextarea
                error={editForm.formState.errors.notes}
                isDirty={editForm.formState.dirtyFields.notes}
                label="\u05d4\u05e2\u05e8\u05d5\u05ea"
                placeholder="\u05d4\u05e2\u05e8\u05d5\u05ea \u05e0\u05d5\u05e1\u05e4\u05d5\u05ea..."
                rows={3}
                {...editForm.register("notes")}
              />
              <div className="flex gap-3 pt-2">
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] py-2.5 text-white transition-colors hover:bg-[#e67e00] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={saving || !editForm.formState.isValid}
                  style={{ fontWeight: 600 }}
                  type="submit"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "\u05e9\u05de\u05d5\u05e8 \u05e9\u05d9\u05e0\u05d5\u05d9\u05d9\u05dd"
                  )}
                </button>
                <button
                  className="rounded-xl border border-[#e7e1da] px-5 transition-colors hover:bg-[#f5f3f0]"
                  onClick={() => {
                    setEditingClient(null);
                    editForm.reset();
                  }}
                  type="button"
                >
                  {"\u05d1\u05d9\u05d8\u05d5\u05dc"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDeletingClient(null)}
          onKeyDown={(e) => e.key === "Escape" && e.currentTarget.click()}
          role="presentation"
        >
          <div
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            role="dialog"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="text-red-500" size={22} />
            </div>
            <h2
              className="mb-1 text-[#181510] text-[18px]"
              style={{ fontWeight: 700 }}
            >
              {"\u05de\u05d7\u05d9\u05e7\u05ea \u05dc\u05e7\u05d5\u05d7"}
            </h2>
            <p className="mb-4 text-[#8d785e] text-[13px]">
              {
                "\u05d4\u05d0\u05dd \u05d0\u05ea\u05d4 \u05d1\u05d8\u05d5\u05d7 \u05e9\u05d1\u05e8\u05e6\u05d5\u05e0\u05da \u05dc\u05de\u05d7\u05d5\u05e7 \u05d0\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7"
              }{" "}
              <strong>"{deletingClient.name}"</strong>?
              <br />
              <span className="text-red-500">
                {
                  "\u05e4\u05e2\u05d5\u05dc\u05d4 \u05d6\u05d5 \u05d0\u05d9\u05e0\u05d4 \u05e0\u05d9\u05ea\u05e0\u05ea \u05dc\u05d1\u05d9\u05d8\u05d5\u05dc."
                }
              </span>
            </p>
            <div className="flex gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                disabled={saving}
                onClick={confirmDelete}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "\u05db\u05df, \u05de\u05d7\u05e7"
                )}
              </button>
              <button
                className="flex-1 rounded-xl border border-[#e7e1da] py-2.5 transition-colors hover:bg-[#f5f3f0]"
                onClick={() => setDeletingClient(null)}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {"\u05d1\u05d9\u05d8\u05d5\u05dc"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
