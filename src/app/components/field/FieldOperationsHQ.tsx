import { useMutation, useQuery } from "convex/react";
import {
  ArrowRight,
  Clock,
  Loader2,
  MapPin,
  Play,
  Plus,
  Receipt,
  Square,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { FieldStop } from "./FieldStop";
import { FieldSummary } from "./FieldSummary";
import { RoadExpenseForm } from "./RoadExpenseForm";
import { TimeShiftModal } from "./TimeShiftModal";

const statusLabels: Record<string, string> = {
  planned: "מתוכנן",
  in_progress: "בביצוע",
  completed: "הושלם",
};

const statusColors: Record<string, string> = {
  planned: "bg-gray-100 text-gray-600",
  in_progress: "bg-[#ff8c00] text-white animate-pulse",
  completed: "bg-green-100 text-green-700",
};

export function FieldOperationsHQ() {
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showTimeShift, setShowTimeShift] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Load project first (handles legacyId or _id)
  const project = useQuery(
    api.projects.get,
    projectIdParam ? { id: projectIdParam } : "skip"
  );

  // Load field operation by project's Convex _id
  const fieldOperation = useQuery(
    api.fieldOperations.getByProject,
    project?._id ? { projectId: project._id } : "skip"
  );

  // Load stops
  const stops = useQuery(
    api.fieldOperationStops.listByOperation,
    fieldOperation?._id ? { fieldOperationId: fieldOperation._id } : "skip"
  );

  const createOperation = useMutation(api.fieldOperations.create);
  const startOperationMut = useMutation(api.fieldOperations.startOperation);
  const completeOperationMut = useMutation(
    api.fieldOperations.completeOperation
  );

  // Loading state
  if (project === undefined || (project && fieldOperation === undefined)) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#faf9f7]"
        dir="rtl"
      >
        <Loader2 className="animate-spin text-[#ff8c00]" size={32} />
      </div>
    );
  }

  // Project not found
  if (project === null) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf9f7]"
        dir="rtl"
      >
        <p className="text-[#8d785e] text-[16px]">הפרויקט לא נמצא</p>
        <button
          className="flex min-h-11 items-center gap-2 rounded-xl bg-[#ff8c00] px-6 py-3 text-white transition-colors hover:bg-[#e67e00]"
          onClick={() => navigate("/projects")}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <ArrowRight size={16} />
          חזרה לפרויקטים
        </button>
      </div>
    );
  }

  const handleCreate = async () => {
    try {
      setCreating(true);
      await createOperation({ projectId: project._id as Id<"projects"> });
      appToast.success("מבצע שטח נוצר");
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן ליצור מבצע שטח");
    } finally {
      setCreating(false);
    }
  };

  const handleStart = async () => {
    if (!fieldOperation) {
      return;
    }
    try {
      setActionLoading(true);
      await startOperationMut({ id: fieldOperation._id });
      appToast.success("המבצע התחיל");
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן להתחיל את המבצע");
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!fieldOperation) {
      return;
    }
    try {
      setActionLoading(true);
      await completeOperationMut({ id: fieldOperation._id });
      appToast.success("המבצע הושלם");
    } catch (_err) {
      appToast.error("שגיאה", "לא ניתן לסיים את המבצע");
    } finally {
      setActionLoading(false);
    }
  };

  // No operation yet
  if (!fieldOperation) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#faf9f7] p-4"
        dir="rtl"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#ff8c00]/10">
          <MapPin className="text-[#ff8c00]" size={40} />
        </div>
        <div className="text-center">
          <h2
            className="mb-2 text-[#181510] text-[20px]"
            style={{ fontWeight: 700 }}
          >
            מבצע שטח — {project.name}
          </h2>
          <p className="text-[#8d785e] text-[14px]">
            אין עדיין מבצע שטח לפרויקט זה. צור מבצע חדש כדי להתחיל.
          </p>
        </div>
        <button
          className="flex min-h-11 items-center gap-2 rounded-xl bg-[#ff8c00] px-6 py-3 text-[16px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
          disabled={creating}
          onClick={handleCreate}
          style={{ fontWeight: 700 }}
          type="button"
        >
          {creating ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Plus size={20} />
          )}
          צור מבצע שטח
        </button>
      </div>
    );
  }

  const sortedStops = stops
    ? [...stops].sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  return (
    <div className="min-h-screen bg-[#faf9f7]" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-10 border-[#e7e1da] border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-2 text-[#8d785e] transition-colors hover:bg-[#f5f3f0]"
              onClick={() => navigate(-1)}
              type="button"
            >
              <ArrowRight size={20} />
            </button>
            <div>
              <h1
                className="text-[#181510] text-[18px]"
                style={{ fontWeight: 700 }}
              >
                {project.name}
              </h1>
              <p className="text-[#8d785e] text-[12px]">מבצע שטח</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[12px] ${statusColors[fieldOperation.status]}`}
              style={{ fontWeight: 600 }}
            >
              {statusLabels[fieldOperation.status]}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-auto max-w-lg px-4 py-3">
        <div className="flex gap-2">
          {fieldOperation.status === "planned" && (
            <button
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ff8c00] px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
              disabled={actionLoading}
              onClick={handleStart}
              style={{ fontWeight: 700 }}
              type="button"
            >
              {actionLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Play size={16} />
              )}
              התחל מבצע
            </button>
          )}
          {fieldOperation.status === "in_progress" && (
            <button
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-[14px] text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              disabled={actionLoading}
              onClick={handleComplete}
              style={{ fontWeight: 700 }}
              type="button"
            >
              {actionLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Square size={16} />
              )}
              סיים מבצע
            </button>
          )}
          <button
            className="flex min-h-11 items-center gap-2 rounded-xl border border-[#e7e1da] px-4 py-2.5 text-[#181510] text-[14px] transition-colors hover:bg-[#f5f3f0]"
            onClick={() => setShowExpenseForm(true)}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Receipt size={16} />
            הוצאות
          </button>
        </div>
      </div>

      {/* Timeline of stops */}
      <div className="mx-auto max-w-lg space-y-3 px-4 pb-24">
        {sortedStops.length === 0 ? (
          <div className="rounded-xl border border-[#e7e1da] border-dashed p-8 text-center">
            <MapPin className="mx-auto mb-2 text-[#8d785e]" size={24} />
            <p className="text-[#8d785e] text-[14px]">
              אין עצירות עדיין. הוסף עצירות דרך עמוד הפרויקט.
            </p>
          </div>
        ) : (
          sortedStops.map((stop) => <FieldStop key={stop.id} stop={stop} />)
        )}

        {/* Summary when completed */}
        {fieldOperation.status === "completed" && (
          <FieldSummary
            completedAt={fieldOperation.completedAt}
            fieldOperationId={fieldOperation._id}
            startedAt={fieldOperation.startedAt}
          />
        )}
      </div>

      {/* Floating action button for time shift */}
      {fieldOperation.status !== "completed" && sortedStops.length > 0 && (
        <button
          className="fixed bottom-6 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#181510] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          onClick={() => setShowTimeShift(true)}
          title="הזזת לוח זמנים"
          type="button"
        >
          <Clock size={24} />
        </button>
      )}

      {/* Modals */}
      {showExpenseForm && (
        <RoadExpenseForm
          fieldOperationId={fieldOperation._id}
          onClose={() => setShowExpenseForm(false)}
          projectId={project._id as Id<"projects">}
        />
      )}

      {showTimeShift && (
        <TimeShiftModal
          fieldOperationId={fieldOperation._id}
          onClose={() => setShowTimeShift(false)}
          stops={sortedStops}
        />
      )}
    </div>
  );
}
