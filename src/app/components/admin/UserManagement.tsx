import { useMutation, useQuery } from "convex/react";
import { Search, Shield, Users } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { appToast } from "../AppToast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const ROLE_LABELS: Record<string, string> = {
  admin: "מנהל",
  producer: "מפיק",
  supplier: "ספק",
};

const STATUS_LABELS: Record<string, string> = {
  active: "פעיל",
  pending: "ממתין",
  suspended: "מושעה",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-success/15 text-success",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-destructive/15 text-destructive",
};

function formatHebrewDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function UserManagement() {
  const users = useQuery(api.users.list);
  const updateUser = useMutation(api.users.updateUserAdmin);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users?.filter((user) => {
    if (!searchQuery) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    return (
      (user.name?.toLowerCase().includes(query) ?? false) ||
      (user.email?.toLowerCase().includes(query) ?? false) ||
      (user.company?.toLowerCase().includes(query) ?? false)
    );
  });

  const handleRoleChange = async (
    id: string,
    role: "admin" | "producer" | "supplier"
  ) => {
    try {
      await updateUser({ id: id as any, role });
      appToast.success("התפקיד עודכן בהצלחה");
    } catch {
      appToast.error("שגיאה בעדכון התפקיד");
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "active" | "pending" | "suspended"
  ) => {
    try {
      await updateUser({ id: id as any, status });
      appToast.success("הסטטוס עודכן בהצלחה");
    } catch {
      appToast.error("שגיאה בעדכון הסטטוס");
    }
  };

  return (
    <div
      className="min-h-screen bg-background font-['Assistant',sans-serif] text-foreground"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <h1 className="font-bold text-2xl">ניהול משתמשים</h1>
          {users && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary text-sm">
              <Users className="h-4 w-4" />
              {searchQuery ? (filteredUsers?.length ?? 0) : users.length}{" "}
              משתמשים
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full rounded-xl border border-border bg-background py-2.5 pr-10 pl-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש לפי שם, אימייל או חברה..."
              type="text"
              value={searchQuery}
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          {users === undefined ? (
            <div className="flex items-center justify-center p-12 text-foreground/50">
              טוען...
            </div>
          ) : filteredUsers && filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-12 text-foreground/50">
              <Users className="h-10 w-10 text-border" />
              <p className="text-lg">
                {searchQuery ? "לא נמצאו תוצאות" : "אין משתמשים במערכת"}
              </p>
              {searchQuery && (
                <p className="text-sm">נסה לשנות את מילות החיפוש</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-right text-foreground/70">
                    שם
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    אימייל
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    תפקיד
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    סטטוס
                  </TableHead>
                  <TableHead className="text-right text-foreground/70">
                    תאריך יצירה
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow className="border-border" key={user._id}>
                    <TableCell className="font-medium">
                      {user.name || "---"}
                    </TableCell>
                    <TableCell className="text-foreground/80">
                      {user.email || "---"}
                    </TableCell>
                    <TableCell>
                      <select
                        className="rounded-lg border border-border bg-card px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        onChange={(e) =>
                          handleRoleChange(
                            user.id,
                            e.target.value as "admin" | "producer" | "supplier"
                          )
                        }
                        value={user.role || ""}
                      >
                        <option value="">---</option>
                        <option value="admin">{ROLE_LABELS.admin}</option>
                        <option value="producer">{ROLE_LABELS.producer}</option>
                        <option value="supplier">{ROLE_LABELS.supplier}</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <select
                        className={`rounded-lg border border-transparent px-2 py-1 font-medium text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${STATUS_STYLES[user.status || ""] || "bg-accent text-muted-foreground"}`}
                        onChange={(e) =>
                          handleStatusChange(
                            user.id,
                            e.target.value as "active" | "pending" | "suspended"
                          )
                        }
                        value={user.status || ""}
                      >
                        <option value="">---</option>
                        <option value="active">{STATUS_LABELS.active}</option>
                        <option value="pending">{STATUS_LABELS.pending}</option>
                        <option value="suspended">
                          {STATUS_LABELS.suspended}
                        </option>
                      </select>
                    </TableCell>
                    <TableCell className="text-foreground/80">
                      {user.createdAt
                        ? formatHebrewDate(user.createdAt)
                        : "---"}
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
