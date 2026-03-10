import { useMutation, useQuery } from "convex/react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  FileText,
  Loader2,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import { StatCard } from "./StatCard";

export function AdminDashboard() {
  const { profile } = useAuth();

  const adminStats = useQuery(api.dashboard.adminStats);
  const adminKPIs = useQuery(api.dashboard.adminKPIs);

  // Suppliers pending approval
  const allSuppliers = useQuery(api.suppliers.list);
  const pendingSuppliers = (allSuppliers ?? []).filter(
    (s) => s.registrationStatus === "pending"
  );

  const updateSupplier = useMutation(api.suppliers.update);

  const loading = adminStats === undefined;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="mb-3 animate-spin text-[#ff8c00]" size={32} />
        <p className="text-[#8d785e] text-[14px]">טוען נתוני דשבורד...</p>
      </div>
    );
  }

  async function handleApproveSupplier(supplierId: Id<"suppliers">) {
    try {
      await updateSupplier({
        id: supplierId,
        verificationStatus: "verified",
      });
      appToast.success("ספק אושר בהצלחה");
    } catch {
      appToast.error("שגיאה באישור הספק");
    }
  }

  async function handleRejectSupplier(supplierId: Id<"suppliers">) {
    try {
      await updateSupplier({
        id: supplierId,
        verificationStatus: "unverified",
      });
      appToast.success("ספק נדחה");
    } catch {
      appToast.error("שגיאה בדחיית הספק");
    }
  }

  return (
    <div className="w-full space-y-8 p-8" dir="rtl">
      {/* Welcome */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-[#181510] text-[30px] tracking-[-0.75px]"
          style={{ fontWeight: 600 }}
        >
          לוח בקרה - מנהל מערכת
        </h1>
        <p className="mt-1 text-[#8d785e] text-[16px]">
          שלום, {profile?.name || "מנהל"}. סקירה כללית של הפלטפורמה.
        </p>
      </motion.div>

      {/* Platform Summary Cards */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <StatCard
          color={{ icon: "#3B82F6", iconBg: "#EFF6FF", spark: "#3B82F6" }}
          icon={Users}
          index={0}
          title="מפיקים רשומים"
          value={adminStats.producers}
        />
        <StatCard
          color={{ icon: "#22C55E", iconBg: "#F0FDF4", spark: "#22C55E" }}
          icon={UserCheck}
          index={1}
          title="ספקים רשומים"
          value={adminStats.totalSuppliers}
        />
        <StatCard
          color={{ icon: "#F59E0B", iconBg: "#FFFBEB", spark: "#F59E0B" }}
          icon={AlertTriangle}
          index={2}
          title="ממתינים לאישור"
          value={adminStats.pendingApprovals}
        />
        <StatCard
          color={{ icon: "#8B5CF6", iconBg: "#F5F3FF", spark: "#8B5CF6" }}
          icon={FileText}
          index={3}
          title='סה"כ פרויקטים'
          value={adminStats.totalProjects}
        />
      </div>

      {/* Pending Supplier Approval Queue */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center gap-2 px-6 py-4">
          <Shield className="text-[#ff8c00]" size={18} />
          <h2
            className="text-[#181510] text-[18px]"
            style={{ fontWeight: 600 }}
          >
            תור אישור ספקים
          </h2>
          {pendingSuppliers.length > 0 && (
            <span
              className="rounded-full bg-[#ff8c00] px-2 py-0.5 text-[11px] text-white"
              style={{ fontWeight: 600 }}
            >
              {pendingSuppliers.length}
            </span>
          )}
        </div>
        <div className="border-[#f5f3f0] border-t px-6 py-4">
          {pendingSuppliers.length === 0 ? (
            <div className="flex flex-col items-center py-6">
              <CheckCircle className="mb-2 text-[#22c55e]" size={24} />
              <p className="text-[#8d785e] text-[14px]">
                אין ספקים ממתינים לאישור
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSuppliers.map((supplier) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-[#f5f3f0] bg-[#fdfcfb] px-4 py-3"
                  key={supplier.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#fff7ed]">
                      <Users className="text-[#ff8c00]" size={16} />
                    </div>
                    <div>
                      <p
                        className="text-[#181510] text-[14px]"
                        style={{ fontWeight: 600 }}
                      >
                        {supplier.name}
                      </p>
                      <div className="flex items-center gap-3 text-[#8d785e] text-[12px]">
                        <span>{supplier.category}</span>
                        {supplier.region && <span>{supplier.region}</span>}
                        {supplier.email && <span>{supplier.email}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1 rounded-lg bg-[#22c55e] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#16a34a]"
                      onClick={() =>
                        handleApproveSupplier(supplier.id as Id<"suppliers">)
                      }
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      <CheckCircle size={12} />
                      אשר
                    </button>
                    <button
                      className="flex items-center gap-1 rounded-lg bg-[#ef4444] px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-[#dc2626]"
                      onClick={() =>
                        handleRejectSupplier(supplier.id as Id<"suppliers">)
                      }
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      <XCircle size={12} />
                      דחה
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* KPI Tracking */}
      {adminKPIs && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 px-6 py-4">
            <BarChart3 className="text-[#8b5cf6]" size={18} />
            <h2
              className="text-[#181510] text-[18px]"
              style={{ fontWeight: 600 }}
            >
              מדדי ביצוע
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 border-[#f5f3f0] border-t px-6 py-5 lg:grid-cols-4">
            <KPICard
              color="#3B82F6"
              label="ספקים רשומים"
              target="200+"
              value={adminKPIs.registeredSuppliers.toString()}
            />
            <KPICard
              color="#22C55E"
              label="מפיקים"
              target="50+"
              value={adminKPIs.producers.toString()}
            />
            <KPICard
              color="#F59E0B"
              label="הצעות שנבנו"
              target="100+"
              value={adminKPIs.quotesBuilt.toString()}
            />
            <KPICard
              color="#8B5CF6"
              label="השלמת פרופילים"
              target="60%+"
              value={`${adminKPIs.profileCompletionRate}%`}
            />
          </div>
        </motion.div>
      )}

      {/* Recent Activity (static placeholder) */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-xl border border-[#e7e1da] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center gap-2 px-6 py-4">
          <TrendingUp className="text-[#ff8c00]" size={18} />
          <h2
            className="text-[#181510] text-[18px]"
            style={{ fontWeight: 600 }}
          >
            פעילות אחרונה
          </h2>
        </div>
        <div className="border-[#f5f3f0] border-t px-6 py-5">
          <div className="space-y-4">
            <ActivityRow
              color="#22c55e"
              subtitle={`${adminStats.totalSuppliers} ספקים, ${adminStats.producers} מפיקים`}
              time="כעת"
              title="סקירת משתמשים"
            />
            <ActivityRow
              color="#3b82f6"
              subtitle={`${adminStats.totalProjects} פרויקטים במערכת`}
              time="כעת"
              title="סקירת פרויקטים"
            />
            {adminStats.pendingApprovals > 0 && (
              <ActivityRow
                color="#f59e0b"
                subtitle={`${adminStats.pendingApprovals} ספקים ממתינים`}
                time="כעת"
                title="אישורים נדרשים"
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function KPICard({
  label,
  value,
  color,
  target,
}: {
  label: string;
  value: string;
  color: string;
  target?: string;
}) {
  return (
    <div className="rounded-lg border border-[#f5f3f0] bg-[#fdfcfb] p-4 text-center">
      <p
        className="text-[28px] leading-tight"
        style={{ color, fontWeight: 700 }}
      >
        {value}
      </p>
      <p
        className="mt-1 text-[#8d785e] text-[12px]"
        style={{ fontWeight: 500 }}
      >
        {label}
      </p>
      {target && (
        <p className="mt-1 text-[#b8a990] text-[10px]">יעד: {target}</p>
      )}
    </div>
  );
}

function ActivityRow({
  title,
  subtitle,
  time,
  color,
}: {
  title: string;
  subtitle: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[#181510] text-[14px]" style={{ fontWeight: 600 }}>
          {title}
        </p>
        <p className="text-[#8d785e] text-[12px]">{subtitle}</p>
      </div>
      <span className="shrink-0 text-[#c4b89a] text-[11px]">{time}</span>
    </div>
  );
}
