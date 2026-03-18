import { useMutation, useQuery } from "convex/react";
import {
  Clock,
  Grid3X3,
  List,
  Loader2,
  Package,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { appToast } from "../AppToast";
import { useAuth } from "../AuthContext";
import { useConfirmDelete } from "../ConfirmDeleteModal";
import { FeatureGate } from "./FeatureGate";

type ViewMode = "grid" | "list";

interface ProductData {
  capacity?: number;
  description?: string;
  grossTime?: number;
  id: string;
  images?: { id: string; url: string; name: string }[];
  listPrice?: number;
  name: string;
  netTime?: number;
  price: number;
  unit?: string;
}

export function MyProducts() {
  const { profile } = useAuth();
  const supplierId = profile?.supplierId as Id<"suppliers"> | undefined;

  const products = useQuery(
    api.supplierProducts.listBySupplierId,
    supplierId ? { supplierId } : "skip"
  );

  const navigate = useNavigate();
  const removeProduct = useMutation(api.supplierProducts.remove);
  const { requestDelete, modal: deleteModal } = useConfirmDelete();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const handleAdd = () => {
    navigate("/products/new");
  };

  const handleEdit = (product: ProductData) => {
    navigate(`/products/${product.id}`);
  };

  const handleDelete = (product: ProductData) => {
    requestDelete({
      title: "מחיקת מוצר",
      itemName: product.name,
      onConfirm: async () => {
        try {
          await removeProduct({ id: product.id as Id<"supplierProducts"> });
          appToast.success("המוצר נמחק", product.name);
        } catch {
          appToast.error("שגיאה", "לא ניתן למחוק את המוצר");
        }
      },
    });
  };

  if (!supplierId) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <p className="text-[14px] text-muted-foreground">
          לא נמצא חיבור לספק. פנה למנהל המערכת.
        </p>
      </div>
    );
  }

  if (products === undefined) {
    return (
      <div className="flex h-64 items-center justify-center" dir="rtl">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <Package size={20} />
          </span>
          <div>
            <h1
              className="text-[22px] text-foreground"
              style={{ fontWeight: 700 }}
            >
              המוצרים שלי
            </h1>
            <p className="text-[13px] text-muted-foreground">
              {products.length} מוצרים
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              className={`min-h-[44px] min-w-[44px] px-3 py-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setViewMode("grid")}
              type="button"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              className={`min-h-[44px] min-w-[44px] px-3 py-2 transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
              onClick={() => setViewMode("list")}
              type="button"
            >
              <List size={16} />
            </button>
          </div>

          {/* Add button */}
          <button
            className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[14px] text-white shadow-lg shadow-primary/25 transition-colors hover:bg-primary-hover"
            onClick={handleAdd}
            style={{ fontWeight: 600 }}
            type="button"
          >
            <Plus size={16} />
            הוסף מוצר
          </button>
        </div>
      </div>

      {/* Products */}
      <FeatureGate featureName="ניהול מוצרים מורחב" requiredStage="stage2">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-border border-dashed bg-card py-16">
            <Package className="mb-4 text-tertiary" size={48} />
            <p
              className="mb-2 text-[16px] text-foreground"
              style={{ fontWeight: 600 }}
            >
              אין מוצרים עדיין
            </p>
            <p className="mb-4 text-[13px] text-muted-foreground">
              הוסף את המוצרים והשירותים שלך
            </p>
            <button
              className="flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-[14px] text-white transition-colors hover:bg-primary-hover"
              onClick={handleAdd}
              style={{ fontWeight: 600 }}
              type="button"
            >
              <Plus size={16} />
              הוסף מוצר ראשון
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                onDelete={() => handleDelete(product as ProductData)}
                onEdit={() => handleEdit(product as ProductData)}
                product={product as ProductData}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => (
              <ProductListItem
                key={product.id}
                onDelete={() => handleDelete(product as ProductData)}
                onEdit={() => handleEdit(product as ProductData)}
                product={product as ProductData}
              />
            ))}
          </div>
        )}
      </FeatureGate>

      {deleteModal}
    </div>
  );
}

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductData;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const displayPrice = product.listPrice ?? product.price;
  const firstImage = product.images?.[0];

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="relative h-40 bg-accent">
        {firstImage ? (
          <img
            alt={product.name}
            className="h-full w-full object-cover"
            height={160}
            src={firstImage.url}
            width={320}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="text-tertiary" size={40} />
          </div>
        )}
        <div className="absolute top-2 left-2 rounded-lg bg-card/90 px-2 py-1 text-foreground shadow-sm backdrop-blur-sm">
          <span className="text-[15px]" style={{ fontWeight: 700 }}>
            ₪{displayPrice.toLocaleString()}
          </span>
          {product.unit && (
            <span className="text-[11px] text-muted-foreground">
              /{product.unit}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="mb-1 truncate text-[15px] text-foreground"
          style={{ fontWeight: 600 }}
        >
          {product.name}
        </h3>

        <div className="mb-3 flex flex-wrap gap-2">
          {product.grossTime != null && (
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
              <Clock size={12} />
              {product.grossTime} דק׳
            </span>
          )}
          {product.capacity != null && (
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
              <Users size={12} />
              {product.capacity}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="min-h-[44px] flex-1 rounded-lg border border-border px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-accent"
            onClick={onEdit}
            style={{ fontWeight: 600 }}
            type="button"
          >
            עריכה
          </button>
          <button
            className="min-h-[44px] min-w-[44px] rounded-lg border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
            type="button"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductListItem({
  product,
  onEdit,
  onDelete,
}: {
  product: ProductData;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const displayPrice = product.listPrice ?? product.price;
  const firstImage = product.images?.[0];

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
      {/* Image */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-accent">
        {firstImage ? (
          <img
            alt={product.name}
            className="h-full w-full object-cover"
            height={64}
            src={firstImage.url}
            width={64}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="text-tertiary" size={24} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3
          className="truncate text-[15px] text-foreground"
          style={{ fontWeight: 600 }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          {product.grossTime != null && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {product.grossTime} דק׳
            </span>
          )}
          {product.capacity != null && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              {product.capacity}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="text-left">
        <span
          className="text-[16px] text-foreground"
          style={{ fontWeight: 700 }}
        >
          ₪{displayPrice.toLocaleString()}
        </span>
        {product.unit && (
          <span className="text-[11px] text-muted-foreground">
            /{product.unit}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          className="min-h-[44px] rounded-lg border border-border px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-accent"
          onClick={onEdit}
          style={{ fontWeight: 600 }}
          type="button"
        >
          עריכה
        </button>
        <button
          className="min-h-[44px] min-w-[44px] rounded-lg border border-border px-3 py-2 text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
