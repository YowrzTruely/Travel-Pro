import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  Search, Plus, FolderOpen, Users, MapPin,
  DollarSign, ChevronLeft, Loader2, MoreVertical,
  Edit2, ArrowRightLeft, Trash2, X, AlertTriangle, Copy
} from 'lucide-react';
import type { Project } from './data';
import { projectsApi } from './api';
import { appToast } from './AppToast';
import { FormField, FormSelect, rules } from './FormField';
import { useConfirmDelete } from './ConfirmDeleteModal';

const STATUS_OPTIONS_ALL = ['הכל', 'ליד חדש', 'בניית הצעה', 'הצעה נשלחה', 'אושר', 'מחיר בהערכה', 'בביצוע'];
const STATUS_CHANGE_OPTIONS = ['ליד חדש', 'בניית הצעה', 'הצעה נשלחה', 'אושר', 'מחיר בהערכה', 'בביצוע'];

const STATUS_COLORS: Record<string, string> = {
  'ליד חדש': '#3b82f6',
  'בניית הצעה': '#f97316',
  'הצעה נשלחה': '#8b5cf6',
  'אושר': '#22c55e',
  'מחיר בהערכה': '#eab308',
  'בביצוע': '#ff8c00',
};

interface EditProjectForm {
  name: string;
  client: string;
  participants: string;
  region: string;
}

