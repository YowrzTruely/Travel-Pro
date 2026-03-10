import { useMutation, useQuery } from "convex/react";
import {
  Banknote,
  BedDouble,
  Bus,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  ImagePlus,
  Loader2,
  Music,
  Package,
  Save,
  Star,
  StickyNote,
  Trash2,
  Upload,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { appToast } from "./AppToast";
import { useImageUpload } from "./hooks/useImageUpload";

interface QuoteItem {
  alternatives?: {
    id: string;
    name: string;
    description: string;
    costPerPerson: number;
    selected: boolean;
  }[];
  cost: number;
  description: string;
  directPrice: number;
  icon: string;
  id: string;
  images?: { id: string; url: string; name: string }[];
  name: string;
  notes?: string;
  productId?: Id<"supplierProducts">;
  profitWeight: number;
  projectId: string;
  selectedAddons?: { addonId: string; name: string; price: number }[];
  sellingPrice: number;
  status: string;
  supplier: string;
  type: string;
}

import { useConfirmDelete } from "./ConfirmDeleteModal";

// ─── Type icon map (shared with QuoteEditor) ───
const TYPE_ICONS: Record<string, React.ReactNode> = {
  תחבורה: <Bus size={18} />,
  לינה: <BedDouble size={18} />,
  פעילות: <Compass size={18} />,
  "פעילות בוקר": <Compass size={18} />,
  ארוחה: <UtensilsCrossed size={18} />,
  בידור: <Music size={18} />,
  אחר: <Package size={18} />,
};

const STATUS_OPTIONS = [
  { value: "approved", label: "מאושר", color: "#16a34a", bg: "#f0fdf4" },
  {
    value: "modified",
    label: "שונה",
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.1)",
  },
  { value: "pending", label: "ממתין", color: "#8b5cf6", bg: "#f5f3ff" },
];

interface ItemEditorProps {
  isOpen: boolean;
  item: QuoteItem;
  onClose: () => void;
  onUpdate: (updated: QuoteItem) => void;
  participants?: number;
}

