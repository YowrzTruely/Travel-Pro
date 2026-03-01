import { useState, useEffect, useCallback, useRef } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  ArrowRight, Eye, CheckSquare, FileText, Star, Plus,
  Trash2, Loader2, Save, Download, Info, Check, X,
  MapPin, Users, Building2, CircleDot,
  Bus, BedDouble, Compass, UtensilsCrossed, Music, Package,
  Clock, Coins, User, Receipt, Pencil, Camera
} from 'lucide-react';
import { FormField, rules } from './FormField';
import { SupplierSearch } from './SupplierSearch';
import { appToast } from './AppToast';
import { projectsApi, quoteItemsApi, timelineApi } from './api';
import type { QuoteItem, TimelineEvent } from './api';
import type { Project } from './data';
import { ItemEditor } from './ItemEditor';
import { useConfirmDelete } from './ConfirmDeleteModal';
import { CategoryIcon } from './CategoryIcons';

const KAYAK_IMG = 'https://images.unsplash.com/photo-1550515710-9324b8e4262e?w=800';
const BUS_IMG = 'https://images.unsplash.com/photo-1765739099920-81a456008253?w=800';

// ─── Profit theme system ───
function getProfitTheme(percent: number) {
  if (percent >= 21) return {
    color: '#22c55e',
    lightColor: '#bbf7d0',
    bgTint: 'rgba(34, 197, 94, 0.15)',
    glowColor: 'rgba(34, 197, 94, 0.35)',
    gradientFrom: '#0f2a1a',
    gradientMid: '#132e1c',
    label: 'מצוין!',
    labelBg: 'rgba(34, 197, 94, 0.2)',
    iconRotation: -45,
    showShimmer: true,
  };
  if (percent >= 14) return {
    color: '#84cc16',
    lightColor: '#d9f99d',
    bgTint: 'rgba(132, 204, 22, 0.12)',
    glowColor: 'rgba(132, 204, 22, 0.25)',
    gradientFrom: '#172a10',
    gradientMid: '#1c2e14',
    label: 'טוב',
    labelBg: 'rgba(132, 204, 22, 0.2)',
    iconRotation: -30,
    showShimmer: false,
  };
  if (percent >= 10) return {
    color: '#ff8c00',
    lightColor: '#ffb74d',
    bgTint: 'rgba(255, 140, 0, 0.2)',
    glowColor: 'rgba(255, 140, 0, 0.2)',
    gradientFrom: '#2a2010',
    gradientMid: '#2a2518',
    label: 'סביר',
    labelBg: 'rgba(255, 140, 0, 0.15)',
    iconRotation: 0,
    showShimmer: false,
  };
  return {
    color: '#ef4444',
    lightColor: '#fca5a5',
    bgTint: 'rgba(239, 68, 68, 0.2)',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    gradientFrom: '#2a1212',
    gradientMid: '#2a1818',
    label: 'נמוך',
    labelBg: 'rgba(239, 68, 68, 0.2)',
    iconRotation: 45,
    showShimmer: false,
  };
}

// ─── Animated counter hook ───
function useAnimatedCounter(target: number, duration = 800) {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) { setValue(target); return; }

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ─── Icon system ───
const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  'תחבורה': <Bus size={16} />,
  'לינה': <BedDouble size={16} />,
  'פעילות': <Compass size={16} />,
  'פעילות בוקר': <Compass size={16} />,
  'ארוחה': <UtensilsCrossed size={16} />,
  'בידור': <Music size={16} />,
  'אחר': <Package size={16} />,
};

function getItemIcon(typeOrIcon: string): React.ReactNode {
  if (TYPE_ICON_MAP[typeOrIcon]) return TYPE_ICON_MAP[typeOrIcon];
  // Use CategoryIcon for category name strings (replaces emoji lookup)
  return <CategoryIcon category={typeOrIcon} size={16} color="currentColor" />;
}

