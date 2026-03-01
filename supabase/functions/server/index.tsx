import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();
console.log("[Server] TravelPro Hono server starting... (v6)");
app.use("*", logger(console.log));
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const PREFIX = "/make-server-0045c7fc";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ═══════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════

const SEED_SUPPLIERS = [
  { id: "1", name: "הסעות מסיילי הצפון", phone: "514423982", category: "תחבורה", categoryColor: "#3b82f6", region: "צפון", rating: 4.5, verificationStatus: "verified", notes: "-", icon: "🚌" },
  { id: "2", name: "קייטרינג סאמי המזרח", phone: "032115664", category: "מזון", categoryColor: "#22c55e", region: "ירושלים", rating: 4.0, verificationStatus: "pending", notes: "מסמכים חסרים", icon: "🍽️" },
  { id: "3", name: "ספורט אתגרי בנגב", phone: "520038441", category: "אטרקציות", categoryColor: "#a855f7", region: "דרום", rating: 5.0, verificationStatus: "unverified", notes: "נדרש חידוש ביטוח", icon: "🏃" },
  { id: "4", name: "מלון פלאזה - מרכז", phone: "510098442", category: "לינה", categoryColor: "#ec4899", region: "מרכז", rating: 3.2, verificationStatus: "verified", notes: "-", icon: "🏨" },
  { id: "5", name: "יקב רמת נפתלי", phone: "049876543", category: "אטרקציות", categoryColor: "#a855f7", region: "צפון", rating: 4.8, verificationStatus: "verified", notes: "-", icon: "🍷" },
  { id: "6", name: "אוטובוסים הגליל", phone: "047654321", category: "תחבורה", categoryColor: "#3b82f6", region: "צפון", rating: 4.2, verificationStatus: "verified", notes: "-", icon: "🚌" },
];

const SEED_PROJECTS = [
  { id: "4829-24", name: "נופש שנתי גליל עליון", client: "סייבר-גלובל", company: "סייבר-גלובל", participants: 120, region: "גליל עליון", status: "בניית הצעה", statusColor: "#f97316", totalPrice: 102000, pricePerPerson: 850, profitMargin: 25, date: "2024-03-15" },
  { id: "4830-24", name: "כנס מכירות Q1", client: "טכנו-פלוס", company: "טכנו-פלוס", participants: 80, region: "אילת", status: "ליד חדש", statusColor: "#3b82f6", totalPrice: 0, pricePerPerson: 0, profitMargin: 0, date: "2024-03-20" },
  { id: "4831-24", name: "יום כיף צוות פיתוח", client: "קליקסופט", company: "קליקסופט", participants: 45, region: "מרכז", status: "הצעה נשלחה", statusColor: "#8b5cf6", totalPrice: 38250, pricePerPerson: 850, profitMargin: 22, date: "2024-03-10" },
  { id: "4832-24", name: "אירוע חברה שנתי", client: "מדיה-וורקס", company: "מדיה-וורקס", participants: 200, region: "ירושלים", status: "אושר", statusColor: "#22c55e", totalPrice: 180000, pricePerPerson: 900, profitMargin: 28, date: "2024-02-28" },
  { id: "4833-24", name: "סדנת גיבוש הנהלה", client: "פיננס-פרו", company: "פיננס-פרו", participants: 25, region: "גולן", status: "מחיר בהערכה", statusColor: "#eab308", totalPrice: 0, pricePerPerson: 0, profitMargin: 0, date: "2024-03-18" },
];

const SEED_QUOTE_ITEMS = [
  { id: "qi-1", projectId: "4829-24", type: "תחבורה", icon: "🚌", name: "אוטובוסים הגליל", supplier: "אוטובוסים הגליל", description: "3 אוטובוסים ממוגנים, איסוף מהמרכז", cost: 7500, directPrice: 9500, sellingPrice: 9000, profitWeight: 2, status: "approved" },
  { id: "qi-2", projectId: "4829-24", type: "פעילות בוקר", icon: "🎯", name: "רייזרס בגוף", supplier: "רייזרס בגוף", description: "מתחם ג׳ונגל/רייזרים", cost: 28800, directPrice: 37200, sellingPrice: 36000, profitWeight: 4, status: "modified", alternatives: [{ id: "a1", name: "רייזרס בגוף", description: "מתחם ג׳ונגל/רייזרים", costPerPerson: 240, selected: true }, { id: "a2", name: "קייקי הגליל", description: "מתחם פעילות/רייזרים", costPerPerson: 110, selected: false }, { id: "a3", name: "ספק מהאינטרנט", description: "מתחם ביער/בגוף", costPerPerson: 180, selected: false }] },
];

const SEED_TIMELINE_EVENTS = [
  { id: "te-1", projectId: "4829-24", time: "08:00", title: "יציאה ואיסוף", description: "נקודת מפגש: חניון הבימה מיני גלילות. חלוקת ערכות בוקר.", icon: "🚌" },
  { id: "te-2", projectId: "4829-24", time: "10:30", title: "פעילות בוקר - רייזרים", description: "הגעה למתחם רייזרים בגוף. מדריך בטיחות ויציאה למסלול!", icon: "🎯" },
  { id: "te-3", projectId: "4829-24", time: "13:00", title: "ארוחת צהריים", description: "ארוחת בשרים כשרה למהדרין במסעדת \"החווה\".", icon: "🍽️" },
];

const SEED_SUPPLIER_CONTACTS = [
  { id: "sc-1", supplierId: "5", name: "יצחק ברוך", role: "בעלים ומנכ\"ל", phone: "054-1234567", email: "yitzhak@ramatnaftali.co.il", primary: true },
  { id: "sc-2", supplierId: "5", name: "מיכל לוי", role: "מנהלת אירועים ושיווק", phone: "050-7654321", email: "michal@ramatnaftali.co.il", primary: false },
  { id: "sc-3", supplierId: "6", name: "דוד כהן", role: "מנהל תפעול", phone: "052-9876543", email: "david@galil-bus.co.il", primary: true },
];

