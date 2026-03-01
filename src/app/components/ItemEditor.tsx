import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Save, Loader2, Star, Upload, ImagePlus, Trash2, ChevronLeft, ChevronRight,
  Bus, BedDouble, Compass, UtensilsCrossed, Music, Package, Camera,
  FileText, Banknote, StickyNote, CheckCircle2, AlertCircle
} from 'lucide-react';
import { quoteItemsApi } from './api';
import type { QuoteItem } from './api';
import { appToast } from './AppToast';
import { useConfirmDelete } from './ConfirmDeleteModal';

// ─── Type icon map (shared with QuoteEditor) ───
const TYPE_ICONS: Record<string, React.ReactNode> = {
  'תחבורה': <Bus size={18} />,
  'לינה': <BedDouble size={18} />,
  'פעילות': <Compass size={18} />,
  'פעילות בוקר': <Compass size={18} />,
  'ארוחה': <UtensilsCrossed size={18} />,
  'בידור': <Music size={18} />,
  'אחר': <Package size={18} />,
};

const STATUS_OPTIONS = [
  { value: 'approved', label: 'מאושר', color: '#16a34a', bg: '#f0fdf4' },
  { value: 'modified', label: 'שונה', color: '#ff8c00', bg: 'rgba(255,140,0,0.1)' },
  { value: 'pending', label: 'ממתין', color: '#8b5cf6', bg: '#f5f3ff' },
];

interface ItemEditorProps {
  item: QuoteItem;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: QuoteItem) => void;
}

