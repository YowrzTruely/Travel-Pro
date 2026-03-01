import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Search, Plus, Filter, Edit2, Trash2, X,
  ChevronLeft, ChevronRight, UserCircle, Loader2,
  AlertTriangle, Users, DollarSign, TrendingUp, Phone, Mail
} from 'lucide-react';
import type { Client } from './data';
import { appToast } from './AppToast';
import { FormField, FormSelect, FormTextarea, rules } from './FormField';

interface ClientForm {
  name: string;
  company: string;
  phone: string;
  email: string;
  status: 'active' | 'lead' | 'inactive';
  notes: string;
}

const STATUS_OPTIONS = ['\u05d4\u05db\u05dc', '\u05e4\u05e2\u05d9\u05dc', '\u05dc\u05d9\u05d3', '\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc'] as const;

const STATUS_MAP: Record<string, Client['status']> = {
  '\u05e4\u05e2\u05d9\u05dc': 'active',
  '\u05dc\u05d9\u05d3': 'lead',
  '\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc': 'inactive',
};

const STATUS_DISPLAY: Record<Client['status'], { label: string; color: string }> = {
  active: { label: '\u05e4\u05e2\u05d9\u05dc', color: '#22c55e' },
  lead: { label: '\u05dc\u05d9\u05d3', color: '#3b82f6' },
  inactive: { label: '\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc', color: '#8d785e' },
};

const ITEMS_PER_PAGE = 10;

