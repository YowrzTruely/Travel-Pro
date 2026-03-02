import { useMutation } from "convex/react";
import {
  Banknote,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  ImagePlus,
  Loader2,
  Package,
  Save,
  StickyNote,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { appToast } from "./AppToast";
import { useImageUpload } from "./hooks/useImageUpload";

interface SupplierProduct {
  description: string;
  id: string;
  images?: { id: string; url: string; name: string; path?: string }[];
  name: string;
  notes?: string;
  price: number;
  supplierId: string;
  unit: string;
}

import { useConfirmDelete } from "./ConfirmDeleteModal";

const UNIT_OPTIONS = ["אדם", "אירוע", "יום", "קבוצה", "חבילה", "יחידה"];

interface ProductEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: SupplierProduct) => void;
  product: SupplierProduct;
}

export function ProductEditor({
  product,
  isOpen,
  onClose,
  onUpdate,
}: ProductEditorProps) {
  const updateProduct = useMutation(api.supplierProducts.update);
  const { upload } = useImageUpload();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [unit, setUnit] = useState(product.unit);
  const [notes, setNotes] = useState(product.notes || "");
  const [images, setImages] = useState<SupplierProduct["images"]>(
    product.images || []
  );

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  useEffect(() => {
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setUnit(product.unit);
    setNotes(product.notes || "");
    setImages(product.images || []);
    setActiveImageIdx(0);
    setSaveSuccess(false);
  }, [product]);

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
          await updateProduct({
            id: product.id as any,
            images: currentImages.map((img) => ({
              id: img.id,
              storageId: img.url || img.id,
              name: img.name,
            })),
          });
        }
        setImages(currentImages);
        setActiveImageIdx(currentImages.length - 1);
        onUpdate({ ...product, images: currentImages });
        appToast.success("תמונה הועלתה", "התמונה נוספה למוצר");
      } catch (err) {
        console.error("[ProductEditor] Upload failed:", err);
        appToast.error("שגיאה בהעלאה", "לא ניתן להעלות את התמונה");
      } finally {
        setUploading(false);
        setIsDragging(false);
      }
    },
    [product, images, upload, updateProduct, onUpdate]
  );

  const handleDeleteImage = async (imageId: string) => {
    try {
      const newImages = (images || []).filter((img) => img.id !== imageId);
      await updateProduct({
        id: product.id as any,
        images: newImages.map((img) => ({
          id: img.id,
          storageId: img.url || img.id,
          name: img.name,
        })),
      });
      setImages(newImages);
      onUpdate({ ...product, images: newImages });
      setActiveImageIdx(Math.max(0, activeImageIdx - 1));
      appToast.success("תמונה הוסרה", "");
    } catch (err) {
      console.error("[ProductEditor] Delete image failed:", err);
      appToast.error("שגיאה", "לא ניתן למחוק את התמונה");
    }
  };

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
      await updateProduct({
        id: product.id as any,
        name: name.trim(),
        price,
        description: description.trim(),
        unit: unit.trim(),
        notes: notes.trim(),
      });
      const updated = {
        ...product,
        name: name.trim(),
        price,
        description: description.trim(),
        unit: unit.trim(),
        notes: notes.trim(),
      };
      onUpdate(updated);
      setSaveSuccess(true);
      appToast.success("המוצר עודכן", name);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("[ProductEditor] Save failed:", err);
      appToast.error("שגיאה", "לא ניתן לשמור את השינויים");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    name !== product.name ||
    price !== product.price ||
    description !== product.description ||
    unit !== product.unit ||
    notes !== (product.notes || "");

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
            {/* Header */}
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between border-[#e7e1da] border-b bg-white px-5 py-4"
              initial={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff8c00] text-white">
                  <Package size={18} />
                </span>
                <div>
                  <h2
                    className="text-[#181510] text-[17px]"
                    style={{ fontWeight: 700 }}
                  >
                    עריכת מוצר
                  </h2>
                  <p className="text-[#8d785e] text-[12px]">
                    מזהה: {product.id}
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

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Gallery */}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-md">
                        <Camera size={12} />
                        {activeImageIdx + 1}/{images.length}
                      </div>
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
                        <Trash2 size={11} /> מחק
                      </button>
                      {/* Price overlay */}
                      <div className="absolute right-3 bottom-3 rounded-lg bg-white/95 px-3 py-1.5 text-[#181510] shadow-lg backdrop-blur-md">
                        <span
                          className="text-[18px]"
                          style={{ fontWeight: 800 }}
                        >
                          ₪{price.toLocaleString()}
                        </span>
                        <span className="text-[#8d785e] text-[11px]">
                          /{unit}
                        </span>
                      </div>
                    </div>
                    {/* Thumbnails */}
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
                  /* Empty upload zone */
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
                            : "הוסף תמונות למוצר"}
                      </p>
                      <p className="text-[#b8a990] text-[12px]">
                        גרור לכאן או לחץ לבחירת קובץ &bull; JPG, PNG עד 5MB
                      </p>
                    </div>
                  </div>
                )}

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

              {/* Details section */}
              <div className="space-y-4 px-4 py-3">
                {/* Basic info */}
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
                    פרטי המוצר
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-[#8d785e] text-[11px]"
                      htmlFor="product-name"
                    >
                      שם המוצר
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[15px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                      id="product-name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="שם המוצר..."
                      style={{ fontWeight: 600 }}
                      value={name}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-[#8d785e] text-[11px]"
                      htmlFor="product-description"
                    >
                      תיאור
                    </label>
                    <textarea
                      className="w-full resize-none rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[14px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                      id="product-description"
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="תיאור המוצר..."
                      rows={3}
                      value={description}
                    />
                  </div>
                </motion.div>

                {/* Pricing */}
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        className="mb-1 block text-[#8d785e] text-[11px]"
                        htmlFor="product-price"
                      >
                        מחיר
                      </label>
                      <div className="relative">
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#b8a990] text-[13px]">
                          ₪
                        </span>
                        <input
                          className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] py-2.5 pr-7 pl-2 text-[16px] transition-all focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                          id="product-price"
                          onChange={(e) =>
                            setPrice(Number.parseFloat(e.target.value) || 0)
                          }
                          style={{ fontWeight: 700 }}
                          type="number"
                          value={price || ""}
                        />
                      </div>
                    </div>
                    <div>
                      <fieldset>
                        <legend className="mb-1 block text-[#8d785e] text-[11px]">
                          יחידת מדידה
                        </legend>
                        <div className="flex flex-wrap gap-1.5">
                          {UNIT_OPTIONS.map((u) => (
                            <button
                              className={`rounded-lg border px-3 py-2 text-[12px] transition-all ${
                                unit === u
                                  ? "border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]"
                                  : "border-[#e7e1da] bg-[#fafaf8] text-[#8d785e] hover:border-[#ff8c00]/40"
                              }`}
                              key={u}
                              onClick={() => setUnit(u)}
                              style={{ fontWeight: unit === u ? 600 : 400 }}
                              type="button"
                            >
                              {u}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  {/* Price display card */}
                  <div className="rounded-xl border border-[#ff8c00]/20 bg-gradient-to-l from-[#ff8c00]/10 to-[#ff8c00]/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8d785e] text-[13px]">
                        מחיר סופי
                      </span>
                      <div>
                        <span
                          className="text-[#181510] text-[24px]"
                          style={{ fontWeight: 800 }}
                        >
                          ₪{price.toLocaleString()}
                        </span>
                        <span className="mr-1 text-[#8d785e] text-[13px]">
                          /{unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Notes */}
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
                    placeholder="הערות פנימיות, דגשים על המוצר..."
                    rows={3}
                    value={notes}
                  />
                </motion.div>

                <div className="h-20" />
              </div>
            </div>

            {/* Bottom bar */}
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
