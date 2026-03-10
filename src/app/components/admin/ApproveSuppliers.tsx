import { useMutation, useQuery } from "convex/react";
import { CheckCircle, Clock, Users, UserX } from "lucide-react";
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

function formatHebrewDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ApproveSuppliers() {
  const pendingSuppliers = useQuery(api.users.listPendingSuppliers);
  const approve = useMutation(api.users.approveSupplier);
  const reject = useMutation(api.users.rejectSupplier);

  const handleApprove = async (id: string, name: string) => {
    try {
      await approve({ id: id as any });
      appToast.success(`${name || "ספק"} אושר בהצלחה`);
    } catch {
      appToast.error("שגיאה באישור הספק");
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await reject({ id: id as any });
      appToast.warning(`${name || "ספק"} נדחה`);
    } catch {
      appToast.error("שגיאה בדחיית הספק");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f8f7f5] font-['Assistant',sans-serif] text-[#181510]"
      dir="rtl"
    >
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Users className="h-7 w-7 text-[#ff8c00]" />
          <h1 className="font-bold text-2xl">אישור ספקים</h1>
          {pendingSuppliers && pendingSuppliers.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#ff8c00]/10 px-3 py-1 font-medium text-[#ff8c00] text-sm">
              <Clock className="h-4 w-4" />
              {pendingSuppliers.length} ממתינים
            </span>
          )}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[#e7e1da] bg-white shadow-sm">
          {pendingSuppliers === undefined ? (
            <div className="flex items-center justify-center p-12 text-[#181510]/50">
              טוען...
            </div>
          ) : pendingSuppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 p-12 text-[#181510]/50">
              <CheckCircle className="h-10 w-10 text-[#e7e1da]" />
              <p className="text-lg">אין ספקים ממתינים לאישור</p>
              <p className="text-sm">כל הרישומים טופלו</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#e7e1da]">
                  <TableHead className="text-right text-[#181510]/70">
                    שם
                  </TableHead>
                  <TableHead className="text-right text-[#181510]/70">
                    אימייל
                  </TableHead>
                  <TableHead className="text-right text-[#181510]/70">
                    טלפון
                  </TableHead>
                  <TableHead className="text-right text-[#181510]/70">
                    חברה
                  </TableHead>
                  <TableHead className="text-right text-[#181510]/70">
                    תאריך הרשמה
                  </TableHead>
                  <TableHead className="text-right text-[#181510]/70">
                    פעולות
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingSuppliers.map((supplier) => (
                  <TableRow className="border-[#e7e1da]" key={supplier._id}>
                    <TableCell className="font-medium">
                      {supplier.name || "---"}
                    </TableCell>
                    <TableCell className="text-[#181510]/80">
                      {supplier.email || "---"}
                    </TableCell>
                    <TableCell className="text-[#181510]/80">
                      {supplier.phone || "---"}
                    </TableCell>
                    <TableCell className="text-[#181510]/80">
                      {supplier.company || "---"}
                    </TableCell>
                    <TableCell className="text-[#181510]/80">
                      {supplier.createdAt
                        ? formatHebrewDate(supplier.createdAt)
                        : "---"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-green-700"
                          onClick={() =>
                            handleApprove(supplier.id, supplier.name || "")
                          }
                          type="button"
                        >
                          <CheckCircle className="h-4 w-4" />
                          אשר
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-red-700"
                          onClick={() =>
                            handleReject(supplier.id, supplier.name || "")
                          }
                          type="button"
                        >
                          <UserX className="h-4 w-4" />
                          דחה
                        </button>
                      </div>
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