const SEED_SUPPLIER_PRODUCTS = [
  { id: "sp-1", supplierId: "5", name: "סיור ביקב וטעימות יין", price: 120, description: "סיור מודרך בכרמים ובחביות, הדגמת תהליך הייצור.", unit: "אדם" },
  { id: "sp-2", supplierId: "5", name: "פלטת גבינות גליליות", price: 85, description: "מבחר גבינות מחלבות בוטיק בגליל.", unit: "אדם" },
  { id: "sp-3", supplierId: "5", name: "אירועי חברה בוטיק", price: 5000, description: "אירוח פרטי עד 50 איש. ארוחת שף בתנור אבן.", unit: "אירוע" },
  { id: "sp-4", supplierId: "6", name: "אוטובוס ממוגן 55 מקומות", price: 2500, description: "אוטובוס מפואר עם Wi-Fi, מיזוג ומושבים מרופדים.", unit: "יום" },
];

const SEED_SUPPLIER_DOCUMENTS = [
  { id: "sd-1", supplierId: "5", name: "רישיון עסק", expiry: "2026-01-01", status: "valid" },
  { id: "sd-2", supplierId: "5", name: "תעודת כשרות", expiry: "2024-09-15", status: "warning" },
  { id: "sd-3", supplierId: "5", name: "ביטוח צד ג'", expiry: "2024-05-01", status: "expired" },
  { id: "sd-4", supplierId: "6", name: "רישיון הובלה", expiry: "2025-12-31", status: "valid" },
  { id: "sd-5", supplierId: "6", name: "ביטוח נוסעים", expiry: "2025-06-30", status: "valid" },
];

const SEED_CLIENTS = [
  { id: "cl-1", name: "יוסי כהן", company: "סייבר-גלובל", phone: "054-1234567", email: "yosi@cyberglobal.co.il", status: "active", notes: "לקוח VIP", totalProjects: 3, totalRevenue: 280000, createdAt: "2023-06-15" },
  { id: "cl-2", name: "דנה לוי", company: "טכנו-פלוס", phone: "052-9876543", email: "dana@technoplus.co.il", status: "lead", notes: "פנתה דרך האתר", totalProjects: 0, totalRevenue: 0, createdAt: "2024-02-01" },
  { id: "cl-3", name: "אבי ישראלי", company: "קליקסופט", phone: "050-5551234", email: "avi@clicksoft.co.il", status: "active", notes: "-", totalProjects: 1, totalRevenue: 38250, createdAt: "2023-11-20" },
  { id: "cl-4", name: "מיכל ברון", company: "מדיה-וורקס", phone: "053-7778899", email: "michal@mediaworks.co.il", status: "active", notes: "אירוע שנתי קבוע", totalProjects: 2, totalRevenue: 180000, createdAt: "2023-01-10" },
  { id: "cl-5", name: "רון אלמוג", company: "פיננס-פרו", phone: "058-3334455", email: "ron@financepro.co.il", status: "lead", notes: "מחכה להצעת מחיר", totalProjects: 0, totalRevenue: 0, createdAt: "2024-03-05" },
];

// Lookup tables
const CATEGORY_COLORS: Record<string, string> = { "תחבורה": "#3b82f6", "מזון": "#22c55e", "אטרקציות": "#a855f7", "לינה": "#ec4899", "בידור": "#f59e0b" };
const CATEGORY_ICONS: Record<string, string> = { "תחבורה": "🚌", "מזון": "🍽️", "אטרקציות": "🏃", "לינה": "🏨", "בידור": "🎭" };
const STATUS_COLORS: Record<string, string> = { "ליד חדש": "#3b82f6", "בניית הצעה": "#f97316", "הצעה נשלחה": "#8b5cf6", "אושר": "#22c55e", "מחיר בהערכה": "#eab308", "בביצוע": "#ff8c00" };

// ═══════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════

app.get(`${PREFIX}/health`, (c) => c.json({ status: "ok" }));

// ─── AUTH ─────────────────────────────────────────
app.post(`${PREFIX}/signup`, async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password) return c.json({ error: "אימייל וסיסמה הם שדות חובה" }, 400);
    if (password.length < 6) return c.json({ error: "סיסמה חייבת להכיל לפחות 6 תווים" }, 400);
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, user_metadata: { name: name || "" }, email_confirm: true });
    if (error) { console.log(`[Auth] Signup error: ${error.message}`); return c.json({ error: error.message }, 400); }
    console.log(`[Auth] User created: ${data.user?.id}`);
    return c.json({ data: { userId: data.user?.id, email } }, 201);
  } catch (err) { console.log(`[Auth] Signup exception: ${err}`); return c.json({ error: `שגיאה ביצירת חשבון: ${err}` }, 500); }
});

// ─── SEED ─────────────────────────────────────────
app.post(`${PREFIX}/seed`, async (c) => {
  try {
    const alreadySeeded = await kv.get("_meta:seeded_v6");
    if (alreadySeeded) return c.json({ data: { skipped: true } });

    await kv.mset(SEED_SUPPLIERS.map(s => `supplier:${s.id}`), SEED_SUPPLIERS);
    await kv.mset(SEED_PROJECTS.map(p => `project:${p.id}`), SEED_PROJECTS);
    await kv.mset(SEED_QUOTE_ITEMS.map(q => `quote_item:${q.id}`), SEED_QUOTE_ITEMS);
    await kv.mset(SEED_TIMELINE_EVENTS.map(t => `timeline_event:${t.id}`), SEED_TIMELINE_EVENTS);
    await kv.mset(SEED_SUPPLIER_CONTACTS.map(sc => `supplier_contact:${sc.id}`), SEED_SUPPLIER_CONTACTS);
    await kv.mset(SEED_SUPPLIER_PRODUCTS.map(sp => `supplier_product:${sp.id}`), SEED_SUPPLIER_PRODUCTS);
    await kv.mset(SEED_SUPPLIER_DOCUMENTS.map(sd => `supplier_document:${sd.id}`), SEED_SUPPLIER_DOCUMENTS);
    await kv.mset(SEED_CLIENTS.map(cl => `client:${cl.id}`), SEED_CLIENTS);
    await kv.set("_meta:seeded_v6", { seededAt: new Date().toISOString() });

    console.log("[Seed] All data seeded (v6 with directPrice)");
    return c.json({ data: { skipped: false, suppliers: SEED_SUPPLIERS.length, projects: SEED_PROJECTS.length } });
  } catch (err) { console.log(`[Seed] Error: ${err}`); return c.json({ error: `Seed failed: ${err}` }, 500); }
});

