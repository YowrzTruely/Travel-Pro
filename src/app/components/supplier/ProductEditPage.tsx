import { useQuery } from "convex/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { useAuth } from "../AuthContext";
import { SupplierProductEditor } from "./SupplierProductEditor";

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const isNew = id === "new";
  const productId = isNew ? undefined : (id as Id<"supplierProducts">);

  const product = useQuery(
    api.supplierProducts.get,
    productId ? { id: productId } : "skip"
  );

  const handleClose = () => {
    navigate("/products");
  };

  if (!supplierId) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[#8d785e] text-[14px]">
          לא נמצא חיבור לספק. פנה למנהל המערכת.
        </p>
      </div>
    );
  }

  // Loading state for edit mode
  if (!isNew && product === undefined) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin text-[#ff8c00]" size={32} />
      </div>
    );
  }

  // Backend now resolves storage URLs, just cast the id
  const productData = product ? { ...product, id: product.id as string } : null;

  // Product not found
  if (!isNew && product === null) {
    return (
      <div
        className="flex h-64 flex-col items-center justify-center gap-4"
        dir="rtl"
      >
        <p className="text-[#8d785e] text-[16px]">המוצר לא נמצא</p>
        <button
          className="flex items-center gap-2 rounded-xl bg-[#ff8c00] px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-[#e67e00]"
          onClick={handleClose}
          style={{ fontWeight: 600 }}
          type="button"
        >
          <ArrowRight size={16} />
          חזרה למוצרים
        </button>
      </div>
    );
  }

  return (
    <SupplierProductEditor
      mode="page"
      onClose={handleClose}
      product={isNew ? null : productData}
      supplierId={supplierId}
    />
  );
}
