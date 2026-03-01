import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, Check, Edit2, Trash2, ExternalLink, AlertTriangle, X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { appToast } from './AppToast';

const DRILL_IMG = 'https://images.unsplash.com/photo-1770763233593-74dfd0da7bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGRyaWxsJTIwY29uc3RydWN0aW9uJTIwdG9vbHxlbnwxfHx8fDE3NzE0NjgyMzh8MA&ixlib=rb-4.1.0&q=80&w=1080';
const CABINET_IMG = 'https://images.unsplash.com/photo-1755870190789-113202c5096c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBzdG9yYWdlJTIwY2FiaW5ldCUyMHdvcmtzaG9wfGVufDF8fHx8MTc3MTQ2ODIzOHww&ixlib=rb-4.1.0&q=80&w=1080';
const HOTEL_IMG = 'https://images.unsplash.com/photo-1708107243243-557a2cad3cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGxvYmJ5JTIwbHV4dXJ5JTIwcmVjZXB0aW9ufGVufDF8fHx8MTc3MTQ2ODI0M3ww&ixlib=rb-4.1.0&q=80&w=1080';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sourceUrl: string;
  status: 'complete' | 'incomplete';
  image: string;
  approved?: boolean;
  removed?: boolean;
}

export function ScannedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'מקדחה חשמלית 18V - Brushless',
      description: 'מקדחות אימפקט מקצועית מסדרת ה-XR, מנוע ללא פחמים לאורך חיים ממושך. כולל 2 סוללות 5.0Ah ומטען מהיר במזוודה קשיחה.',
      price: 849.00,
      category: 'כלי עבודה חשמליים',
      sourceUrl: 'https://supplier-site.com/tools/drill-v18',
      status: 'complete',
      image: DRILL_IMG,
    },
    {
      id: '2',
      name: 'ארון כלים מודולרי 7 מגירות',
      description: 'מערכת אחסון מקצועית למוסכים ומדראות. עשוי פלדה עמידה עם ציפוי נגד חלודה, גלגלים מחוזקים עם נעילה ומכנגנון מגיעת פתיחה כפולה.',
      price: 1250.00,
      category: 'אחסון ומדפים',
      sourceUrl: 'https://supplier-site.com/storage/cabinet-7drw',
      status: 'complete',
      image: CABINET_IMG,
    },
    {
      id: '3',
      name: 'ערכת בטיחות "SafeWork"',
      description: 'המוצר לא הצליח להמיר תיאור מלא מהדף. מומלץ לגשת לקישור המקור ולהוסיף תיאור ידנית.',
      price: 0,
      category: '',
      sourceUrl: 'https://supplier-site.com/p/safety-kit-2024',
      status: 'incomplete',
      image: HOTEL_IMG,
    },
  ]);

  const approveProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, approved: true } : p));
    appToast.success('המוצר אושר והוסף לקטלוג');
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, removed: true } : p));
    appToast.neutral('המוצר הוסר מהרשימה');
  };

  const activeProducts = products.filter(p => !p.removed);
  const approvedCount = activeProducts.filter(p => p.approved).length;
  const incompleteCount = activeProducts.filter(p => p.status === 'incomplete').length;

  return (
    <div className="min-h-full bg-[#f8f7f5] font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-[#e7e1da] px-4 lg:px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ff8c00]/10 rounded-lg flex items-center justify-center">
              <span className="text-[16px]">🔍</span>
            </div>
            <h1 className="text-[22px] text-[#181510]" style={{ fontWeight: 700 }}>ניהול ספקים</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto p-4 lg:p-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <span className="text-[12px] text-green-600 bg-green-50 px-3 py-1 rounded-full" style={{ fontWeight: 600 }}>✨ סריקה אוטומטית הושלמה</span>
          <h2 className="text-[26px] text-[#181510] mt-3" style={{ fontWeight: 700 }}>מוצרים מוצעים מסריקת אתר</h2>
          <p className="text-[14px] text-[#8d785e] mt-1 max-w-xl mx-auto">
            האלגוריתם שלנו זיהה מוצרים חדשים באתר הספק. באפשרותך לאשר אותם להוספה לקטלוג, לערוך את הפרטים או להסיר פריטים שאינם רלוונטיים.
          </p>
        </div>

        {/* Products */}
        <div className="space-y-5">
          {activeProducts.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                product.approved ? 'border-green-200' :
                product.status === 'incomplete' ? 'border-yellow-200' :
                'border-[#e7e1da]'
              }`}
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-72 h-48 md:h-auto bg-[#f5f3f0] relative shrink-0 overflow-hidden">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.status === 'complete' && !product.approved && (
                    <span className="absolute top-3 right-3 text-[11px] bg-[#ff8c00] text-white px-2 py-0.5 rounded-md" style={{ fontWeight: 600 }}>✓ אימות בוצע</span>
                  )}
                  {product.status === 'incomplete' && (
                    <span className="absolute top-3 right-3 text-[11px] bg-yellow-500 text-white px-2 py-0.5 rounded-md" style={{ fontWeight: 600 }}>⚠ נדרש אימות</span>
                  )}
                  {product.approved && (
                    <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
                      <div className="bg-green-500 text-white rounded-full p-2"><Check size={24} /></div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[11px] text-[#8d785e] mb-0.5">שם מוצר שזוהה</div>
                      <h3 className="text-[18px] text-[#181510]" style={{ fontWeight: 700 }}>{product.name}</h3>
                    </div>
                    <div className="text-left">
                      <div className="text-[11px] text-[#8d785e] mb-0.5">הערכת מחיר</div>
                      <div className="text-[20px] text-[#ff8c00]" style={{ fontWeight: 700 }}>
                        {product.price > 0 ? `₪${product.price.toFixed(2)}` : '₪ ???'}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-[11px] text-[#8d785e] mb-0.5">תיאור מוצר</div>
                    <p className="text-[13px] text-[#6b5d45]">{product.description}</p>
                  </div>

                  {product.category && (
                    <div className="text-[12px] text-[#8d785e] mb-2">
                      <span>🏷️ {product.category}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[12px] text-[#ff8c00] hover:text-[#e67e00]">
                      🔗 {product.sourceUrl}
                    </a>
                    <span className="text-[12px] text-[#c4b89a]">|</span>
                    <span className="text-[12px] text-[#8d785e]">🔒 פרטנות אחסון</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {!product.approved && product.status === 'complete' && (
                      <>
                        <button
                          onClick={() => approveProduct(product.id)}
                          className="flex items-center gap-1.5 text-[13px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-4 py-2 rounded-lg transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          <Check size={14} /> אישור מוצר
                        </button>
                        <button className="flex items-center gap-1.5 text-[13px] text-[#ff8c00] border border-[#ff8c00] px-4 py-2 rounded-lg hover:bg-[#ff8c00]/5 transition-colors" style={{ fontWeight: 600 }}>
                          <Edit2 size={14} /> עריכת פרטים
                        </button>
                      </>
                    )}
                    {product.status === 'incomplete' && (
                      <button className="flex items-center gap-1.5 text-[13px] text-[#ff8c00] border border-[#ff8c00] px-4 py-2 rounded-lg hover:bg-[#ff8c00]/5 transition-colors" style={{ fontWeight: 600 }}>
                        <Edit2 size={14} /> השלמת פרטים חסרים
                      </button>
                    )}
                    {product.approved && (
                      <span className="text-[13px] text-green-600 flex items-center gap-1" style={{ fontWeight: 600 }}>
                        <Check size={14} /> אושר והוסף לקטלוג
                      </span>
                    )}
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="flex items-center gap-1.5 text-[13px] text-[#8d785e] hover:text-red-500 px-3 py-2 rounded-lg transition-colors"
                    >
                      הסרה
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="bg-white rounded-xl border border-[#e7e1da] p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[14px]">📊</span>
            <div className="text-[14px] text-[#181510]" style={{ fontWeight: 700 }}>סיכום סריקה</div>
            <span className="text-[12px] text-[#8d785e]">{activeProducts.length} מוצרים נמצאו &bull; {approvedCount} אושרו &bull; {incompleteCount} דורשים השלמה</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/suppliers')} className="text-[13px] text-[#8d785e] border border-[#e7e1da] px-4 py-2 rounded-lg hover:bg-[#f5f3f0] transition-colors">סגירה</button>
            <button
              onClick={() => { appToast.success('הسكירה הושלמה בהצלחה!', 'כל המוצרים עודכנו בקטלוג'); navigate('/suppliers'); }}
              className="text-[13px] text-white bg-[#ff8c00] hover:bg-[#e67e00] px-4 py-2 rounded-lg transition-colors"
              style={{ fontWeight: 600 }}
            >
              אישור וסיום סקירה
            </button>
          </div>
        </div>

        <div className="text-center text-[12px] text-[#8d785e] py-4">
          מערכת ניהול ספקים חכמה © 2024 &bull; הופעל על ידי בינה מלאכותית
        </div>
      </div>
    </div>
  );
}