// ─── SUPPLIERS CRUD ──────────────────────────────
app.get(`${PREFIX}/suppliers`, async (c) => {
  try { return c.json({ data: await kv.getByPrefix("supplier:") }); }
  catch (err) { return c.json({ error: `Failed to list suppliers: ${err}` }, 500); }
});

// ─── SUPPLIERS SUMMARIES (batch notes data) ──────
app.get(`${PREFIX}/suppliers/summaries`, async (c) => {
  try {
    const [allDocs, allContacts, allProducts] = await Promise.all([
      kv.getByPrefix("supplier_document:"),
      kv.getByPrefix("supplier_contact:"),
      kv.getByPrefix("supplier_product:"),
    ]);

    const REQUIRED_DOCS = ["רישיון עסק", "תעודת כשרות", "ביטוח צד ג'"];
    const now = new Date();

    const summaries: Record<string, any> = {};

    // Group by supplierId
    const docsBySupplierId: Record<string, any[]> = {};
    const contactsBySupplierId: Record<string, any[]> = {};
    const productsBySupplierId: Record<string, any[]> = {};

    for (const doc of allDocs) { const sid = (doc as any).supplierId; if (!docsBySupplierId[sid]) docsBySupplierId[sid] = []; docsBySupplierId[sid].push(doc); }
    for (const c of allContacts) { const sid = (c as any).supplierId; if (!contactsBySupplierId[sid]) contactsBySupplierId[sid] = []; contactsBySupplierId[sid].push(c); }
    for (const p of allProducts) { const sid = (p as any).supplierId; if (!productsBySupplierId[sid]) productsBySupplierId[sid] = []; productsBySupplierId[sid].push(p); }

    // Get all supplier IDs
    const allSuppliers = await kv.getByPrefix("supplier:");
    for (const supplier of allSuppliers) {
      const sid = (supplier as any).id;
      const docs = docsBySupplierId[sid] || [];
      const contacts = contactsBySupplierId[sid] || [];
      const products = productsBySupplierId[sid] || [];

      let docsExpired = 0;
      let docsWarning = 0;
      let insuranceExpired = false;
      const docNames = new Set(docs.map((d: any) => d.name));
      const docsMissing = REQUIRED_DOCS.filter(name => !docNames.has(name));

      for (const doc of docs) {
        const d = doc as any;
        if (!d.expiry) { docsExpired++; continue; }
        const exp = new Date(d.expiry);
        if (exp < now) {
          docsExpired++;
          if (d.name === "ביטוח צד ג'") insuranceExpired = true;
        } else {
          const diff = exp.getTime() - now.getTime();
          if (diff / (1000 * 60 * 60 * 24) < 60) docsWarning++;
        }
      }

      summaries[sid] = {
        docsExpired,
        docsWarning,
        docsMissing: docsMissing.length,
        docsMissingNames: docsMissing,
        insuranceExpired,
        contactsCount: contacts.length,
        productsCount: products.length,
      };
    }

    return c.json({ data: summaries });
  } catch (err) {
    console.log(`[Suppliers] Summaries error: ${err}`);
    return c.json({ error: `Failed to get supplier summaries: ${err}` }, 500);
  }
});

