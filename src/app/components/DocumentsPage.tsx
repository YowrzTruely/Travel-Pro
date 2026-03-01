import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  Search, Plus, FileText, Eye, Edit2, Trash2,
  AlertTriangle, CheckCircle, Clock, X, ChevronLeft, ChevronRight,
  Loader2, Shield, ShieldCheck, ShieldAlert, CalendarDays, Upload, Save, Filter,
} from 'lucide-react';
import type { Supplier, Project } from './data';
import {
  suppliersApi, supplierDocumentsApi, projectsApi, projectDocumentsApi,
  type SupplierDocument, type ProjectDocument,
} from './api';
import { appToast } from './AppToast';
import { FormField, FormSelect, rules } from './FormField';

// ─── Types ───────────────────────────────────────

interface DocumentRow {
  id: string;
  name: string;
  type: string;
  entityType: 'supplier' | 'project';
  entityId: string;
  entityName: string;
  expiry: string;
  status: 'valid' | 'warning' | 'expired';
  fileName?: string;
}

interface AddProjectDocForm {
  projectId: string;
  name: string;
  type: 'contract' | 'proposal' | 'agreement' | 'invoice' | 'other';
  expiry: string;
  fileName: string;
}

type TabType = 'suppliers' | 'projects';
type StatusFilter = 'all' | 'valid' | 'warning' | 'expired';

// ─── Helpers ─────────────────────────────────────

