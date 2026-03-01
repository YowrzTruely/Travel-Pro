import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  LayoutDashboard, FolderOpen, Users, Calendar, Settings,
  Menu, X, Plus, UserCircle, FileText, Loader2, LogOut, HelpCircle, Bell
} from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsPanel } from './NotificationsPanel';
import imgAvatar from "figma:asset/3e33ffb968ecb98f421cfb68a6d08fed3e8bf007.png";
import imgLogo from "figma:asset/b655d2164f14a54b258c6a8a069f10a88a1c4640.png";
import { Breadcrumbs } from './Breadcrumbs';
import { appToast } from './AppToast';
import { projectsApi } from './api';
import { FormField, FormSelect, rules } from './FormField';
import { useAuth } from './AuthContext';

interface NewProjectForm {
  name: string;
  client: string;
  participants: string;
  region: string;
}

const mainNavItems = [
  { path: '/', label: 'דשבורד', icon: LayoutDashboard },
  { path: '/projects', label: 'פרויקטים', icon: FolderOpen },
  { path: '/suppliers', label: 'בנק ספקים', icon: Users },
  { path: '/clients', label: 'לקוחות', icon: UserCircle },
  { path: '/documents', label: 'מסמכים', icon: FileText },
  { path: '/calendar', label: 'יומן', icon: Calendar },
];

const bottomNavItems = [
  { path: '/settings', label: 'הגדרות', icon: Settings },
];

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { logout, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [npSaving, setNpSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, dirtyFields, isValid }, reset } = useForm<NewProjectForm>({
    mode: 'onChange',
    defaultValues: { name: '', client: '', participants: '', region: 'גליל עליון' },
  });

  // Auto-open new project modal from URL param
  useEffect(() => {
    if (searchParams.get('newProject') === 'true') {
      setShowNewProject(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Don't show layout for client quote pages
  if (location.pathname.startsWith('/quote/') || location.pathname === '/prd') {
    return <Outlet />;
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const onSubmitProject = async (data: NewProjectForm) => {
    try {
      setNpSaving(true);
      const project = await projectsApi.create({
        name: data.name.trim(),
        client: data.client.trim(),
        company: data.client.trim(),
        participants: parseInt(data.participants) || 0,
        region: data.region,
      });
      appToast.success('פרויקט חדש נוצר בהצלחה!', 'תוכל להתחיל להוסיף רכיבים וספקים');
      setShowNewProject(false);
      reset();
      navigate(`/projects/${project.id}`);
    } catch (err) {
      console.error('[Layout] Failed to create project:', err);
      appToast.error('שגיאה ביצירת פרויקט', String(err));
    } finally {
      setNpSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowNewProject(false);
    reset();
  };

  return (
    <div dir="rtl" className="flex h-screen bg-[#f8f7f5] font-['Assistant',sans-serif]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50 w-[256px] bg-white
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        flex flex-col border-l border-[#e7e1da]
      `}>
        {/* Logo */}
        <div className="border-b border-[#f5f3f0]">
          <div className="flex items-center gap-3 px-6 py-6 cursor-pointer" onClick={() => navigate('/')}>
            <img src={imgLogo} alt="יום כיף - ערן לוי" className="w-10 h-10 rounded-lg object-contain shrink-0" />
            <div>
              <div className="text-[18px] text-[#181510]" style={{ fontWeight: 700 }}>יום כיף</div>
              <div className="text-[12px] text-[#8d785e]">ערן לוי - הפקת אירועים</div>
            </div>
          </div>
          <button className="lg:hidden absolute top-5 left-4 text-[#8d785e]" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-4 flex flex-col">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all
                    ${active
                      ? 'bg-[rgba(255,140,0,0.1)] text-[#ff8c00]'
                      : 'text-[#181510] hover:bg-[#f5f3f0]'
                    }
                  `}
                  style={{ fontWeight: active ? 600 : 400 }}
                  dir="rtl"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          <div className="border-t border-[#f5f3f0] pt-4">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-all
                    ${active
                      ? 'bg-[rgba(255,140,0,0.1)] text-[#ff8c00]'
                      : 'text-[#181510] hover:bg-[#f5f3f0]'
                    }
                  `}
                  style={{ fontWeight: active ? 600 : 400 }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User + New project */}
        <div className="bg-[#fcfbf9] border-t border-[#f5f3f0] p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center shrink-0 border-2 border-white shadow-sm"
              style={{ backgroundImage: `url('${imgAvatar}')` }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] text-[#181510] truncate" style={{ fontWeight: 600 }}>
                {user?.user_metadata?.name || user?.email?.split('@')[0] || 'משתמש'}
              </div>
              <div className="text-[12px] text-[#8d785e] truncate">{user?.email || 'מפיק ראשי'}</div>
            </div>
            <button
              onClick={logout}
              title="התנתק"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#8d785e] hover:text-[#ef4444] hover:bg-red-50 transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
          <button
            onClick={() => setShowNewProject(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-lg shadow-sm transition-all"
            style={{ fontWeight: 600 }}
          >
            <span className="text-[16px]">+ פרויקט חדש</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-[#e7e1da] flex items-center px-4 lg:px-8 shrink-0 gap-4">
          <button className="lg:hidden text-[#181510] shrink-0" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <GlobalSearch />
          <div className="flex-1" />
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => navigate('/prd')}
              title="עזרה ומידע"
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f5f3f0] transition-colors text-[#181510]"
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
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()} dir="rtl">
            <h2 className="text-[22px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>פרויקט חדש</h2>
            <form onSubmit={handleSubmit(onSubmitProject)} className="space-y-4">
              <FormField
                label="שם הפרויקט"
                placeholder="למשל: נופש שנתי חברת XYZ"
                required
                error={errors.name}
                isDirty={dirtyFields.name}
                {...register('name', rules.requiredMin('שם הפרויקט', 2))}
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="לקוח"
                  placeholder="שם החברה"
                  required
                  error={errors.client}
                  isDirty={dirtyFields.client}
                  {...register('client', rules.required('לקוח'))}
                />
                <FormField
                  label="מספר משתתפים"
                  placeholder="120"
                  type="number"
                  error={errors.participants}
                  isDirty={dirtyFields.participants}
                  {...register('participants', rules.optionalPositiveInt('מספר משתתפים'))}
                />
              </div>
              <FormSelect
                label="אזור"
                error={errors.region}
                isDirty={dirtyFields.region}
                {...register('region')}
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
                  type="submit"
                  disabled={npSaving || !isValid}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {npSaving && <Loader2 size={16} className="animate-spin" />}
                  {npSaving ? 'יוצר...' : 'צור פרויקט'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 text-[#181510] hover:bg-[#f5f3f0] py-2.5 rounded-lg transition-colors border border-[#e7e1da]"
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