function SectionIcon({ children, size = 'md' }: { children: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  return (
    <span className={`${dims} bg-[#ff8c00] rounded-full flex items-center justify-center text-white shrink-0`}>
      {children}
    </span>
  );
}

function TypeBadge({ type, iconStr, size = 'md' }: { type: string; iconStr?: string; size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'sm' ? 13 : size === 'lg' ? 18 : 15;
  const dims = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const lucideIcon = TYPE_ICON_MAP[type];
  return (
    <span className={`${dims} bg-[#ff8c00]/10 rounded-lg flex items-center justify-center text-[#ff8c00] shrink-0`}>
      {lucideIcon
        ? React.cloneElement(lucideIcon as React.ReactElement, { size: iconSize })
        : <CategoryIcon category={iconStr || type} size={iconSize} color="#ff8c00" />
      }
    </span>
  );
}

const COMPONENT_TYPES = [
  { label: 'תחבורה', type: 'תחבורה' },
  { label: 'לינה', type: 'לינה' },
  { label: 'פעילות', type: 'פעילות' },
  { label: 'ארוחה', type: 'ארוחה' },
  { label: 'בידור', type: 'בידור' },
  { label: 'אחר', type: 'אחר' },
];

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  approved: { label: '✓ מאושר', color: '#16a34a', bg: '#f0fdf4' },
  modified: { label: '♦ שונה', color: '#ff8c00', bg: 'rgba(255,140,0,0.1)' },
  pending: { label: '● ממתין', color: '#8b5cf6', bg: '#f5f3ff' },
};

const tabs = [
  { id: 'components', label: 'רכיבים וספקים' },
  { id: 'pricing', label: 'תמחור ורווח יעד' },
  { id: 'timeline', label: 'לו"ז הפעילות' },
];

interface AddItemForm {
  type: string;
  name: string;
  supplier: string;
  description: string;
  cost: string;
  directPrice: string;
  sellingPrice: string;
}

export function QuoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('components');

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [project, setProject] = useState<Project | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPreview, setShowPreview] = useState(false);
  const [showAddComponent, setShowAddComponent] = useState(false);
  const [showAddForm, setShowAddForm] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Item Editor drawer
  const [editingItem, setEditingItem] = useState<QuoteItem | null>(null);

  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  const [editingDirectPriceId, setEditingDirectPriceId] = useState<string | null>(null);
  const [editingDirectPriceValue, setEditingDirectPriceValue] = useState('');
  const directPriceInputRef = useRef<HTMLInputElement>(null);

  const [showDirectPriceTooltip, setShowDirectPriceTooltip] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const el = sectionRefs.current[sectionId];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const secId = entry.target.getAttribute('data-section');
            if (secId) setActiveTab(secId);
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [loading]);

  const addForm = useForm<AddItemForm>({
    mode: 'onChange',
    defaultValues: { type: '', name: '', supplier: '', description: '', cost: '', directPrice: '', sellingPrice: '' },
  });

  // ─── Load data ───
  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [proj, qi, tl] = await Promise.all([
        projectsApi.get(id),
        quoteItemsApi.list(id),
        timelineApi.list(id),
      ]);
      setProject(proj);
      setItems(qi);
      setTimeline(tl);
    } catch (err) {
      console.error('[QuoteEditor] Failed to load:', err);
      appToast.error('שגיאה בטעינה', 'לא ניתן לטעון את נתוני הפרויקט');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Pricing ───
  const getSellingPrice = (cost: number, weight: number) => {
    const margin = 0.05 + (weight * 0.05);
    return Math.round(cost * (1 + margin));
  };

  const totalCost = items.reduce((sum, item) => sum + (item.cost || 0), 0);
  const totalDirectPrice = items.reduce((sum, item) => sum + (item.directPrice || 0), 0);
  const totalSelling = items.reduce((sum, item) => sum + (item.sellingPrice || 0), 0);
  const totalProfit = totalSelling - totalCost;
  const profitPercent = totalSelling > 0 ? Math.round((totalProfit / totalSelling) * 100) : 0;
  const participants = project?.participants || 1;
  const pricePerPerson = Math.round(totalSelling / participants);

  const profitTheme = getProfitTheme(profitPercent);
  const animatedPercent = useAnimatedCounter(profitPercent);
  const animatedTotal = useAnimatedCounter(totalSelling);
  const animatedPPP = useAnimatedCounter(pricePerPerson);

  const updateProfitWeight = async (item: QuoteItem, newWeight: number) => {
    if (!id) return;
    const newSelling = getSellingPrice(item.cost, newWeight);
    try {
      const updated = await quoteItemsApi.update(id, item.id, { profitWeight: newWeight, sellingPrice: newSelling });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    } catch (err) {
      console.error('[QuoteEditor] Failed to update weight:', err);
      appToast.error('שגיאה', 'לא ניתן לעדכן את משקל הרווח');
    }
  };

  const startEditDirectPrice = (item: QuoteItem) => {
    setEditingDirectPriceId(item.id);
    setEditingDirectPriceValue(String(item.directPrice || ''));
    setTimeout(() => directPriceInputRef.current?.focus(), 50);
  };

  const cancelEditDirectPrice = () => {
    setEditingDirectPriceId(null);
    setEditingDirectPriceValue('');
  };

  const saveDirectPrice = async (item: QuoteItem) => {
    if (!id) return;
    const newPrice = parseFloat(editingDirectPriceValue) || 0;
    if (newPrice === (item.directPrice || 0)) { cancelEditDirectPrice(); return; }
    try {
      const updated = await quoteItemsApi.update(id, item.id, { directPrice: newPrice });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      appToast.success('תמחור ישיר עודכן', `₪${newPrice.toLocaleString()}`);
    } catch (err) {
      console.error('[QuoteEditor] Failed to update direct price:', err);
      appToast.error('שגיאה', 'לא ניתן לעדכן את התמחור הישיר');
    } finally {
      cancelEditDirectPrice();
    }
  };

  const onAddItem = async (data: AddItemForm) => {
    if (!id || !showAddForm) return;
    try {
      setSaving(true);
      const typeInfo = COMPONENT_TYPES.find(c => c.type === showAddForm);
      const cost = parseFloat(data.cost) || 0;
      const directPrice = parseFloat(data.directPrice) || Math.round(cost * 1.25);
      const sellingPrice = parseFloat(data.sellingPrice) || getSellingPrice(cost, 3);
      const newItem = await quoteItemsApi.create(id, {
        type: showAddForm,
        icon: showAddForm || 'אחר',
        name: data.name.trim(),
        supplier: data.supplier.trim(),
        description: data.description.trim(),
        cost,
        directPrice,
        sellingPrice,
        profitWeight: 3,
        status: 'pending',
      });
      setItems(prev => [...prev, newItem]);
      setShowAddForm(null);
      setShowAddComponent(false);
      addForm.reset();
      appToast.success('רכיב נוסף', `${data.name} נוסף להצעה`);
    } catch (err) {
      console.error('[QuoteEditor] Failed to add item:', err);
      appToast.error('שגיאה', 'לא ניתן להוסיף את הרכיב');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!id) return;
    try {
      setDeletingItemId(itemId);
      await quoteItemsApi.delete(id, itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
      appToast.success('רכיב הוסר', 'הרכיב הוסר מההצעה');
    } catch (err) {
      console.error('[QuoteEditor] Failed to delete item:', err);
      appToast.error('שגיאה', 'לא ניתן למחוק את הרכיב');
    } finally {
      setDeletingItemId(null);
    }
  };

  const saveDraft = async () => {
    if (!id || !project) return;
    try {
      setSaving(true);
      const margin = totalSelling > 0 ? Math.round((totalProfit / totalSelling) * 100) : 0;
      await projectsApi.update(id, { totalPrice: totalSelling, pricePerPerson, profitMargin: margin });
      appToast.success('הטיוטה נשמרה', 'מחירים ורווח עודכנו בפרויקט');
    } catch (err) {
      console.error('[QuoteEditor] Failed to save draft:', err);
      appToast.error('שגיאה', 'לא ניתן לשמור את הטיוטה');
    } finally {
      setSaving(false);
    }
  };

  // ─── Item editor update handler ───
  const handleItemUpdate = (updated: QuoteItem) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    // Keep editingItem in sync
    if (editingItem?.id === updated.id) setEditingItem(updated);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-[#ff8c00] mb-3" />
        <p className="text-[14px] text-[#8d785e]">טוען נתוני הצעה...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-[18px] text-[#8d785e] mb-4">פרויקט לא נמצא</p>
        <button onClick={() => navigate('/projects')} className="text-[#ff8c00] hover:underline">
          חזרה לרשימת הפרויקטים
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>פרויקט: {project.name}</h1>
            <p className="text-[12px] text-[#8d785e]">מזהה פרויקט: #{id} &bull; {project.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/quote/${id}`)}
            className="flex items-center gap-2 text-[13px] text-[#6b5d45] border border-[#e7e1da] px-3 py-2 rounded-lg hover:bg-[#f5f3f0] transition-colors"
          >
            <Eye size={15} />
            תצוגה מקדימה ללקוח
          </button>
          <button
            onClick={() => {
              if (items.length === 0) {
                appToast.warning('אין רכיבים', 'הוסף לפחות רכיב אחד להצעה');
              } else {
                appToast.success('בדיקה הושלמה', 'ההצעה תקינה ומוכנה לשליחה ללקוח');
              }
            }}
            className="flex items-center gap-2 text-[13px] text-[#6b5d45] border border-[#e7e1da] px-3 py-2 rounded-lg hover:bg-[#f5f3f0] transition-colors"
          >
            <CheckSquare size={15} />
            בדיקה לפני שליחה
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 text-[13px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-4 py-2 rounded-lg shadow-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <FileText size={15} />
            צור גרסת הצעה
          </button>
        </div>
      </div>

      {/* Project info cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'סטטוס', value: project.status, color: project.statusColor, icon: <CircleDot size={13} /> },
          { label: 'חברה', value: project.company, icon: <Building2 size={13} /> },
          { label: 'משתתפים', value: `${project.participants} איש`, icon: <Users size={13} /> },
          { label: 'אזור', value: project.region, icon: <MapPin size={13} /> },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-3.5 border border-[#e7e1da] text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8d785e] mb-1">
              <span className="text-[#b8a990]">{card.icon}</span>
              <span>{card.label}</span>
            </div>
            <div className="text-[15px] text-[#181510]" style={{ fontWeight: 600, color: card.color || '#181510' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div
        className="relative rounded-xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4 overflow-hidden"
        style={{
          background: `linear-gradient(to left, #181510 0%, ${profitTheme.gradientMid} 60%, ${profitTheme.gradientFrom} 100%)`,
          transition: 'background 0.8s ease',
          boxShadow: `0 4px 24px ${profitTheme.glowColor}`,
        }}
      >
        {profitTheme.showShimmer && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${profitTheme.glowColor} 50%, transparent 60%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
        )}
        <div
          className="absolute left-0 top-0 bottom-0 w-1/3 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${profitTheme.glowColor} 0%, transparent 70%)`,
            transition: 'background 0.8s ease',
          }}
        />
        <style>{`@keyframes shimmer { 0%,100% { background-position: 200% 0; } 50% { background-position: -200% 0; } }`}</style>

        <div className="flex items-center gap-6 relative z-10">
          <div className="flex items-center gap-2.5">
            <User size={16} className="text-white/60" />
            <div className="text-center">
              <div className="text-[11px] text-[#c4b89a]">מחיר לאדם</div>
              <div className="text-[22px] text-white" style={{ fontWeight: 700 }}>₪{animatedPPP.toLocaleString()}</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="flex items-center gap-2.5">
            <Receipt size={16} className="text-white/60" />
            <div className="text-center">
              <div className="text-[11px] text-[#c4b89a]">מחיר כולל (משוער)</div>
              <div className="text-[22px] text-white" style={{ fontWeight: 700 }}>₪{animatedTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl relative z-10"
          style={{
            backgroundColor: profitTheme.bgTint,
            boxShadow: `inset 0 0 20px ${profitTheme.glowColor}, 0 0 12px ${profitTheme.glowColor}`,
            transition: 'all 0.8s ease',
          }}
        >
          <div className="text-center">
            <div className="text-[11px]" style={{ color: profitTheme.lightColor, transition: 'color 0.8s ease' }}>
              רווח יעד מוערך
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-[22px]" style={{ fontWeight: 700, color: profitTheme.color, transition: 'color 0.8s ease' }}>
                {animatedPercent}%
              </span>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: profitTheme.labelBg, color: profitTheme.color, fontWeight: 600, transition: 'all 0.8s ease' }}
              >
                {profitTheme.label}
              </span>
            </div>
          </div>
          <DynamicTrendIcon color={profitTheme.color} rotation={profitTheme.iconRotation} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#ece8e3] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md text-[13px] transition-all ${
              activeTab === tab.id ? 'bg-white text-[#181510] shadow-sm' : 'text-[#8d785e] hover:text-[#181510]'
            }`}
            style={{ fontWeight: 700 }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ Components Section ═══ */}
      <div
        ref={el => { sectionRefs.current['components'] = el; }}
        data-section="components"
        className="space-y-5 scroll-mt-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
            <SectionIcon><Package size={15} /></SectionIcon>
            רכיבים וספקים ({items.length})
          </h2>
          <button
            onClick={() => setShowAddComponent(true)}
            className="text-[13px] text-[#ff8c00] flex items-center gap-1 hover:text-[#e67e00]"
            style={{ fontWeight: 600 }}
          >
            <Plus size={14} />
            הוספת רכיב חדש
          </button>
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e7e1da]">
            <div className="flex justify-center mb-3"><SectionIcon size="lg"><Package size={22} /></SectionIcon></div>
            <p className="text-[16px] text-[#8d785e] mb-2">אין רכיבים בהצעה</p>
            <p className="text-[13px] text-[#b8a990]">הוסף רכיבים כמו תחבורה, פעילויות, ארוחות ועוד</p>
          </div>
        )}

        {items.map(item => {
          const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.pending;
          const imageCount = item.images?.length || 0;
          return (
            <div key={item.id} className="bg-white rounded-xl border border-[#e7e1da] overflow-hidden group/card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between p-4 bg-[#f5f3f0] border-b border-[#e7e1da]">
                <div className="flex items-center gap-2">
                  <SectionIcon size="sm">{getItemIcon(item.type)}</SectionIcon>
                  <span className="text-[15px] text-[#181510]" style={{ fontWeight: 600 }}>{item.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  {imageCount > 0 && (
                    <span className="text-[11px] text-[#8d785e] bg-white px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#e7e1da]">
                      <Camera size={11} />
                      {imageCount}
                    </span>
                  )}
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: statusInfo.bg, color: statusInfo.color, fontWeight: 600 }}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TypeBadge type={item.type} iconStr={item.icon} size="lg" />
                    <div>
                      <div className="text-[15px] text-[#181510] flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        {item.name || item.supplier}
                      </div>
                      <div className="text-[12px] text-[#8d785e]">{item.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Edit button - always visible */}
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff8c00]/10 text-[#ff8c00] hover:bg-[#ff8c00] hover:text-white transition-all text-[12px]"
                      style={{ fontWeight: 600 }}
                    >
                      <Pencil size={13} />
                      עריכה
                    </button>
                    <button
                      onClick={() => requestDelete({ title: 'מחיקת רכיב', itemName: item.name || item.supplier, onConfirm: () => deleteItem(item.id) })}
                      disabled={deletingItemId === item.id}
                      className="text-[#8d785e] hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {deletingItemId === item.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                    <div className="text-left">
                      <div className="text-[11px] text-[#8d785e]">עלות</div>
                      <div className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>₪{item.cost.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Image preview strip */}
                {imageCount > 0 && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-[#f5f3f0]">
                    {(item.images || []).slice(0, 4).map((img, idx) => (
                      <div
                        key={img.id}
                        onClick={() => setEditingItem(item)}
                        className="w-16 h-12 rounded-lg overflow-hidden border border-[#e7e1da] cursor-pointer hover:border-[#ff8c00] transition-all"
                      >
                        <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {imageCount > 4 && (
                      <div
                        onClick={() => setEditingItem(item)}
                        className="w-16 h-12 rounded-lg border border-[#e7e1da] flex items-center justify-center bg-[#f5f3f0] cursor-pointer hover:border-[#ff8c00] transition-all"
                      >
                        <span className="text-[11px] text-[#8d785e]" style={{ fontWeight: 600 }}>+{imageCount - 4}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Alternatives */}
                {item.alternatives && item.alternatives.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#f5f3f0]">
                    <div className="text-[13px] text-[#8d785e] mb-3">חלופות לבחירה:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {item.alternatives.map(alt => (
                        <div
                          key={alt.id}
                          className={`relative rounded-xl border-2 p-3 transition-all ${
                            alt.selected ? 'border-[#ff8c00] bg-[#ff8c00]/5' : 'border-[#e7e1da]'
                          }`}
                        >
                          <div className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{alt.name}</div>
                          <div className="text-[11px] text-[#8d785e]">{alt.description}</div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[11px] text-[#8d785e]">עלות לאדם</span>
                            <span className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>₪{alt.costPerPerson}</span>
                          </div>
                          {alt.selected && (
                            <div className="absolute top-2 left-2 w-5 h-5 bg-[#ff8c00] rounded-full flex items-center justify-center">
                              <span className="text-white text-[12px]">✓</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setShowAddComponent(true)}
          className="w-full border-2 border-dashed border-[#e7e1da] rounded-xl p-4 text-[#8d785e] hover:border-[#ff8c00] hover:text-[#ff8c00] transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span className="text-[13px]" style={{ fontWeight: 600 }}>הוסף רכיב נוסף (ארוחה, לינה, פעילות...)</span>
        </button>
      </div>

      {/* ═══ Pricing Section ═══ */}
      <div
        ref={el => { sectionRefs.current['pricing'] = el; }}
        data-section="pricing"
        className="space-y-5 mt-8 scroll-mt-4"
      >
        <h2 className="text-[18px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
          <SectionIcon><Coins size={15} /></SectionIcon>
          תמחור ורווח יעד
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e7e1da]">
            <p className="text-[16px] text-[#8d785e]">הוסף רכיבים כדי לראות תמחור</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e7e1da] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f3f0] border-b border-[#e7e1da] text-[12px] text-[#8d785e]">
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>רכיב</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>
                    <div className="flex items-center gap-1 relative">
                      <span>תמחור ישיר</span>
                      <button
                        onMouseEnter={() => setShowDirectPriceTooltip(true)}
                        onMouseLeave={() => setShowDirectPriceTooltip(false)}
                        onClick={() => setShowDirectPriceTooltip(prev => !prev)}
                        className="text-[#b8a990] hover:text-[#ff8c00] transition-colors"
                      >
                        <Info size={13} />
                      </button>
                      {showDirectPriceTooltip && (
                        <div className="absolute top-full right-0 mt-1 z-10 bg-[#181510] text-white text-[11px] rounded-lg px-3 py-2 w-52 shadow-lg" style={{ fontWeight: 400 }}>
                          המחיר שהלקוח היה משלם אם היה פונה ישירות לספק, ללא תיווך. לחץ על מחיר בטבלה כדי לערוך.
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>עלות (ספק)</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>מחיר מכירה</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>רווח</th>
                  <th className="p-3 text-right" style={{ fontWeight: 600 }}>משקל רווח</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const dp = item.directPrice || 0;
                  const savingsVsDirect = dp > 0 ? dp - item.sellingPrice : 0;
                  return (
                  <tr key={item.id} className="border-b border-[#e7e1da]">
                    <td className="p-3 text-[14px]" style={{ fontWeight: 500 }}>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-[#ff8c00]">{getItemIcon(item.type)}</span>
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3">
                      {editingDirectPriceId === item.id ? (
                        <div className="flex items-center gap-1">
                          <div className="relative">
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-[#8d785e]">₪</span>
                            <input
                              ref={directPriceInputRef}
                              type="number"
                              value={editingDirectPriceValue}
                              onChange={e => setEditingDirectPriceValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveDirectPrice(item);
                                if (e.key === 'Escape') cancelEditDirectPrice();
                              }}
                              className="w-24 pr-6 pl-1 py-1 text-[13px] border border-[#ff8c00] rounded-lg bg-[#ff8c00]/5 text-[#181510] focus:outline-none focus:ring-1 focus:ring-[#ff8c00]"
                              style={{ fontWeight: 600 }}
                            />
                          </div>
                          <button onClick={() => saveDirectPrice(item)} className="text-green-600 hover:text-green-700 p-0.5"><Check size={14} /></button>
                          <button onClick={cancelEditDirectPrice} className="text-[#8d785e] hover:text-red-500 p-0.5"><X size={14} /></button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditDirectPrice(item)}
                          className="flex flex-col items-start gap-0.5 cursor-pointer group/dp w-full text-right"
                        >
                          <span className="text-[14px] text-[#8d785e] group-hover/dp:text-[#ff8c00] transition-colors" style={{ fontWeight: 500 }}>
                            {dp > 0 ? `₪${dp.toLocaleString()}` : '+ הוסף'}
                          </span>
                          {savingsVsDirect > 0 && (
                            <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                              חיסכון ₪{savingsVsDirect.toLocaleString()}
                            </span>
                          )}
                        </button>
                      )}
                    </td>
                    <td className="p-3 text-[14px] text-[#6b5d45]">₪{item.cost.toLocaleString()}</td>
                    <td className="p-3 text-[14px]" style={{ fontWeight: 600 }}>₪{item.sellingPrice.toLocaleString()}</td>
                    <td className="p-3 text-[14px] text-green-600" style={{ fontWeight: 600 }}>
                      ₪{(item.sellingPrice - item.cost).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(w => (
                          <button key={w} onClick={() => updateProfitWeight(item, w)} className="transition-colors">
                            <Star size={16} fill={w <= item.profitWeight ? '#ff8c00' : 'none'} className={w <= item.profitWeight ? 'text-[#ff8c00]' : 'text-[#ddd6cb]'} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-[#181510] text-white">
                  <td className="p-3 text-[14px]" style={{ fontWeight: 600 }}>סה"כ פרויקט</td>
                  <td className="p-3 text-[14px]">{totalDirectPrice > 0 ? <span>₪{totalDirectPrice.toLocaleString()}</span> : '—'}</td>
                  <td className="p-3 text-[14px]">₪{totalCost.toLocaleString()}</td>
                  <td className="p-3 text-[14px]" style={{ fontWeight: 700 }}>₪{totalSelling.toLocaleString()}</td>
                  <td className="p-3 text-[14px] text-green-400" style={{ fontWeight: 700 }}>₪{totalProfit.toLocaleString()} ({profitPercent}%)</td>
                  <td className="p-3 text-[14px] text-[#c4b89a]">
                    ממוצע: {items.length > 0 ? (items.reduce((s, i) => s + i.profitWeight, 0) / items.length).toFixed(1) : '0'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* ═══ Timeline Section ═══ */}
      <div
        ref={el => { sectionRefs.current['timeline'] = el; }}
        data-section="timeline"
        className="space-y-5 mt-8 scroll-mt-4"
      >
        <h2 className="text-[18px] text-[#181510] flex items-center gap-2" style={{ fontWeight: 700 }}>
          <SectionIcon><Clock size={15} /></SectionIcon>
          לו"ז הפעילות
        </h2>

        {timeline.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#e7e1da]">
            <div className="flex justify-center mb-3"><SectionIcon size="lg"><Clock size={22} /></SectionIcon></div>
            <p className="text-[16px] text-[#8d785e]">אין אירועי לו"ז לפרויקט זה</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
            <div className="space-y-0">
              {timeline.map((event, idx) => (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#ff8c00]/10 flex items-center justify-center text-[#b8a990]">{getItemIcon(event.icon)}</div>
                    {idx < timeline.length - 1 && <div className="w-0.5 flex-1 bg-[#e7e1da] my-1" />}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>{event.time}</span>
                      <span className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>&bull; {event.title}</span>
                    </div>
                    <p className="text-[13px] text-[#8d785e]">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={saveDraft}
          disabled={saving}
          className="bg-[#181510] hover:bg-[#2a2518] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-[14px] transition-colors flex items-center gap-2"
          style={{ fontWeight: 600 }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'שומר...' : 'שמור טיוטה'}
        </button>
        <button
          onClick={() => {
            const printWin = window.open('', '_blank');
            if (!printWin) { appToast.error('חלון הדפסה נחסם'); return; }
            const rows = items.map(i => `<tr><td style="padding:10px;border-bottom:1px solid #e7e1da">${i.type}</td><td style="padding:10px;border-bottom:1px solid #e7e1da">${i.name}</td><td style="padding:10px;border-bottom:1px solid #e7e1da">${i.supplier || '-'}</td><td style="padding:10px;border-bottom:1px solid #e7e1da;font-weight:600">₪${i.sellingPrice.toLocaleString()}</td></tr>`).join('');
            const tlRows = timeline.map(e => `<div style="display:flex;gap:12px;margin-bottom:12px"><div style="width:40px;text-align:center;font-weight:700;color:#ff8c00">${e.time}</div><div><b>${e.title}</b><br/><span style="color:#8d785e;font-size:13px">${e.description}</span></div></div>`).join('');
            printWin.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="utf-8"><title>הצעת מחיר — ${project?.name || ''}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Assistant,Helvetica,Arial,sans-serif;color:#181510;padding:40px;max-width:800px;margin:0 auto}h1{font-size:24px;margin-bottom:4px}h2{font-size:18px;margin:24px 0 12px;border-bottom:2px solid #ff8c00;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin-bottom:20px}th{text-align:right;padding:10px;background:#f5f3f0;border-bottom:2px solid #e7e1da;font-size:13px}.summary{display:flex;gap:24px;background:#f8f7f5;padding:16px;border-radius:12px;margin:16px 0}.summary div{text-align:center}.summary .value{font-size:22px;font-weight:700}.summary .label{font-size:12px;color:#8d785e}@media print{body{padding:20px}}</style></head><body><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><div><h1>הצעת מחיר</h1><p style="color:#8d785e;font-size:14px">${project?.name} — ${project?.company || ''}</p></div><div style="text-align:left"><p style="font-size:13px;color:#8d785e">מזהה: #${id}</p><p style="font-size:13px;color:#8d785e">${new Date().toLocaleDateString('he-IL')}</p></div></div><div class="summary"><div><div class="label">משתתפים</div><div class="value">${participants}</div></div><div><div class="label">מחיר לאדם</div><div class="value">₪${pricePerPerson.toLocaleString()}</div></div><div><div class="label">סה"כ</div><div class="value">₪${totalSelling.toLocaleString()}</div></div><div><div class="label">אזור</div><div class="value">${project?.region || ''}</div></div></div><h2>פירוט רכיבים</h2><table><thead><tr><th>סוג</th><th>רכיב</th><th>ספק</th><th>מחיר</th></tr></thead><tbody>${rows}</tbody><tfoot><tr style="background:#181510;color:white"><td colspan="3" style="padding:10px;font-weight:600">סה"כ</td><td style="padding:10px;font-weight:700">₪${totalSelling.toLocaleString()}</td></tr></tfoot></table>${tlRows ? `<h2>לו"ז הפעילות</h2>${tlRows}` : ''}<div style="margin-top:40px;text-align:center;color:#b8a990;font-size:12px"><p>הופק ע"י TravelPro &bull; ${new Date().toLocaleDateString('he-IL')}</p></div></body></html>`);
            printWin.document.close();
            setTimeout(() => { printWin.print(); }, 500);
            appToast.success('PDF מוכן', 'חלון ההדפסה נפתח — בחר "שמור כ-PDF"');
          }}
          className="text-[#6b5d45] border border-[#e7e1da] px-5 py-2.5 rounded-xl text-[14px] hover:bg-[#f5f3f0] transition-colors flex items-center gap-2"
        >
          <Download size={16} />
          ייצוא PDF
        </button>
        <button
          onClick={() => loadData().then(() => appToast.neutral('השינויים בוטלו', 'הנתונים נטענו מחדש מהשרת'))}
          className="text-[#8d785e] border border-[#e7e1da] px-6 py-2.5 rounded-xl text-[14px] hover:bg-[#f5f3f0] transition-colors"
        >
          ביטול שינויים
        </button>
      </div>

      {/* ═══ Create version modal ═══ */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>יצירת גרסת הצעה</h3>
            <p className="text-[14px] text-[#8d785e] mb-4">הגרסה הנוכחית תינעל ויווצר קישור לשליחה ללקוח.</p>
            <div className="bg-[#f5f3f0] rounded-xl p-4 mb-4">
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#8d785e]">גרסה:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>V1.0</span>
              </div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#8d785e]">רכיבים:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>{items.length}</span>
              </div>
              <div className="flex justify-between text-[13px] mb-2">
                <span className="text-[#8d785e]">סה"כ:</span>
                <span className="text-[#181510]" style={{ fontWeight: 600 }}>₪{totalSelling.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[#8d785e]">רווחיות:</span>
                <span className="text-green-600" style={{ fontWeight: 600 }}>{profitPercent}%</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await saveDraft();
                  setShowPreview(false);
                  appToast.success('גרסת הצעה V1.0 נוצרה בהצלחה!', 'מעביר לתצוגת לקוח...');
                  setTimeout(() => navigate(`/quote/${id}`), 1200);
                }}
                className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] text-white py-2.5 rounded-xl transition-colors"
                style={{ fontWeight: 600 }}
              >
                צור ושלח ללקוח
              </button>
              <button onClick={() => setShowPreview(false)} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Add component modal ═══ */}
      {showAddComponent && !showAddForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddComponent(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>הוספת רכיב חדש</h3>
            <div className="grid grid-cols-2 gap-3">
              {COMPONENT_TYPES.map(ct => (
                <button
                  key={ct.type}
                  onClick={() => { setShowAddForm(ct.type); addForm.setValue('type', ct.type); }}
                  className="flex items-center gap-3 p-3 border border-[#e7e1da] rounded-xl hover:border-[#ff8c00] hover:bg-[#ff8c00]/5 transition-all"
                >
                  <TypeBadge type={ct.type} size="md" />
                  <span className="text-[14px] text-[#181510]" style={{ fontWeight: 500 }}>{ct.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Add component form ═══ */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddForm(null); addForm.reset(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-[20px] text-[#181510] mb-4" style={{ fontWeight: 700 }}>
              הוספת {showAddForm} להצעה
            </h3>
            <form onSubmit={addForm.handleSubmit(onAddItem)} className="space-y-4">
              <FormField label="שם רכיב" placeholder="למשל: אוטובוס מפואר" required error={addForm.formState.errors.name} isDirty={addForm.formState.dirtyFields.name} {...addForm.register('name', rules.requiredMin('שם רכיב', 2))} />
              <SupplierSearch value={addForm.watch('supplier')} onChange={(name) => addForm.setValue('supplier', name, { shouldDirty: true })} />
              <FormField label="תיאור" placeholder="פרטים נוספים..." error={addForm.formState.errors.description} isDirty={addForm.formState.dirtyFields.description} {...addForm.register('description')} />
              <div className="grid grid-cols-3 gap-3">
                <FormField label="עלות (ספק)" type="number" placeholder="₪" required error={addForm.formState.errors.cost} isDirty={addForm.formState.dirtyFields.cost} {...addForm.register('cost', rules.positivePrice('עלות'))} />
                <FormField label="תמחור ישיר" type="number" placeholder="₪ (מחיר ללקוח ישיר)" error={addForm.formState.errors.directPrice} isDirty={addForm.formState.dirtyFields.directPrice} {...addForm.register('directPrice')} />
                <FormField label="מחיר מכירה" type="number" placeholder="₪ (אוטומטי אם ריק)" error={addForm.formState.errors.sellingPrice} isDirty={addForm.formState.dirtyFields.sellingPrice} {...addForm.register('sellingPrice')} />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || !addForm.formState.isValid}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? 'מוסיף...' : 'הוסף רכיב'}
                </button>
                <button type="button" onClick={() => { setShowAddForm(null); addForm.reset(); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Item Editor Drawer ═══ */}
      {editingItem && id && (
        <ItemEditor
          item={editingItem}
          projectId={id}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleItemUpdate}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteModal}
    </div>
  );
}

function DynamicTrendIcon({ color, rotation }: { color: string; rotation: number }) {
  return (
    <svg
      width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.8s ease, stroke 0.8s ease',
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}