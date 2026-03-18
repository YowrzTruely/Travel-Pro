import { useMutation, useQuery } from "convex/react";
import {
  Camera,
  Copy,
  ImageIcon,
  Loader2,
  Share2,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

export function EventGallery({ projectId }: { projectId: Id<"projects"> }) {
  const items = useQuery(api.eventGallery.listByProject, { projectId });
  const stats = useQuery(api.eventGallery.getStats, { projectId });
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const uploadEntry = useMutation(api.eventGallery.upload);
  const removeEntry = useMutation(api.eventGallery.remove);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);

  const publicUrl = `${window.location.origin}/gallery/${projectId}`;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await generateUploadUrl();
        const result = await fetch(url, {
          method: "POST",
          body: file,
          headers: { "Content-Type": file.type },
        });
        const { storageId } = await result.json();
        const isVideo = file.type.startsWith("video/");
        await uploadEntry({
          projectId,
          fileId: storageId,
          fileType: isVideo ? "video" : "photo",
        });
      }
      appToast.success(`${files.length} קבצים הועלו בהצלחה`);
    } catch {
      appToast.error("שגיאה בהעלאת הקבצים");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleDelete(id: Id<"eventGallery">) {
    try {
      await removeEntry({ id });
      appToast.success("הפריט נמחק");
    } catch {
      appToast.error("שגיאה במחיקת הפריט");
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(publicUrl);
    appToast.success("הקישור הועתק ללוח");
  }

  if (items === undefined || stats === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-tertiary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="flex items-center gap-2 text-[18px] text-foreground"
          style={{ fontWeight: 700 }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Camera className="text-primary" size={15} />
          </div>
          גלריית אירוע
        </h2>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-[13px] text-foreground transition-colors hover:bg-background"
            onClick={() => setShowShareLink(!showShareLink)}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Share2 size={14} />
            שתף עם משתתפים
          </button>
          <button
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[13px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Upload size={14} />
            )}
            העלאת תמונות/סרטונים
          </button>
          <input
            accept="image/*,video/*"
            className="hidden"
            multiple
            onChange={handleFileUpload}
            ref={fileInputRef}
            type="file"
          />
        </div>
      </div>

      {/* Share link panel */}
      {showShareLink && (
        <div className="rounded-xl border border-border bg-background p-4">
          <p
            className="mb-2 text-[14px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            קישור ציבורי לגלריה
          </p>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-muted-foreground"
              dir="ltr"
              readOnly
              value={publicUrl}
            />
            <button
              className="flex items-center gap-1 rounded-lg bg-foreground px-3 py-2 text-[13px] text-white transition-colors hover:bg-foreground/90"
              onClick={handleCopyLink}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Copy size={14} />
              העתק
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-background px-4 py-2">
          <ImageIcon className="text-muted-foreground" size={16} />
          <span
            className="text-[14px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            {stats.photos} תמונות
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-background px-4 py-2">
          <Video className="text-muted-foreground" size={16} />
          <span
            className="text-[14px] text-foreground"
            style={{ fontWeight: 600 }}
          >
            {stats.videos} סרטונים
          </span>
        </div>
      </div>

      {/* Gallery Grid */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-16 text-center">
          <Camera className="mx-auto mb-3 text-tertiary" size={40} />
          <p className="text-[16px] text-muted-foreground">
            אין תמונות או סרטונים עדיין
          </p>
          <p className="mt-1 text-[13px] text-tertiary">
            העלו תמונות וסרטונים מהאירוע
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => (
            <GalleryItem
              fileId={item.fileId}
              fileType={item.fileType}
              id={item.id}
              key={item.id}
              onDelete={handleDelete}
              participantName={item.participantName}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryItem({
  id,
  fileId,
  fileType,
  participantName,
  onDelete,
}: {
  id: Id<"eventGallery">;
  fileId: string;
  fileType: "photo" | "video";
  participantName?: string;
  onDelete: (id: Id<"eventGallery">) => void;
}) {
  const imageUrl = useQuery(
    api.images.getImageUrl,
    fileId ? { storageId: fileId as Id<"_storage"> } : "skip"
  );

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-background">
      <div className="aspect-square">
        {fileType === "video" ? (
          <div className="flex h-full w-full items-center justify-center bg-foreground/5">
            <Video className="text-muted-foreground" size={32} />
          </div>
        ) : imageUrl ? (
          <img
            alt="תמונה מהאירוע"
            className="h-full w-full object-cover"
            height={200}
            src={imageUrl}
            width={200}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="animate-spin text-tertiary" size={20} />
          </div>
        )}
      </div>
      {/* Overlay on hover */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex w-full items-center justify-between p-2">
          {participantName && (
            <span className="truncate text-[11px] text-white">
              {participantName}
            </span>
          )}
          <button
            className="mr-auto rounded-lg bg-destructive/100/80 p-1.5 text-white transition-colors hover:bg-destructive/100"
            onClick={() => onDelete(id)}
            type="button"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {fileType === "video" && (
        <div className="absolute top-2 right-2 rounded-full bg-black/50 p-1">
          <Video className="text-white" size={12} />
        </div>
      )}
    </div>
  );
}
