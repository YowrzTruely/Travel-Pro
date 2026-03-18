import { useMutation, useQuery } from "convex/react";
import {
  Camera,
  Check,
  Download,
  ImageIcon,
  Loader2,
  Upload,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { useParams } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";

export function PublicGallery() {
  const { projectId } = useParams<{ projectId: string }>();
  const typedProjectId = projectId as Id<"projects">;

  const items = useQuery(
    api.eventGallery.listByProject,
    projectId ? { projectId: typedProjectId } : "skip"
  );
  const stats = useQuery(
    api.eventGallery.getStats,
    projectId ? { projectId: typedProjectId } : "skip"
  );

  const generateUploadUrl = useMutation(api.images.generateUploadUrl);
  const uploadEntry = useMutation(api.eventGallery.upload);
  const registerAndDownload = useMutation(api.eventGallery.registerAndDownload);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantPhone, setParticipantPhone] = useState("");

  // Download registration state
  const [showRegForm, setShowRegForm] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  if (!projectId) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <p className="text-[16px] text-muted-foreground">גלריה לא נמצאה</p>
      </div>
    );
  }

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
          projectId: typedProjectId,
          fileId: storageId,
          fileType: isVideo ? "video" : "photo",
          participantName: participantName || undefined,
          participantPhone: participantPhone || undefined,
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

  async function handleRegister() {
    if (!(regName.trim() && regPhone.trim())) {
      appToast.error("נא למלא שם וטלפון");
      return;
    }
    setRegistering(true);
    try {
      await registerAndDownload({
        projectId: typedProjectId,
        name: regName.trim(),
        phone: regPhone.trim(),
        marketingConsent,
      });
      setRegistered(true);
      appToast.success("נרשמת בהצלחה! ניתן להוריד תמונות");
    } catch {
      appToast.error("שגיאה בהרשמה");
    } finally {
      setRegistering(false);
    }
  }

  if (items === undefined || stats === undefined) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background font-['Assistant',sans-serif]"
        dir="rtl"
      >
        <Loader2 className="animate-spin text-tertiary" size={32} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background font-['Assistant',sans-serif]"
      dir="rtl"
    >
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Camera className="text-primary" size={28} />
          </div>
          <h1
            className="text-[24px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            גלריית האירוע
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            צפו והעלו תמונות וסרטונים מהאירוע
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 flex justify-center gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-card px-4 py-2 shadow-sm">
            <ImageIcon className="text-muted-foreground" size={16} />
            <span
              className="text-[14px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              {stats.photos} תמונות
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-card px-4 py-2 shadow-sm">
            <Video className="text-muted-foreground" size={16} />
            <span
              className="text-[14px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              {stats.videos} סרטונים
            </span>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2
            className="mb-4 text-[16px] text-foreground"
            style={{ fontWeight: 700 }}
          >
            העלו גם אתם תמונות
          </h2>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="rounded-lg border border-border px-3 py-2 text-[14px] outline-none focus:border-primary"
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="השם שלכם (אופציונלי)"
              value={participantName}
            />
            <input
              className="rounded-lg border border-border px-3 py-2 text-[14px] outline-none focus:border-primary"
              dir="ltr"
              onChange={(e) => setParticipantPhone(e.target.value)}
              placeholder="טלפון (אופציונלי)"
              value={participantPhone}
            />
          </div>
          <button
            className="flex items-center gap-1.5 rounded-xl bg-primary px-6 py-2.5 text-[14px] text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            style={{ fontWeight: 600 }}
            type="button"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Upload size={16} />
            )}
            בחירת קבצים להעלאה
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

        {/* Download Section */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {registered ? (
            <div className="flex items-center gap-3 text-success">
              <Check size={20} />
              <span className="text-[14px]" style={{ fontWeight: 600 }}>
                נרשמתם בהצלחה! ניתן להוריד את התמונות
              </span>
            </div>
          ) : showRegForm ? (
            <div>
              <h3
                className="mb-3 text-[15px] text-foreground"
                style={{ fontWeight: 700 }}
              >
                הרשמה להורדת תמונות
              </h3>
              <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  className="rounded-lg border border-border px-3 py-2 text-[14px] outline-none focus:border-primary"
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="שם מלא *"
                  value={regName}
                />
                <input
                  className="rounded-lg border border-border px-3 py-2 text-[14px] outline-none focus:border-primary"
                  dir="ltr"
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="טלפון *"
                  value={regPhone}
                />
              </div>
              <label className="mb-4 flex cursor-pointer items-center gap-2 text-[13px] text-muted-foreground">
                <input
                  checked={marketingConsent}
                  className="rounded accent-primary"
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  type="checkbox"
                />
                מאשר/ת קבלת עדכונים ומבצעים
              </label>
              <button
                className="flex items-center gap-1.5 rounded-xl bg-success px-6 py-2.5 text-[14px] text-white transition-colors hover:bg-success disabled:opacity-50"
                disabled={registering}
                onClick={handleRegister}
                style={{ fontWeight: 600 }}
                type="button"
              >
                {registering ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Check size={16} />
                )}
                הרשמה והורדה
              </button>
            </div>
          ) : (
            <button
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-6 py-2.5 text-[14px] text-foreground transition-colors hover:bg-accent"
              onClick={() => setShowRegForm(true)}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Download size={16} />
              הורדת תמונות (דורש הרשמה)
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card py-16 text-center shadow-sm">
            <Camera className="mx-auto mb-3 text-tertiary" size={40} />
            <p className="text-[16px] text-muted-foreground">
              אין תמונות או סרטונים עדיין
            </p>
            <p className="mt-1 text-[13px] text-tertiary">
              היו הראשונים להעלות
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <PublicGalleryItem
                downloadEnabled={registered}
                fileId={item.fileId}
                fileType={item.fileType}
                key={item.id}
                participantName={item.participantName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PublicGalleryItem({
  fileId,
  fileType,
  participantName,
  downloadEnabled,
}: {
  fileId: string;
  fileType: "photo" | "video";
  participantName?: string;
  downloadEnabled: boolean;
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
      {/* Overlay */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex w-full items-center justify-between p-2">
          {participantName && (
            <span className="truncate text-[11px] text-white">
              {participantName}
            </span>
          )}
          {downloadEnabled && imageUrl && (
            <a
              className="mr-auto rounded-lg bg-card/80 p-1.5 text-foreground transition-colors hover:bg-card"
              download
              href={imageUrl}
            >
              <Download size={14} />
            </a>
          )}
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