export function ItemEditor({
  item,
  isOpen,
  onClose,
  onUpdate,
  participants,
}: ItemEditorProps) {
  const updateItem = useMutation(api.quoteItems.update);
  const { upload } = useImageUpload();

  // Volume pricing + addons queries (Fix 5 & 6)
  const product = useQuery(
    api.supplierProducts.get,
    item.productId ? { id: item.productId } : "skip"
  );
  const productAddons = useQuery(
    api.productAddons.listByProductId,
    item.productId ? { productId: item.productId } : "skip"
  );

  const isVolumePrice =
    product?.volumeThreshold &&
    participants &&
    participants >= product.volumeThreshold;

  // ─── Editable fields ───
  const [name, setName] = useState(item.name);
  const [supplier, setSupplier] = useState(item.supplier);
  const [description, setDescription] = useState(item.description);
  const [cost, setCost] = useState(item.cost);
  const [directPrice, setDirectPrice] = useState(item.directPrice || 0);
  const [sellingPrice, setSellingPrice] = useState(item.sellingPrice);
  const [profitWeight, setProfitWeight] = useState(item.profitWeight);
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes || "");
  const [images, setImages] = useState<QuoteItem["images"]>(item.images || []);

  // ─── UI state ───
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  // Reset state when item changes
  useEffect(() => {
    setName(item.name);
    setSupplier(item.supplier);
    setDescription(item.description);
    setCost(item.cost);
    setDirectPrice(item.directPrice || 0);
    setSellingPrice(item.sellingPrice);
    setProfitWeight(item.profitWeight);
    setStatus(item.status);
    setNotes(item.notes || "");
    setImages(item.images || []);
    setActiveImageIdx(0);
    setSaveSuccess(false);
  }, [item]);

  // ─── Image upload (Convex storage) ───
  const handleImageUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!files.length) {
        return;
      }
      setUploading(true);
      try {
        const currentImages = [...(images || [])];
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) {
            appToast.warning("קובץ לא תקין", `${file.name} אינו תמונה`);
            continue;
          }
          if (file.size > 5 * 1024 * 1024) {
            appToast.warning("קובץ גדול מדי", "גודל מקסימלי 5MB");
            continue;
          }
          const storageId = await upload(file);
          currentImages.push({
            id: storageId,
            url: storageId,
            name: file.name,
          });
          await updateItem({
            id: item.id as any,
            images: currentImages.map((img) => ({
              id: img.id,
              storageId: img.url || img.id,
              name: img.name,
            })),
          });
        }
        setImages(currentImages);
        setActiveImageIdx(currentImages.length - 1);
        onUpdate({ ...item, images: currentImages });
        appToast.success("תמונה הועלתה", "התמונה נוספה לרכיב");
      } catch (err) {
        console.error("[ItemEditor] Upload failed:", err);
        appToast.error("שגיאה בהעלאה", "לא ניתן להעלות את התמונה");
      } finally {
        setUploading(false);
        setIsDragging(false);
      }
    },
    [item, images, upload, updateItem, onUpdate]
  );

  const handleDeleteImage = async (imageId: string) => {
    try {
      const newImages = (images || []).filter((img) => img.id !== imageId);
      await updateItem({
        id: item.id as any,
        images: newImages.map((img) => ({
          id: img.id,
          storageId: img.url || img.id,
          name: img.name,
        })),
      });
      setImages(newImages);
      onUpdate({ ...item, images: newImages });
      setActiveImageIdx(Math.max(0, activeImageIdx - 1));
      appToast.success("תמונה הוסרה", "");
    } catch (err) {
      console.error("[ItemEditor] Delete image failed:", err);
      appToast.error("שגיאה", "לא ניתן למחוק את התמונה");
    }
  };

  // ─── Drag and drop ───
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) {
        handleImageUpload(e.dataTransfer.files);
      }
    },
    [handleImageUpload]
  );

  // ─── Save ───
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateItem({
        id: item.id as any,
        name: name.trim(),
        supplier: supplier.trim(),
        description: description.trim(),
        cost,
        directPrice,
        sellingPrice,
        profitWeight,
        status,
        notes: notes.trim(),
      });
      const updated = {
        ...item,
        name: name.trim(),
        supplier: supplier.trim(),
        description: description.trim(),
        cost,
        directPrice,
        sellingPrice,
        profitWeight,
        status,
        notes: notes.trim(),
      };
      onUpdate(updated);
      setSaveSuccess(true);
      appToast.success("הרכיב עודכן", name);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("[ItemEditor] Save failed:", err);
      appToast.error("שגיאה", "לא ניתן לשמור את השינויים");
    } finally {
      setSaving(false);
    }
  };

  const profit = sellingPrice - cost;
  const profitPct =
    sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;
  const typeIcon = TYPE_ICONS[item.type] || <Package size={18} />;
  const hasChanges =
    name !== item.name ||
    supplier !== item.supplier ||
    description !== item.description ||
    cost !== item.cost ||
    directPrice !== (item.directPrice || 0) ||
    sellingPrice !== item.sellingPrice ||
    profitWeight !== item.profitWeight ||
    status !== item.status ||
    notes !== (item.notes || "");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.3 }}
          />

          {/* Drawer */}
          <motion.div
            animate={{ x: 0, opacity: 1 }}
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-xl flex-col overflow-hidden bg-[#f8f7f5] shadow-2xl"
            dir="rtl"
            exit={{ x: "100%", opacity: 0 }}
            initial={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* ─── Header ─── */}
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between border-[#e7e1da] border-b bg-white px-5 py-4"
              initial={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff8c00] text-white">
                  {typeIcon}
                </span>
                <div>
                  <h2
                    className="text-[#181510] text-[17px]"
                    style={{ fontWeight: 700 }}
                  >
                    עריכת רכיב
                  </h2>
                  <p className="text-[#8d785e] text-[12px]">
                    {item.type} &bull; {item.id}
                  </p>
                </div>
              </div>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8d785e] transition-colors hover:bg-[#f5f3f0] hover:text-[#181510]"
                onClick={onClose}
                type="button"
              >
                <X size={18} />
              </button>
            </motion.div>

            {/* ─── Scrollable Content ─── */}
            <div className="flex-1 overflow-y-auto">
              {/* ─── Image Gallery Section ─── */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
              >
                {images && images.length > 0 ? (
                  <div className="relative">
                    {/* Main image */}
                    <div className="relative h-56 overflow-hidden bg-[#181510]">
                      <AnimatePresence mode="wait">
                        <motion.img
                          alt={images[activeImageIdx]?.name}
                          animate={{ opacity: 1, scale: 1 }}
                          className="h-full w-full object-cover"
                          exit={{ opacity: 0, scale: 0.95 }}
                          height={600}
                          initial={{ opacity: 0, scale: 1.05 }}
                          key={images[activeImageIdx]?.id || activeImageIdx}
                          src={images[activeImageIdx]?.url}
                          transition={{ duration: 0.3 }}
                          width={800}
                        />
                      </AnimatePresence>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Image counter badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-md">
                        <Camera size={12} />
                        {activeImageIdx + 1}/{images.length}
                      </div>

                      {/* Navigation arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            className="absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#181510] shadow-lg transition-all hover:bg-white"
                            onClick={() =>
                              setActiveImageIdx((i) => (i + 1) % images.length)
                            }
                            type="button"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#181510] shadow-lg transition-all hover:bg-white"
                            onClick={() =>
                              setActiveImageIdx(
                                (i) => (i - 1 + images.length) % images.length
                              )
                            }
                            type="button"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {/* Delete current image */}
                      <button
                        className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-red-500/80 px-2.5 py-1 text-[11px] text-white backdrop-blur-md transition-colors hover:bg-red-500"
                        onClick={() =>
                          images[activeImageIdx] &&
                          requestDelete({
                            title: "מחיקת תמונה",
                            itemName: images[activeImageIdx].name,
                            onConfirm: () =>
                              handleDeleteImage(images[activeImageIdx].id),
                          })
                        }
                        type="button"
                      >
                        <Trash2 size={11} />
                        מחק
                      </button>
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto border-[#e7e1da] border-b bg-white p-3">
                        {images.map((img, idx) => (
                          <button
                            className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                              idx === activeImageIdx
                                ? "scale-105 border-[#ff8c00] shadow-md"
                                : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                            key={img.id}
                            onClick={() => setActiveImageIdx(idx)}
                            type="button"
                          >
                            <img
                              alt={img.name}
                              className="h-full w-full object-cover"
                              height="600"
                              src={img.url}
                              width="800"
                            />
                          </button>
                        ))}
                        {/* Add more button */}
                        <button
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border-2 border-[#e7e1da] border-dashed text-[#b8a990] transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00]"
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                        >
                          <ImagePlus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty state — Drag & Drop Zone */
                  <div
                    className={`relative m-4 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
                      isDragging
                        ? "scale-[1.02] border-[#ff8c00] bg-[#ff8c00]/5"
                        : "border-[#e7e1da] bg-white hover:border-[#ff8c00]/50"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {/* Animated glow ring when dragging */}
                    {isDragging && (
                      <motion.div
                        animate={{
                          boxShadow: [
                            "inset 0 0 0 0 rgba(255,140,0,0)",
                            "inset 0 0 30px 0 rgba(255,140,0,0.15)",
                            "inset 0 0 0 0 rgba(255,140,0,0)",
                          ],
                        }}
                        className="absolute inset-0 rounded-2xl"
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      />
                    )}

                    <div className="flex flex-col items-center justify-center px-6 py-12">
                      <motion.div
                        animate={
                          isDragging
                            ? { scale: [1, 1.15, 1], y: [0, -5, 0] }
                            : {}
                        }
                        className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 ${
                          isDragging
                            ? "bg-[#ff8c00]/15 text-[#ff8c00]"
                            : "bg-[#f5f3f0] text-[#b8a990]"
                        }`}
                        transition={{
                          duration: 0.8,
                          repeat: isDragging ? Number.POSITIVE_INFINITY : 0,
                        }}
                      >
                        {uploading ? (
                          <Loader2
                            className="animate-spin text-[#ff8c00]"
                            size={28}
                          />
                        ) : (
                          <Upload size={28} />
                        )}
                      </motion.div>
                      <p
                        className="mb-1 text-[#181510] text-[15px]"
                        style={{ fontWeight: 600 }}
                      >
                        {isDragging
                          ? "שחרר כדי להעלות"
                          : uploading
                            ? "מעלה תמונה..."
                            : "גרור תמונה לכאן"}
                      </p>
                      <p className="text-[#b8a990] text-[12px]">
                        או לחץ לבחירת קובץ &bull; JPG, PNG עד 5MB
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files)
                  }
                  ref={fileInputRef}
                  type="file"
                />

                {/* Upload button if there are images already */}
                {images && images.length > 0 && (
                  <div className="px-4 pb-2">
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#e7e1da] border-dashed p-3 text-[#8d785e] text-[13px] transition-all hover:border-[#ff8c00] hover:text-[#ff8c00]"
                      onClick={() => fileInputRef.current?.click()}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      type="button"
                    >
                      {uploading ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <ImagePlus size={14} />
                      )}
                      {uploading ? "מעלה..." : "הוסף תמונה נוספת"}
                    </button>
                  </div>
                )}
              </motion.div>

              {/* ─── Details Section ─── */}
              <div className="space-y-4 px-4 py-3">
                {/* Section: Basic Info */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
                  initial={{ opacity: 0, y: 15 }}
                  transition={{ delay: 0.25 }}
                >
                  <div
                    className="mb-1 flex items-center gap-2 text-[#8d785e] text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    <FileText className="text-[#ff8c00]" size={14} />
                    פרטי הרכיב
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-[#8d785e] text-[11px]"
                      htmlFor="item-name"
                    >
                      שם הרכיב
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                      id="item-name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="שם הרכיב..."
                      style={{ fontWeight: 500 }}
                      value={name}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-[#8d785e] text-[11px]"
                      htmlFor="item-supplier"
                    >
                      ספק
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                      id="item-supplier"
                      onChange={(e) => setSupplier(e.target.value)}
                      placeholder="שם הספק..."
                      value={supplier}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-[#8d785e] text-[11px]"
                      htmlFor="item-description"
                    >
                      תיאור
                    </label>
                    <textarea
                      className="w-full resize-none rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="תיאור הרכיב..."
                      rows={3}
                      value={description}
                    />
                  </div>

                  {/* Status selector */}
                  <fieldset>
                    <legend className="mb-1.5 block text-[#8d785e] text-[11px]">
                      סטטוס
                    </legend>
                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          className={`flex-1 rounded-lg border-2 px-3 py-2 text-[12px] transition-all ${
                            status === opt.value
                              ? "shadow-sm"
                              : "border-transparent bg-[#f5f3f0] text-[#8d785e] hover:bg-[#ece8e3]"
                          }`}
                          key={opt.value}
                          onClick={() => setStatus(opt.value)}
                          style={
                            status === opt.value
                              ? {
                                  borderColor: opt.color,
                                  backgroundColor: opt.bg,
                                  color: opt.color,
                                  fontWeight: 600,
                                }
                              : { fontWeight: 500 }
                          }
                          type="button"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </motion.div>

                {/* Section: Pricing */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
                  initial={{ opacity: 0, y: 15 }}
                  transition={{ delay: 0.35 }}
                >
                  <div
                    className="mb-1 flex items-center gap-2 text-[#8d785e] text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    <Banknote className="text-[#ff8c00]" size={14} />
                    תמחור
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label
                        className="mb-1 block text-[#8d785e] text-[11px]"
                        htmlFor="item-cost"
                      >
                        עלות (ספק)
                      </label>
                      <div className="relative">
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#b8a990] text-[12px]">
                          ₪
                        </span>
                        <input
                          className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] py-2 pr-7 pl-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                          id="item-cost"
                          onChange={(e) =>
                            setCost(Number.parseFloat(e.target.value) || 0)
                          }
                          style={{ fontWeight: 600 }}
                          type="number"
                          value={cost || ""}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-[#8d785e] text-[11px]"
                        htmlFor="item-direct-price"
                      >
                        תמחור ישיר
                      </label>
                      <div className="relative">
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#b8a990] text-[12px]">
                          ₪
                        </span>
                        <input
                          className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] py-2 pr-7 pl-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                          id="item-direct-price"
                          onChange={(e) =>
                            setDirectPrice(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          style={{ fontWeight: 500 }}
                          type="number"
                          value={directPrice || ""}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="mb-1 block text-[#8d785e] text-[11px]"
                        htmlFor="item-selling-price"
                      >
                        מחיר מכירה
                      </label>
                      <div className="relative">
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#b8a990] text-[12px]">
                          ₪
                        </span>
                        <input
                          className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] py-2 pr-7 pl-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                          id="item-selling-price"
                          onChange={(e) =>
                            setSellingPrice(
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          style={{ fontWeight: 600 }}
                          type="number"
                          value={sellingPrice || ""}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profit indicator bar */}
                  <div className="rounded-xl bg-[#f5f3f0] p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[#8d785e] text-[12px]">רווח</span>
                      <span
                        className={`text-[14px] ${profit >= 0 ? "text-green-600" : "text-red-500"}`}
                        style={{ fontWeight: 700 }}
                      >
                        ₪{profit.toLocaleString()} ({profitPct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#e7e1da]">
                      <motion.div
                        animate={{
                          width: `${Math.min(Math.max(profitPct, 0), 100)}%`,
                        }}
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        style={{
                          background:
                            profitPct >= 20
                              ? "linear-gradient(90deg, #22c55e, #16a34a)"
                              : profitPct >= 14
                                ? "linear-gradient(90deg, #84cc16, #65a30d)"
                                : profitPct >= 10
                                  ? "linear-gradient(90deg, #ff8c00, #e67e00)"
                                  : "linear-gradient(90deg, #ef4444, #dc2626)",
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Profit weight (stars) */}
                  <div>
                    <fieldset>
                      <legend className="mb-1.5 block text-[#8d785e] text-[11px]">
                        משקל רווח
                      </legend>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((w) => (
                          <button
                            className="transition-all hover:scale-110"
                            key={w}
                            onClick={() => setProfitWeight(w)}
                            type="button"
                          >
                            <Star
                              className={
                                w <= profitWeight
                                  ? "text-[#ff8c00]"
                                  : "text-[#ddd6cb]"
                              }
                              fill={w <= profitWeight ? "#ff8c00" : "none"}
                              size={22}
                            />
                          </button>
                        ))}
                        <span className="mr-2 text-[#8d785e] text-[12px]">
                          {profitWeight === 1
                            ? "מינימלי"
                            : profitWeight === 2
                              ? "נמוך"
                              : profitWeight === 3
                                ? "בינוני"
                                : profitWeight === 4
                                  ? "גבוה"
                                  : "מקסימלי"}
                        </span>
                      </div>
                    </fieldset>
                  </div>
                </motion.div>

                {/* Volume pricing indicator (Fix 5) */}
                {isVolumePrice && product && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-blue-200 bg-blue-50 p-4"
                    initial={{ opacity: 0, y: 15 }}
                    transition={{ delay: 0.38 }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-md bg-blue-500 px-2 py-0.5 text-[11px] text-white"
                        style={{ fontWeight: 600 }}
                      >
                        מחיר כמות
                      </span>
                      <span className="text-[#8d785e] text-[12px]">
                        {participants} משתתפים ≥ סף כמות (
                        {product.volumeThreshold})
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-[12px]">
                      <div>
                        <span className="text-[#8d785e]">מחירון כמות: </span>
                        <span
                          className="text-[#181510]"
                          style={{ fontWeight: 600 }}
                        >
                          ₪
                          {(
                            product.volumeListPrice ??
                            product.listPrice ??
                            product.price
                          )?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#8d785e]">ישיר כמות: </span>
                        <span
                          className="text-[#181510]"
                          style={{ fontWeight: 600 }}
                        >
                          ₪
                          {(
                            product.volumeDirectPrice ??
                            product.directPrice ??
                            0
                          )?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      className="mt-2 rounded-lg bg-blue-500 px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-blue-600"
                      onClick={() => {
                        const volCost =
                          product.volumeProducerPrice ??
                          product.producerPrice ??
                          cost;
                        const volDirect =
                          product.volumeDirectPrice ??
                          product.directPrice ??
                          directPrice;
                        setCost(volCost);
                        setDirectPrice(volDirect);
                        appToast.success(
                          "מחיר כמות הוחל",
                          `עלות: ₪${volCost} | ישיר: ₪${volDirect}`
                        );
                      }}
                      style={{ fontWeight: 600 }}
                      type="button"
                    >
                      החל מחירי כמות
                    </button>
                  </motion.div>
                )}

                {/* Product addons / upsells (Fix 6) */}
                {productAddons && productAddons.length > 0 && (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-[#e7e1da] bg-white p-4"
                    initial={{ opacity: 0, y: 15 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div
                      className="mb-3 flex items-center gap-2 text-[#8d785e] text-[13px]"
                      style={{ fontWeight: 600 }}
                    >
                      <Package className="text-[#ff8c00]" size={14} />
                      תוספות זמינות
                    </div>
                    <div className="space-y-2">
                      {productAddons.map((addon) => {
                        const isSelected = (item.selectedAddons ?? []).some(
                          (a) => a.addonId === addon.id
                        );
                        return (
                          <label
                            className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${
                              isSelected
                                ? "border-[#ff8c00] bg-[#ff8c00]/5"
                                : "border-[#e7e1da] hover:border-[#ff8c00]/50"
                            }`}
                            key={addon.id}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                checked={isSelected}
                                className="h-4 w-4 accent-[#ff8c00]"
                                onChange={async () => {
                                  const currentAddons = [
                                    ...(item.selectedAddons ?? []),
                                  ];
                                  let newAddons: typeof currentAddons;
                                  if (isSelected) {
                                    newAddons = currentAddons.filter(
                                      (a) => a.addonId !== addon.id
                                    );
                                  } else {
                                    newAddons = [
                                      ...currentAddons,
                                      {
                                        addonId: addon.id,
                                        name: addon.name,
                                        price: addon.listPrice,
                                      },
                                    ];
                                  }
                                  try {
                                    await updateItem({
                                      id: item.id as any,
                                      selectedAddons: newAddons.map((a) => ({
                                        addonId:
                                          a.addonId as Id<"productAddons">,
                                        name: a.name,
                                        price: a.price,
                                      })),
                                    });
                                    onUpdate({
                                      ...item,
                                      selectedAddons: newAddons,
                                    });
                                  } catch {
                                    appToast.error(
                                      "שגיאה",
                                      "לא ניתן לעדכן תוספות"
                                    );
                                  }
                                }}
                                type="checkbox"
                              />
                              <div>
                                <span
                                  className="text-[#181510] text-[13px]"
                                  style={{ fontWeight: 600 }}
                                >
                                  {addon.name}
                                </span>
                                {addon.description && (
                                  <p className="text-[#8d785e] text-[11px]">
                                    {addon.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span
                              className="text-[#181510] text-[13px]"
                              style={{ fontWeight: 600 }}
                            >
                              ₪{addon.listPrice.toLocaleString()}
                              {addon.unit && (
                                <span className="text-[#8d785e] text-[11px]">
                                  /{addon.unit}
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Section: Notes */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[#e7e1da] bg-white p-4"
                  initial={{ opacity: 0, y: 15 }}
                  transition={{ delay: 0.45 }}
                >
                  <div
                    className="mb-2 flex items-center gap-2 text-[#8d785e] text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    <StickyNote className="text-[#ff8c00]" size={14} />
                    הערות פנימיות
                  </div>
                  <textarea
                    className="w-full resize-none rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[13px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="הערות שלא יוצגו ללקוח..."
                    rows={3}
                    value={notes}
                  />
                </motion.div>

                {/* Spacer for bottom bar */}
                <div className="h-20" />
              </div>
            </div>

            {/* ─── Bottom Save Bar ─── */}
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className="sticky bottom-0 flex items-center gap-3 border-[#e7e1da] border-t bg-white/95 px-4 py-3 backdrop-blur-md"
              initial={{ y: 20, opacity: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[14px] transition-all ${
                  saveSuccess
                    ? "bg-green-500 text-white"
                    : hasChanges
                      ? "bg-[#ff8c00] text-white shadow-[#ff8c00]/25 shadow-lg hover:bg-[#e67e00]"
                      : "cursor-not-allowed bg-[#e7e1da] text-[#b8a990]"
                }`}
                disabled={saving || !(hasChanges || saveSuccess)}
                onClick={handleSave}
                style={{ fontWeight: 600 }}
                whileTap={{ scale: 0.97 }}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> שומר...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 size={16} /> נשמר בהצלחה!
                  </>
                ) : (
                  <>
                    <Save size={16} /> שמור שינויים
                  </>
                )}
              </motion.button>
              <button
                className="rounded-xl border border-[#e7e1da] px-5 py-3 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
                onClick={onClose}
                type="button"
              >
                סגור
              </button>
            </motion.div>
          </motion.div>
        </>
      )}
      {deleteModal}
    </AnimatePresence>
  );
}
