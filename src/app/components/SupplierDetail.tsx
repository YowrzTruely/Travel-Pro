import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  ArrowRight, CheckCircle, Phone, Mail,
  MapPin, FileText, AlertTriangle, Plus, Loader2, Clock, Save, Trash2, X,
  Upload, Shield, ShieldCheck, ShieldAlert, CalendarDays, Pencil, Camera, Package, Users, Archive, ArchiveRestore
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Supplier } from './data';
import { suppliersApi, supplierContactsApi, supplierProductsApi, supplierDocumentsApi } from './api';
import type { SupplierContact, SupplierProduct, SupplierDocument } from './api';
import { FormField, rules } from './FormField';
import { FormSelect, FormTextarea } from './FormField';
import { appToast } from './AppToast';
import { ProductEditor } from './ProductEditor';
import { SupplierLocationMap } from './SupplierLocationMap';
import { computeAutoNotes, noteLevelStyles } from './supplierNotes';
import type { AutoNote } from './supplierNotes';
import { useConfirmDelete } from './ConfirmDeleteModal';
import { CategoryIcon } from './CategoryIcons';

const VINEYARD_IMG = 'https://images.unsplash.com/photo-1762330465953-75478d918896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW5leWFyZCUyMGdyYXBlJTIwaGlsbHNpZGUlMjBncmVlbnxlbnwxfHx8fDE3NzE0NjgyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080';

const tabItems = [
  { id: 'info', label: 'מידע כללי' },
  { id: 'products', label: 'מוצרים ושירותים' },
  { id: 'docs', label: 'מסמכים' },
  { id: 'contacts', label: 'אנשי קשר' },
];

const statusLabel: Record<string, string> = { verified: 'מאומת', pending: 'ממתין לאימות', unverified: 'לא מאומת' };

interface AddContactForm { contactName: string; contactRole: string; contactPhone: string; contactEmail: string; }
interface AddProductForm { productName: string; productPrice: string; productDescription: string; productUnit: string; }
interface EditSupplierForm { name: string; phone: string; category: string; categoryColor: string; region: string; rating: string; verificationStatus: string; notes: string; icon: string; }

// Helper: parse comma-separated categories
function parseCategories(cat: string | undefined): string[] {
  if (!cat) return [];
  return cat.split(',').map(c => c.trim()).filter(Boolean);
}

const CATEGORY_OPTIONS = [
  { value: 'תחבורה', color: '#3b82f6' },
  { value: 'מזון', color: '#22c55e' },
  { value: 'אטרקציות', color: '#a855f7' },
  { value: 'לינה', color: '#ec4899' },
  { value: 'אולמות וגנים', color: '#f97316' },
  { value: 'צילום', color: '#06b6d4' },
  { value: 'מוזיקה', color: '#8b5cf6' },
  { value: 'ציוד', color: '#64748b' },
  { value: 'כללי', color: '#8d785e' },
];

const REGION_OPTIONS = ['צפון', 'מרכז', 'דרום', 'ירושלים', 'גולן', 'שפלה', 'שרון', 'נגב', 'אילת', 'יהודה ושומרון'];