export function ItemEditor({ item, projectId, isOpen, onClose, onUpdate }: ItemEditorProps) {
  // ─── Editable fields ───
  const [name, setName] = useState(item.name);
  const [supplier, setSupplier] = useState(item.supplier);
  const [description, setDescription] = useState(item.description);
  const [cost, setCost] = useState(item.cost);
  const [directPrice, setDirectPrice] = useState(item.directPrice || 0);
  const [sellingPrice, setSellingPrice] = useState(item.sellingPrice);
  const [profitWeight, setProfitWeight] = useState(item.profitWeight);
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes || '');
  const [images, setImages] = useState<QuoteItem['images']>(item.images || []);

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
    setNotes(item.notes || '');
    setImages(item.images || []);
    setActiveImageIdx(0);
    setSaveSuccess(false);
  }, [item]);

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
        const updated = await quoteItemsApi.uploadImage(projectId, item.id, file);
        setImages(updated.images || []);
        onUpdate(updated);
        setActiveImageIdx((updated.images || []).length - 1);
      }
      appToast.success('תמונה הועלתה', 'התמונה נוספה לרכיב');
    } catch (err) {
      console.error('[ItemEditor] Upload failed:', err);
      appToast.error('שגיאה בהעלאה', 'לא ניתן להעלות את התמונה');
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  }, [projectId, item.id, onUpdate]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      const updated = await quoteItemsApi.deleteImage(projectId, item.id, imageId);
      setImages(updated.images || []);
      onUpdate(updated);
      setActiveImageIdx(Math.max(0, activeImageIdx - 1));
      appToast.success('תמונה הוסרה', '');
    } catch (err) {
      console.error('[ItemEditor] Delete image failed:', err);
      appToast.error('שגיאה', 'לא ניתן למחוק את התמונה');
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleImageUpload(e.dataTransfer.files);
    }
  }, [handleImageUpload]);

  // ─── Save ───
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await quoteItemsApi.update(projectId, item.id, {
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
      onUpdate(updated);
      setSaveSuccess(true);
      appToast.success('הרכיב עודכן', name);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('[ItemEditor] Save failed:', err);
      appToast.error('שגיאה', 'לא ניתן לשמור את השינויים');
    } finally {
      setSaving(false);
    }
  };

  const profit = sellingPrice - cost;
  const profitPct = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;
  const typeIcon = TYPE_ICONS[item.type] || <Package size={18} />;
  const currentStatus = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[2];
  const hasChanges = name !== item.name || supplier !== item.supplier || description !== item.description ||
    cost !== item.cost || directPrice !== (item.directPrice || 0) || sellingPrice !== item.sellingPrice ||
    profitWeight !== item.profitWeight || status !== item.status || notes !== (item.notes || '');

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
            {/* ─── Header ─── */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#e7e1da]"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 bg-[#ff8c00] rounded-full flex items-center justify-center text-white">
                  {typeIcon}
                </span>
                <div>
                  <h2 className="text-[17px] text-[#181510]" style={{ fontWeight: 700 }}>עריכת רכיב</h2>
                  <p className="text-[12px] text-[#8d785e]">{item.type} &bull; {item.id}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#f5f3f0] flex items-center justify-center text-[#8d785e] hover:text-[#181510] transition-colors">
                <X size={18} />
              </button>
            </motion.div>

            {/* ─── Scrollable Content ─── */}
            <div className="flex-1 overflow-y-auto">
              {/* ─── Image Gallery Section ─── */}
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
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Image counter badge */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <Camera size={12} />
                        {activeImageIdx + 1}/{images.length}
                      </div>

                      {/* Navigation arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImageIdx(i => (i + 1) % images.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#181510] hover:bg-white shadow-lg transition-all"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={() => setActiveImageIdx(i => (i - 1 + images.length) % images.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-[#181510] hover:bg-white shadow-lg transition-all"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {/* Delete current image */}
                      <button
                        onClick={() => images[activeImageIdx] && requestDelete({ title: 'מחיקת תמונה', itemName: images[activeImageIdx].name, onConfirm: () => handleDeleteImage(images[activeImageIdx].id) })}
                        className="absolute bottom-3 left-3 bg-red-500/80 hover:bg-red-500 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={11} />
                        מחק
                      </button>
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                      <div className="flex gap-2 p-3 bg-white border-b border-[#e7e1da] overflow-x-auto">
                        {images.map((img, idx) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveImageIdx(idx)}
                            className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                              idx === activeImageIdx
                                ? 'border-[#ff8c00] shadow-md scale-105'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                        {/* Add more button */}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-14 h-14 rounded-lg border-2 border-dashed border-[#e7e1da] flex items-center justify-center text-[#b8a990] hover:border-[#ff8c00] hover:text-[#ff8c00] transition-colors shrink-0"
                        >
                          <ImagePlus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty state — Drag & Drop Zone */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative m-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden ${
                      isDragging
                        ? 'border-[#ff8c00] bg-[#ff8c00]/5 scale-[1.02]'
                        : 'border-[#e7e1da] hover:border-[#ff8c00]/50 bg-white'
                    }`}
                  >
                    {/* Animated glow ring when dragging */}
                    {isDragging && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        animate={{
                          boxShadow: [
                            'inset 0 0 0 0 rgba(255,140,0,0)',
                            'inset 0 0 30px 0 rgba(255,140,0,0.15)',
                            'inset 0 0 0 0 rgba(255,140,0,0)',
                          ],
                        }}
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
                        {uploading ? (
                          <Loader2 size={28} className="animate-spin text-[#ff8c00]" />
                        ) : (
                          <Upload size={28} />
                        )}
                      </motion.div>
                      <p className="text-[15px] text-[#181510] mb-1" style={{ fontWeight: 600 }}>
                        {isDragging ? 'שחרר כדי להעלות' : uploading ? 'מעלה תמונה...' : 'גרור תמונה לכאן'}
                      </p>
                      <p className="text-[12px] text-[#b8a990]">
                        או לחץ לבחירת קובץ &bull; JPG, PNG עד 5MB
                      </p>
                    </div>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => e.target.files && handleImageUpload(e.target.files)}
                />

                {/* Upload button if there are images already */}
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

              {/* ─── Details Section ─── */}
              <div className="px-4 py-3 space-y-4">
                {/* Section: Basic Info */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white rounded-xl border border-[#e7e1da] p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-[13px] text-[#8d785e] mb-1" style={{ fontWeight: 600 }}>
                    <FileText size={14} className="text-[#ff8c00]" />
                    פרטי הרכיב
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8d785e] block mb-1">שם הרכיב</label>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 text-[14px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] transition-all"
                      style={{ fontWeight: 500 }}
                      placeholder="שם הרכיב..."
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8d785e] block mb-1">ספק</label>
                    <input
                      value={supplier}
                      onChange={e => setSupplier(e.target.value)}
                      className="w-full px-3 py-2 text-[14px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] transition-all"
                      placeholder="שם הספק..."
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#8d785e] block mb-1">תיאור</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-[14px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] resize-none transition-all"
                      placeholder="תיאור הרכיב..."
                    />
                  </div>

                  {/* Status selector */}
                  <div>
                    <label className="text-[11px] text-[#8d785e] block mb-1.5">סטטוס</label>
                    <div className="flex gap-2">
                      {STATUS_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setStatus(opt.value)}
                          className={`flex-1 py-2 px-3 rounded-lg text-[12px] border-2 transition-all ${
                            status === opt.value
                              ? 'shadow-sm'
                              : 'border-transparent bg-[#f5f3f0] text-[#8d785e] hover:bg-[#ece8e3]'
                          }`}
                          style={status === opt.value ? {
                            borderColor: opt.color,
                            backgroundColor: opt.bg,
                            color: opt.color,
                            fontWeight: 600,
                          } : { fontWeight: 500 }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Section: Pricing */}
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

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-[#8d785e] block mb-1">עלות (ספק)</label>
                      <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#b8a990]">₪</span>
                        <input
                          type="number"
                          value={cost || ''}
                          onChange={e => setCost(parseFloat(e.target.value) || 0)}
                          className="w-full pr-7 pl-2 py-2 text-[14px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] transition-all"
                          style={{ fontWeight: 600 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#8d785e] block mb-1">תמחור ישיר</label>
                      <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#b8a990]">₪</span>
                        <input
                          type="number"
                          value={directPrice || ''}
                          onChange={e => setDirectPrice(parseFloat(e.target.value) || 0)}
                          className="w-full pr-7 pl-2 py-2 text-[14px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] transition-all"
                          style={{ fontWeight: 500 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] text-[#8d785e] block mb-1">מחיר מכירה</label>
                      <div className="relative">
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#b8a990]">₪</span>
                        <input
                          type="number"
                          value={sellingPrice || ''}
                          onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
                          className="w-full pr-7 pl-2 py-2 text-[14px] border border-[#e7e1da] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] bg-[#fafaf8] transition-all"
                          style={{ fontWeight: 600 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profit indicator bar */}
                  <div className="bg-[#f5f3f0] rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] text-[#8d785e]">רווח</span>
                      <span className={`text-[14px] ${profit >= 0 ? 'text-green-600' : 'text-red-500'}`} style={{ fontWeight: 700 }}>
                        ₪{profit.toLocaleString()} ({profitPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#e7e1da] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.max(profitPct, 0), 100)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{
                          background: profitPct >= 20 ? 'linear-gradient(90deg, #22c55e, #16a34a)' :
                            profitPct >= 14 ? 'linear-gradient(90deg, #84cc16, #65a30d)' :
                            profitPct >= 10 ? 'linear-gradient(90deg, #ff8c00, #e67e00)' :
                            'linear-gradient(90deg, #ef4444, #dc2626)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Profit weight (stars) */}
                  <div>
                    <label className="text-[11px] text-[#8d785e] block mb-1.5">משקל רווח</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(w => (
                        <button
                          key={w}
                          onClick={() => setProfitWeight(w)}
                          className="transition-all hover:scale-110"
                        >
                          <Star
                            size={22}
                            fill={w <= profitWeight ? '#ff8c00' : 'none'}
                            className={w <= profitWeight ? 'text-[#ff8c00]' : 'text-[#ddd6cb]'}
                          />
                        </button>
                      ))}
                      <span className="text-[12px] text-[#8d785e] mr-2">
                        {profitWeight === 1 ? 'מינימלי' : profitWeight === 2 ? 'נמוך' : profitWeight === 3 ? 'בינוני' : profitWeight === 4 ? 'גבוה' : 'מקסימלי'}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Section: Notes */}
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
                    placeholder="הערות שלא יוצגו ללקוח..."
                  />
                </motion.div>

                {/* Spacer for bottom bar */}
                <div className="h-20" />
              </div>
            </div>

            {/* ─── Bottom Save Bar ─── */}
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
              <button
                onClick={onClose}
                className="px-5 py-3 border border-[#e7e1da] rounded-xl text-[14px] text-[#8d785e] hover:bg-[#f5f3f0] transition-colors"
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