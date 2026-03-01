import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight, Archive, ArchiveRestore, Search, Loader2, AlertTriangle, Star, Eye
} from 'lucide-react';
import type { Supplier } from './data';
import { suppliersApi } from './api';
import { appToast } from './AppToast';

export function SupplierArchive() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchArchived = async () => {
    try {
      setLoading(true);
      const all = await suppliersApi.list();
      setSuppliers(all.filter(s => s.category === 'ארכיון'));
    } catch (err) {
      console.error('[SupplierArchive] Failed to load:', err);
      appToast.error('שגיאה בטעינת ספקים מאורכנים');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchived();
  }, []);

  const restoreSupplier = async (supplier: Supplier) => {
    try {
      setRestoringId(supplier.id);
      // Restore to default category 'כללי'
      await suppliersApi.update(supplier.id, { category: 'כללי', categoryColor: '#8d785e' });
      setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
      appToast.success('הספק שוחזר בהצלחה', `${supplier.name} חזר לבנק הספקים`);
    } catch (err) {
      console.error('[SupplierArchive] Failed to restore:', err);
      appToast.error('שגיאה בשחזור ספק');
    } finally {
      setRestoringId(null);
    }
  };

  const filtered = suppliers.filter(s =>
    !search || s.name.includes(search) || s.region.includes(search)
  );

  return (
    <div className="p-4 lg:p-6 mx-auto font-['Assistant',sans-serif]" dir="rtl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/suppliers')} className="text-[#8d785e] hover:text-[#181510] transition-colors">
            <ArrowRight size={20} />
          </button>
          <div className="w-10 h-10 bg-[#94a3b8]/10 rounded-xl flex items-center justify-center">
            <Archive size={20} className="text-[#94a3b8]" />
          </div>
          <div>
            <h1 className="text-[26px] text-[#181510]" style={{ fontWeight: 700 }}>ארכיון ספקים</h1>
            <p className="text-[13px] text-[#8d785e]">{suppliers.length} ספקים בארכיון</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8d785e]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e7e1da] rounded-xl pr-10 pl-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#ff8c00]/30 focus:border-[#ff8c00] transition-all"
          placeholder="חיפוש בארכיון..."
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e7e1da]">
          <Loader2 size={32} className="animate-spin text-[#ff8c00] mb-3" />
          <p className="text-[14px] text-[#8d785e]">טוען ארכיון...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#e7e1da]">
          <Archive size={48} className="text-[#d0c8bb] mb-4" />
          <p className="text-[18px] text-[#181510] mb-1" style={{ fontWeight: 600 }}>
            {suppliers.length === 0 ? 'הארכיון ריק' : 'לא נמצאו תוצאות'}
          </p>
          <p className="text-[13px] text-[#8d785e] mb-4">
            {suppliers.length === 0 ? 'ספקים שיועברו לארכיון יופיעו כאן' : 'נסה מילות חיפוש אחרות'}
          </p>
          <button
            onClick={() => navigate('/suppliers')}
            className="text-[13px] text-[#ff8c00] hover:text-[#e67e00] transition-colors"
            style={{ fontWeight: 600 }}
          >
            חזור לבנק ספקים
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e7e1da] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f5f3f0] border-b border-[#e7e1da]">
                  {['ספק', 'אזור', 'דירוג', 'טלפון', 'פעולות'].map(h => (
                    <th key={h} className="p-3 text-right text-[12px] text-[#8d785e] whitespace-nowrap" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-[#ece8e3] hover:bg-[#f5f3f0]/50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#94a3b8]/10 flex items-center justify-center text-[16px]">
                          {supplier.icon}
                        </div>
                        <div>
                          <div className="text-[14px] text-[#181510]" style={{ fontWeight: 600 }}>{supplier.name}</div>
                          <div className="text-[11px] text-[#8d785e]">{supplier.notes !== '-' ? supplier.notes : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[13px] text-[#6b5d45]">{supplier.region}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] text-[#181510]" style={{ fontWeight: 600 }}>{supplier.rating}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} fill={s <= supplier.rating ? '#ff8c00' : 'none'} className={s <= supplier.rating ? 'text-[#ff8c00]' : 'text-[#ddd6cb]'} />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[13px] text-[#6b5d45]">{supplier.phone}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/suppliers/${supplier.id}`)}
                          className="p-1.5 text-[#8d785e] hover:text-[#ff8c00] hover:bg-[#ff8c00]/10 rounded-lg transition-all"
                          title="צפייה"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => restoreSupplier(supplier)}
                          disabled={restoringId === supplier.id}
                          className="flex items-center gap-1.5 text-[12px] text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-all"
                          style={{ fontWeight: 600 }}
                        >
                          {restoringId === supplier.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <ArchiveRestore size={13} />
                          )}
                          {restoringId === supplier.id ? 'משחזר...' : 'שחזור'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-[#f5f3f0] border-t border-[#e7e1da]">
            <span className="text-[12px] text-[#8d785e]">
              {filtered.length} ספקים בארכיון
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