export function SupplierDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('info');
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [contacts, setContacts] = useState<SupplierContact[]>([]);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [documents, setDocuments] = useState<SupplierDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [docExpiryEditing, setDocExpiryEditing] = useState<string | null>(null);
  const [docExpiryValue, setDocExpiryValue] = useState('');
  const [docSaving, setDocSaving] = useState<string | null>(null);

  // Product editor
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);

  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  // Archive
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiving, setArchiving] = useState(false);

  // Edit supplier
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  const [savingSupplier, setSavingSupplier] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const contactForm = useForm<AddContactForm>({ mode: 'onChange', defaultValues: { contactName: '', contactRole: '', contactPhone: '', contactEmail: '' } });
  const productForm = useForm<AddProductForm>({ mode: 'onChange', defaultValues: { productName: '', productPrice: '', productDescription: '', productUnit: 'אדם' } });
  const editSupplierForm = useForm<EditSupplierForm>({ mode: 'onChange' });

  // ─── Load all data ───
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      suppliersApi.get(id),
      supplierContactsApi.list(id),
      supplierProductsApi.list(id),
      supplierDocumentsApi.list(id),
    ])
      .then(([s, c, p, d]) => {
        setSupplier(s);
        setContacts(c);
        setProducts(p);
        setDocuments(d);
      })
      .catch(err => {
        console.error('[SupplierDetail] fetch failed:', err);
        appToast.error('שגיאה בטעינת פרטי ספק');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onAddContact = async (data: AddContactForm) => {
    if (!id) return;
    try {
      setSaving(true);
      const newContact = await supplierContactsApi.create(id, {
        name: data.contactName.trim(), role: data.contactRole.trim(),
        phone: data.contactPhone.trim(), email: data.contactEmail.trim(),
        primary: contacts.length === 0,
      });
      setContacts(prev => [...prev, newContact]);
      setShowAddContact(false);
      contactForm.reset();
      appToast.success('איש קשר נוסף', `${data.contactName} נשמר בכרטיס הספק`);
    } catch (err) { appToast.error('שגיאה בהוספת איש קשר'); }
    finally { setSaving(false); }
  };

  const deleteContact = async (contactId: string) => {
    if (!id) return;
    try {
      await supplierContactsApi.delete(id, contactId);
      setContacts(prev => prev.filter(c => c.id !== contactId));
      appToast.success('איש קשר הוסר');
    } catch (err) { appToast.error('שגיאה במחיקת איש קשר'); }
  };

  const onAddProduct = async (data: AddProductForm) => {
    if (!id) return;
    try {
      setSaving(true);
      const newProduct = await supplierProductsApi.create(id, {
        name: data.productName.trim(), price: parseFloat(data.productPrice) || 0,
        description: data.productDescription.trim(), unit: data.productUnit.trim(),
      });
      setProducts(prev => [...prev, newProduct]);
      setShowAddProduct(false);
      productForm.reset({ productName: '', productPrice: '', productDescription: '', productUnit: 'אדם' });
      appToast.success('מוצר נוסף', `${data.productName} נשמר`);
    } catch (err) { appToast.error('שגיאה בהוספת מוצר'); }
    finally { setSaving(false); }
  };

  const deleteProduct = async (productId: string) => {
    if (!id) return;
    try {
      await supplierProductsApi.delete(id, productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      appToast.success('מוצר הוסר');
    } catch (err) { appToast.error('שגיאה במחיקת מוצר'); }
  };

  const handleProductUpdate = (updated: SupplierProduct) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    if (editingProduct?.id === updated.id) setEditingProduct(updated);
  };

  const updateDocExpiry = async (docId: string) => {
    if (!id || !docExpiryValue) return;
    try {
      setDocSaving(docId);
      const updatedDoc = await supplierDocumentsApi.update(id, docId, { expiry: docExpiryValue });
      setDocuments(prev => prev.map(d => d.id === docId ? updatedDoc : d));
      setDocExpiryEditing(null);
      setDocExpiryValue('');
      appToast.success('תאריך פג תוקף עודכן בהצלחה');
    } catch (err) { appToast.error('שגיאה בעדכון תאריך פג תוקף'); }
    finally { setDocSaving(null); }
  };

  const archiveSupplier = async () => {
    if (!id) return;
    try {
      setArchiving(true);
      await suppliersApi.archive(id);
      appToast.success('הספק הועבר לארכיון', `${supplier?.name} הועבר לארכיון בהצלחה`);
      navigate('/suppliers');
    } catch (err) { appToast.error('שגיאה בהעברה לארכיון'); }
    finally { setArchiving(false); }
  };

  const restoreSupplier = async () => {
    if (!id) return;
    try {
      setArchiving(true);
      const updated = await suppliersApi.update(id, { category: 'כללי', categoryColor: '#8d785e' });
      setSupplier(updated);
      appToast.success('הספק שוחזר בהצלחה', `${supplier?.name} חזר לבנק הספקים`);
    } catch (err) { appToast.error('שגיאה בשחזור ספק'); }
    finally { setArchiving(false); }
  };

  const isArchived = supplier?.category === 'ארכיון';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-[#ff8c00] mb-3" />
        <p className="text-[14px] text-[#8d785e]">טוען פרטי ספק...</p>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertTriangle size={32} className="text-[#ef4444] mb-3" />
        <p className="text-[16px] text-[#181510]" style={{ fontWeight: 600 }}>ספק לא נמצא</p>
        <button onClick={() => navigate('/suppliers')} className="mt-3 text-[13px] text-[#ff8c00]" style={{ fontWeight: 600 }}>חזור לבנק ספקים</button>
      </div>
    );
  }

  const verifBg = supplier.verificationStatus === 'verified' ? 'bg-green-50 text-green-600' :
                  supplier.verificationStatus === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                  'bg-[#f5f3f0] text-[#8d785e]';
  const VerifIcon = supplier.verificationStatus === 'verified' ? CheckCircle :
                    supplier.verificationStatus === 'pending' ? Clock : AlertTriangle;

  const getInitials = (name: string) => name.split(' ').map(w => w[0]).join('').slice(0, 2);

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Archived banner */}
      {isArchived && (
        <div className="flex items-center justify-between bg-[#94a3b8]/10 border border-[#94a3b8]/30 rounded-xl px-4 py-3 mb-5">
          <div className="flex items-center gap-2">
            <Archive size={16} className="text-[#64748b]" />
            <span className="text-[14px] text-[#475569]" style={{ fontWeight: 600 }}>ספק זה נמצא בארכיון</span>
          </div>
          <button
            onClick={restoreSupplier}
            disabled={archiving}
            className="flex items-center gap-1.5 text-[13px] text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all"
            style={{ fontWeight: 600 }}
          >
            {archiving ? <Loader2 size={14} className="animate-spin" /> : <ArchiveRestore size={14} />}
            {archiving ? 'משחזר...' : 'שחזור לבנק ספקים'}
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(isArchived ? '/suppliers/archive' : '/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: supplier.categoryColor + '15' }}>
            <CategoryIcon category={parseCategories(supplier.category)[0] || supplier.category} size={24} color={supplier.categoryColor} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] text-[#181510]" style={{ fontWeight: 700 }}>{supplier.name}</h1>
              <button
                onClick={() => {
                  editSupplierForm.reset({
                    name: supplier.name,
                    phone: supplier.phone || '',
                    category: supplier.category,
                    categoryColor: supplier.categoryColor,
                    region: supplier.region,
                    rating: String(supplier.rating),
                    verificationStatus: supplier.verificationStatus,
                    notes: supplier.notes || '',
                    icon: supplier.icon || '',
                  });
                  setSelectedCategories(parseCategories(supplier.category));
                  setShowEditSupplier(true);
                }}
                className="flex items-center gap-1 text-[12px] text-[#ff8c00] hover:text-[#e67e00] bg-[#ff8c00]/10 hover:bg-[#ff8c00]/20 px-2.5 py-1 rounded-lg transition-all"
                style={{ fontWeight: 600 }}
              >
                <Pencil size={12} /> עריכה
              </button>
              <span className={`flex items-center gap-1 text-[12px] px-2 py-0.5 rounded-full ${verifBg}`} style={{ fontWeight: 600 }}>
                <VerifIcon size={12} /> {statusLabel[supplier.verificationStatus]}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              {parseCategories(supplier.category).map(cat => {
                const opt = CATEGORY_OPTIONS.find(o => o.value === cat);
                const catColor = opt?.color || '#8d785e';
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: catColor + '15', color: catColor, fontWeight: 600 }}
                  >
                    <CategoryIcon category={cat} size={12} color={catColor} />
                    {cat}
                  </span>
                );
              })}
              <span className="text-[13px] text-[#8d785e]">&bull; {supplier.region}</span>
              {supplier.phone && <span className="text-[13px] text-[#8d785e]">&bull; {supplier.phone}</span>}
            </div>
          </div>
        </div>
        {!isArchived && (
          <button
            onClick={() => setShowArchiveConfirm(true)}
            className="flex items-center gap-1.5 text-[13px] text-[#8d785e] hover:text-[#181510] border border-[#e7e1da] hover:border-[#b8a990] px-3 py-2 rounded-xl transition-all"
            style={{ fontWeight: 500 }}
          >
            <Archive size={15} />
            העבר לארכיון
          </button>
        )}
      </div>

      {/* Auto-note badges + manual note — below supplier details */}
      {(() => {
        const autoNotes = computeAutoNotes(supplier, documents, contacts, products);
        const hasManual = supplier.notes && supplier.notes !== '-';
        if (autoNotes.length === 0 && !hasManual) return null;

        const NOTE_ICONS: Record<string, React.ElementType> = {
          'shield-alert': AlertTriangle,
          'file-warning': FileText,
          'alert-triangle': AlertTriangle,
          'clock': Clock,
          'file-x': FileText,
          'user-x': Users,
          'phone-off': Phone,
          'package-x': Package,
        };

        return (
          <div className="flex flex-col items-start gap-1.5 mb-5">
            {autoNotes.map(note => {
              const styles = noteLevelStyles(note.level);
              const NoteIcon = NOTE_ICONS[note.icon] || AlertTriangle;
              return (
                <span
                  key={note.id}
                  className={`inline-flex items-center gap-1.5 ${styles.bg} border ${styles.border} rounded-full px-2.5 py-1`}
                >
                  <NoteIcon size={12} className={styles.icon} />
                  <span className={`text-[11px] ${styles.text} whitespace-nowrap`} style={{ fontWeight: 500 }}>{note.text}</span>
                </span>
              );
            })}
            {hasManual && (
              <span className="inline-flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-2.5 py-1">
                <AlertTriangle size={12} className="text-yellow-600" />
                <span className="text-[11px] text-yellow-800 whitespace-nowrap" style={{ fontWeight: 500 }}>הערה: {supplier.notes}</span>
              </span>
            )}
          </div>
        );
      })()}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#ece8e3] rounded-lg p-1 overflow-x-auto">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-2 px-4 rounded-md text-[13px] transition-all ${
              activeTab === tab.id ? 'bg-white text-[#181510] shadow-sm' : 'text-[#8d785e] hover:text-[#181510]'
            }`}
            style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
          >
            {tab.id === 'docs' && documents.some(d => d.status === 'expired') && <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-1" />}
            {tab.label}
            {tab.id === 'contacts' && <span className="text-[10px] text-[#b8a990] mr-1">({contacts.length})</span>}
            {tab.id === 'products' && <span className="text-[10px] text-[#b8a990] mr-1">({products.length})</span>}
            {tab.id === 'docs' && <span className="text-[10px] text-[#b8a990] mr-1">({documents.length})</span>}
          </button>
        ))}
      </div>

      {/* ═══ Info Tab ═══ */}
      {activeTab === 'info' && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Contacts preview */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>אנשי קשר ({contacts.length})</h3>
                <button onClick={() => setActiveTab('contacts')} className="text-[12px] text-[#ff8c00]" style={{ fontWeight: 600 }}>צפה בכל →</button>
              </div>
              {contacts.length === 0 ? (
                <p className="text-[13px] text-[#b8a990] text-center py-4">אין אנשי קשר</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {contacts.slice(0, 2).map(contact => (
                    <div key={contact.id} className="border border-[#e7e1da] rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] text-white ${contact.primary ? 'bg-green-500' : 'bg-[#ff8c00]'}`} style={{ fontWeight: 600 }}>{getInitials(contact.name)}</div>
                        <div>
                          <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{contact.name}</div>
                          <div className="text-[11px] text-[#8d785e]">{contact.role}</div>
                        </div>
                        {contact.primary && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full mr-auto" style={{ fontWeight: 600 }}>ראשי</span>}
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[12px] text-[#8d785e]"><Phone size={12} /> {contact.phone}</div>
                        <div className="flex items-center gap-2 text-[12px] text-[#8d785e]"><Mail size={12} /> {contact.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Products preview */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>מוצרים ושירותים ({products.length})</h3>
                <button onClick={() => setActiveTab('products')} className="text-[12px] text-[#ff8c00]" style={{ fontWeight: 600 }}>צפה בכל →</button>
              </div>
              {products.length === 0 ? (
                <p className="text-[13px] text-[#b8a990] text-center py-4">אין מוצרים</p>
              ) : (
                <div className="grid sm:grid-cols-3 gap-3">
                  {products.slice(0, 3).map(product => {
                    const heroImg = product.images?.length ? product.images[0].url : null;
                    return (
                      <div
                        key={product.id}
                        onClick={() => setEditingProduct(product)}
                        className="border border-[#e7e1da] rounded-xl overflow-hidden hover:shadow-sm hover:border-[#ff8c00]/40 transition-all cursor-pointer group"
                      >
                        {/* Product image */}
                        {heroImg ? (
                          <div className="h-24 bg-[#f5f3f0] overflow-hidden relative">
                            <ImageWithFallback src={heroImg} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {(product.images?.length || 0) > 1 && (
                              <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <Camera size={9} /> {product.images!.length}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="h-16 bg-[#f5f3f0] flex items-center justify-center">
                            <Package size={20} className="text-[#d0c8bb]" />
                          </div>
                        )}
                        <div className="p-3">
                          <div className="text-[13px] text-[#181510] group-hover:text-[#ff8c00] transition-colors flex items-center gap-1" style={{ fontWeight: 600 }}>
                            {product.name}
                            <Pencil size={10} className="text-[#b8a990] group-hover:text-[#ff8c00] transition-colors" />
                          </div>
                          <div className="text-[11px] text-[#8d785e] mt-1 line-clamp-2">{product.description}</div>
                          <div className="mt-2 text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>₪{product.price.toLocaleString()}<span className="text-[11px] text-[#8d785e]" style={{ fontWeight: 400 }}>/{product.unit}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-5">
            {/* Rating */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <h3 className="text-[14px] text-[#181510] mb-3" style={{ fontWeight: 700 }}>דירוג</h3>
              <div className="flex items-center gap-2">
                <span className="text-[28px] text-[#181510]" style={{ fontWeight: 800 }}>{supplier.rating}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} className={`text-[18px] ${s <= supplier.rating ? 'text-[#ff8c00]' : 'text-[#ddd6cb]'}`}>★</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <SupplierLocationMap
              supplier={supplier}
              onUpdate={(updated) => setSupplier(updated)}
            />

            {/* Documents summary */}
            <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>מסמכים ותקינות</h3>
                <button onClick={() => setActiveTab('docs')} className="text-[11px] text-[#ff8c00]" style={{ fontWeight: 600 }}>ניהול →</button>
              </div>
              {(() => {
                const requiredNames = ['רישיון עסק', 'תעודת כשרות', "ביטוח צד ג'"];
                const getStatus = (expiry: string) => {
                  if (!expiry) return 'expired';
                  const exp = new Date(expiry);
                  const now = new Date();
                  if (exp < now) return 'expired';
                  const diff = exp.getTime() - now.getTime();
                  if (diff / (1000 * 60 * 60 * 24) < 60) return 'warning';
                  return 'valid';
                };
                return (
                  <div className="space-y-2">
                    {requiredNames.map(name => {
                      const doc = documents.find(d => d.name === name);
                      const status = doc ? getStatus(doc.expiry) : null;
                      return (
                        <div key={name} className={`flex items-center justify-between p-2.5 rounded-lg border ${
                          !doc ? 'bg-[#f8f7f5] border-dashed border-[#d4cdc3]' :
                          status === 'expired' ? 'bg-red-50 border-red-200' :
                          status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-green-50 border-green-200'
                        }`}>
                          <div className="flex items-center gap-2">
                            {!doc ? <Upload size={13} className="text-[#b8a990]" /> :
                             status === 'valid' ? <CheckCircle size={13} className="text-green-500" /> :
                             status === 'warning' ? <AlertTriangle size={13} className="text-yellow-500" /> :
                             <AlertTriangle size={13} className="text-red-500" />}
                            <span className="text-[12px] text-[#181510]" style={{ fontWeight: 500 }}>{name}</span>
                          </div>
                          {doc ? (
                            <span className={`text-[10px] ${status === 'expired' ? 'text-red-500' : status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} style={{ fontWeight: 600 }}>
                              {new Date(doc.expiry).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#b8a990]" style={{ fontWeight: 600 }}>חסר</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Contacts Tab ═══ */}
      {activeTab === 'contacts' && (
        <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>אנשי קשר ({contacts.length})</h3>
            <button onClick={() => setShowAddContact(true)} className="text-[13px] text-[#ff8c00] flex items-center gap-1" style={{ fontWeight: 600 }}><Plus size={14} /> הוספת איש קשר</button>
          </div>
          {contacts.length === 0 ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-2"><Users size={32} className="text-[#d0c8bb]" /></div>
              <p className="text-[14px] text-[#8d785e]">אין אנשי קשר</p>
              <button onClick={() => setShowAddContact(true)} className="mt-2 text-[13px] text-[#ff8c00]" style={{ fontWeight: 600 }}>הוסף איש קשר ראשון</button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-4 border border-[#e7e1da] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] text-white ${contact.primary ? 'bg-green-500' : 'bg-[#ff8c00]'}`} style={{ fontWeight: 600 }}>{getInitials(contact.name)}</div>
                    <div>
                      <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>
                        {contact.name}
                        {contact.primary && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full mr-2" style={{ fontWeight: 600 }}>ראשי</span>}
                      </div>
                      <div className="text-[12px] text-[#8d785e]">{contact.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-[12px] text-[#8d785e]">
                      <span className="flex items-center gap-1"><Phone size={12} />{contact.phone}</span>
                      <span className="flex items-center gap-1"><Mail size={12} />{contact.email}</span>
                    </div>
                    <button onClick={() => requestDelete({ title: 'מחיקת איש קשר', itemName: contact.name, onConfirm: () => deleteContact(contact.id) })} className="text-[#c4b89a] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ Products Tab ═══ */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border border-[#e7e1da] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>מוצרים ושירותים ({products.length})</h3>
            <button onClick={() => setShowAddProduct(true)} className="text-[13px] text-[#ff8c00] flex items-center gap-1" style={{ fontWeight: 600 }}><Plus size={14} /> הוספת מוצר</button>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-10">
              <div className="flex justify-center mb-2"><Package size={32} className="text-[#d0c8bb]" /></div>
              <p className="text-[14px] text-[#8d785e]">אין מוצרים</p>
              <button onClick={() => setShowAddProduct(true)} className="mt-2 text-[13px] text-[#ff8c00]" style={{ fontWeight: 600 }}>הוסף מוצר ראשון</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-4">
              {products.map(product => {
                const imageCount = product.images?.length || 0;
                const heroImg = imageCount > 0 ? product.images![0].url : VINEYARD_IMG;
                return (
                  <div
                    key={product.id}
                    onClick={() => setEditingProduct(product)}
                    className="border border-[#e7e1da] rounded-xl overflow-hidden hover:shadow-lg hover:border-[#ff8c00]/40 transition-all group relative cursor-pointer"
                  >
                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); requestDelete({ title: 'מחיקת מוצר', itemName: product.name, onConfirm: () => deleteProduct(product.id) }); }}
                      className="absolute top-2 left-2 z-10 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-[#c4b89a] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    >
                      <Trash2 size={12} />
                    </button>

                    {/* Edit badge */}
                    <div className="absolute top-2 right-2 z-10 bg-[#ff8c00] text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm" style={{ fontWeight: 600 }}>
                      <Pencil size={10} /> עריכה
                    </div>

                    {/* Image */}
                    <div className="h-32 bg-[#f5f3f0] flex items-center justify-center relative overflow-hidden">
                      <ImageWithFallback src={heroImg} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {/* Image count */}
                      {imageCount > 1 && (
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Camera size={10} /> {imageCount}
                        </span>
                      )}
                      {/* Price tag */}
                      <span className="absolute bottom-2 left-2 text-[12px] bg-white/90 backdrop-blur-sm text-[#181510] px-2 py-0.5 rounded-md shadow-sm" style={{ fontWeight: 700 }}>
                        ₪{product.price.toLocaleString()}/{product.unit}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="text-[14px] text-[#181510] group-hover:text-[#ff8c00] transition-colors" style={{ fontWeight: 600 }}>{product.name}</div>
                      <div className="text-[12px] text-[#8d785e] mt-1 line-clamp-2">{product.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ Docs Tab ═══ */}
      {activeTab === 'docs' && (() => {
        const REQUIRED_DOCS = [
          { key: 'רישיון עסק', shieldIcon: ShieldCheck },
          { key: 'תעודת כשרות', shieldIcon: ShieldCheck },
          { key: "ביטוח צד ג'", shieldIcon: Shield },
        ] as const;

        const getDocStatus = (expiry: string): 'valid' | 'warning' | 'expired' => {
          if (!expiry) return 'expired';
          const exp = new Date(expiry);
          const now = new Date();
          if (exp < now) return 'expired';
          const diff = exp.getTime() - now.getTime();
          if (diff / (1000 * 60 * 60 * 24) < 60) return 'warning';
          return 'valid';
        };

        const formatExpiryDate = (dateStr: string) => {
          if (!dateStr) return '';
          const d = new Date(dateStr);
          return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };

        const handleUploadDoc = async (docName: string, expiryDate: string, fileName: string) => {
          if (!id || !expiryDate) return;
          try {
            setDocSaving(docName);
            const status = getDocStatus(expiryDate);
            const existing = documents.find(d => d.name === docName);
            if (existing) {
              const updated = await supplierDocumentsApi.update(id, existing.id, { expiry: expiryDate, status, fileName });
              setDocuments(prev => prev.map(d => d.id === existing.id ? updated : d));
            } else {
              const newDoc = await supplierDocumentsApi.create(id, { name: docName, expiry: expiryDate, status, fileName });
              setDocuments(prev => [...prev, newDoc]);
            }
            appToast.success('מסמך הועלה בהצלחה', `${docName} נשמר עם תוקף ${formatExpiryDate(expiryDate)}`);
          } catch (err) {
            console.error('[SupplierDetail] doc upload error:', err);
            appToast.error('שגיאה בשמירת מסמך');
          } finally { setDocSaving(null); }
        };

        return (
          <div className="bg-white rounded-xl border border-[#e7e1da] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>מסמכים ותקינות</h3>
              <button onClick={() => setActiveTab('docs')} className="w-9 h-9 rounded-lg bg-[#f5f3f0] hover:bg-[#ece8e3] flex items-center justify-center transition-colors" title="העלאה">
                <Upload size={16} className="text-[#8d785e]" />
              </button>
            </div>

            <div className="space-y-4">
              {REQUIRED_DOCS.map(({ key: docName, shieldIcon: ShieldIcon }) => {
                const doc = documents.find(d => d.name === docName);
                const hasDoc = !!doc;
                const status = hasDoc ? getDocStatus(doc.expiry) : null;
                const isExpired = status === 'expired';
                const isWarning = status === 'warning';
                const isValid = status === 'valid';
                const isEditing = docExpiryEditing === docName;
                const isSaving = docSaving === docName;

                return (
                  <div key={docName}>
                    <div
                      className={`relative rounded-2xl border-2 p-5 transition-all ${
                        !hasDoc ? 'border-dashed border-[#d4cdc3] bg-[#faf9f7] hover:border-[#ff8c00]/40 hover:bg-[#fffaf3] cursor-pointer' :
                        isExpired ? 'border-red-200 bg-gradient-to-l from-red-50 to-red-50/30' :
                        isWarning ? 'border-yellow-200 bg-gradient-to-l from-yellow-50 to-yellow-50/30' :
                        'border-green-200 bg-gradient-to-l from-green-50 to-green-50/30'
                      }`}
                      onClick={() => { if (!hasDoc && !isEditing) { setDocExpiryEditing(docName); setDocExpiryValue(''); } }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            !hasDoc ? 'bg-[#ece8e3]' : isExpired ? 'bg-red-100' : isWarning ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            {!hasDoc ? <Upload size={18} className="text-[#8d785e]" /> :
                             isExpired ? <AlertTriangle size={18} className="text-red-500" /> :
                             <CheckCircle size={18} className={isWarning ? 'text-yellow-500' : 'text-green-600'} />}
                          </div>
                          <div>
                            <div className="text-[16px] text-[#181510]" style={{ fontWeight: 700 }}>{docName}</div>
                            {hasDoc ? (
                              <div className={`text-[13px] mt-0.5 ${isExpired ? 'text-red-500' : isWarning ? 'text-yellow-600' : 'text-green-600'}`} style={{ fontWeight: 500 }}>
                                {isExpired ? `פג תוקף ב-${formatExpiryDate(doc.expiry)}` : `בתוקף עד: ${formatExpiryDate(doc.expiry)}`}
                              </div>
                            ) : (
                              <div className="text-[13px] text-[#b8a990] mt-0.5">לא הועלה — לחץ להעלאה</div>
                            )}
                          </div>
                        </div>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          !hasDoc ? 'bg-[#ece8e3]' : isExpired ? 'bg-red-100' : isWarning ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          {!hasDoc ? <Shield size={22} className="text-[#b8a990]" /> :
                           isExpired ? <ShieldAlert size={22} className="text-red-500" /> :
                           <ShieldIcon size={22} className={isWarning ? 'text-yellow-500' : 'text-green-600'} />}
                        </div>
                      </div>
                      {hasDoc && doc.fileName && (
                        <div className="flex items-center gap-2 mt-3 mr-14">
                          <FileText size={12} className="text-[#8d785e]" />
                          <span className="text-[11px] text-[#8d785e]">{doc.fileName}</span>
                        </div>
                      )}
                      {hasDoc && !isEditing && (
                        <div className="flex items-center gap-2 mt-3 mr-14">
                          <button onClick={(e) => { e.stopPropagation(); setDocExpiryEditing(docName); setDocExpiryValue(doc.expiry); }} className="text-[11px] text-[#ff8c00] hover:text-[#e67e00] transition-colors flex items-center gap-1" style={{ fontWeight: 600 }}>
                            <CalendarDays size={12} /> עדכן תוקף
                          </button>
                          <span className="text-[#e7e1da]">|</span>
                          <label className="text-[11px] text-[#ff8c00] hover:text-[#e67e00] transition-colors flex items-center gap-1 cursor-pointer" style={{ fontWeight: 600 }}>
                            <Upload size={12} /> החלף קובץ
                            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleUploadDoc(docName, doc.expiry, file.name); e.target.value = ''; }} />
                          </label>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="mt-3 bg-[#f8f7f5] border border-[#e7e1da] rounded-xl p-4 space-y-3">
                        <div className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>
                          {hasDoc ? `עדכון תוקף — ${docName}` : `העלאת ${docName}`}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[12px] text-[#8d785e] mb-1" style={{ fontWeight: 600 }}>תאריך תוקף</label>
                            <input type="date" value={docExpiryValue} onChange={(e) => setDocExpiryValue(e.target.value)} className="w-full bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5 text-[13px] text-[#181510] focus:outline-none focus:border-[#ff8c00] focus:ring-2 focus:ring-[#ff8c00]/10 transition-all" />
                          </div>
                          {!hasDoc && (
                            <div>
                              <label className="block text-[12px] text-[#8d785e] mb-1" style={{ fontWeight: 600 }}>קובץ מסמך</label>
                              <label className="flex items-center gap-2 bg-white border border-[#e7e1da] hover:border-[#ff8c00]/40 rounded-lg px-3 py-2.5 cursor-pointer transition-colors">
                                <Upload size={14} className="text-[#8d785e]" />
                                <span className="text-[13px] text-[#8d785e]">בחר קובץ...</span>
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file && docExpiryValue) { handleUploadDoc(docName, docExpiryValue, file.name); setDocExpiryEditing(null); setDocExpiryValue(''); } else if (file && !docExpiryValue) { appToast.warning('נא לבחור תאריך תוקף לפני העלאה'); } e.target.value = ''; }} />
                              </label>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {hasDoc && (
                            <button
                              onClick={() => { if (docExpiryValue) { handleUploadDoc(docName, docExpiryValue, doc.fileName || ''); setDocExpiryEditing(null); setDocExpiryValue(''); } }}
                              disabled={!docExpiryValue || isSaving}
                              className="text-[12px] text-white bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                              style={{ fontWeight: 600 }}
                            >
                              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                              {isSaving ? 'שומר...' : 'שמור'}
                            </button>
                          )}
                          <button onClick={() => { setDocExpiryEditing(null); setDocExpiryValue(''); }} className="text-[12px] text-[#8d785e] hover:text-[#181510] px-3 py-2 rounded-lg transition-colors" style={{ fontWeight: 600 }}>
                            ביטול
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {documents.filter(d => !['רישיון עסק', 'תעודת כשרות', "ביטוח צד ג'"].includes(d.name)).length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#e7e1da]">
                <h4 className="text-[14px] text-[#181510] mb-3" style={{ fontWeight: 600 }}>מסמכים נוספים</h4>
                <div className="space-y-2">
                  {documents.filter(d => !['רישיון עסק', 'תעודת כשרות', "ביטוח צד ג'"].includes(d.name)).map(doc => (
                    <div key={doc.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                      doc.status === 'expired' ? 'bg-red-50 border-red-200' :
                      doc.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <FileText size={15} className={doc.status === 'expired' ? 'text-red-500' : doc.status === 'warning' ? 'text-yellow-500' : 'text-green-500'} />
                        <span className="text-[13px] text-[#181510]" style={{ fontWeight: 500 }}>{doc.name}</span>
                      </div>
                      <span className={`text-[12px] ${doc.status === 'expired' ? 'text-red-500' : doc.status === 'warning' ? 'text-yellow-600' : 'text-green-600'}`} style={{ fontWeight: 600 }}>
                        {formatExpiryDate(doc.expiry)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ═══ Add Contact Modal ═══ */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddContact(false); contactForm.reset(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>הוספת איש קשר</h3>
              <button onClick={() => { setShowAddContact(false); contactForm.reset(); }} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <form onSubmit={contactForm.handleSubmit(onAddContact)} className="space-y-3">
              <FormField label="שם מלא" placeholder="שם מלא" required error={contactForm.formState.errors.contactName} isDirty={contactForm.formState.dirtyFields.contactName} {...contactForm.register('contactName', rules.requiredMin('שם', 2))} />
              <FormField label="תפקיד" placeholder="תפקיד" required error={contactForm.formState.errors.contactRole} isDirty={contactForm.formState.dirtyFields.contactRole} {...contactForm.register('contactRole', rules.required('תפקיד'))} />
              <FormField label="טלפון" placeholder="05X-XXXXXXX" error={contactForm.formState.errors.contactPhone} isDirty={contactForm.formState.dirtyFields.contactPhone} {...contactForm.register('contactPhone', rules.israeliPhone(true))} />
              <FormField label="אימייל" placeholder="email@example.com" error={contactForm.formState.errors.contactEmail} isDirty={contactForm.formState.dirtyFields.contactEmail} {...contactForm.register('contactEmail', rules.email(true))} />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || !contactForm.formState.isValid} className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? 'שומר...' : 'הוסף'}
                </button>
                <button type="button" onClick={() => { setShowAddContact(false); contactForm.reset(); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Add Product Modal ═══ */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddProduct(false); productForm.reset(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>הוספת מוצר / שירות</h3>
              <button onClick={() => { setShowAddProduct(false); productForm.reset(); }} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <form onSubmit={productForm.handleSubmit(onAddProduct)} className="space-y-3">
              <FormField label="שם מוצר" placeholder="למשל: סיור מודרך" required error={productForm.formState.errors.productName} isDirty={productForm.formState.dirtyFields.productName} {...productForm.register('productName', rules.requiredMin('שם מוצר', 2))} />
              <div className="grid grid-cols-2 gap-3">
                <FormField label="מחיר" type="number" placeholder="₪" required error={productForm.formState.errors.productPrice} isDirty={productForm.formState.dirtyFields.productPrice} {...productForm.register('productPrice', rules.positivePrice('מחיר'))} />
                <FormField label="יחידה" placeholder="אדם / אירוע / יום" error={productForm.formState.errors.productUnit} isDirty={productForm.formState.dirtyFields.productUnit} {...productForm.register('productUnit')} />
              </div>
              <FormField label="תיאור" placeholder="פרטים נוספים..." error={productForm.formState.errors.productDescription} isDirty={productForm.formState.dirtyFields.productDescription} {...productForm.register('productDescription')} />
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving || !productForm.formState.isValid} className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}>
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? 'שומר...' : 'הוסף מוצר'}
                </button>
                <button type="button" onClick={() => { setShowAddProduct(false); productForm.reset(); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Product Editor Drawer ═══ */}
      {editingProduct && id && (
        <ProductEditor
          product={editingProduct}
          supplierId={id}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleProductUpdate}
        />
      )}

      {/* ═══ Archive Confirm Modal ═══ */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowArchiveConfirm(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>העברה לארכיון</h3>
              <button onClick={() => { setShowArchiveConfirm(false); }} className="text-[#8d785e] hover:text-[#181510]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <p className="text-[14px] text-[#8d785e]">האם אתה בטוח שברצונך להעביר את הספק <strong className="text-[#181510]">{supplier?.name}</strong> לארכיון? הספק לא יופיע יותר בבנק הספקים, אך ניתן יהיה לשחזר אותו מעמוד הארכיון.</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={archiveSupplier}
                  disabled={archiving}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2" style={{ fontWeight: 600 }}
                >
                  {archiving ? <Loader2 size={16} className="animate-spin" /> : <Archive size={16} />}
                  {archiving ? 'מעביר...' : 'העבר לארכיון'}
                </button>
                <button type="button" onClick={() => { setShowArchiveConfirm(false); }} className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors">ביטול</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Edit Supplier Modal ═══ */}
      {showEditSupplier && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowEditSupplier(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" dir="rtl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff8c00]/10 flex items-center justify-center">
                  <Pencil size={18} className="text-[#ff8c00]" />
                </div>
                <div>
                  <h3 className="text-[20px] text-[#181510]" style={{ fontWeight: 700 }}>עריכת פרטי ספק</h3>
                  <p className="text-[12px] text-[#8d785e]">עדכון פרטים בסיסיים של הספק</p>
                </div>
              </div>
              <button onClick={() => setShowEditSupplier(false)} className="text-[#8d785e] hover:text-[#181510] transition-colors"><X size={20} /></button>
            </div>
            <form
              onSubmit={editSupplierForm.handleSubmit(async (data: EditSupplierForm) => {
                if (!id || selectedCategories.length === 0) return;
                try {
                  setSavingSupplier(true);
                  const categoryStr = selectedCategories.join(',');
                  const primaryCat = CATEGORY_OPTIONS.find(c => c.value === selectedCategories[0]);
                  const updated = await suppliersApi.update(id, {
                    name: data.name.trim(),
                    phone: data.phone.trim(),
                    category: categoryStr,
                    categoryColor: primaryCat?.color || data.categoryColor,
                    region: data.region,
                    rating: parseFloat(data.rating) || supplier!.rating,
                    verificationStatus: data.verificationStatus as Supplier['verificationStatus'],
                    notes: data.notes.trim() || '-',
                    icon: selectedCategories[0] || data.icon,
                  });
                  setSupplier(updated);
                  setShowEditSupplier(false);
                  appToast.success('פרטי ספק עודכנו', `${data.name} נשמר בהצלחה`);
                } catch (err) {
                  console.error('[SupplierDetail] update supplier error:', err);
                  appToast.error('שגיאה בעדכון פרטי ספק');
                } finally { setSavingSupplier(false); }
              })}
              className="space-y-4"
            >
              <FormField
                label="שם הספק"
                placeholder="שם הספק"
                required
                error={editSupplierForm.formState.errors.name}
                isDirty={editSupplierForm.formState.dirtyFields.name}
                {...editSupplierForm.register('name', rules.requiredMin('שם ספק', 2))}
              />

              <FormField
                label="טלפון"
                placeholder="מספר טלפון"
                error={editSupplierForm.formState.errors.phone}
                isDirty={editSupplierForm.formState.dirtyFields.phone}
                {...editSupplierForm.register('phone')}
              />

              {/* קטגוריות — multi-select */}
              <div>
                <label className="text-[13px] text-[#8d785e] mb-2 block" style={{ fontWeight: 600 }}>
                  קטגוריות <span className="text-[#ff8c00]">*</span>
                  {selectedCategories.length > 0 && (
                    <span className="text-[11px] text-[#b5a48b] mr-1" style={{ fontWeight: 400 }}>({selectedCategories.length} נבחרו)</span>
                  )}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map(opt => {
                    const isSelected = selectedCategories.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSelectedCategories(prev =>
                            prev.includes(opt.value)
                              ? prev.filter(c => c !== opt.value)
                              : [...prev, opt.value]
                          );
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[12px] transition-all ${
                          isSelected
                            ? 'border-[#ff8c00] bg-[#ff8c00]/10 shadow-sm'
                            : 'border-[#e7e1da] bg-white hover:border-[#d5cdc0] hover:bg-[#faf9f7]'
                        }`}
                        style={{ fontWeight: isSelected ? 600 : 400 }}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                            isSelected
                              ? 'bg-[#ff8c00] border-[#ff8c00]'
                              : 'border-[#d5cdc0] bg-white'
                          }`}
                        >
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5L4.2 7.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <CategoryIcon category={opt.value} size={16} color={isSelected ? opt.color : '#8d785e'} />
                        <span className={isSelected ? 'text-[#181510]' : 'text-[#6b5d45]'}>{opt.value}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-[11px] text-red-500 mt-1">יש לבחור לפחות קטגוריה אחת</p>
                )}
              </div>

              <FormSelect
                label="אזור"
                error={editSupplierForm.formState.errors.region}
                isDirty={editSupplierForm.formState.dirtyFields.region}
                {...editSupplierForm.register('region', { required: 'אזור הוא שדה חובה' })}
              >
                {REGION_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </FormSelect>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] text-[#8d785e] mb-1 block" style={{ fontWeight: 600 }}>דירוג</label>
                  <div className="flex items-center gap-1 bg-white border border-[#e7e1da] rounded-lg px-3 py-2.5">
                    {[1, 2, 3, 4, 5].map(star => {
                      const currentRating = parseFloat(editSupplierForm.watch('rating') || '0');
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => editSupplierForm.setValue('rating', String(star), { shouldDirty: true })}
                          className={`text-[22px] transition-colors ${star <= currentRating ? 'text-[#ff8c00]' : 'text-[#ddd6cb] hover:text-[#ff8c00]/50'}`}
                        >
                          ★
                        </button>
                      );
                    })}
                  </div>
                </div>

                <FormSelect
                  label="סטטוס אימות"
                  error={editSupplierForm.formState.errors.verificationStatus}
                  isDirty={editSupplierForm.formState.dirtyFields.verificationStatus}
                  {...editSupplierForm.register('verificationStatus')}
                >
                  <option value="verified">מאומת</option>
                  <option value="pending">ממתין לאימות</option>
                  <option value="unverified">לא מאומת</option>
                </FormSelect>
              </div>

              <FormTextarea
                label="הערות"
                placeholder="הערות נוספות..."
                rows={3}
                error={editSupplierForm.formState.errors.notes}
                isDirty={editSupplierForm.formState.dirtyFields.notes}
                {...editSupplierForm.register('notes')}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={savingSupplier || !editSupplierForm.formState.isValid || selectedCategories.length === 0}
                  className="flex-1 bg-[#ff8c00] hover:bg-[#e67e00] disabled:opacity-50 text-white py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  {savingSupplier ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {savingSupplier ? 'שומר...' : 'שמור שינויים'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditSupplier(false)}
                  className="px-5 border border-[#e7e1da] rounded-xl hover:bg-[#f5f3f0] transition-colors text-[14px] text-[#8d785e]"
                  style={{ fontWeight: 500 }}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteModal}
    </div>
  );
}