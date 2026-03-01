// ═══════════════════════════════════════════════════
// TravelPro — Supplier Auto-Notes System
// Generates prioritized notes based on supplier state
// ═══════════════════════════════════════════════════

import type { Supplier } from './data';
import type { SupplierDocument, SupplierContact, SupplierProduct } from './api';

export type NoteLevel = 'critical' | 'warning' | 'info' | 'low';

export interface AutoNote {
  id: string;
  priority: number; // lower = more urgent
  level: NoteLevel;
  text: string;
  icon: 'shield-alert' | 'file-warning' | 'alert-triangle' | 'clock' | 'file-x' | 'user-x' | 'phone-off' | 'package-x';
}

const REQUIRED_DOCS = ['רישיון עסק', 'תעודת כשרות', "ביטוח צד ג'"];

function getDocExpiryStatus(expiry: string): 'valid' | 'warning' | 'expired' {
  if (!expiry) return 'expired';
  const exp = new Date(expiry);
  const now = new Date();
  if (exp < now) return 'expired';
  const diff = exp.getTime() - now.getTime();
  if (diff / (1000 * 60 * 60 * 24) < 60) return 'warning';
  return 'valid';
}

// ─── Full computation (for SupplierDetail page) ───
export function computeAutoNotes(
  supplier: Supplier,
  documents: SupplierDocument[],
  contacts: SupplierContact[],
  products: SupplierProduct[],
): AutoNote[] {
  const notes: AutoNote[] = [];

  // 1. Insurance expired (priority 1)
  const insuranceDoc = documents.find(d => d.name === "ביטוח צד ג'");
  if (insuranceDoc && getDocExpiryStatus(insuranceDoc.expiry) === 'expired') {
    notes.push({
      id: 'insurance-expired',
      priority: 1,
      level: 'critical',
      text: "ביטוח צד ג' פג תוקף",
      icon: 'shield-alert',
    });
  }

  // 2. Other documents expired (priority 2)
  const expiredDocs = documents.filter(d =>
    d.name !== "ביטוח צד ג'" && getDocExpiryStatus(d.expiry) === 'expired'
  );
  if (expiredDocs.length > 0) {
    const names = expiredDocs.map(d => d.name).join(', ');
    notes.push({
      id: 'docs-expired',
      priority: 2,
      level: 'critical',
      text: expiredDocs.length === 1
        ? `מסמך פג תוקף: ${names}`
        : `${expiredDocs.length} מסמכים פגי תוקף (${names})`,
      icon: 'file-warning',
    });
  }

  // 3. Supplier unverified (priority 3)
  if (supplier.verificationStatus === 'unverified') {
    notes.push({
      id: 'unverified',
      priority: 3,
      level: 'warning',
      text: 'ספק לא מאומת',
      icon: 'alert-triangle',
    });
  }

  // 4. Documents about to expire (priority 4)
  const warningDocs = documents.filter(d => getDocExpiryStatus(d.expiry) === 'warning');
  if (warningDocs.length > 0) {
    const names = warningDocs.map(d => d.name).join(', ');
    notes.push({
      id: 'docs-warning',
      priority: 4,
      level: 'warning',
      text: warningDocs.length === 1
        ? `מסמך עומד לפוג: ${names}`
        : `${warningDocs.length} מסמכים עומדים לפוג (${names})`,
      icon: 'clock',
    });
  }

  // 5. Required documents missing (priority 5)
  const existingDocNames = new Set(documents.map(d => d.name));
  const missingDocs = REQUIRED_DOCS.filter(name => !existingDocNames.has(name));
  if (missingDocs.length > 0) {
    notes.push({
      id: 'docs-missing',
      priority: 5,
      level: 'critical',
      text: missingDocs.length === REQUIRED_DOCS.length
        ? 'כל מסמכי החובה חסרים'
        : `מסמכים חסרים: ${missingDocs.join(', ')}`,
      icon: 'file-x',
    });
  }

  // 6. Pending verification (priority 6)
  if (supplier.verificationStatus === 'pending') {
    notes.push({
      id: 'pending-verification',
      priority: 6,
      level: 'info',
      text: 'ממתין לאימות',
      icon: 'clock',
    });
  }

  // 7. No contacts (priority 7)
  if (contacts.length === 0) {
    notes.push({
      id: 'no-contacts',
      priority: 7,
      level: 'critical',
      text: 'אין אנשי קשר',
      icon: 'user-x',
    });
  }

  // 8. Missing phone (priority 8)
  if (!supplier.phone || supplier.phone.trim() === '') {
    notes.push({
      id: 'no-phone',
      priority: 8,
      level: 'critical',
      text: 'חסר מספר טלפון',
      icon: 'phone-off',
    });
  }

  // 9. No products (priority 9)
  if (products.length === 0) {
    notes.push({
      id: 'no-products',
      priority: 9,
      level: 'critical',
      text: 'אין מוצרים/שירותים',
      icon: 'package-x',
    });
  }

  return notes.sort((a, b) => a.priority - b.priority);
}

