import { useAction, useMutation, useQuery } from "convex/react";
import {
  Banknote,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  Wrench,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useConfirmDelete } from "../ConfirmDeleteModal";
import { useImageUpload } from "../hooks/useImageUpload";

const UNIT_OPTIONS = ["אדם", "אירוע", "יום", "קבוצה", "חבילה", "יחידה"];

interface ProductFormValues {
  aiDescription: string;
  cancellationTerms: string;
  capacity: string;
  clientPrice: string;
  description: string;
  directPrice: string;
  grossTime: string;
  listPrice: string;
  location: string;
  name: string;
  netTime: string;
  producerPrice: string;
  unit: string;
  volumeDirectPrice: string;
  volumeListPrice: string;
  volumeProducerPrice: string;
  volumeThreshold: string;
}

interface ProductData {
  aiDescription?: string;
  cancellationTerms?: string;
  capacity?: number;
  clientPrice?: number;
  description?: string;
  directPrice?: number;
  equipmentRequirements?: string[];
  grossTime?: number;
  id: string;
  images?: { id: string; url: string; name: string }[];
  listPrice?: number;
  location?: string;
  name: string;
  netTime?: number;
  price: number;
  producerPrice?: number;
  unit?: string;
  volumeDirectPrice?: number;
  volumeListPrice?: number;
  volumeProducerPrice?: number;
  volumeThreshold?: number;
}

interface SupplierProductEditorProps {
  isOpen?: boolean;
  mode?: "drawer" | "page";
  onClose: () => void;
  product: ProductData | null; // null = create mode
  supplierId: Id<"suppliers">;
}