export function ClientsPage() {
  const clients = useQuery(api.clients.list);
  const createClient = useMutation(api.clients.create);
  const updateClient = useMutation(api.clients.update);
  const removeClient = useMutation(api.clients.remove);

  const loading = clients === undefined;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('\u05d4\u05db\u05dc');
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  const addForm = useForm<ClientForm>({
    mode: 'onChange',
    defaultValues: { name: '', company: '', phone: '', email: '', status: 'lead', notes: '' },
  });

  const editForm = useForm<ClientForm>({
    mode: 'onChange',
  });

  // --- Filtering ---
  const clientList = clients ?? [];
  const filtered = clientList.filter(c => {
    const matchesSearch = !search ||
      c.name.includes(search) ||
      c.company.includes(search) ||
      c.phone.includes(search) ||
      c.email.includes(search);
    const matchesStatus = statusFilter === '\u05d4\u05db\u05dc' ||
      c.status === STATUS_MAP[statusFilter];
    return matchesSearch && matchesStatus;
  });

  // --- Stats ---
  const totalClients = clientList.length;
  const activeCount = clientList.filter(c => c.status === 'active').length;
  const leadCount = clientList.filter(c => c.status === 'lead').length;
  const totalRevenue = clientList.reduce((sum, c) => sum + (c.totalRevenue || 0), 0);

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
      appToast.success('\u05d4\u05dc\u05e7\u05d5\u05d7 \u05e0\u05d5\u05e1\u05e3 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4', '\u05e0\u05d9\u05ea\u05df \u05db\u05e2\u05ea \u05dc\u05e9\u05d9\u05d9\u05da \u05d0\u05d5\u05ea\u05d5 \u05dc\u05e4\u05e8\u05d5\u05d9\u05e7\u05d8\u05d9\u05dd');
      setShowAddClient(false);
      addForm.reset();
    } catch (err) {
      console.error('[ClientsPage] Failed to create client:', err);
      appToast.error('\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d9\u05e6\u05d9\u05e8\u05ea \u05dc\u05e7\u05d5\u05d7', String(err));
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
      notes: client.notes || '',
    });
  };

  const onSaveEdit = async (data: ClientForm) => {
    if (!editingClient) return;
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
      appToast.success('\u05dc\u05e7\u05d5\u05d7 \u05e2\u05d5\u05d3\u05db\u05df', `"${data.name.trim()}" \u05e2\u05d5\u05d3\u05db\u05df \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4`);
    } catch (err) {
      console.error('[ClientsPage] Update failed:', err);
      appToast.error('\u05e9\u05d2\u05d9\u05d0\u05d4', '\u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05e2\u05d3\u05db\u05df \u05d0\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingClient) return;
    try {
      setSaving(true);
      await removeClient({ id: deletingClient.id as any });
      appToast.success('\u05dc\u05e7\u05d5\u05d7 \u05e0\u05de\u05d7\u05e7', `"${deletingClient.name}" \u05d4\u05d5\u05e1\u05e8 \u05de\u05d4\u05de\u05e2\u05e8\u05db\u05ea`);
      setDeletingClient(null);
    } catch (err) {
      console.error('[ClientsPage] Delete failed:', err);
      appToast.error('\u05e9\u05d2\u05d9\u05d0\u05d4', '\u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05de\u05d7\u05d5\u05e7 \u05d0\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
            <UserCircle size={22} className="text-[#ff8c00]" />
          </div>
          <h1 className="text-[26px] text-[#181510]" style={{ fontWeight: 700 }}>{'\u05e0\u05d9\u05d4\u05d5\u05dc \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea'}</h1>
        </div>
        <button
          onClick={() => setShowAddClient(true)}
          className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff8c00]/20 transition-all text-[14px]"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} />
          {'\u05d4\u05d5\u05e1\u05e4\u05ea \u05dc\u05e7\u05d5\u05d7 \u05d7\u05d3\u05e9'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-[#e7e1da] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>{'\u05e1\u05d4"\u05db \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea'}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#ff8c00]/10">
              <Users size={16} className="text-[#ff8c00]" />
            </div>
          </div>
          <div className="text-[24px] text-[#181510]" style={{ fontWeight: 700 }}>{totalClients}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e7e1da] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>{'\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea \u05e4\u05e2\u05d9\u05dc\u05d9\u05dd'}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#22c55e]/10">
              <UserCircle size={16} className="text-[#22c55e]" />
            </div>
          </div>
          <div className="text-[24px] text-[#181510]" style={{ fontWeight: 700 }}>{activeCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e7e1da] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>{'\u05dc\u05d9\u05d3\u05d9\u05dd'}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3b82f6]/10">
              <TrendingUp size={16} className="text-[#3b82f6]" />
            </div>
          </div>
          <div className="text-[24px] text-[#181510]" style={{ fontWeight: 700 }}>{leadCount}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e7e1da] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-[#8d785e]" style={{ fontWeight: 600 }}>{'\u05d4\u05db\u05e0\u05e1\u05d4 \u05db\u05d5\u05dc\u05dc\u05ea'}</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#8b5cf6]/10">
              <DollarSign size={16} className="text-[#8b5cf6]" />
            </div>
          </div>
          <div className="text-[24px] text-[#181510]" style={{ fontWeight: 700 }}>{'\u20aa'}{totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full bg-white border border-[#e7e1da] rounded-xl pr-10 pl-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] transition-all"
          placeholder={'\u05d7\u05d9\u05e4\u05d5\u05e9 \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea, \u05d7\u05d1\u05e8\u05d5\u05ea \u05d0\u05d5 \u05d8\u05dc\u05e4\u05d5\u05df...'}
        />
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex gap-1 bg-white border border-[#e7e1da] rounded-lg p-1 overflow-x-auto">
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-md text-[12px] transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#181510] text-white'
                  : 'text-[#8d785e] hover:bg-[#f5f3f0]'
              }`}
              style={{ fontWeight: statusFilter === status ? 600 : 400 }}
            >
              {status}
            </button>
          ))}
        </div>
        {(search || statusFilter !== '\u05d4\u05db\u05dc') && (
          <button
            onClick={() => { setSearch(''); setStatusFilter('\u05d4\u05db\u05dc'); setCurrentPage(1); }}
            className="flex items-center gap-1 text-[12px] text-[#8d785e] hover:text-[#ff8c00] border border-[#e7e1da] px-3 py-1.5 rounded-lg transition-colors"
          >
            <Filter size={13} />
            {'\u05e0\u05d9\u05e7\u05d5\u05d9 \u05de\u05e1\u05e0\u05e0\u05d9\u05dd'}
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#e7e1da] shadow-sm mb-5">
          <Loader2 size={32} className="animate-spin text-[#ff8c00] mb-3" />
          <p className="text-[14px] text-[#8d785e]">{'\u05d8\u05d5\u05e2\u05df \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea...'}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#e7e1da] shadow-sm mb-5">
          <span className="text-[40px] mb-3">{'\ud83d\udc65'}</span>
          <p className="text-[16px] text-[#8d785e]" style={{ fontWeight: 600 }}>{'\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 \u05dc\u05e7\u05d5\u05d7\u05d5\u05ea'}</p>
          <p className="text-[13px] text-[#8d785e] mt-1">{'\u05e0\u05e1\u05d4 \u05dc\u05e9\u05e0\u05d5\u05ea \u05d0\u05ea \u05d4\u05e1\u05d9\u05e0\u05d5\u05df \u05d0\u05d5 \u05dc\u05d4\u05d5\u05e1\u05d9\u05e3 \u05dc\u05e7\u05d5\u05d7 \u05d7\u05d3\u05e9'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e7e1da] shadow-sm overflow-hidden mb-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f3f0] border-b border-[#e7e1da]">
                  {['\u05dc\u05e7\u05d5\u05d7', '\u05d8\u05dc\u05e4\u05d5\u05df', '\u05d0\u05d9\u05de\u05d9\u05d9\u05dc', '\u05e1\u05d8\u05d8\u05d5\u05e1', '\u05e4\u05e8\u05d5\u05d9\u05e7\u05d8\u05d9\u05dd', '\u05d4\u05db\u05e0\u05e1\u05d4', '\u05e4\u05e2\u05d5\u05dc\u05d5\u05ea'].map(h => (
                    <th key={h} className="p-3 text-right text-[12px] text-[#8d785e] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((client) => (
                  <tr key={client.id} className="border-b border-[#ece8e3] hover:bg-[#f5f3f0]/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#06b6d4]/10">
                          <UserCircle size={18} className="text-[#06b6d4]" />
                        </div>
                        <div>
                          <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{client.name}</div>
                          <div className="text-[11px] text-[#8d785e]">{client.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[13px] text-[#6b5d45]">
                      <span className="flex items-center gap-1"><Phone size={12} /> {client.phone || '-'}</span>
                    </td>
                    <td className="p-3 text-[13px] text-[#6b5d45] max-w-[200px]">
                      <span className="flex items-center gap-1 truncate"><Mail size={12} /> {client.email || '-'}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className="text-[12px] px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: STATUS_DISPLAY[client.status].color + '15',
                          color: STATUS_DISPLAY[client.status].color,
                          fontWeight: 600,
                        }}
                      >
                        {STATUS_DISPLAY[client.status].label}
                      </span>
                    </td>
                    <td className="p-3 text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>
                      {client.totalProjects || 0}
                    </td>
                    <td className="p-3 text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>
                      {client.totalRevenue ? `\u20aa${client.totalRevenue.toLocaleString()}` : '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(client as any)}
                          className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeletingClient(client as any)}
                          className="p-1.5 text-[#8d785e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
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
          <div className="flex items-center justify-between p-3 bg-[#f5f3f0] border-t border-[#e7e1da]">
            <span className="text-[12px] text-[#8d785e]">
              {'\u05de\u05e6\u05d9\u05d2'} {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} {'\u05de\u05ea\u05d5\u05da'} {filtered.length} {'\u05dc\u05e7\u05d5\u05d7\u05d5\u05ea'}
            </span>
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
              return (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white transition-colors disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-[12px] transition-colors ${
                        currentPage === page
                          ? 'bg-[#ff8c00] text-white'
                          : 'text-[#8d785e] hover:bg-white'
                      }`}
                      style={{ fontWeight: currentPage === page ? 600 : 400 }}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-white transition-colors disabled:opacity-30"
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddClient(false); addForm.reset(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>{'\u05d4\u05d5\u05e1\u05e4\u05ea \u05dc\u05e7\u05d5\u05d7 \u05d7\u05d3\u05e9'}</h2>
              <button onClick={() => { setShowAddClient(false); addForm.reset(); }} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <form onSubmit={addForm.handleSubmit(onSubmitAdd)} className="space-y-3">
              <FormField
                label="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05e7\u05e9\u05e8"
                required
                error={addForm.formState.errors.name}
                isDirty={addForm.formState.dirtyFields.name}
                placeholder="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05d4\u05e7\u05e9\u05e8"
                {...addForm.register('name', rules.requiredMin('\u05e9\u05dd', 2))}
              />
              <FormField
                label="\u05e9\u05dd \u05d7\u05d1\u05e8\u05d4"
                required
                error={addForm.formState.errors.company}
                isDirty={addForm.formState.dirtyFields.company}
                placeholder="\u05e9\u05dd \u05d4\u05d7\u05d1\u05e8\u05d4"
                {...addForm.register('company', rules.requiredMin('\u05d7\u05d1\u05e8\u05d4', 2))}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="\u05d8\u05dc\u05e4\u05d5\u05df"
                  placeholder="05X-XXXXXXX"
                  error={addForm.formState.errors.phone}
                  isDirty={addForm.formState.dirtyFields.phone}
                  {...addForm.register('phone', rules.israeliPhone(false))}
                />
                <FormField
                  label="\u05d0\u05d9\u05de\u05d9\u05d9\u05dc"
                  placeholder="email@example.com"
                  error={addForm.formState.errors.email}
                  isDirty={addForm.formState.dirtyFields.email}
                  {...addForm.register('email', rules.email(false))}
                />
              </div>
              <FormSelect
                label="\u05e1\u05d8\u05d8\u05d5\u05e1"
                error={addForm.formState.errors.status}
                isDirty={addForm.formState.dirtyFields.status}
                {...addForm.register('status')}
              >
                <option value="lead">{'\u05dc\u05d9\u05d3'}</option>
                <option value="active">{'\u05e4\u05e2\u05d9\u05dc'}</option>
                <option value="inactive">{'\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc'}</option>
              </FormSelect>
              <FormTextarea
                label="\u05d4\u05e2\u05e8\u05d5\u05ea"
                rows={3}
                placeholder="\u05d4\u05e2\u05e8\u05d5\u05ea \u05e0\u05d5\u05e1\u05e4\u05d5\u05ea..."
                error={addForm.formState.errors.notes}
                isDirty={addForm.formState.dirtyFields.notes}
                {...addForm.register('notes')}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !addForm.formState.isValid}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : '\u05d4\u05d5\u05e1\u05e3 \u05dc\u05e7\u05d5\u05d7'}
                </button>
                <button type="button" onClick={() => { setShowAddClient(false); addForm.reset(); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">{'\u05d1\u05d9\u05d8\u05d5\u05dc'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setEditingClient(null); editForm.reset(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>{'\u05e2\u05e8\u05d9\u05db\u05ea \u05dc\u05e7\u05d5\u05d7'}</h2>
              <button onClick={() => { setEditingClient(null); editForm.reset(); }} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <form onSubmit={editForm.handleSubmit(onSaveEdit)} className="space-y-3">
              <FormField
                label="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05e7\u05e9\u05e8"
                required
                error={editForm.formState.errors.name}
                isDirty={editForm.formState.dirtyFields.name}
                placeholder="\u05e9\u05dd \u05d0\u05d9\u05e9 \u05d4\u05e7\u05e9\u05e8"
                {...editForm.register('name', rules.requiredMin('\u05e9\u05dd', 2))}
              />
              <FormField
                label="\u05e9\u05dd \u05d7\u05d1\u05e8\u05d4"
                required
                error={editForm.formState.errors.company}
                isDirty={editForm.formState.dirtyFields.company}
                placeholder="\u05e9\u05dd \u05d4\u05d7\u05d1\u05e8\u05d4"
                {...editForm.register('company', rules.requiredMin('\u05d7\u05d1\u05e8\u05d4', 2))}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="\u05d8\u05dc\u05e4\u05d5\u05df"
                  placeholder="05X-XXXXXXX"
                  error={editForm.formState.errors.phone}
                  isDirty={editForm.formState.dirtyFields.phone}
                  {...editForm.register('phone', rules.israeliPhone(false))}
                />
                <FormField
                  label="\u05d0\u05d9\u05de\u05d9\u05d9\u05dc"
                  placeholder="email@example.com"
                  error={editForm.formState.errors.email}
                  isDirty={editForm.formState.dirtyFields.email}
                  {...editForm.register('email', rules.email(false))}
                />
              </div>
              <FormSelect
                label="\u05e1\u05d8\u05d8\u05d5\u05e1"
                error={editForm.formState.errors.status}
                isDirty={editForm.formState.dirtyFields.status}
                {...editForm.register('status')}
              >
                <option value="lead">{'\u05dc\u05d9\u05d3'}</option>
                <option value="active">{'\u05e4\u05e2\u05d9\u05dc'}</option>
                <option value="inactive">{'\u05dc\u05d0 \u05e4\u05e2\u05d9\u05dc'}</option>
              </FormSelect>
              <FormTextarea
                label="\u05d4\u05e2\u05e8\u05d5\u05ea"
                rows={3}
                placeholder="\u05d4\u05e2\u05e8\u05d5\u05ea \u05e0\u05d5\u05e1\u05e4\u05d5\u05ea..."
                error={editForm.formState.errors.notes}
                isDirty={editForm.formState.dirtyFields.notes}
                {...editForm.register('notes')}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !editForm.formState.isValid}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : '\u05e9\u05de\u05d5\u05e8 \u05e9\u05d9\u05e0\u05d5\u05d9\u05d9\u05dd'}
                </button>
                <button type="button" onClick={() => { setEditingClient(null); editForm.reset(); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">{'\u05d1\u05d9\u05d8\u05d5\u05dc'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingClient && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeletingClient(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h2 className="text-[18px] text-[#181510] mb-1" style={{ fontWeight: 700 }}>{'\u05de\u05d7\u05d9\u05e7\u05ea \u05dc\u05e7\u05d5\u05d7'}</h2>
            <p className="text-[13px] text-[#8d785e] mb-4">
              {'\u05d4\u05d0\u05dd \u05d0\u05ea\u05d4 \u05d1\u05d8\u05d5\u05d7 \u05e9\u05d1\u05e8\u05e6\u05d5\u05e0\u05da \u05dc\u05de\u05d7\u05d5\u05e7 \u05d0\u05ea \u05d4\u05dc\u05e7\u05d5\u05d7'} <strong>"{deletingClient.name}"</strong>?
              <br />
              <span className="text-red-500">{'\u05e4\u05e2\u05d5\u05dc\u05d4 \u05d6\u05d5 \u05d0\u05d9\u05e0\u05d4 \u05e0\u05d9\u05ea\u05e0\u05ea \u05dc\u05d1\u05d9\u05d8\u05d5\u05dc.'}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={saving}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                style={{ fontWeight: 600 }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : '\u05db\u05df, \u05de\u05d7\u05e7'}
              </button>
              <button onClick={() => setDeletingClient(null)} className="flex-1 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors py-2.5" style={{ fontWeight: 600 }}>{'\u05d1\u05d9\u05d8\u05d5\u05dc'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