app.get(`${PREFIX}/suppliers/:id`, async (c) => {
  try {
    const supplier = await kv.get(`supplier:${c.req.param("id")}`);
    if (!supplier) return c.json({ error: "Supplier not found" }, 404);
    return c.json({ data: supplier });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/suppliers`, async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || generateId();
    const supplier = { id, name: body.name || "", phone: body.phone || "", category: body.category || "", categoryColor: body.categoryColor || CATEGORY_COLORS[body.category] || "#8d785e", region: body.region || "", rating: body.rating ?? 0, verificationStatus: body.verificationStatus || "unverified", notes: body.notes || "-", icon: body.icon || CATEGORY_ICONS[body.category] || "📦" };
    await kv.set(`supplier:${id}`, supplier);
    return c.json({ data: supplier }, 201);
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.put(`${PREFIX}/suppliers/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`supplier:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    if (body.category && body.category !== existing.category) {
      if (!body.categoryColor) updated.categoryColor = CATEGORY_COLORS[body.category] || existing.categoryColor;
      if (!body.icon) updated.icon = CATEGORY_ICONS[body.category] || existing.icon;
    }
    await kv.set(`supplier:${id}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.delete(`${PREFIX}/suppliers/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    if (!(await kv.get(`supplier:${id}`))) return c.json({ error: "Not found" }, 404);
    await kv.del(`supplier:${id}`);
    return c.json({ data: { success: true, id } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── SUPPLIERS BULK IMPORT ──────────────────────
app.post(`${PREFIX}/suppliers/bulk-import`, async (c) => {
  try {
    const { suppliers } = await c.req.json();
    if (!suppliers || !Array.isArray(suppliers) || suppliers.length === 0) {
      return c.json({ error: "suppliers array required" }, 400);
    }

    const imported: any[] = [];
    const skipped: string[] = [];

    // Get existing suppliers to check duplicates
    const existingSuppliers = await kv.getByPrefix("supplier:");
    const existingNames = new Set(existingSuppliers.map((s: any) => (s.name || "").trim().toLowerCase()));

    for (let i = 0; i < suppliers.length; i += 25) {
      const batch = suppliers.slice(i, i + 25);
      const validBatch: any[] = [];
      const keys: string[] = [];

      for (const s of batch) {
        const name = (s.name || "").trim();
        if (!name) { skipped.push("(ללא שם)"); continue; }

        // Skip if duplicate and action is 'skip'
        if (s._action === "skip") { skipped.push(name); continue; }

        const id = generateId();
        const category = (s.category || "").trim();
        const supplier = {
          id,
          name,
          phone: (s.phone || "").trim(),
          email: (s.email || "").trim(),
          category,
          categoryColor: CATEGORY_COLORS[category] || "#8d785e",
          region: (s.region || "").trim(),
          rating: 0,
          verificationStatus: "unverified",
          notes: (s.notes || "").trim() || "-",
          icon: CATEGORY_ICONS[category] || "📦",
        };

        keys.push(`supplier:${id}`);
        validBatch.push(supplier);
        imported.push(supplier);
      }

      if (keys.length > 0) {
        await kv.mset(keys, validBatch);
      }
    }

    console.log(`[Import] Bulk imported ${imported.length} suppliers, skipped ${skipped.length}`);
    return c.json({ data: { imported: imported.length, skipped: skipped.length, suppliers: imported } }, 201);
  } catch (err) {
    console.log(`[Import] Bulk import error: ${err}`);
    return c.json({ error: `Bulk import failed: ${err}` }, 500);
  }
});

// ─── SUPPLIERS BULK ROLLBACK ────────────────────
app.post(`${PREFIX}/suppliers/bulk-rollback`, async (c) => {
  try {
    const { supplierIds } = await c.req.json();
    if (!supplierIds || !Array.isArray(supplierIds) || supplierIds.length === 0) {
      return c.json({ error: "supplierIds array required" }, 400);
    }

    let deleted = 0;
    let notFound = 0;

    // Also delete any contacts, products, documents linked to these suppliers
    const allContacts = await kv.getByPrefix("supplier_contact:");
    const allProducts = await kv.getByPrefix("supplier_product:");
    const allDocuments = await kv.getByPrefix("supplier_document:");

    for (const id of supplierIds) {
      const existing = await kv.get(`supplier:${id}`);
      if (!existing) { notFound++; continue; }

      // Delete the supplier
      await kv.del(`supplier:${id}`);
      deleted++;

      // Clean up related sub-resources
      const relatedContacts = allContacts.filter((c: any) => c.supplierId === id);
      const relatedProducts = allProducts.filter((p: any) => p.supplierId === id);
      const relatedDocs = allDocuments.filter((d: any) => d.supplierId === id);

      for (const c of relatedContacts) await kv.del(`supplier_contact:${c.id}`);
      for (const p of relatedProducts) await kv.del(`supplier_product:${p.id}`);
      for (const d of relatedDocs) await kv.del(`supplier_document:${d.id}`);
    }

    console.log(`[Import] Rollback: deleted ${deleted} suppliers, ${notFound} not found`);
    return c.json({ data: { deleted, notFound } });
  } catch (err) {
    console.log(`[Import] Rollback error: ${err}`);
    return c.json({ error: `Rollback failed: ${err}` }, 500);
  }
});

// ─── SUPPLIER CONTACTS ───────────────────────────
app.get(`${PREFIX}/suppliers/:supplierId/contacts`, async (c) => {
  try {
    const supplierId = c.req.param("supplierId");
    const all = await kv.getByPrefix("supplier_contact:");
    return c.json({ data: all.filter((x: any) => x.supplierId === supplierId) });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/suppliers/:supplierId/contacts`, async (c) => {
  try {
    const supplierId = c.req.param("supplierId");
    const body = await c.req.json();
    const id = body.id || `sc-${generateId()}`;
    const contact = { id, supplierId, name: body.name || "", role: body.role || "", phone: body.phone || "", email: body.email || "", primary: body.primary ?? false };
    await kv.set(`supplier_contact:${id}`, contact);
    return c.json({ data: contact }, 201);
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.delete(`${PREFIX}/suppliers/:supplierId/contacts/:contactId`, async (c) => {
  try {
    const contactId = c.req.param("contactId");
    if (!(await kv.get(`supplier_contact:${contactId}`))) return c.json({ error: "Not found" }, 404);
    await kv.del(`supplier_contact:${contactId}`);
    return c.json({ data: { success: true, id: contactId } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── SUPPLIER PRODUCTS ───────────────────────────
app.get(`${PREFIX}/suppliers/:supplierId/products`, async (c) => {
  try {
    const supplierId = c.req.param("supplierId");
    const all = await kv.getByPrefix("supplier_product:");
    return c.json({ data: all.filter((x: any) => x.supplierId === supplierId) });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/suppliers/:supplierId/products`, async (c) => {
  try {
    const supplierId = c.req.param("supplierId");
    const body = await c.req.json();
    const id = body.id || `sp-${generateId()}`;
    const product = { id, supplierId, name: body.name || "", price: body.price ?? 0, description: body.description || "", unit: body.unit || "אדם" };
    await kv.set(`supplier_product:${id}`, product);
    return c.json({ data: product }, 201);
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.delete(`${PREFIX}/suppliers/:supplierId/products/:productId`, async (c) => {
  try {
    const productId = c.req.param("productId");
    if (!(await kv.get(`supplier_product:${productId}`))) return c.json({ error: "Not found" }, 404);
    await kv.del(`supplier_product:${productId}`);
    return c.json({ data: { success: true, id: productId } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── SUPPLIER PRODUCT UPDATE ─────────────────────
app.put(`${PREFIX}/suppliers/:supplierId/products/:productId`, async (c) => {
  try {
    const productId = c.req.param("productId");
    const existing = await kv.get(`supplier_product:${productId}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id: productId, supplierId: c.req.param("supplierId") };
    await kv.set(`supplier_product:${productId}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── SUPPLIER PRODUCT IMAGES ─────────────────────
app.post(`${PREFIX}/suppliers/:supplierId/products/:productId/images`, async (c) => {
  try {
    const productId = c.req.param("productId");
    const existing = await kv.get(`supplier_product:${productId}`);
    if (!existing) return c.json({ error: "Product not found" }, 404);

    const { base64, fileName, contentType } = await c.req.json();
    if (!base64) return c.json({ error: "No image data provided" }, 400);

    const supabase = await ensureImageBucket();

    const rawBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
    const binaryStr = atob(rawBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    const imageId = `img-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const ext = (fileName || "image.jpg").split(".").pop() || "jpg";
    const storagePath = `products/${productId}/${imageId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(storagePath, bytes, { contentType: contentType || "image/jpeg", upsert: false });

    if (uploadError) {
      console.log(`[Storage] Product image upload error: ${uploadError.message}`);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    const { data: signedData, error: signError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    if (signError) {
      console.log(`[Storage] Product sign URL error: ${signError.message}`);
      return c.json({ error: `Sign URL failed: ${signError.message}` }, 500);
    }

    const newImage = { id: imageId, url: signedData.signedUrl, name: fileName || "image.jpg", path: storagePath };
    const images = [...(existing.images || []), newImage];
    const updated = { ...existing, images, id: productId, supplierId: c.req.param("supplierId") };
    await kv.set(`supplier_product:${productId}`, updated);

    console.log(`[Storage] Product image uploaded: ${storagePath} for product ${productId}`);
    return c.json({ data: updated }, 201);
  } catch (err) {
    console.log(`[Storage] Product image upload exception: ${err}`);
    return c.json({ error: `Product image upload failed: ${err}` }, 500);
  }
});

app.delete(`${PREFIX}/suppliers/:supplierId/products/:productId/images/:imageId`, async (c) => {
  try {
    const productId = c.req.param("productId");
    const imageId = c.req.param("imageId");
    const existing = await kv.get(`supplier_product:${productId}`);
    if (!existing) return c.json({ error: "Product not found" }, 404);

    const images = existing.images || [];
    const imageToDelete = images.find((img: any) => img.id === imageId);

    if (imageToDelete && imageToDelete.path) {
      try {
        const supabase = await ensureImageBucket();
        await supabase.storage.from(IMAGE_BUCKET).remove([imageToDelete.path]);
        console.log(`[Storage] Deleted product image: ${imageToDelete.path}`);
      } catch (storageErr) {
        console.log(`[Storage] Delete product image error (non-fatal): ${storageErr}`);
      }
    }

    const updatedImages = images.filter((img: any) => img.id !== imageId);
    const updated = { ...existing, images: updatedImages, id: productId, supplierId: c.req.param("supplierId") };
    await kv.set(`supplier_product:${productId}`, updated);

    return c.json({ data: updated });
  } catch (err) {
    console.log(`[Storage] Product image delete exception: ${err}`);
    return c.json({ error: `Product image delete failed: ${err}` }, 500);
  }
});

// ─── SUPPLIER DOCUMENTS ──────────────────────────
app.get(`${PREFIX}/suppliers/:supplierId/documents`, async (c) => {
  try {
    const supplierId = c.req.param("supplierId");
    const all = await kv.getByPrefix("supplier_document:");
    return c.json({ data: all.filter((x: any) => x.supplierId === supplierId) });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/suppliers/:supplierId/documents`, async (c) => {
  try {
    const supplierId = c.req.param("supplierId");
    const body = await c.req.json();
    const id = body.id || `sd-${generateId()}`;
    const doc = { id, supplierId, name: body.name || "", expiry: body.expiry || "", status: body.status || "valid" };
    await kv.set(`supplier_document:${id}`, doc);
    return c.json({ data: doc }, 201);
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.put(`${PREFIX}/suppliers/:supplierId/documents/:docId`, async (c) => {
  try {
    const docId = c.req.param("docId");
    const existing = await kv.get(`supplier_document:${docId}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id: docId, supplierId: c.req.param("supplierId") };
    await kv.set(`supplier_document:${docId}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.delete(`${PREFIX}/suppliers/:supplierId/documents/:docId`, async (c) => {
  try {
    const docId = c.req.param("docId");
    if (!(await kv.get(`supplier_document:${docId}`))) return c.json({ error: "Not found" }, 404);
    await kv.del(`supplier_document:${docId}`);
    return c.json({ data: { success: true, id: docId } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── PROJECTS CRUD ───────────────────────────────
app.get(`${PREFIX}/projects`, async (c) => {
  try { return c.json({ data: await kv.getByPrefix("project:") }); }
  catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.get(`${PREFIX}/projects/:id`, async (c) => {
  try {
    const project = await kv.get(`project:${c.req.param("id")}`);
    if (!project) return c.json({ error: "Not found" }, 404);
    return c.json({ data: project });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/projects`, async (c) => {
  try {
    const body = await c.req.json();
    const year = new Date().getFullYear().toString().slice(2);
    const seq = Math.floor(1000 + Math.random() * 9000);
    const id = body.id || `${seq}-${year}`;
    const project = { id, name: body.name || "", client: body.client || body.company || "", company: body.company || body.client || "", participants: body.participants ?? 0, region: body.region || "", status: body.status || "ליד חדש", statusColor: body.statusColor || STATUS_COLORS[body.status || "ליד חדש"] || "#3b82f6", totalPrice: body.totalPrice ?? 0, pricePerPerson: body.pricePerPerson ?? 0, profitMargin: body.profitMargin ?? 0, date: body.date || new Date().toISOString().split("T")[0] };
    await kv.set(`project:${id}`, project);
    return c.json({ data: project }, 201);
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.put(`${PREFIX}/projects/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`project:${id}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    if (body.status && body.status !== existing.status && !body.statusColor) {
      updated.statusColor = STATUS_COLORS[body.status] || existing.statusColor;
    }
    await kv.set(`project:${id}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.delete(`${PREFIX}/projects/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    if (!(await kv.get(`project:${id}`))) return c.json({ error: "Not found" }, 404);
    await kv.del(`project:${id}`);
    return c.json({ data: { success: true, id } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── QUOTE ITEMS ─────────────────────────────────
app.get(`${PREFIX}/projects/:projectId/items`, async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const all = await kv.getByPrefix("quote_item:");
    return c.json({ data: all.filter((qi: any) => qi.projectId === projectId) });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/projects/:projectId/items`, async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const body = await c.req.json();
    const id = body.id || `qi-${generateId()}`;
    const item = { id, projectId, type: body.type || "", icon: body.icon || "📦", name: body.name || "", supplier: body.supplier || "", description: body.description || "", cost: body.cost ?? 0, directPrice: body.directPrice ?? 0, sellingPrice: body.sellingPrice ?? 0, profitWeight: body.profitWeight ?? 3, status: body.status || "pending", alternatives: body.alternatives || [] };
    await kv.set(`quote_item:${id}`, item);
    return c.json({ data: item }, 201);
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.put(`${PREFIX}/projects/:projectId/items/:itemId`, async (c) => {
  try {
    const itemId = c.req.param("itemId");
    const existing = await kv.get(`quote_item:${itemId}`);
    if (!existing) return c.json({ error: "Not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id: itemId, projectId: c.req.param("projectId") };
    await kv.set(`quote_item:${itemId}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.delete(`${PREFIX}/projects/:projectId/items/:itemId`, async (c) => {
  try {
    const itemId = c.req.param("itemId");
    if (!(await kv.get(`quote_item:${itemId}`))) return c.json({ error: "Not found" }, 404);
    await kv.del(`quote_item:${itemId}`);
    return c.json({ data: { success: true, id: itemId } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── ITEM IMAGES (Supabase Storage) ──────────────
const IMAGE_BUCKET = "make-0045c7fc-images";

async function ensureImageBucket() {
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === IMAGE_BUCKET);
    if (!bucketExists) {
      await supabase.storage.createBucket(IMAGE_BUCKET, { public: false });
      console.log(`[Storage] Created bucket: ${IMAGE_BUCKET}`);
    }
    return supabase;
  } catch (err) {
    console.log(`[Storage] Bucket init error: ${err}`);
    throw err;
  }
}

app.post(`${PREFIX}/projects/:projectId/items/:itemId/images`, async (c) => {
  try {
    const itemId = c.req.param("itemId");
    const existing = await kv.get(`quote_item:${itemId}`);
    if (!existing) return c.json({ error: "Item not found" }, 404);

    const { base64, fileName, contentType } = await c.req.json();
    if (!base64) return c.json({ error: "No image data provided" }, 400);

    const supabase = await ensureImageBucket();

    // Extract raw base64 data (strip data:image/...;base64, prefix)
    const rawBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
    const binaryStr = atob(rawBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    const imageId = `img-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const ext = (fileName || "image.jpg").split(".").pop() || "jpg";
    const storagePath = `items/${itemId}/${imageId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .upload(storagePath, bytes, { contentType: contentType || "image/jpeg", upsert: false });

    if (uploadError) {
      console.log(`[Storage] Upload error: ${uploadError.message}`);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    // Generate signed URL (7 days)
    const { data: signedData, error: signError } = await supabase.storage
      .from(IMAGE_BUCKET)
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7);

    if (signError) {
      console.log(`[Storage] Sign URL error: ${signError.message}`);
      return c.json({ error: `Sign URL failed: ${signError.message}` }, 500);
    }

    const newImage = { id: imageId, url: signedData.signedUrl, name: fileName || "image.jpg", path: storagePath };
    const images = [...(existing.images || []), newImage];
    const updated = { ...existing, images, id: itemId, projectId: c.req.param("projectId") };
    await kv.set(`quote_item:${itemId}`, updated);

    console.log(`[Storage] Image uploaded: ${storagePath} for item ${itemId}`);
    return c.json({ data: updated }, 201);
  } catch (err) {
    console.log(`[Storage] Image upload exception: ${err}`);
    return c.json({ error: `Image upload failed: ${err}` }, 500);
  }
});

app.delete(`${PREFIX}/projects/:projectId/items/:itemId/images/:imageId`, async (c) => {
  try {
    const itemId = c.req.param("itemId");
    const imageId = c.req.param("imageId");
    const existing = await kv.get(`quote_item:${itemId}`);
    if (!existing) return c.json({ error: "Item not found" }, 404);

    const images = existing.images || [];
    const imageToDelete = images.find((img: any) => img.id === imageId);

    if (imageToDelete && imageToDelete.path) {
      try {
        const supabase = await ensureImageBucket();
        await supabase.storage.from(IMAGE_BUCKET).remove([imageToDelete.path]);
        console.log(`[Storage] Deleted: ${imageToDelete.path}`);
      } catch (storageErr) {
        console.log(`[Storage] Delete file error (non-fatal): ${storageErr}`);
      }
    }

    const updatedImages = images.filter((img: any) => img.id !== imageId);
    const updated = { ...existing, images: updatedImages, id: itemId, projectId: c.req.param("projectId") };
    await kv.set(`quote_item:${itemId}`, updated);

    return c.json({ data: updated });
  } catch (err) {
    console.log(`[Storage] Image delete exception: ${err}`);
    return c.json({ error: `Image delete failed: ${err}` }, 500);
  }
});

// ─── TIMELINE EVENTS ─────────────────────────────
app.get(`${PREFIX}/projects/:projectId/timeline`, async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const all = await kv.getByPrefix("timeline_event:");
    const events = all.filter((te: any) => te.projectId === projectId);
    events.sort((a: any, b: any) => (a.time || "").localeCompare(b.time || ""));
    return c.json({ data: events });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/projects/:projectId/timeline`, async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const body = await c.req.json();
    const id = body.id || `te-${generateId()}`;
    const event = { id, projectId, time: body.time || "", title: body.title || "", description: body.description || "", icon: body.icon || "📌" };
    await kv.set(`timeline_event:${id}`, event);
    return c.json({ data: event }, 201);
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.delete(`${PREFIX}/projects/:projectId/timeline/:eventId`, async (c) => {
  try {
    const eventId = c.req.param("eventId");
    if (!(await kv.get(`timeline_event:${eventId}`))) return c.json({ error: "Not found" }, 404);
    await kv.del(`timeline_event:${eventId}`);
    return c.json({ data: { success: true, id: eventId } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── DASHBOARD STATS ─────────────────────────────
app.get(`${PREFIX}/dashboard/stats`, async (c) => {
  try {
    const [suppliersList, projectsList] = await Promise.all([kv.getByPrefix("supplier:"), kv.getByPrefix("project:")]);
    const supplierStats = { total: suppliersList.length, verified: suppliersList.filter((s: any) => s.verificationStatus === "verified").length, pending: suppliersList.filter((s: any) => s.verificationStatus === "pending").length, unverified: suppliersList.filter((s: any) => s.verificationStatus === "unverified").length };
    const projectStats = { total: projectsList.length, leads: projectsList.filter((p: any) => p.status === "ליד חדש").length, building: projectsList.filter((p: any) => p.status === "בניית הצעה").length, quotesSent: projectsList.filter((p: any) => p.status === "הצעה נשלחה").length, approved: projectsList.filter((p: any) => p.status === "אושר").length, pricing: projectsList.filter((p: any) => p.status === "מחיר בהערכה").length, inProgress: projectsList.filter((p: any) => p.status === "בביצוע").length };
    const totalRevenue = projectsList.reduce((sum: number, p: any) => sum + (p.totalPrice || 0), 0);
    const projectsWithMargin = projectsList.filter((p: any) => p.profitMargin > 0);
    const avgMargin = projectsWithMargin.length > 0 ? Math.round(projectsWithMargin.reduce((sum: number, p: any) => sum + p.profitMargin, 0) / projectsWithMargin.length) : 0;
    return c.json({ data: { suppliers: supplierStats, projects: projectStats, revenue: { total: totalRevenue, avgMargin } } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── CLIENTS CRUD ───────────────────────────────
app.get(`${PREFIX}/clients`, async (c) => {
  try { return c.json({ data: await kv.getByPrefix("client:") }); }
  catch (err) { return c.json({ error: `Failed to list clients: ${err}` }, 500); }
});

app.get(`${PREFIX}/clients/:id`, async (c) => {
  try {
    const client = await kv.get(`client:${c.req.param("id")}`);
    if (!client) return c.json({ error: "Client not found" }, 404);
    return c.json({ data: client });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/clients`, async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `cl-${generateId()}`;
    const client = {
      id,
      name: body.name || "",
      company: body.company || "",
      phone: body.phone || "",
      email: body.email || "",
      status: body.status || "lead",
      notes: body.notes || "",
      totalProjects: body.totalProjects ?? 0,
      totalRevenue: body.totalRevenue ?? 0,
      createdAt: body.createdAt || new Date().toISOString().split("T")[0],
    };
    await kv.set(`client:${id}`, client);
    console.log(`[Clients] Created: ${id} — ${client.name}`);
    return c.json({ data: client }, 201);
  } catch (err) { return c.json({ error: `Failed to create client: ${err}` }, 500); }
});

app.put(`${PREFIX}/clients/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`client:${id}`);
    if (!existing) return c.json({ error: "Client not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`client:${id}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed to update client: ${err}` }, 500); }
});

app.delete(`${PREFIX}/clients/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    if (!(await kv.get(`client:${id}`))) return c.json({ error: "Client not found" }, 404);
    await kv.del(`client:${id}`);
    console.log(`[Clients] Deleted: ${id}`);
    return c.json({ data: { success: true, id } });
  } catch (err) { return c.json({ error: `Failed to delete client: ${err}` }, 500); }
});

// ─── PUBLIC CLIENT QUOTE ─────────────────────────
app.get(`${PREFIX}/public/quote/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const project = await kv.get(`project:${id}`);
    if (!project) return c.json({ error: "Not found" }, 404);
    const allItems = await kv.getByPrefix("quote_item:");
    const items = allItems.filter((qi: any) => qi.projectId === id).map((qi: any) => ({ type: qi.type, icon: qi.icon, name: qi.name, supplier: qi.supplier, description: qi.description, sellingPrice: qi.sellingPrice }));
    const allEvents = await kv.getByPrefix("timeline_event:");
    const timeline = allEvents.filter((te: any) => te.projectId === id).sort((a: any, b: any) => (a.time || "").localeCompare(b.time || ""));
    return c.json({ data: { name: project.name, company: project.company || project.client, participants: project.participants, region: project.region, totalPrice: project.totalPrice, pricePerPerson: project.pricePerPerson, items, timeline } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── PUBLIC CLIENT APPROVAL ──────────────────────
app.post(`${PREFIX}/public/quote/:id/approve`, async (c) => {
  try {
    const id = c.req.param("id");
    const project = await kv.get(`project:${id}`);
    if (!project) return c.json({ error: "Not found" }, 404);
    const updated = { ...project, status: "אושר", statusColor: "#22c55e" };
    await kv.set(`project:${id}`, updated);
    console.log(`[Public] Client approved project ${id}`);
    return c.json({ data: { success: true } });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

// ─── KANBAN TASKS ────────────────────────────────
const KANBAN_SEED_KEY = "_meta:kanban_seeded_v1";

app.get(`${PREFIX}/kanban/tasks`, async (c) => {
  try {
    const all = await kv.getByPrefix("kanban_task:");
    return c.json({ data: all });
  } catch (err) {
    console.log(`[Kanban] List error: ${err}`);
    return c.json({ error: `Failed to list kanban tasks: ${err}` }, 500);
  }
});

app.post(`${PREFIX}/kanban/tasks`, async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `kt-${generateId()}`;
    const task = {
      id,
      title: body.title || "",
      description: body.description || "",
      type: body.type || "TASK",
      priority: body.priority || "MEDIUM",
      status: body.status || "todo",
      feature: body.feature || "",
      estimate: body.estimate || "",
      tags: body.tags || [],
      createdAt: body.createdAt || new Date().toISOString().split("T")[0],
      version: body.version || "V1",
    };
    await kv.set(`kanban_task:${id}`, task);
    console.log(`[Kanban] Task created: ${id} — ${task.title}`);
    return c.json({ data: task }, 201);
  } catch (err) {
    console.log(`[Kanban] Create error: ${err}`);
    return c.json({ error: `Failed to create kanban task: ${err}` }, 500);
  }
});

app.put(`${PREFIX}/kanban/tasks/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`kanban_task:${id}`);
    if (!existing) return c.json({ error: "Kanban task not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`kanban_task:${id}`, updated);
    return c.json({ data: updated });
  } catch (err) {
    console.log(`[Kanban] Update error: ${err}`);
    return c.json({ error: `Failed to update kanban task: ${err}` }, 500);
  }
});

app.delete(`${PREFIX}/kanban/tasks/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    if (!(await kv.get(`kanban_task:${id}`))) return c.json({ error: "Kanban task not found" }, 404);
    await kv.del(`kanban_task:${id}`);
    console.log(`[Kanban] Task deleted: ${id}`);
    return c.json({ data: { success: true, id } });
  } catch (err) {
    console.log(`[Kanban] Delete error: ${err}`);
    return c.json({ error: `Failed to delete kanban task: ${err}` }, 500);
  }
});

// Bulk seed — writes all provided tasks to KV (idempotent by version key)
app.post(`${PREFIX}/kanban/seed`, async (c) => {
  try {
    const { tasks, version } = await c.req.json();
    const seedKey = version ? `_meta:kanban_seeded_${version}` : KANBAN_SEED_KEY;
    const alreadySeeded = await kv.get(seedKey);
    if (alreadySeeded) return c.json({ data: { skipped: true } });

    if (!tasks || !Array.isArray(tasks)) return c.json({ error: "tasks array required" }, 400);

    // Write tasks in batches of 25
    for (let i = 0; i < tasks.length; i += 25) {
      const batch = tasks.slice(i, i + 25);
      await kv.mset(
        batch.map((t: any) => `kanban_task:${t.id}`),
        batch,
      );
    }
    await kv.set(seedKey, { seededAt: new Date().toISOString(), count: tasks.length });
    console.log(`[Kanban] Seeded ${tasks.length} tasks (${seedKey})`);
    return c.json({ data: { skipped: false, count: tasks.length } });
  } catch (err) {
    console.log(`[Kanban] Seed error: ${err}`);
    return c.json({ error: `Kanban seed failed: ${err}` }, 500);
  }
});

// Bulk update — for drag & drop or batch operations
app.put(`${PREFIX}/kanban/tasks-bulk`, async (c) => {
  try {
    const { tasks } = await c.req.json();
    if (!tasks || !Array.isArray(tasks)) return c.json({ error: "tasks array required" }, 400);
    for (let i = 0; i < tasks.length; i += 25) {
      const batch = tasks.slice(i, i + 25);
      await kv.mset(
        batch.map((t: any) => `kanban_task:${t.id}`),
        batch,
      );
    }
    console.log(`[Kanban] Bulk updated ${tasks.length} tasks`);
    return c.json({ data: { updated: tasks.length } });
  } catch (err) {
    console.log(`[Kanban] Bulk update error: ${err}`);
    return c.json({ error: `Kanban bulk update failed: ${err}` }, 500);
  }
});

// ─── PROJECT DOCUMENTS CRUD ─────────────────────
app.get(`${PREFIX}/projects/:projectId/documents`, async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const all = await kv.getByPrefix("project_document:");
    return c.json({ data: all.filter((d: any) => d.projectId === projectId) });
  } catch (err) { return c.json({ error: `Failed to list project documents: ${err}` }, 500); }
});

app.post(`${PREFIX}/projects/:projectId/documents`, async (c) => {
  try {
    const projectId = c.req.param("projectId");
    const body = await c.req.json();
    const id = body.id || `pdoc-${generateId()}`;
    const doc = {
      id,
      projectId,
      name: body.name || "",
      type: body.type || "other",
      expiry: body.expiry || null,
      status: body.status || "active",
      fileName: body.fileName || null,
      createdAt: body.createdAt || new Date().toISOString().split("T")[0],
    };
    await kv.set(`project_document:${id}`, doc);
    console.log(`[ProjectDocs] Created: ${id} — ${doc.name}`);
    return c.json({ data: doc }, 201);
  } catch (err) { return c.json({ error: `Failed to create project document: ${err}` }, 500); }
});

app.put(`${PREFIX}/projects/:projectId/documents/:docId`, async (c) => {
  try {
    const docId = c.req.param("docId");
    const existing = await kv.get(`project_document:${docId}`);
    if (!existing) return c.json({ error: "Project document not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id: docId, projectId: c.req.param("projectId") };
    await kv.set(`project_document:${docId}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed to update project document: ${err}` }, 500); }
});

app.delete(`${PREFIX}/projects/:projectId/documents/:docId`, async (c) => {
  try {
    const docId = c.req.param("docId");
    if (!(await kv.get(`project_document:${docId}`))) return c.json({ error: "Project document not found" }, 404);
    await kv.del(`project_document:${docId}`);
    console.log(`[ProjectDocs] Deleted: ${docId}`);
    return c.json({ data: { success: true, id: docId } });
  } catch (err) { return c.json({ error: `Failed to delete project document: ${err}` }, 500); }
});

// ─── CALENDAR CRUD ──────────────────────────────
app.get(`${PREFIX}/calendar`, async (c) => {
  try { return c.json({ data: await kv.getByPrefix("calendar_event:") }); }
  catch (err) { return c.json({ error: `Failed to list calendar events: ${err}` }, 500); }
});

app.get(`${PREFIX}/calendar/:id`, async (c) => {
  try {
    const evt = await kv.get(`calendar_event:${c.req.param("id")}`);
    if (!evt) return c.json({ error: "Calendar event not found" }, 404);
    return c.json({ data: evt });
  } catch (err) { return c.json({ error: `Failed: ${err}` }, 500); }
});

app.post(`${PREFIX}/calendar`, async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `cal-${generateId()}`;
    const evt = {
      id,
      title: body.title || "",
      description: body.description || "",
      date: body.date || new Date().toISOString().split("T")[0],
      startTime: body.startTime || "09:00",
      endTime: body.endTime || "10:00",
      type: body.type || "meeting",
      color: body.color || "#3b82f6",
      projectId: body.projectId || null,
    };
    await kv.set(`calendar_event:${id}`, evt);
    console.log(`[Calendar] Created: ${id} — ${evt.title}`);
    return c.json({ data: evt }, 201);
  } catch (err) { return c.json({ error: `Failed to create calendar event: ${err}` }, 500); }
});

app.put(`${PREFIX}/calendar/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    const existing = await kv.get(`calendar_event:${id}`);
    if (!existing) return c.json({ error: "Calendar event not found" }, 404);
    const body = await c.req.json();
    const updated = { ...existing, ...body, id };
    await kv.set(`calendar_event:${id}`, updated);
    return c.json({ data: updated });
  } catch (err) { return c.json({ error: `Failed to update calendar event: ${err}` }, 500); }
});

app.delete(`${PREFIX}/calendar/:id`, async (c) => {
  try {
    const id = c.req.param("id");
    if (!(await kv.get(`calendar_event:${id}`))) return c.json({ error: "Calendar event not found" }, 404);
    await kv.del(`calendar_event:${id}`);
    console.log(`[Calendar] Deleted: ${id}`);
    return c.json({ data: { success: true, id } });
  } catch (err) { return c.json({ error: `Failed to delete calendar event: ${err}` }, 500); }
});

Deno.serve(app.fetch);