const getDocStatus = (expiry: string): 'valid' | 'warning' | 'expired' => {
  if (!expiry) return 'expired';
  const exp = new Date(expiry);
  const now = new Date();
  if (exp < now) return 'expired';
  const diff = exp.getTime() - now.getTime();
  if (diff / (1000 * 60 * 60 * 24) < 60) return 'warning';
  return 'valid';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const statusConfig = {
  valid: { label: 'בתוקף', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle, iconColor: 'text-green-500' },
  warning: { label: 'פג בקרוב', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock, iconColor: 'text-yellow-500' },
  expired: { label: 'פג תוקף', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, iconColor: 'text-red-500' },
};

const supplierDocTypes = ['הכל', 'רישיון עסק', 'תעודת כשרות', "ביטוח צד ג'", 'אחר'];
const projectDocTypeLabels: Record<string, string> = {
  contract: 'חוזה',
  proposal: 'הצעת מחיר',
  agreement: 'הסכם',
  invoice: 'חשבונית',
  other: 'אחר',
};
const projectDocTypes = ['הכל', ...Object.values(projectDocTypeLabels)];

const ITEMS_PER_PAGE = 10;

// ─── Component ───────────────────────────────────

export function DocumentsPage() {
  const navigate = useNavigate();

  // ─── Data state ───
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [supplierDocs, setSupplierDocs] = useState<DocumentRow[]>([]);
  const [projectDocs, setProjectDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── UI state ───
  const [activeTab, setActiveTab] = useState<TabType>('suppliers');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState('הכל');
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Modal state ───
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentRow | null>(null);
  const [editExpiryValue, setEditExpiryValue] = useState('');
  const [deletingDoc, setDeletingDoc] = useState<DocumentRow | null>(null);
  const [saving, setSaving] = useState(false);

  // ─── Form ───
  const { register, handleSubmit, formState: { errors, dirtyFields, isValid }, reset: resetForm, watch } = useForm<AddProjectDocForm>({
    mode: 'onChange',
    defaultValues: { projectId: '', name: '', type: 'contract', expiry: '', fileName: '' },
  });

  // ─── Fetch all data ───
  const fetchAll = async () => {
    try {
      setLoading(true);

      const [suppliersData, projectsData] = await Promise.all([
        suppliersApi.list(),
        projectsApi.list(),
      ]);

      setSuppliers(suppliersData);
      setProjects(projectsData);

      // Fetch supplier documents
      const supplierDocResults = await Promise.all(
        suppliersData.map(async (s) => {
          try {
            const docs = await supplierDocumentsApi.list(s.id);
            return docs.map((d): DocumentRow => ({
              id: d.id,
              name: d.name,
              type: d.name, // The doc name IS the type for supplier docs
              entityType: 'supplier',
              entityId: s.id,
              entityName: s.name,
              expiry: d.expiry,
              status: getDocStatus(d.expiry),
              fileName: d.fileName,
            }));
          } catch {
            return [];
          }
        })
      );
      setSupplierDocs(supplierDocResults.flat());

      // Fetch project documents
      const projectDocResults = await Promise.all(
        projectsData.map(async (p) => {
          try {
            const docs = await projectDocumentsApi.list(p.id);
            return docs.map((d): DocumentRow => ({
              id: d.id,
              name: d.name,
              type: projectDocTypeLabels[d.type] || d.type,
              entityType: 'project',
              entityId: p.id,
              entityName: p.name,
              expiry: d.expiry || '',
              status: d.expiry ? getDocStatus(d.expiry) : 'valid',
              fileName: d.fileName,
            }));
          } catch {
            return [];
          }
        })
      );
      setProjectDocs(projectDocResults.flat());
    } catch (err) {
      console.error('[DocumentsPage] Failed to fetch data:', err);
      appToast.error('שגיאה בטעינת מסמכים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ─── Filtered data ───
  const activeDocs = activeTab === 'suppliers' ? supplierDocs : projectDocs;
  const allDocs = [...supplierDocs, ...projectDocs];

  const filtered = useMemo(() => {
    return activeDocs.filter((doc) => {
      if (search) {
        const q = search.toLowerCase();
        if (!doc.name.toLowerCase().includes(q) && !doc.entityName.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
      if (typeFilter !== 'הכל') {
        if (activeTab === 'suppliers') {
          if (typeFilter === 'אחר') {
            const requiredNames = ['רישיון עסק', 'תעודת כשרות', "ביטוח צד ג'"];
            if (requiredNames.includes(doc.name)) return false;
          } else if (doc.name !== typeFilter) return false;
        } else {
          if (doc.type !== typeFilter) return false;
        }
      }
      return true;
    });
  }, [activeDocs, search, statusFilter, typeFilter, activeTab]);

  // ─── Pagination ───
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, typeFilter, activeTab]);

  // ─── Stats ───
  const stats = useMemo(() => {
    const total = allDocs.length;
    const valid = allDocs.filter(d => d.status === 'valid').length;
    const warning = allDocs.filter(d => d.status === 'warning').length;
    const expired = allDocs.filter(d => d.status === 'expired').length;
    return { total, valid, warning, expired };
  }, [allDocs]);

  // ─── Handlers ───
  const onAddProjectDoc = async (data: AddProjectDocForm) => {
    try {
      setSaving(true);
      const status = data.expiry ? getDocStatus(data.expiry) : 'active';
      await projectDocumentsApi.create(data.projectId, {
        name: data.name.trim(),
        type: data.type,
        expiry: data.expiry || undefined,
        status,
        fileName: data.fileName.trim() || undefined,
      });
      appToast.success('מסמך נוסף בהצלחה');
      setShowAddDoc(false);
      resetForm();
      fetchAll();
    } catch (err) {
      console.error('[DocumentsPage] Failed to add document:', err);
      appToast.error('שגיאה בהוספת מסמך');
    } finally {
      setSaving(false);
    }
  };

  const onUpdateExpiry = async () => {
    if (!editingDoc || !editExpiryValue) return;
    try {
      setSaving(true);
      const newStatus = getDocStatus(editExpiryValue);
      if (editingDoc.entityType === 'supplier') {
        await supplierDocumentsApi.update(editingDoc.entityId, editingDoc.id, { expiry: editExpiryValue, status: newStatus });
      } else {
        await projectDocumentsApi.update(editingDoc.entityId, editingDoc.id, { expiry: editExpiryValue, status: newStatus });
      }
      appToast.success('תוקף המסמך עודכן בהצלחה');
      setEditingDoc(null);
      setEditExpiryValue('');
      fetchAll();
    } catch (err) {
      console.error('[DocumentsPage] Failed to update expiry:', err);
      appToast.error('שגיאה בעדכון תוקף');
    } finally {
      setSaving(false);
    }
  };

  const onDeleteDoc = async () => {
    if (!deletingDoc) return;
    try {
      setSaving(true);
      if (deletingDoc.entityType === 'supplier') {
        await supplierDocumentsApi.delete(deletingDoc.entityId, deletingDoc.id);
      } else {
        await projectDocumentsApi.delete(deletingDoc.entityId, deletingDoc.id);
      }
      appToast.success('המסמך נמחק בהצלחה');
      setDeletingDoc(null);
      fetchAll();
    } catch (err) {
      console.error('[DocumentsPage] Failed to delete document:', err);
      appToast.error('שגיאה במחיקת מסמך');
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div className="p-4 lg:p-6 max-w-[1200px] mx-auto font-['Assistant',sans-serif] flex items-center justify-center min-h-[60vh]" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#ff8c00]" />
          <span className="text-[15px] text-[#8d785e]" style={{ fontWeight: 500 }}>טוען מסמכים...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto font-['Assistant',sans-serif]" dir="rtl">

      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
            <FileText size={22} className="text-[#ff8c00]" />
          </div>
          <div>
            <h1 className="text-[24px] text-[#181510]" style={{ fontWeight: 700 }}>ניהול מסמכים</h1>
            <p className="text-[13px] text-[#8d785e]">מסמכים, חוזים והסכמים עם ספקים ולקוחות</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddDoc(true)}
          className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-4 py-2.5 rounded-xl transition-colors text-[14px]"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} />
          הוסף מסמך
        </button>
      </div>

      {/* ═══ Summary Cards ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'סה״כ מסמכים', value: stats.total, color: '#8d785e', bg: '#f5f3f0' },
          { label: 'בתוקף', value: stats.valid, color: '#22c55e', bg: '#f0fdf4' },
          { label: 'פג בקרוב', value: stats.warning, color: '#eab308', bg: '#fefce8' },
          { label: 'פג תוקף', value: stats.expired, color: '#ef4444', bg: '#fef2f2' },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-[#e7e1da] p-4" style={{ backgroundColor: card.bg }}>
            <div className="text-[12px] text-[#8d785e] mb-1" style={{ fontWeight: 600 }}>{card.label}</div>
            <div className="text-[28px]" style={{ fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* ═══ Tabs ═══ */}
      <div className="flex items-center gap-1 mb-4 bg-[#f5f3f0] rounded-xl p-1 w-fit">
        {([
          { key: 'suppliers' as TabType, label: 'מסמכי ספקים', icon: Shield },
          { key: 'projects' as TabType, label: 'מסמכי פרויקטים', icon: FileText },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setTypeFilter('הכל'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#181510] shadow-sm'
                : 'text-[#8d785e] hover:text-[#181510]'
            }`}
            style={{ fontWeight: activeTab === tab.key ? 700 : 500 }}
          >
            <tab.icon size={15} />
            {tab.label}
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-[#ff8c00]/10 text-[#ff8c00]' : 'bg-[#e7e1da] text-[#8d785e]'
            }`} style={{ fontWeight: 700 }}>
              {tab.key === 'suppliers' ? supplierDocs.length : projectDocs.length}
            </span>
          </button>
        ))}
      </div>

      {/* ═══ Filter Bar ═══ */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e7e1da] rounded-xl pr-9 pl-4 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] transition-all"
            placeholder="חיפוש לפי שם מסמך או שם ספק/פרויקט..."
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="bg-white border border-[#e7e1da] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="valid">בתוקף</option>
          <option value="warning">פג בקרוב</option>
          <option value="expired">פג תוקף</option>
        </select>

        {/* Type filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white border border-[#e7e1da] rounded-xl px-3 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
        >
          {(activeTab === 'suppliers' ? supplierDocTypes : projectDocTypes).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* ═══ Documents Table ═══ */}
      <div className="bg-white rounded-xl border border-[#e7e1da] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-[#f5f3f0] rounded-full flex items-center justify-center mb-3">
              <FileText size={24} className="text-[#b8a990]" />
            </div>
            <div className="text-[15px] text-[#181510] mb-1" style={{ fontWeight: 600 }}>
              {search || statusFilter !== 'all' || typeFilter !== 'הכל' ? 'לא נמצאו מסמכים תואמים' : 'אין מסמכים עדיין'}
            </div>
            <div className="text-[13px] text-[#8d785e]">
              {search || statusFilter !== 'all' || typeFilter !== 'הכל' ? 'נסה לשנות את הסינון' : activeTab === 'projects' ? 'הוסף מסמך פרויקט חדש' : 'מסמכי ספקים יופיעו כאן'}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-[#faf9f7] border-b border-[#e7e1da]">
                    <th className="text-right py-3 px-4 text-[#8d785e] text-[12px]" style={{ fontWeight: 600 }}>סטטוס</th>
                    <th className="text-right py-3 px-4 text-[#8d785e] text-[12px]" style={{ fontWeight: 600 }}>שם מסמך</th>
                    <th className="text-right py-3 px-4 text-[#8d785e] text-[12px]" style={{ fontWeight: 600 }}>
                      {activeTab === 'suppliers' ? 'ספק' : 'פרויקט'}
                    </th>
                    <th className="text-right py-3 px-4 text-[#8d785e] text-[12px]" style={{ fontWeight: 600 }}>סוג</th>
                    <th className="text-right py-3 px-4 text-[#8d785e] text-[12px]" style={{ fontWeight: 600 }}>תוקף</th>
                    <th className="text-right py-3 px-4 text-[#8d785e] text-[12px]" style={{ fontWeight: 600 }}>קובץ</th>
                    <th className="text-right py-3 px-4 text-[#8d785e] text-[12px]" style={{ fontWeight: 600 }}>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((doc) => {
                    const sc = statusConfig[doc.status];
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={`${doc.entityType}-${doc.id}`} className="border-b border-[#f0ede8] hover:bg-[#faf9f7] transition-colors">
                        {/* Status */}
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${sc.bg} ${sc.border} border`} style={{ fontWeight: 600 }}>
                            <StatusIcon size={12} className={sc.iconColor} />
                            <span className={sc.color}>{sc.label}</span>
                          </div>
                        </td>

                        {/* Document name */}
                        <td className="py-3 px-4">
                          <div className="text-[#181510]" style={{ fontWeight: 600 }}>{doc.name}</div>
                        </td>

                        {/* Entity name (clickable) */}
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(doc.entityType === 'supplier' ? `/suppliers/${doc.entityId}` : `/projects/${doc.entityId}`)}
                            className="text-[#ff8c00] hover:text-[#e67e00] hover:underline transition-colors"
                            style={{ fontWeight: 500 }}
                          >
                            {doc.entityName}
                          </button>
                        </td>

                        {/* Type badge */}
                        <td className="py-3 px-4">
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f5f3f0] text-[#8d785e]" style={{ fontWeight: 600 }}>
                            {doc.type}
                          </span>
                        </td>

                        {/* Expiry */}
                        <td className="py-3 px-4">
                          <span className={`text-[12px] ${sc.color}`} style={{ fontWeight: 500 }}>
                            {formatDate(doc.expiry)}
                          </span>
                        </td>

                        {/* File name */}
                        <td className="py-3 px-4">
                          {doc.fileName ? (
                            <div className="flex items-center gap-1 text-[12px] text-[#8d785e]">
                              <FileText size={12} />
                              <span className="max-w-[120px] truncate">{doc.fileName}</span>
                            </div>
                          ) : (
                            <span className="text-[12px] text-[#b8a990]">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => navigate(doc.entityType === 'supplier' ? `/suppliers/${doc.entityId}` : `/projects/${doc.entityId}`)}
                              className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"
                              title="צפייה"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => { setEditingDoc(doc); setEditExpiryValue(doc.expiry); }}
                              className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"
                              title="עדכון תוקף"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeletingDoc(doc)}
                              className="p-1.5 text-[#8d785e] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="מחיקה"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ═══ Pagination ═══ */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#f0ede8]">
                <div className="text-[12px] text-[#8d785e]">
                  מציג {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} מתוך {filtered.length}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-[#f5f3f0] transition-colors disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-md flex items-center justify-center text-[12px] transition-colors ${
                        currentPage === page ? 'bg-[#ff8c00] text-white' : 'text-[#8d785e] hover:bg-[#f5f3f0]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[#8d785e] hover:bg-[#f5f3f0] transition-colors disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══ Add Document Modal ═══ */}
      {showAddDoc && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddDoc(false); resetForm(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
                  <Plus size={18} className="text-[#ff8c00]" />
                </div>
                <h3 className="text-[18px] text-[#181510]" style={{ fontWeight: 700 }}>הוספת מסמך פרויקט</h3>
              </div>
              <button onClick={() => { setShowAddDoc(false); resetForm(); }} className="text-[#8d785e] hover:text-[#181510] transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onAddProjectDoc)} className="space-y-3">
              <FormSelect
                label="פרויקט"
                required
                error={errors.projectId}
                isDirty={dirtyFields.projectId}
                {...register('projectId', rules.required('פרויקט'))}
              >
                <option value="">בחר פרויקט...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </FormSelect>

              <FormField
                label="שם המסמך"
                placeholder="לדוגמה: חוזה התקשרות"
                required
                error={errors.name}
                isDirty={dirtyFields.name}
                {...register('name', rules.requiredMin('שם המסמך', 2))}
              />

              <FormSelect
                label="סוג מסמך"
                required
                error={errors.type}
                isDirty={dirtyFields.type}
                {...register('type', rules.required('סוג מסמך'))}
              >
                <option value="contract">חוזה</option>
                <option value="proposal">הצעת מחיר</option>
                <option value="agreement">הסכם</option>
                <option value="invoice">חשבונית</option>
                <option value="other">אחר</option>
              </FormSelect>

              <FormField
                label="תאריך תוקף"
                type="date"
                error={errors.expiry}
                isDirty={dirtyFields.expiry}
                {...register('expiry')}
              />

              <FormField
                label="שם קובץ"
                placeholder="לדוגמה: contract_2024.pdf"
                error={errors.fileName}
                isDirty={dirtyFields.fileName}
                {...register('fileName')}
              />

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={saving || !isValid}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? 'שומר...' : 'הוסף מסמך'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddDoc(false); resetForm(); }}
                  className="px-4 py-2.5 text-[#8d785e] hover:text-[#181510] hover:bg-[#f5f3f0] rounded-xl transition-colors text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Edit Expiry Modal ═══ */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setEditingDoc(null); setEditExpiryValue(''); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
                  <CalendarDays size={18} className="text-[#ff8c00]" />
                </div>
                <h3 className="text-[18px] text-[#181510]" style={{ fontWeight: 700 }}>עדכון תוקף</h3>
              </div>
              <button onClick={() => { setEditingDoc(null); setEditExpiryValue(''); }} className="text-[#8d785e] hover:text-[#181510] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="text-[13px] text-[#8d785e] mb-1" style={{ fontWeight: 600 }}>מסמך</div>
              <div className="text-[15px] text-[#181510]" style={{ fontWeight: 600 }}>{editingDoc.name}</div>
              <div className="text-[12px] text-[#8d785e] mt-0.5">{editingDoc.entityName}</div>
            </div>

            <div className="mb-4">
              <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>תאריך תוקף חדש</label>
              <input
                type="date"
                value={editExpiryValue}
                onChange={(e) => setEditExpiryValue(e.target.value)}
                className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[13px] text-[#181510] focus:outline-none focus:border-[#ff8c00] focus:ring-2 focus:ring-[#ff8c00]/10 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onUpdateExpiry}
                disabled={!editExpiryValue || saving}
                className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-[14px]"
                style={{ fontWeight: 600 }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'שומר...' : 'שמור'}
              </button>
              <button
                onClick={() => { setEditingDoc(null); setEditExpiryValue(''); }}
                className="px-4 py-2.5 text-[#8d785e] hover:text-[#181510] hover:bg-[#f5f3f0] rounded-xl transition-colors text-[14px]"
                style={{ fontWeight: 600 }}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Delete Confirmation Modal ═══ */}
      {deletingDoc && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeletingDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-[18px] text-[#181510]" style={{ fontWeight: 700 }}>מחיקת מסמך</h3>
                <p className="text-[13px] text-[#8d785e]">פעולה זו אינה ניתנת לביטול</p>
              </div>
            </div>

            <div className="bg-[#faf9f7] rounded-xl p-3 mb-4">
              <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{deletingDoc.name}</div>
              <div className="text-[12px] text-[#8d785e] mt-0.5">{deletingDoc.entityName}</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onDeleteDoc}
                disabled={saving}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-[14px]"
                style={{ fontWeight: 600 }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {saving ? 'מוחק...' : 'מחק'}
              </button>
              <button
                onClick={() => setDeletingDoc(null)}
                className="px-4 py-2.5 text-[#8d785e] hover:text-[#181510] hover:bg-[#f5f3f0] rounded-xl transition-colors text-[14px]"
                style={{ fontWeight: 600 }}
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
