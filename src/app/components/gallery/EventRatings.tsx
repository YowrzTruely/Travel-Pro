import { useMutation, useQuery } from "convex/react";
import { CheckCircle, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

interface RatingEntry {
  comment: string;
  rating: number;
  supplierId: Id<"suppliers">;
}

export function EventRatings() {
  const { projectId } = useParams<{ projectId: string }>();
  const typedProjectId = projectId as Id<"projects">;

  const quoteItems = useQuery(
    api.quoteItems.listByProjectId,
    projectId ? { projectId: typedProjectId } : "skip"
  );

  const createBulk = useMutation(api.supplierRatings.createBulk);

  const [participantName, setParticipantName] = useState("");
  const [ratings, setRatings] = useState<Map<string, RatingEntry>>(new Map());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!projectId) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f8f7f5] font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <p className="text-[#8d785e] text-[16px]">דף דירוג לא נמצא</p>
      </div>
    );
  }

  if (quoteItems === undefined) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f8f7f5] font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <Loader2 className="animate-spin text-[#b8a990]" size={32} />
      </div>
    );
  }

  // Filter to items that have a supplier
  const rateableItems = quoteItems.filter((item) => item.supplierId);

  function updateRating(
    itemId: string,
    supplierId: Id<"suppliers">,
    field: "rating" | "comment",
    value: number | string
  ) {
    setRatings((prev) => {
      const next = new Map(prev);
      const existing = next.get(itemId) ?? {
        supplierId,
        rating: 0,
        comment: "",
      };
      if (field === "rating") {
        existing.rating = value as number;
      } else {
        existing.comment = value as string;
      }
      next.set(itemId, existing);
      return next;
    });
  }

  async function handleSubmit() {
    const validRatings = Array.from(ratings.values()).filter(
      (r) => r.rating > 0
    );
    if (validRatings.length === 0) {
      appToast.error("נא לדרג לפחות פעילות אחת");
      return;
    }
    setSubmitting(true);
    try {
      await createBulk({
        projectId: typedProjectId,
        participantName: participantName.trim() || undefined,
        ratings: validRatings.map((r) => ({
          supplierId: r.supplierId,
          rating: r.rating,
          comment: r.comment.trim() || undefined,
        })),
      });
      setSubmitted(true);
    } catch {
      appToast.error("שגיאה בשליחת הדירוגים");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f8f7f5] font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#22c55e]/10">
            <CheckCircle className="text-[#22c55e]" size={32} />
          </div>
          <h1
            className="mb-2 text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            תודה רבה!
          </h1>
          <p className="text-[#8d785e] text-[15px]">
            הדירוגים שלכם נשמרו בהצלחה. המשוב שלכם עוזר לנו להשתפר!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f8f7f5] font-['Assistant',sans-serif]"
      dir="rtl"
    >
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff8c00]/10">
            <Star className="text-[#ff8c00]" size={28} />
          </div>
          <h1
            className="text-[#181510] text-[24px]"
            style={{ fontWeight: 700 }}
          >
            דרגו את הפעילויות
          </h1>
          <p className="mt-1 text-[#8d785e] text-[15px]">
            ספרו לנו מה חשבתם על כל פעילות
          </p>
        </div>

        {/* Participant Name */}
        <div className="mb-6 rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm">
          <label
            className="mb-2 block text-[#181510] text-[14px]"
            style={{ fontWeight: 600 }}
          >
            השם שלכם (אופציונלי)
            <input
              className="mt-1 block w-full rounded-lg border border-[#e7e1da] px-3 py-2.5 font-normal text-[14px] outline-none focus:border-[#ff8c00]"
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="הכניסו את שמכם"
              value={participantName}
            />
          </label>
        </div>

        {/* Activities to rate */}
        {rateableItems.length === 0 ? (
          <div className="rounded-2xl border border-[#e7e1da] bg-white py-12 text-center shadow-sm">
            <p className="text-[#8d785e] text-[16px]">אין פעילויות לדירוג</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rateableItems.map((item) => {
              const entry = ratings.get(item.id) ?? {
                supplierId: item.supplierId as Id<"suppliers">,
                rating: 0,
                comment: "",
              };
              return (
                <div
                  className="rounded-2xl border border-[#e7e1da] bg-white p-5 shadow-sm"
                  key={item.id}
                >
                  <div className="mb-3 flex items-center gap-2">
                    {item.icon && (
                      <span className="text-[18px]">{item.icon}</span>
                    )}
                    <h3
                      className="text-[#181510] text-[16px]"
                      style={{ fontWeight: 700 }}
                    >
                      {item.name}
                    </h3>
                  </div>
                  {item.description && (
                    <p className="mb-3 text-[#8d785e] text-[13px]">
                      {item.description}
                    </p>
                  )}

                  {/* Stars */}
                  <div className="mb-3 flex gap-1" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        className="transition-transform hover:scale-110"
                        key={star}
                        onClick={() =>
                          updateRating(
                            item.id,
                            item.supplierId as Id<"suppliers">,
                            "rating",
                            star
                          )
                        }
                        type="button"
                      >
                        <Star
                          className={
                            star <= entry.rating
                              ? "fill-[#ff8c00] text-[#ff8c00]"
                              : "text-[#e7e1da]"
                          }
                          size={28}
                        />
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <textarea
                    className="w-full resize-none rounded-lg border border-[#e7e1da] px-3 py-2 text-[13px] outline-none focus:border-[#ff8c00]"
                    onChange={(e) =>
                      updateRating(
                        item.id,
                        item.supplierId as Id<"suppliers">,
                        "comment",
                        e.target.value
                      )
                    }
                    placeholder="הוסיפו הערה (אופציונלי)"
                    rows={2}
                    value={entry.comment}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Submit */}
        {rateableItems.length > 0 && (
          <div className="mt-6 text-center">
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-[#ff8c00] px-8 py-3 text-[15px] text-white transition-colors hover:bg-[#e67e00] disabled:opacity-50"
              disabled={submitting}
              onClick={handleSubmit}
              style={{ fontWeight: 700 }}
              type="button"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Star size={18} />
              )}
              שליחת דירוגים
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
