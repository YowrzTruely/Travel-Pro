import imgAvatar from "figma:asset/3e33ffb968ecb98f421cfb68a6d08fed3e8bf007.png";
import imgLogo from "figma:asset/b655d2164f14a54b258c6a8a069f10a88a1c4640.png";
import { useMutation } from "convex/react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Box,
  Calendar,
  CheckCircle,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Menu,
  Settings,
  Shield,
  Target,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { api } from "../../../convex/_generated/api";
import { appConfig } from "../../appConfig";
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
  locked?: boolean;
  path: string;
}

const producerNavItems: NavItem[] = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/projects", label: "פרויקטים", icon: FolderOpen },
  { path: "/suppliers", label: "בנק ספקים", icon: Users },
  { path: "/clients", label: "לקוחות", icon: UserCircle },
  { path: "/crm", label: "ניהול לידים", icon: Target },
  { path: "/documents", label: "מסמכים", icon: FileText },
  { path: "/calendar", label: "יומן", icon: Calendar },
];

const supplierNavStage1: NavItem[] = [
  { path: "/", label: "דשבורד", icon: LayoutDashboard },
  { path: "/products", label: "מוצרים", icon: Box },
  { path: "/documents", label: "מסמכים", icon: FileText },
  { path: "/profile", label: "פרופיל", icon: UserCircle },
];

const supplierNavStage2: NavItem[] = [
  { path: "/promotions", label: "מבצעים", icon: Box },
  { path: "/ratings", label: "דירוגים", icon: CheckCircle },
  { path: "/availability", label: "זמינות", icon: Calendar },
  { path: "/preview", label: "תצוגה מקדימה", icon: FileText },
  { path: "/requests", label: "בקשות", icon: ClipboardList },
];

const adminNavItems: NavItem[] = [
  { path: "/", label: "דשבורד", icon: Shield },
  { path: "/approve-suppliers", label: "אישור ספקים", icon: CheckCircle },
  { path: "/users", label: "משתמשים", icon: Users },
  { path: "/activity", label: "יומן פעילות", icon: Activity },
];

const bottomNavItems: NavItem[] = [
  { path: "/settings", label: "הגדרות", icon: Settings },
];

function getNavItemsForRole(role?: string, supplierStage?: string): NavItem[] {
  switch (role) {
    case "supplier": {
      if (appConfig.supplierPermissionsUnlocked) {
        return [...supplierNavStage1, ...supplierNavStage2];
      }
      const stageLevel =
        supplierStage === "stage2" ? 2 : supplierStage === "stage3" ? 3 : 1;
      const stage2Items =
        stageLevel >= 2
          ? supplierNavStage2
          : supplierNavStage2.map((item) => ({ ...item, locked: true }));
      return [...supplierNavStage1, ...stage2Items];
    }
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
  const mainNavItems = getNavItemsForRole(
    profile?.role,
    profile?.onboardingStage
  );
  const allNavItems = [...mainNavItems, ...bottomNavItems];
  const isProducer = !profile?.role || profile.role === "producer";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [npSaving, setNpSaving] = useState(false);

  // Track navigation direction for vertical carousel
  const [slideDirection, setSlideDirection] = useState(0);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    if (prevPath !== location.pathname) {
      const prevIdx = allNavItems.findIndex(
        (item) =>
          prevPath === item.path ||
          (item.path !== "/" && prevPath.startsWith(item.path))
      );
      const newIdx = allNavItems.findIndex(
        (item) =>
          location.pathname === item.path ||
          (item.path !== "/" && location.pathname.startsWith(item.path))
      );
      if (prevIdx >= 0 && newIdx >= 0) {
        setSlideDirection(newIdx > prevIdx ? 1 : -1);
      } else {
        setSlideDirection(0);
      }
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname, allNavItems]);

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
  if (location.pathname.startsWith("/quote/")) {
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
          <SidebarNavGroup
            isActive={isActive}
            items={mainNavItems}
            navigate={navigate}
            onItemClick={() => setSidebarOpen(false)}
          />

          <div className="flex-1" />

          <div className="border-[#f5f3f0] border-t pt-4">
            <SidebarNavGroup
              isActive={isActive}
              items={bottomNavItems}
              navigate={navigate}
              onItemClick={() => setSidebarOpen(false)}
            />
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
            <NotificationsPanel />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Breadcrumbs />
          <PageTransition
            locationKey={location.pathname}
            slideDirection={slideDirection}
          >
            <Outlet />
          </PageTransition>
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

/* ─── Page Transition (desktop only) ───────────── */

function PageTransition({
  children,
  locationKey,
  slideDirection,
}: {
  children: React.ReactNode;
  locationKey: string;
  slideDirection: number;
}) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: slideDirection === 0 ? 0 : slideDirection > 0 ? "-15%" : "15%",
        }}
        initial={{
          opacity: 0,
          y: slideDirection === 0 ? 0 : slideDirection > 0 ? "15%" : "-15%",
        }}
        key={locationKey}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 34,
          mass: 0.8,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Sidebar Nav Group with Glass Indicator ───── */

function SidebarNavGroup({
  items,
  isActive,
  navigate,
  onItemClick,
}: {
  items: NavItem[];
  isActive: (path: string) => boolean;
  navigate: (path: string) => void;
  onItemClick: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const activeItem = items.find((item) => isActive(item.path));

  useEffect(() => {
    if (!activeItem) {
      return;
    }
    const el = itemRefs.current.get(activeItem.path);
    const container = containerRef.current;
    if (!(el && container)) {
      return;
    }
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setIndicator({
      top: eRect.top - cRect.top,
      height: eRect.height,
    });
  }, [activeItem]);

  return (
    <div className="relative space-y-1" ref={containerRef}>
      {/* Glass indicator — desktop only */}
      {activeItem && (
        <motion.div
          animate={{ top: indicator.top, height: indicator.height }}
          className="pointer-events-none absolute right-0 left-0 hidden rounded-lg lg:block"
          initial={false}
          style={{
            background:
              "linear-gradient(135deg, rgba(255,140,0,0.12) 0%, rgba(255,140,0,0.06) 100%)",
            boxShadow:
              "0 1px 6px rgba(255,140,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
            backdropFilter: "blur(8px)",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.6,
          }}
        />
      )}

      {items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.path);
        const locked = item.locked;
        return (
          <button
            className={`relative z-10 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors duration-200 ${
              locked
                ? "cursor-not-allowed text-[#b8a990]"
                : active
                  ? "text-[#ff8c00]"
                  : "text-[#181510] hover:bg-[#f5f3f0]"
            }`}
            dir="rtl"
            key={item.path}
            onClick={() => {
              if (locked) {
                return;
              }
              navigate(item.path);
              onItemClick();
            }}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(item.path, el);
              }
            }}
            style={{ fontWeight: active && !locked ? 600 : 400 }}
            type="button"
          >
            <Icon size={18} />
            <span>{item.label}</span>
            {locked && <Lock className="mr-auto" size={14} />}
          </button>
        );
      })}
    </div>
  );
}
