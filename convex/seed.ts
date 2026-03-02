import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const meta = await ctx.db
      .query("metadata")
      .withIndex("by_key", (q) => q.eq("key", "_meta:seeded"))
      .first();
    if (meta) {
      return { skipped: true };
    }

    // ─── Suppliers ───
    const supplierMap: Record<string, Id<"suppliers">> = {};

    const SEED_SUPPLIERS = [
      {
        legacyId: "1",
        name: "הסעות מסיילי הצפון",
        phone: "514423982",
        category: "תחבורה",
        categoryColor: "#3b82f6",
        region: "צפון",
        rating: 4.5,
        verificationStatus: "verified" as const,
        notes: "-",
        icon: "🚌",
      },
      {
        legacyId: "2",
        name: "קייטרינג סאמי המזרח",
        phone: "032115664",
        category: "מזון",
        categoryColor: "#22c55e",
        region: "ירושלים",
        rating: 4.0,
        verificationStatus: "pending" as const,
        notes: "מסמכים חסרים",
        icon: "🍽️",
      },
      {
        legacyId: "3",
        name: "ספורט אתגרי בנגב",
        phone: "520038441",
        category: "אטרקציות",
        categoryColor: "#a855f7",
        region: "דרום",
        rating: 5.0,
        verificationStatus: "unverified" as const,
        notes: "נדרש חידוש ביטוח",
        icon: "🏃",
      },
      {
        legacyId: "4",
        name: "מלון פלאזה - מרכז",
        phone: "510098442",
        category: "לינה",
        categoryColor: "#ec4899",
        region: "מרכז",
        rating: 3.2,
        verificationStatus: "verified" as const,
        notes: "-",
        icon: "🏨",
      },
      {
        legacyId: "5",
        name: "יקב רמת נפתלי",
        phone: "049876543",
        category: "אטרקציות",
        categoryColor: "#a855f7",
        region: "צפון",
        rating: 4.8,
        verificationStatus: "verified" as const,
        notes: "-",
        icon: "🍷",
      },
      {
        legacyId: "6",
        name: "אוטובוסים הגליל",
        phone: "047654321",
        category: "תחבורה",
        categoryColor: "#3b82f6",
        region: "צפון",
        rating: 4.2,
        verificationStatus: "verified" as const,
        notes: "-",
        icon: "🚌",
      },
    ];

    for (const s of SEED_SUPPLIERS) {
      const id = await ctx.db.insert("suppliers", s);
      supplierMap[s.legacyId] = id;
    }

    // ─── Supplier Contacts ───
    const SEED_CONTACTS = [
      {
        legacyId: "sc-1",
        supplierLegacyId: "5",
        name: "יצחק ברוך",
        role: 'בעלים ומנכ"ל',
        phone: "054-1234567",
        email: "yitzhak@ramatnaftali.co.il",
        primary: true,
      },
      {
        legacyId: "sc-2",
        supplierLegacyId: "5",
        name: "מיכל לוי",
        role: "מנהלת אירועים ושיווק",
        phone: "050-7654321",
        email: "michal@ramatnaftali.co.il",
        primary: false,
      },
      {
        legacyId: "sc-3",
        supplierLegacyId: "6",
        name: "דוד כהן",
        role: "מנהל תפעול",
        phone: "052-9876543",
        email: "david@galil-bus.co.il",
        primary: true,
      },
    ];

    for (const c of SEED_CONTACTS) {
      const supplierId = supplierMap[c.supplierLegacyId];
      if (supplierId) {
        await ctx.db.insert("supplierContacts", {
          legacyId: c.legacyId,
          supplierId,
          name: c.name,
          role: c.role,
          phone: c.phone,
          email: c.email,
          primary: c.primary,
        });
      }
    }

    // ─── Supplier Products ───
    const SEED_PRODUCTS = [
      {
        legacyId: "sp-1",
        supplierLegacyId: "5",
        name: "סיור ביקב וטעימות יין",
        price: 120,
        description: "סיור מודרך בכרמים ובחביות, הדגמת תהליך הייצור.",
        unit: "אדם",
      },
      {
        legacyId: "sp-2",
        supplierLegacyId: "5",
        name: "פלטת גבינות גליליות",
        price: 85,
        description: "מבחר גבינות מחלבות בוטיק בגליל.",
        unit: "אדם",
      },
      {
        legacyId: "sp-3",
        supplierLegacyId: "5",
        name: "אירועי חברה בוטיק",
        price: 5000,
        description: "אירוח פרטי עד 50 איש. ארוחת שף בתנור אבן.",
        unit: "אירוע",
      },
      {
        legacyId: "sp-4",
        supplierLegacyId: "6",
        name: "אוטובוס ממוגן 55 מקומות",
        price: 2500,
        description: "אוטובוס מפואר עם Wi-Fi, מיזוג ומושבים מרופדים.",
        unit: "יום",
      },
    ];

    for (const p of SEED_PRODUCTS) {
      const supplierId = supplierMap[p.supplierLegacyId];
      if (supplierId) {
        await ctx.db.insert("supplierProducts", {
          legacyId: p.legacyId,
          supplierId,
          name: p.name,
          price: p.price,
          description: p.description,
          unit: p.unit,
        });
      }
    }

    // ─── Supplier Documents ───
    const SEED_DOCS = [
      {
        legacyId: "sd-1",
        supplierLegacyId: "5",
        name: "רישיון עסק",
        expiry: "2026-01-01",
        status: "valid" as const,
      },
      {
        legacyId: "sd-2",
        supplierLegacyId: "5",
        name: "תעודת כשרות",
        expiry: "2024-09-15",
        status: "warning" as const,
      },
      {
        legacyId: "sd-3",
        supplierLegacyId: "5",
        name: "ביטוח צד ג'",
        expiry: "2024-05-01",
        status: "expired" as const,
      },
      {
        legacyId: "sd-4",
        supplierLegacyId: "6",
        name: "רישיון הובלה",
        expiry: "2025-12-31",
        status: "valid" as const,
      },
      {
        legacyId: "sd-5",
        supplierLegacyId: "6",
        name: "ביטוח נוסעים",
        expiry: "2025-06-30",
        status: "valid" as const,
      },
    ];

    for (const d of SEED_DOCS) {
      const supplierId = supplierMap[d.supplierLegacyId];
      if (supplierId) {
        await ctx.db.insert("supplierDocuments", {
          legacyId: d.legacyId,
          supplierId,
          name: d.name,
          expiry: d.expiry,
          status: d.status,
        });
      }
    }

    // ─── Projects ───
    const projectMap: Record<string, Id<"projects">> = {};

    const SEED_PROJECTS = [
      {
        legacyId: "4829-24",
        name: "נופש שנתי גליל עליון",
        client: "סייבר-גלובל",
        company: "סייבר-גלובל",
        participants: 120,
        region: "גליל עליון",
        status: "בניית הצעה",
        statusColor: "#f97316",
        totalPrice: 102_000,
        pricePerPerson: 850,
        profitMargin: 25,
        date: "2024-03-15",
      },
      {
        legacyId: "4830-24",
        name: "כנס מכירות Q1",
        client: "טכנו-פלוס",
        company: "טכנו-פלוס",
        participants: 80,
        region: "אילת",
        status: "ליד חדש",
        statusColor: "#3b82f6",
        totalPrice: 0,
        pricePerPerson: 0,
        profitMargin: 0,
        date: "2024-03-20",
      },
      {
        legacyId: "4831-24",
        name: "יום כיף צוות פיתוח",
        client: "קליקסופט",
        company: "קליקסופט",
        participants: 45,
        region: "מרכז",
        status: "הצעה נשלחה",
        statusColor: "#8b5cf6",
        totalPrice: 38_250,
        pricePerPerson: 850,
        profitMargin: 22,
        date: "2024-03-10",
      },
      {
        legacyId: "4832-24",
        name: "אירוע חברה שנתי",
        client: "מדיה-וורקס",
        company: "מדיה-וורקס",
        participants: 200,
        region: "ירושלים",
        status: "אושר",
        statusColor: "#22c55e",
        totalPrice: 180_000,
        pricePerPerson: 900,
        profitMargin: 28,
        date: "2024-02-28",
      },
      {
        legacyId: "4833-24",
        name: "סדנת גיבוש הנהלה",
        client: "פיננס-פרו",
        company: "פיננס-פרו",
        participants: 25,
        region: "גולן",
        status: "מחיר בהערכה",
        statusColor: "#eab308",
        totalPrice: 0,
        pricePerPerson: 0,
        profitMargin: 0,
        date: "2024-03-18",
      },
    ];

    for (const p of SEED_PROJECTS) {
      const id = await ctx.db.insert("projects", p);
      projectMap[p.legacyId] = id;
    }

    // ─── Quote Items ───
    const SEED_QUOTE_ITEMS = [
      {
        legacyId: "qi-1",
        projectLegacyId: "4829-24",
        type: "תחבורה",
        icon: "🚌",
        name: "אוטובוסים הגליל",
        supplier: "אוטובוסים הגליל",
        description: "3 אוטובוסים ממוגנים, איסוף מהמרכז",
        cost: 7500,
        directPrice: 9500,
        sellingPrice: 9000,
        profitWeight: 2,
        status: "approved",
        alternatives: [] as any[],
      },
      {
        legacyId: "qi-2",
        projectLegacyId: "4829-24",
        type: "פעילות בוקר",
        icon: "🎯",
        name: "רייזרס בגוף",
        supplier: "רייזרס בגוף",
        description: "מתחם ג׳ונגל/רייזרים",
        cost: 28_800,
        directPrice: 37_200,
        sellingPrice: 36_000,
        profitWeight: 4,
        status: "modified",
        alternatives: [
          {
            id: "a1",
            name: "רייזרס בגוף",
            description: "מתחם ג׳ונגל/רייזרים",
            costPerPerson: 240,
            selected: true,
          },
          {
            id: "a2",
            name: "קייקי הגליל",
            description: "מתחם פעילות/רייזרים",
            costPerPerson: 110,
            selected: false,
          },
          {
            id: "a3",
            name: "ספק מהאינטרנט",
            description: "מתחם ביער/בגוף",
            costPerPerson: 180,
            selected: false,
          },
        ],
      },
    ];

    for (const qi of SEED_QUOTE_ITEMS) {
      const projectId = projectMap[qi.projectLegacyId];
      if (projectId) {
        await ctx.db.insert("quoteItems", {
          legacyId: qi.legacyId,
          projectId,
          type: qi.type,
          icon: qi.icon,
          name: qi.name,
          supplier: qi.supplier,
          description: qi.description,
          cost: qi.cost,
          directPrice: qi.directPrice,
          sellingPrice: qi.sellingPrice,
          profitWeight: qi.profitWeight,
          status: qi.status,
          alternatives: qi.alternatives,
        });
      }
    }

    // ─── Timeline Events ───
    const SEED_TIMELINE = [
      {
        legacyId: "te-1",
        projectLegacyId: "4829-24",
        time: "08:00",
        title: "יציאה ואיסוף",
        description: "נקודת מפגש: חניון הבימה מיני גלילות. חלוקת ערכות בוקר.",
        icon: "🚌",
      },
      {
        legacyId: "te-2",
        projectLegacyId: "4829-24",
        time: "10:30",
        title: "פעילות בוקר - רייזרים",
        description: "הגעה למתחם רייזרים בגוף. מדריך בטיחות ויציאה למסלול!",
        icon: "🎯",
      },
      {
        legacyId: "te-3",
        projectLegacyId: "4829-24",
        time: "13:00",
        title: "ארוחת צהריים",
        description: 'ארוחת בשרים כשרה למהדרין במסעדת "החווה".',
        icon: "🍽️",
      },
    ];

    for (const te of SEED_TIMELINE) {
      const projectId = projectMap[te.projectLegacyId];
      if (projectId) {
        await ctx.db.insert("timelineEvents", {
          legacyId: te.legacyId,
          projectId,
          time: te.time,
          title: te.title,
          description: te.description,
          icon: te.icon,
        });
      }
    }

    // ─── Clients ───
    const SEED_CLIENTS = [
      {
        legacyId: "cl-1",
        name: "יוסי כהן",
        company: "סייבר-גלובל",
        phone: "054-1234567",
        email: "yosi@cyberglobal.co.il",
        status: "active" as const,
        notes: "לקוח VIP",
        totalProjects: 3,
        totalRevenue: 280_000,
        createdAt: "2023-06-15",
      },
      {
        legacyId: "cl-2",
        name: "דנה לוי",
        company: "טכנו-פלוס",
        phone: "052-9876543",
        email: "dana@technoplus.co.il",
        status: "lead" as const,
        notes: "פנתה דרך האתר",
        totalProjects: 0,
        totalRevenue: 0,
        createdAt: "2024-02-01",
      },
      {
        legacyId: "cl-3",
        name: "אבי ישראלי",
        company: "קליקסופט",
        phone: "050-5551234",
        email: "avi@clicksoft.co.il",
        status: "active" as const,
        notes: "-",
        totalProjects: 1,
        totalRevenue: 38_250,
        createdAt: "2023-11-20",
      },
      {
        legacyId: "cl-4",
        name: "מיכל ברון",
        company: "מדיה-וורקס",
        phone: "053-7778899",
        email: "michal@mediaworks.co.il",
        status: "active" as const,
        notes: "אירוע שנתי קבוע",
        totalProjects: 2,
        totalRevenue: 180_000,
        createdAt: "2023-01-10",
      },
      {
        legacyId: "cl-5",
        name: "רון אלמוג",
        company: "פיננס-פרו",
        phone: "058-3334455",
        email: "ron@financepro.co.il",
        status: "lead" as const,
        notes: "מחכה להצעת מחיר",
        totalProjects: 0,
        totalRevenue: 0,
        createdAt: "2024-03-05",
      },
    ];

    for (const cl of SEED_CLIENTS) {
      await ctx.db.insert("clients", cl);
    }

    // Mark as seeded
    await ctx.db.insert("metadata", {
      key: "_meta:seeded",
      value: { seededAt: new Date().toISOString() },
    });

    return {
      skipped: false,
      suppliers: SEED_SUPPLIERS.length,
      projects: SEED_PROJECTS.length,
      clients: SEED_CLIENTS.length,
    };
  },
});