// ─── Summary-based computation (for SupplierBank page) ───
export interface SupplierSummary {
  docsExpired: number;
  docsWarning: number;
  docsMissing: number;
  docsMissingNames: string[];
  insuranceExpired: boolean;
  contactsCount: number;
  productsCount: number;
}

export function computeAutoNotesFromSummary(
  supplier: Supplier,
  summary: SupplierSummary | undefined,
): AutoNote[] {
  const notes: AutoNote[] = [];

  if (!summary) {
    // No summary data — just use supplier fields
    if (supplier.verificationStatus === 'unverified') {
      notes.push({ id: 'unverified', priority: 3, level: 'warning', text: 'ספק לא מאומת', icon: 'alert-triangle' });
    }
    if (supplier.verificationStatus === 'pending') {
      notes.push({ id: 'pending-verification', priority: 6, level: 'info', text: 'ממתין לאימות', icon: 'clock' });
    }
    if (!supplier.phone || supplier.phone.trim() === '') {
      notes.push({ id: 'no-phone', priority: 8, level: 'critical', text: 'חסר מספר טלפון', icon: 'phone-off' });
    }
    // Fallback to manual notes if present
    if (supplier.notes && supplier.notes !== '-') {
      notes.push({ id: 'manual', priority: 10, level: 'info', text: supplier.notes, icon: 'alert-triangle' });
    }
    return notes.sort((a, b) => a.priority - b.priority);
  }

  // 1. Insurance expired
  if (summary.insuranceExpired) {
    notes.push({ id: 'insurance-expired', priority: 1, level: 'critical', text: "ביטוח צד ג' פג תוקף", icon: 'shield-alert' });
  }

  // 2. Other docs expired
  const otherExpired = summary.insuranceExpired ? summary.docsExpired - 1 : summary.docsExpired;
  if (otherExpired > 0) {
    notes.push({
      id: 'docs-expired', priority: 2, level: 'critical',
      text: otherExpired === 1 ? 'מסמך פג תוקף' : `${otherExpired} מסמכים פגי תוקף`,
      icon: 'file-warning',
    });
  }

  // 3. Unverified
  if (supplier.verificationStatus === 'unverified') {
    notes.push({ id: 'unverified', priority: 3, level: 'warning', text: 'ספק לא מאומת', icon: 'alert-triangle' });
  }

  // 4. Docs about to expire
  if (summary.docsWarning > 0) {
    notes.push({
      id: 'docs-warning', priority: 4, level: 'warning',
      text: summary.docsWarning === 1 ? 'מסמך עומד לפוג' : `${summary.docsWarning} מסמכים עומדים לפוג`,
      icon: 'clock',
    });
  }

  // 5. Missing required docs
  if (summary.docsMissing > 0) {
    notes.push({
      id: 'docs-missing', priority: 5, level: 'critical',
      text: summary.docsMissing === 3
        ? 'כל מסמכי החובה חסרים'
        : `מסמכים חסרים: ${summary.docsMissingNames.join(', ')}`,
      icon: 'file-x',
    });
  }

  // 6. Pending
  if (supplier.verificationStatus === 'pending') {
    notes.push({ id: 'pending-verification', priority: 6, level: 'info', text: 'ממתין לאימות', icon: 'clock' });
  }

  // 7. No contacts
  if (summary.contactsCount === 0) {
    notes.push({ id: 'no-contacts', priority: 7, level: 'critical', text: 'אין אנשי קשר', icon: 'user-x' });
  }

  // 8. Missing phone
  if (!supplier.phone || supplier.phone.trim() === '') {
    notes.push({ id: 'no-phone', priority: 8, level: 'critical', text: 'חסר מספר טלפון', icon: 'phone-off' });
  }

  // 9. No products
  if (summary.productsCount === 0) {
    notes.push({ id: 'no-products', priority: 9, level: 'critical', text: 'אין מוצרים/שירותים', icon: 'package-x' });
  }

  return notes.sort((a, b) => a.priority - b.priority);
}

// ─── Style helpers ───
export function noteLevelStyles(level: NoteLevel) {
  switch (level) {
    case 'critical':
      return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500', dot: 'bg-red-500' };
    case 'warning':
      return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'text-amber-500', dot: 'bg-amber-500' };
    case 'info':
      return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500', dot: 'bg-blue-500' };
    case 'low':
      return { bg: 'bg-[#f5f3f0]', border: 'border-[#e7e1da]', text: 'text-[#8d785e]', icon: 'text-[#b8a990]', dot: 'bg-[#b8a990]' };
  }
}