import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Save, Loader2, Upload, ImagePlus, Trash2, ChevronLeft, ChevronRight,
  Package, Camera, FileText, Banknote, StickyNote, CheckCircle2
} from 'lucide-react';
import { supplierProductsApi } from './api';
import type { SupplierProduct } from './api';
import { appToast } from './AppToast';
import { useConfirmDelete } from './ConfirmDeleteModal';

const UNIT_OPTIONS = ['אדם', 'אירוע', 'יום', 'קבוצה', 'חבילה', 'יחידה'];

interface ProductEditorProps {
  product: SupplierProduct;
  supplierId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: SupplierProduct) => void;
}

export function ProductEditor({ product, supplierId, isOpen, onClose, onUpdate }: ProductEditorProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);
  const [unit, setUnit] = useState(product.unit);
  const [notes, setNotes] = useState(product.notes || '');
  const [images, setImages] = useState<SupplierProduct['images']>(product.images || []);

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
    setNotes(product.notes || '');
    setImages(product.images || []);
    setActiveImageIdx(0);
    setSaveSuccess(false);
  }, [product]);

  // ─── Image upload ───
  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          appToast.warning('קובץ לא תקין', `${file.name} אינו תמונה`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          appToast.warning('קובץ גדול מדי', 'גודל מקסימלי 5MB');
          continue;
        }
        const updated = await supplierProductsApi.uploadImage(supplierId, product.id, file);
        setImages(updated.images || []);
        onUpdate(updated);
        setActiveImageIdx((updated.images || []).length - 1);
      }
      appToast.success('תמונה הועלתה', 'התמונה נוספה למוצר');
    } catch (err) {
      console.error('[ProductEditor] Upload failed:', err);
      appToast.error('שגיאה בהעלאה', 'לא ניתן להעלות את התמונה');
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  }, [supplierId, product.id, onUpdate]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      const updated = await supplierProductsApi.deleteImage(supplierId, product.id, imageId);
      setImages(updated.images || []);
      onUpdate(updated);
      setActiveImageIdx(Math.max(0, activeImageIdx - 1));
      appToast.success('תמונה הוסרה', '');
    } catch (err) {
      console.error('[ProductEditor] Delete image failed:', err);
      appToast.error('שגיאה', 'לא ניתן למחוק את התמונה');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files?.length) handleImageUpload(e.dataTransfer.files);
  }, [handleImageUpload]);

  // ─── Save ───
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await supplierProductsApi.update(supplierId, product.id, {
        name: name.trim(),
        price,
        description: description.trim(),
        unit: unit.trim(),
        notes: notes.trim(),
      });
      onUpdate(updated);
      setSaveSuccess(true);
      appToast.success('המוצר עודכן', name);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('[ProductEditor] Save failed:', err);
      appToast.error('שגיאה', 'לא ניתן לשמור את השינויים');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = name !== product.name || price !== product.price ||
    description !== product.description || unit !== product.unit || notes !== (product.notes || '');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#f8f7f5] z-50 shadow-2xl overflow-hidden flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#e7e1da]"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-[#ff8c00] rounded-full flex items-center justify-center text-white">
                  <Package size={18} />
                </span>
                <div>
                  <h2 className="text-[17px] text-[#181510]" style={{ fontWeight: 700 }}>עריכת מוצר</h2>
                  <p className="text-[12px] text-[#8d785e]">מזהה: {product.id}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#f5f3f0] flex items-center justify-center text-[#8d785e] hover:text-[#181510] transition-colors">
                <X size={18} />
              </button>
            </motion.div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                {images && images.length > 0 ? (
                  <div className="relative">
                    {/* Main image */}
                    <div className="relative h-56 bg-[#181510] overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={images[activeImageIdx]?.id || activeImageIdx}
                          src={images[activeImageIdx]?.url}
                          alt={images[activeImageIdx]?.name}
                          className="w-full h-full object-cover"
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Camera size={12} />
                        {activeImageIdx + 1}/{images.length}
                      </div>
                      {images.length > 1 && (
                        <>
                          <button onClick={() => setActiveImageIdx(i => (i + 1) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#181510] hover:bg-white shadow-lg transition-all">
                            <ChevronLeft size={16} />
                          </button>
                          <button onClick={() => setActiveImageIdx(i => (i - 1 + images.length) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#181510] hover:bg-white shadow-lg transition-all">
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => images[activeImageIdx] && requestDelete({ title: 'מחיקת תמונה', itemName: images[activeImageIdx].name, onConfirm: () => handleDeleteImage(images[activeImageIdx].id) })}
                        className="absolute bottom-3 left-3 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={11} /> מחק
                      </button>
                      {/* Price overlay */}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#181510] px-3 py-1.5 rounded-lg shadow-lg">
                        <span className="text-[18px]" style={{ fontWeight: 800 }}>₪{price.toLocaleString()}</span>
                        <span className="text-[11px] text-[#8d785e]">/{unit}</span>
                      </div>
                    </div>
                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="flex gap-2 p-3 bg-white border-b border-[#e7e1da] overflow-x-auto">
                        {images.map((img, idx) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImageIdx(idx)}
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                              idx === activeImageIdx ? 'border-[#ff8c00] shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                        <button onClick={() => fileInputRef.current?.click()} className="w-14 h-14 rounded-lg border-2 border-dashed border-[#e7e1da] flex items-center justify-center text-[#b8a990] hover:border-[#ff8c00] hover:text-[#ff8c00] transition-colors shrink-0">
                          <ImagePlus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty upload zone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative m-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
                      isDragging ? 'border-[#ff8c00] bg-[#ff8c00]/5 scale-[1.02]' : 'border-[#e7e1da] hover:border-[#ff8c00]/50 bg-white'
                    }`}
                  >
                    {isDragging && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{ boxShadow: ['inset 0 0 0 0 rgba(255,140,0,0)', 'inset 0 0 30px 0 rgba(255,140,0,0.15)', 'inset 0 0 0 0 rgba(255,140,0,0)'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                      <motion.div
                        animate={isDragging ? { scale: [1, 1.15, 1], y: [0, -5, 0] } : {}}
                        transition={{ duration: 0.8, repeat: isDragging ? Infinity : 0 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
                          isDragging ? 'bg-[#ff8c00]/15 text-[#ff8c00]' : 'bg-[#f5f3f0] text-[#b8a990]'
                        }`}
                      >
                        {uploading ? <Loader2 size={28} className="animate-spin text-[#ff8c00]" /> : <Upload size={28} />}
                      </motion.div>
                      <p className="text-[15px] text-[#181510] mb-1" style={{ fontWeight: 600 }}>
                        {isDragging ? 'שחרר כדי להעלות' : uploading ? 'מעלה תמונה...' : 'הוסף תמונות למוצר'}
                      </p>
                      <p className="text-[12px] text-[#b8a990]">
                        גרור לכאן או לחץ לבחירת קובץ &bull; JPG, PNG עד 5MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => e.target.files && handleImageUpload(e.target.files)}
                />

                {images && images.length > 0 && (
                  <div className="px-4 pb-2">
                    <button
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#e7e1da] rounded-xl p-3 text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00] transition-all flex items-center justify-center gap-2 text-[13px]"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                      {uploading ? 'מעלה...' : 'הוסף תמונה נוספת'}
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Details section */}
              <div className="px-4 py-3 space-y-4">
                {/* Basic info */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white rounded-xl border border-[#e7e1da] p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-[13px] text-[#8d785e] mb-1" style={{ fontWeight: 600 }}>
                    <FileText size={14} className="text-[#ff8c00]" />
                    פרטי המוצר
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8d785e] block mb-1">שם המוצר</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2.5 text-[15px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] transition-all"
                      style={{ fontWeight: 600 }}
                      placeholder="שם המוצר..."
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8d785e] block mb-1">תיאור</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-[14px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] resize-none transition-all"
                      placeholder="תיאור המוצר..."
                    />
                  </div>
                </motion.div>

                {/* Pricing */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-white rounded-xl border border-[#e7e1da] p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-[13px] text-[#8d785e] mb-1" style={{ fontWeight: 600 }}>
                    <Banknote size={14} className="text-[#ff8c00]" />
                    תמחור
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-[#8d785e] block mb-1">מחיר</label>
                      <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#b8a990]">₪</span>
                        <input
                          type="number"
                          value={price || ''}
                          onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                          className="w-full pr-7 pl-2 py-2.5 text-[16px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] transition-all"
                          style={{ fontWeight: 700 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#8d785e] block mb-1">יחידת מדידה</label>
                      <div className="flex flex-wrap gap-1.5">
                        {UNIT_OPTIONS.map(u => (
                          <button
                            key={u}
                            onClick={() => setUnit(u)}
                            className={`px-3 py-2 rounded-lg text-[12px] border transition-all ${
                              unit === u
                                ? 'border-[#ff8c00] bg-[#ff8c00]/10 text-[#ff8c00]'
                                : 'border-[#e7e1da] bg-[#fafaf8] text-[#8d785e] hover:border-[#ff8c00]/40'
                            }`}
                            style={{ fontWeight: unit === u ? 600 : 400 }}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price display card */}
                  <div className="bg-gradient-to-l from-[#ff8c00]/10 to-[#ff8c00]/5 rounded-xl p-4 border border-[#ff8c00]/20">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#8d785e]">מחיר סופי</span>
                      <div>
                        <span className="text-[24px] text-[#181510]" style={{ fontWeight: 800 }}>₪{price.toLocaleString()}</span>
                        <span className="text-[13px] text-[#8d785e] mr-1">/{unit}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Notes */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-white rounded-xl border border-[#e7e1da] p-4"
                >
                  <div className="flex items-center gap-2 text-[13px] text-[#8d785e] mb-2" style={{ fontWeight: 600 }}>
                    <StickyNote size={14} className="text-[#ff8c00]" />
                    הערות פנימיות
                  </div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-[13px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] resize-none transition-all"
                    placeholder="הערות פנימיות, דגשים על המוצר..."
                  />
                </motion.div>

                <div className="h-20" />
              </div>
            </div>

            {/* Bottom bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="sticky bottom-0 px-4 py-3 bg-white/95 backdrop-blur-md border-t border-[#e7e1da] flex items-center gap-3"
            >
              <motion.button
                onClick={handleSave}
                disabled={saving || (!hasChanges && !saveSuccess)}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 py-3 rounded-xl text-[14px] flex items-center justify-center gap-2 transition-all ${
                  saveSuccess
                    ? 'bg-green-500 text-white'
                    : hasChanges
                      ? 'bg-[#ff8c00] hover:bg-[#e67e00] text-white shadow-lg shadow-[#ff8c00]/25'
                      : 'bg-[#e7e1da] text-[#b8a990] cursor-not-allowed'
                }`}
                style={{ fontWeight: 600 }}
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin" /> שומר...</>
                ) : saveSuccess ? (
                  <><CheckCircle2 size={16} /> נשמר בהצלחה!</>
                ) : (
                  <><Save size={16} /> שמור שינויים</>
                )}
              </motion.button>
              <button onClick={onClose} className="px-5 py-3 border border-[#e7e1da] rounded-xl text-[14px] text-[#8d785e] hover:bg-[#f5f3f0] transition-colors">
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