export function SupplierProductEditor({
  isOpen = true,
  mode = "drawer",
  onClose,
  product,
  supplierId,
}: SupplierProductEditorProps) {
  const createProduct = useMutation(api.supplierProducts.create);
  const updateProduct = useMutation(api.supplierProducts.update);
  const { upload } = useImageUpload();

  const generateAiDescription = useAction(
    api.aiSupplier.generateMarketingDescription
  );
  const cleanAiImage = useAction(api.aiSupplier.cleanProductImage);

  const isEditMode = product !== null;
  const productId = product?.id as Id<"supplierProducts"> | undefined;

  // Addons
  const addons = useQuery(
    api.productAddons.listByProductId,
    productId ? { productId } : "skip"
  );
  const createAddon = useMutation(api.productAddons.create);
  const removeAddon = useMutation(api.productAddons.remove);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [images, setImages] = useState<ProductData["images"]>([]);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [newEquipment, setNewEquipment] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [newAddonName, setNewAddonName] = useState("");
  const [newAddonPrice, setNewAddonPrice] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>();

  // Sync form when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        description: product.description || "",
        unit: product.unit || "אדם",
        listPrice: product.listPrice?.toString() || "",
        directPrice: product.directPrice?.toString() || "",
        producerPrice: product.producerPrice?.toString() || "",
        clientPrice: product.clientPrice?.toString() || "",
        volumeThreshold: product.volumeThreshold?.toString() || "",
        volumeListPrice: product.volumeListPrice?.toString() || "",
        volumeDirectPrice: product.volumeDirectPrice?.toString() || "",
        volumeProducerPrice: product.volumeProducerPrice?.toString() || "",
        grossTime: product.grossTime?.toString() || "",
        netTime: product.netTime?.toString() || "",
        capacity: product.capacity?.toString() || "",
        location: product.location || "",
        cancellationTerms: product.cancellationTerms || "",
        aiDescription: product.aiDescription || "",
      });
      setImages(product.images || []);
      setEquipment(product.equipmentRequirements || []);
      setActiveImageIdx(0);
    } else {
      reset({
        name: "",
        description: "",
        unit: "אדם",
        listPrice: "",
        directPrice: "",
        producerPrice: "",
        clientPrice: "",
        volumeThreshold: "",
        volumeListPrice: "",
        volumeDirectPrice: "",
        volumeProducerPrice: "",
        grossTime: "",
        netTime: "",
        capacity: "",
        location: "",
        cancellationTerms: "",
        aiDescription: "",
      });
      setImages([]);
      setEquipment([]);
      setActiveImageIdx(0);
    }
    setSaveSuccess(false);
  }, [product, reset]);

  // ─── Image upload ───
  const handleImageUpload = useCallback(
    async (files: FileList | File[]) => {
      if (!(files.length && isEditMode && productId)) {
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
            id: productId,
            images: currentImages.map((img) => ({
              id: img.id,
              storageId: img.url || img.id,
              name: img.name,
            })),
          });
        }
        setImages(currentImages);
        setActiveImageIdx(currentImages.length - 1);
        appToast.success("תמונה הועלתה", "התמונה נוספה למוצר");
      } catch {
        appToast.error("שגיאה בהעלאה", "לא ניתן להעלות את התמונה");
      } finally {
        setUploading(false);
        setIsDragging(false);
      }
    },
    [images, upload, updateProduct, isEditMode, productId]
  );

  const handleDeleteImage = async (imageId: string) => {
    if (!productId) {
      return;
    }
    try {
      const newImages = (images || []).filter((img) => img.id !== imageId);
      await updateProduct({
        id: productId,
        images: newImages.map((img) => ({
          id: img.id,
          storageId: img.url || img.id,
          name: img.name,
        })),
      });
      setImages(newImages);
      setActiveImageIdx(Math.max(0, activeImageIdx - 1));
      appToast.success("תמונה הוסרה", "");
    } catch {
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

  // ─── Equipment ───
  const addEquipmentItem = () => {
    const val = newEquipment.trim();
    if (val && !equipment.includes(val)) {
      setEquipment((prev) => [...prev, val]);
      setNewEquipment("");
    }
  };

  const removeEquipmentItem = (item: string) => {
    setEquipment((prev) => prev.filter((e) => e !== item));
  };

  // ─── Addons ───
  const handleAddAddon = async () => {
    if (!(productId && newAddonName.trim())) {
      return;
    }
    const price = Number.parseFloat(newAddonPrice);
    if (Number.isNaN(price) || price <= 0) {
      appToast.warning("מחיר לא תקין", "הזן מחיר חיובי");
      return;
    }
    try {
      await createAddon({
        productId,
        name: newAddonName.trim(),
        listPrice: price,
      });
      setNewAddonName("");
      setNewAddonPrice("");
      appToast.success("תוספת נוספה", newAddonName);
    } catch {
      appToast.error("שגיאה", "לא ניתן להוסיף תוספת");
    }
  };

  const handleRemoveAddon = async (addonId: string) => {
    try {
      await removeAddon({ id: addonId as Id<"productAddons"> });
      appToast.success("תוספת הוסרה", "");
    } catch {
      appToast.error("שגיאה", "לא ניתן להסיר תוספת");
    }
  };

  // ─── AI stubs ───
  const handleGenerateAiDescription = async () => {
    setAiLoading(true);
    try {
      const result = await generateAiDescription({ supplierId });
      setValue("aiDescription", result);
      appToast.info("AI", result);
    } catch {
      appToast.error("שגיאה", "שגיאה ביצירת תיאור AI");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCleanImage = async () => {
    if (!productId) {
      return;
    }
    setAiLoading(true);
    try {
      const result = await cleanAiImage({ productId });
      appToast.info("AI", result);
    } catch {
      appToast.error("שגיאה", "שגיאה בניקוי תמונה");
    } finally {
      setAiLoading(false);
    }
  };

  // ─── Save ───
  const onSubmit = async (data: ProductFormValues) => {
    setSaving(true);
    try {
      const parseNum = (v: string) => {
        const n = Number.parseFloat(v);
        return Number.isNaN(n) ? undefined : n;
      };

      const payload = {
        name: data.name.trim(),
        description: data.description.trim(),
        unit: data.unit.trim(),
        price: parseNum(data.listPrice) ?? 0,
        listPrice: parseNum(data.listPrice),
        directPrice: parseNum(data.directPrice),
        producerPrice: parseNum(data.producerPrice),
        clientPrice: parseNum(data.clientPrice),
        volumeThreshold: parseNum(data.volumeThreshold),
        volumeListPrice: parseNum(data.volumeListPrice),
        volumeDirectPrice: parseNum(data.volumeDirectPrice),
        volumeProducerPrice: parseNum(data.volumeProducerPrice),
        grossTime: parseNum(data.grossTime),
        netTime: parseNum(data.netTime),
        capacity: parseNum(data.capacity),
        location: data.location.trim() || undefined,
        cancellationTerms: data.cancellationTerms.trim() || undefined,
        aiDescription: data.aiDescription.trim() || undefined,
        equipmentRequirements: equipment.length > 0 ? equipment : undefined,
      };

      if (isEditMode && productId) {
        await updateProduct({ id: productId, ...payload });
        appToast.success("המוצר עודכן", data.name);
      } else {
        await createProduct({ supplierId, ...payload });
        appToast.success("המוצר נוצר", data.name);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch {
      appToast.error("שגיאה", "לא ניתן לשמור את המוצר");
    } finally {
      setSaving(false);
    }
  };

  const formContent = (
    <div className="flex-1 overflow-y-auto">
      {/* Image gallery (edit mode only) */}
      {isEditMode && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2 }}
        >
          {images && images.length > 0 ? (
            <div className="relative">
              <div className="relative h-48 overflow-hidden bg-[#181510]">
                <AnimatePresence mode="wait">
                  <motion.img
                    alt={images[activeImageIdx]?.name}
                    animate={{ opacity: 1 }}
                    className="h-full w-full object-cover"
                    exit={{ opacity: 0 }}
                    height={192}
                    initial={{ opacity: 0 }}
                    key={images[activeImageIdx]?.id || activeImageIdx}
                    src={images[activeImageIdx]?.url}
                    width={576}
                  />
                </AnimatePresence>
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white backdrop-blur-md">
                  <Camera size={12} />
                  {activeImageIdx + 1}/{images.length}
                </div>
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#181510] shadow-lg"
                      onClick={() =>
                        setActiveImageIdx((i) => (i + 1) % images.length)
                      }
                      type="button"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#181510] shadow-lg"
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
                  className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-red-500/80 px-2.5 py-1 text-[11px] text-white backdrop-blur-md hover:bg-red-500"
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
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto border-[#e7e1da] border-b bg-white p-3">
                  {images.map((img, idx) => (
                    <button
                      className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        idx === activeImageIdx
                          ? "border-[#ff8c00] shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      key={img.id}
                      onClick={() => setActiveImageIdx(idx)}
                      type="button"
                    >
                      <img
                        alt={img.name}
                        className="h-full w-full object-cover"
                        height={48}
                        src={img.url}
                        width={48}
                      />
                    </button>
                  ))}
                  <button
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-[#e7e1da] border-dashed text-[#b8a990] hover:border-[#ff8c00] hover:text-[#ff8c00]"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <ImagePlus size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`relative m-4 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                isDragging
                  ? "border-[#ff8c00] bg-[#ff8c00]/5"
                  : "border-[#e7e1da] bg-white hover:border-[#ff8c00]/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center px-6 py-10">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f3f0] text-[#b8a990]">
                  {uploading ? (
                    <Loader2
                      className="animate-spin text-[#ff8c00]"
                      size={24}
                    />
                  ) : (
                    <Upload size={24} />
                  )}
                </div>
                <p
                  className="mb-1 text-[#181510] text-[14px]"
                  style={{ fontWeight: 600 }}
                >
                  {uploading ? "מעלה תמונה..." : "הוסף תמונות למוצר"}
                </p>
                <p className="text-[#b8a990] text-[12px]">
                  גרור לכאן או לחץ לבחירת קובץ
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#e7e1da] border-dashed p-3 text-[#8d785e] text-[13px] hover:border-[#ff8c00] hover:text-[#ff8c00]"
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
      )}

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
              htmlFor="pe-name"
            >
              שם המוצר *
            </label>
            <input
              className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[15px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              id="pe-name"
              placeholder="שם המוצר..."
              style={{ fontWeight: 600 }}
              {...register("name", {
                required: "שם המוצר הוא שדה חובה",
              })}
            />
            {errors.name && (
              <p className="mt-1 text-[12px] text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-1 block text-[#8d785e] text-[11px]"
              htmlFor="pe-desc"
            >
              תיאור
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              id="pe-desc"
              placeholder="תיאור המוצר..."
              rows={3}
              {...register("description")}
            />
          </div>

          <div>
            <span className="mb-1 block text-[#8d785e] text-[11px]">
              יחידת מדידה
            </span>
            <div className="flex flex-wrap gap-1.5">
              {UNIT_OPTIONS.map((u) => (
                <label className="cursor-pointer" key={u}>
                  <input
                    className="peer hidden"
                    type="radio"
                    value={u}
                    {...register("unit")}
                  />
                  <span className="block rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[#8d785e] text-[12px] transition-all hover:border-[#ff8c00]/40 peer-checked:border-[#ff8c00] peer-checked:bg-[#ff8c00]/10 peer-checked:text-[#ff8c00]">
                    {u}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 4-tier pricing */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
          initial={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="mb-1 flex items-center gap-2 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            <Banknote className="text-[#ff8c00]" size={14} />
            תמחור (4 שכבות)
          </div>

          <div className="grid grid-cols-2 gap-3">
            <PriceField
              id="pe-list"
              label="מחיר מחירון"
              name="listPrice"
              register={register}
            />
            <PriceField
              id="pe-direct"
              label="מחיר ישיר"
              name="directPrice"
              register={register}
            />
            <PriceField
              id="pe-producer"
              label="מחיר הפקה"
              name="producerPrice"
              register={register}
            />
            <PriceField
              id="pe-client"
              label="מחיר ללקוח"
              name="clientPrice"
              register={register}
            />
          </div>
        </motion.div>

        {/* Volume pricing */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
          initial={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.35 }}
        >
          <div
            className="mb-1 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            תמחור כמותי
          </div>

          <div>
            <label
              className="mb-1 block text-[#8d785e] text-[11px]"
              htmlFor="pe-vol-threshold"
            >
              סף כמות (מעל X)
            </label>
            <input
              className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              id="pe-vol-threshold"
              type="number"
              {...register("volumeThreshold")}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <PriceField
              id="pe-vol-list"
              label="מחירון כמותי"
              name="volumeListPrice"
              register={register}
            />
            <PriceField
              id="pe-vol-direct"
              label="ישיר כמותי"
              name="volumeDirectPrice"
              register={register}
            />
            <PriceField
              id="pe-vol-producer"
              label="הפקה כמותי"
              name="volumeProducerPrice"
              register={register}
            />
          </div>
        </motion.div>

        {/* Timing */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
          initial={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="mb-1 flex items-center gap-2 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            <Clock className="text-[#ff8c00]" size={14} />
            זמנים
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-1 block text-[#8d785e] text-[11px]"
                htmlFor="pe-gross"
              >
                זמן ברוטו (דקות)
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                id="pe-gross"
                type="number"
                {...register("grossTime")}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[#8d785e] text-[11px]"
                htmlFor="pe-net"
              >
                זמן נטו (דקות)
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                id="pe-net"
                type="number"
                {...register("netTime")}
              />
            </div>
          </div>
        </motion.div>

        {/* Equipment */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
          initial={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.45 }}
        >
          <div
            className="mb-1 flex items-center gap-2 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            <Wrench className="text-[#ff8c00]" size={14} />
            ציוד נדרש
          </div>

          <div className="flex flex-wrap gap-2">
            {equipment.map((item) => (
              <span
                className="flex items-center gap-1 rounded-lg bg-[#f5f3f0] px-2.5 py-1.5 text-[#181510] text-[12px]"
                key={item}
              >
                {item}
                <button
                  className="text-[#8d785e] hover:text-red-500"
                  onClick={() => removeEquipmentItem(item)}
                  type="button"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[13px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              onChange={(e) => setNewEquipment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addEquipmentItem();
                }
              }}
              placeholder="הוסף פריט ציוד..."
              value={newEquipment}
            />
            <button
              className="rounded-lg border border-[#e7e1da] px-3 py-2 text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00]"
              onClick={addEquipmentItem}
              type="button"
            >
              <Plus size={14} />
            </button>
          </div>
        </motion.div>

        {/* Capacity, location, cancellation */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
          initial={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-1 block text-[#8d785e] text-[11px]"
                htmlFor="pe-capacity"
              >
                קיבולת (משתתפים)
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                id="pe-capacity"
                type="number"
                {...register("capacity")}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-[#8d785e] text-[11px]"
                htmlFor="pe-location"
              >
                מיקום
              </label>
              <input
                className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2.5 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                id="pe-location"
                {...register("location")}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-1 block text-[#8d785e] text-[11px]"
              htmlFor="pe-cancel"
            >
              תנאי ביטול
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[13px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              id="pe-cancel"
              rows={2}
              {...register("cancellationTerms")}
            />
          </div>
        </motion.div>

        {/* Addons (edit mode only) */}
        {isEditMode && productId && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
            initial={{ opacity: 0, y: 15 }}
            transition={{ delay: 0.55 }}
          >
            <div
              className="mb-1 text-[#8d785e] text-[13px]"
              style={{ fontWeight: 600 }}
            >
              תוספות (Addons)
            </div>

            {addons?.map((addon) => (
              <div
                className="flex items-center justify-between rounded-lg bg-[#f5f3f0] px-3 py-2"
                key={addon.id}
              >
                <div>
                  <span
                    className="text-[#181510] text-[13px]"
                    style={{ fontWeight: 600 }}
                  >
                    {addon.name}
                  </span>
                  <span className="mr-2 text-[#8d785e] text-[12px]">
                    ₪{addon.listPrice}
                  </span>
                </div>
                <button
                  className="text-[#8d785e] hover:text-red-500"
                  onClick={() => handleRemoveAddon(addon.id)}
                  type="button"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[13px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                onChange={(e) => setNewAddonName(e.target.value)}
                placeholder="שם תוספת..."
                value={newAddonName}
              />
              <input
                className="w-24 rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[13px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
                onChange={(e) => setNewAddonPrice(e.target.value)}
                placeholder="מחיר"
                type="number"
                value={newAddonPrice}
              />
              <button
                className="rounded-lg border border-[#e7e1da] px-3 py-2 text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00]"
                onClick={handleAddAddon}
                type="button"
              >
                <Plus size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* AI buttons */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-xl border border-[#e7e1da] bg-white p-4"
          initial={{ opacity: 0, y: 15 }}
          transition={{ delay: 0.6 }}
        >
          <div
            className="mb-1 flex items-center gap-2 text-[#8d785e] text-[13px]"
            style={{ fontWeight: 600 }}
          >
            <Sparkles className="text-[#ff8c00]" size={14} />
            כלי AI
          </div>

          <div>
            <label
              className="mb-1 block text-[#8d785e] text-[11px]"
              htmlFor="pe-ai-desc"
            >
              תיאור שיווקי (AI)
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-[#e7e1da] bg-[#fafaf8] px-3 py-2 text-[13px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
              id="pe-ai-desc"
              rows={2}
              {...register("aiDescription")}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="flex items-center gap-1.5 rounded-lg border border-[#e7e1da] px-3 py-2 text-[#8d785e] text-[12px] transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00] disabled:opacity-50"
              disabled={aiLoading}
              onClick={handleGenerateAiDescription}
              type="button"
            >
              {aiLoading ? (
                <Loader2 className="animate-spin" size={12} />
              ) : (
                <Sparkles size={12} />
              )}
              צור תיאור שיווקי
            </button>
            {isEditMode && (
              <button
                className="flex items-center gap-1.5 rounded-lg border border-[#e7e1da] px-3 py-2 text-[#8d785e] text-[12px] transition-colors hover:border-[#ff8c00] hover:text-[#ff8c00] disabled:opacity-50"
                disabled={aiLoading}
                onClick={handleCleanImage}
                type="button"
              >
                {aiLoading ? (
                  <Loader2 className="animate-spin" size={12} />
                ) : (
                  <Sparkles size={12} />
                )}
                נקה תמונה (AI)
              </button>
            )}
          </div>
        </motion.div>

        <div className="h-20" />
      </div>
    </div>
  );

  const bottomBar = (
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
            : "bg-[#ff8c00] text-white shadow-[#ff8c00]/25 shadow-lg hover:bg-[#e67e00]"
        }`}
        disabled={saving}
        style={{ fontWeight: 600 }}
        type="submit"
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
            <Save size={16} /> {isEditMode ? "שמור שינויים" : "צור מוצר"}
          </>
        )}
      </motion.button>
      <button
        className="rounded-xl border border-[#e7e1da] px-5 py-3 text-[#8d785e] text-[14px] transition-colors hover:bg-[#f5f3f0]"
        onClick={onClose}
        type="button"
      >
        {mode === "page" ? "חזרה" : "סגור"}
      </button>
    </motion.div>
  );

  // ─── Page mode: inline content ───
  if (mode === "page") {
    return (
      <div className="min-h-screen bg-[#f8f7f5] p-6" dir="rtl">
        <form
          className="mx-auto flex max-w-2xl flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          {formContent}
          {bottomBar}
        </form>
        {deleteModal}
      </div>
    );
  }

  // ─── Drawer mode (default) ───
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
                    {isEditMode ? "עריכת מוצר" : "מוצר חדש"}
                  </h2>
                  {isEditMode && (
                    <p className="text-[#8d785e] text-[12px]">
                      מזהה: {product?.id}
                    </p>
                  )}
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
            <form
              className="flex flex-1 flex-col overflow-hidden"
              onSubmit={handleSubmit(onSubmit)}
            >
              {formContent}
              {bottomBar}
            </form>
          </motion.div>
        </>
      )}
      {deleteModal}
    </AnimatePresence>
  );
}

/** Small helper for price input fields */
function PriceField({
  id,
  label,
  register,
  name,
}: {
  id: string;
  label: string;
  register: any;
  name: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[#8d785e] text-[11px]" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-[#b8a990] text-[13px]">
          ₪
        </span>
        <input
          className="w-full rounded-lg border border-[#e7e1da] bg-[#fafaf8] py-2.5 pr-7 pl-2 text-[14px] focus:border-[#ff8c00] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30"
          id={id}
          type="number"
          {...register(name)}
        />
      </div>
    </div>
  );
}
