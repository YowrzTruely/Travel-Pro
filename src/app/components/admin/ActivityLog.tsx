import { useQuery } from "convex/react";
import { Activity } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const ACTION_LABELS: Record<string, string> = {
  create: "יצירה",
  update: "עדכון",
  delete: "מחיקה",
  archive: "ארכיון",
  import: "ייבוא",
};

const ENTITY_LABELS: Record<string, string> = {
  suppliers: "ספקים",
  projects: "פרויקטים",
  clients: "לקוחות",
  leads: "לידים",
  users: "משתמשים",
};

const ENTITY_OPTIONS = [
  { value: "all", label: "הכל" },
  { value: "suppliers", label: "ספקים" },
  { value: "projects", label: "פרויקטים" },
  { value: "clients", label: "לקוחות" },
  { value: "leads", label: "לידים" },
  { value: "users", label: "משתמשים" },
];

const ACTION_OPTIONS = [
  { value: "all", label: "הכל" },
  { value: "create", label: "יצירה" },
  { value: "update", label: "עדכון" },
  { value: "delete", label: "מחיקה" },
  { value: "archive", label: "ארכיון" },
  { value: "import", label: "ייבוא" },
];

function formatHebrewDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityLog() {
  const [entityType, setEntityType] = useState("all");
  const [action, setAction] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filters: {
    entityType?: string;
    action?: string;
    fromDate?: number;
    toDate?: number;
  } = {};

  if (entityType !== "all") {
    filters.entityType = entityType;
  }
  if (action !== "all") {
    filters.action = action;
  }
  if (fromDate) {
    filters.fromDate = new Date(fromDate).getTime();
  }
  if (toDate) {
    filters.toDate = new Date(`${toDate}T23:59:59`).getTime();
  }

  const entries = useQuery(api.activityLog.list, { ...filters });

  return (
    <div
      className="min-h-screen bg-background font-['Assistant',sans-serif] text-foreground"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Activity className="h-7 w-7 text-primary" />
          <h1 className="font-bold text-2xl">יומן פעילות</h1>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-4">
          <label className="flex flex-col gap-1">
            <span className="font-medium text-foreground/70 text-sm">
              סוג ישות
            </span>
            <select
              className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setEntityType(e.target.value)}
              value={entityType}
            >
              {ENTITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-foreground/70 text-sm">
              פעולה
            </span>
            <select
              className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setAction(e.target.value)}
              value={action}
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-foreground/70 text-sm">
              מתאריך
            </span>
            <input
              className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setFromDate(e.target.value)}
              type="date"
              value={fromDate}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-foreground/70 text-sm">
              עד תאריך
            </span>
            <input
              className="rounded-md border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setToDate(e.target.value)}
              type="date"
              value={toDate}
            />
          </label>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          {entries === undefined ? (
            <div className="flex items-center justify-center p-12 text-foreground/50">
              טוען...
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-12 text-foreground/50">
              <Activity className="h-10 w-10 text-border" />
              <p className="text-lg">אין רשומות פעילות</p>
              <p className="text-sm">לא נמצאו רשומות התואמות את הסינון שנבחר</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-right text-foreground/70">
                    תאריך
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    משתמש
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    פעולה
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    סוג ישות
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    פרטים
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow className="border-border" key={entry._id}>
                    <TableCell className="text-foreground/80">
                      {formatHebrewDate(entry.createdAt)}
                    </TableCell>
                    <TableCell>{entry.userId ?? "מערכת"}</TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                        {ACTION_LABELS[entry.action] ?? entry.action}
                      </span>
                    </TableCell>
                    <TableCell>
                      {ENTITY_LABELS[entry.entityType] ?? entry.entityType}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-foreground/60">
                      {entry.details ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