export function ProjectsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('status') || 'הכל';
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Action state
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [statusProject, setStatusProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  // Edit form
  const editForm = useForm<EditProjectForm>({
    mode: 'onChange',
    defaultValues: { name: '', client: '', participants: '', region: '' },
  });

  useEffect(() => {
    setLoading(true);
    projectsApi.list()
      .then(setProjects)
      .catch(err => console.error('[ProjectsList] fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    if (openMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openMenu]);

  const filtered = projects.filter(p => {
    const matchesStatus = statusFilter === 'הכל' || p.status === statusFilter;
    const matchesSearch = !search || p.name.includes(search) || p.company.includes(search);
    return matchesStatus && matchesSearch;
  });

  // ─── Edit project ───
  const openEdit = (project: Project) => {
    setEditingProject(project);
    editForm.reset({
      name: project.name,
      client: project.client || project.company,
      participants: String(project.participants || ''),
      region: project.region,
    });
    setOpenMenu(null);
  };

  const onSaveEdit = async (data: EditProjectForm) => {
    if (!editingProject) return;
    try {
      setSaving(true);
      const updated = await projectsApi.update(editingProject.id, {
        name: data.name.trim(),
        client: data.client.trim(),
        company: data.client.trim(),
        participants: parseInt(data.participants) || 0,
        region: data.region.trim(),
      });
      setProjects(prev => prev.map(p => p.id === editingProject.id ? updated : p));
      setEditingProject(null);
      editForm.reset();
      appToast.success('פרויקט עודכן', `"${updated.name}" עודכן בהצלחה`);
    } catch (err) {
      console.error('[ProjectsList] Update failed:', err);
      appToast.error('שגיאה', 'לא ניתן לעדכן את הפרויקט');
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
    if (!statusProject) return;
    try {
      setSaving(true);
      const updated = await projectsApi.update(statusProject.id, {
        status: newStatus,
        statusColor: STATUS_COLORS[newStatus] || '#8d785e',
      });
      setProjects(prev => prev.map(p => p.id === statusProject.id ? updated : p));
      setStatusProject(null);
      appToast.success('סטטוס עודכן', `"${updated.name}" → ${newStatus}`);
    } catch (err) {
      console.error('[ProjectsList] Status change failed:', err);
      appToast.error('שגיאה', 'לא ניתן לשנות את הסטטוס');
    } finally {
      setSaving(false);
    }
  };

  // ─── Duplicate project ───
  const duplicateProject = async (project: Project) => {
    setOpenMenu(null);
    try {
      const copy = await projectsApi.create({
        name: `${project.name} (עותק)`,
        client: project.client,
        company: project.company,
        participants: project.participants,
        region: project.region,
      });
      setProjects(prev => [copy, ...prev]);
      appToast.success('פרויקט שוכפל', `"${copy.name}" נוצר בהצלחה`);
    } catch (err) {
      console.error('[ProjectsList] Duplicate failed:', err);
      appToast.error('שגיאה בשכפול פרויקט');
    }
  };

  // ─── Delete project ───
  const openDelete = (project: Project) => {
    setOpenMenu(null);
    requestDelete({
      title: 'מחיקת פרויקט',
      itemName: project.name,
      onConfirm: async () => {
        await projectsApi.delete(project.id);
        setProjects(prev => prev.filter(p => p.id !== project.id));
        appToast.success('פרויקט נמחק', `"${project.name}" הוסר מהמערכת`);
      },
    });
  };

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff8c00]/10 rounded-xl flex items-center justify-center">
            <FolderOpen size={20} className="text-[#ff8c00]" />
          </div>
          <h1 className="text-[26px] text-[#181510]" style={{ fontWeight: 700 }}>פרויקטים</h1>
        </div>
        <button
          onClick={() => navigate('/projects?newProject=true')}
          className="flex items-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-[#ff8c00]/20 transition-all text-[14px]"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> פרויקט חדש
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e7e1da] rounded-lg pr-9 pl-3 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00]"
            placeholder="חיפוש פרויקט..."
          />
        </div>
        <div className="flex gap-1 bg-white border border-[#e7e1da] rounded-lg p-1 overflow-x-auto">
          {STATUS_OPTIONS_ALL.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
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
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-[#ff8c00] mb-3" />
          <p className="text-[14px] text-[#8d785e]">טוען פרויקטים...</p>
        </div>
      )}

      {/* Projects grid */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-[#e7e1da] p-5 text-right hover:shadow-lg hover:border-[#d4cdc3] transition-all group relative"
            >
              {/* Action menu trigger */}
              <div className="absolute top-3 left-3 z-10" ref={openMenu === project.id ? menuRef : undefined}>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === project.id ? null : project.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8d785e] hover:bg-[#f5f3f0] hover:text-[#181510] transition-colors"
                >
                  <MoreVertical size={16} />
                </button>

                {/* Dropdown menu */}
                {openMenu === project.id && (
                  <div className="absolute left-0 top-9 bg-white rounded-xl border border-[#e7e1da] shadow-xl py-1 w-44 z-50">
                    <button
                      onClick={() => openEdit(project)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#181510] hover:bg-[#f5f3f0] transition-colors"
                    >
                      <Edit2 size={14} className="text-[#8d785e]" />
                      ערוך פרטים
                    </button>
                    <button
                      onClick={() => openStatusChange(project)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#181510] hover:bg-[#f5f3f0] transition-colors"
                    >
                      <ArrowRightLeft size={14} className="text-[#8d785e]" />
                      שנה סטטוס
                    </button>
                    <button
                      onClick={() => duplicateProject(project)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#181510] hover:bg-[#f5f3f0] transition-colors"
                    >
                      <Copy size={14} className="text-[#8d785e]" />
                      שכפל פרויקט
                    </button>
                    <div className="border-t border-[#f5f3f0] my-1" />
                    <button
                      onClick={() => openDelete(project)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                      מחק פרויקט
                    </button>
                  </div>
                )}
              </div>

              {/* Card content — clickable */}
              <button
                onClick={() => navigate(`/projects/${project.id}`)}
                className="w-full text-right"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: project.statusColor + '15', color: project.statusColor, fontWeight: 600 }}
                  >
                    {project.status}
                  </span>
                  <span className="text-[11px] text-[#8d785e]">#{project.id}</span>
                </div>
                <h3 className="text-[16px] text-[#181510] mb-1 group-hover:text-[#ff8c00] transition-colors" style={{ fontWeight: 600 }}>{project.name}</h3>
                <p className="text-[12px] text-[#8d785e] mb-3">{project.company}</p>
                <div className="flex flex-wrap gap-3 text-[12px] text-[#8d785e]">
                  <span className="flex items-center gap-1"><Users size={12} /> {project.participants}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {project.region}</span>
                  {project.totalPrice > 0 && (
                    <span className="flex items-center gap-1"><DollarSign size={12} /> ₪{project.totalPrice.toLocaleString()}</span>
                  )}
                </div>
                {project.profitMargin > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#ece8e3] rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: `${project.profitMargin}%` }} />
                    </div>
                    <span className="text-[11px] text-green-600" style={{ fontWeight: 600 }}>{project.profitMargin}%</span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-end text-[12px] text-[#ff8c00] opacity-0 group-hover:opacity-100 transition-opacity">
                  פתח פרויקט <ChevronLeft size={12} />
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-[40px] mb-3">📁</div>
          <p className="text-[16px] text-[#8d785e]">לא נמצאו פרויקטים</p>
          <p className="text-[13px] text-[#8d785e] mt-1">נסה לשנות את הסינון או ליצור פרויקט חדש</p>
        </div>
      )}

      {/* ═══ Edit Project Modal ═══ */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setEditingProject(null); editForm.reset(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>עריכת פרויקט</h3>
              <button onClick={() => { setEditingProject(null); editForm.reset(); }} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <form onSubmit={editForm.handleSubmit(onSaveEdit)} className="space-y-4">
              <FormField
                label="שם פרויקט"
                required
                error={editForm.formState.errors.name}
                isDirty={editForm.formState.dirtyFields.name}
                {...editForm.register('name', rules.requiredMin('שם פרויקט', 2))}
              />
              <FormField
                label="לקוח / חברה"
                required
                error={editForm.formState.errors.client}
                isDirty={editForm.formState.dirtyFields.client}
                {...editForm.register('client', rules.requiredMin('לקוח', 2))}
              />
              <FormField
                label="מספר משתתפים"
                type="number"
                required
                error={editForm.formState.errors.participants}
                isDirty={editForm.formState.dirtyFields.participants}
                {...editForm.register('participants', rules.positiveInt('מספר משתתפים'))}
              />
              <FormField
                label="אזור"
                error={editForm.formState.errors.region}
                isDirty={editForm.formState.dirtyFields.region}
                {...editForm.register('region')}
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !editForm.formState.isValid}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Edit2 size={16} />}
                  {saving ? 'שומר...' : 'שמור שינויים'}
                </button>
                <button type="button" onClick={() => { setEditingProject(null); editForm.reset(); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Change Status Modal ═══ */}
      {statusProject && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setStatusProject(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>שינוי סטטוס</h3>
              <button onClick={() => setStatusProject(null)} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <p className="text-[13px] text-[#8d785e] mb-4">
              פרויקט: <span style={{ fontWeight: 600, color: '#181510' }}>{statusProject.name}</span>
            </p>
            <div className="space-y-2">
              {STATUS_CHANGE_OPTIONS.map(status => {
                const color = STATUS_COLORS[status] || '#8d785e';
                const isCurrent = statusProject.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => !isCurrent && changeStatus(status)}
                    disabled={isCurrent || saving}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-[#ff8c00] bg-[#ff8c00]/5 cursor-default'
                        : 'border-[#e7e1da] hover:border-[#d4cdc3] hover:bg-[#f5f3f0]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-[14px] text-[#181510]" style={{ fontWeight: isCurrent ? 600 : 400 }}>{status}</span>
                    </div>
                    {isCurrent && <span className="text-[11px] text-[#ff8c00]" style={{ fontWeight: 600 }}>נוכחי</span>}
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