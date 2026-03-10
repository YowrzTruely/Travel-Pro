import { v } from "convex/values";
import { query } from "./_generated/server";

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const [suppliersList, projectsList] = await Promise.all([
      ctx.db.query("suppliers").collect(),
      ctx.db.query("projects").collect(),
    ]);

    const supplierStats = {
      total: suppliersList.length,
      verified: suppliersList.filter((s) => s.verificationStatus === "verified")
        .length,
      pending: suppliersList.filter((s) => s.verificationStatus === "pending")
        .length,
      unverified: suppliersList.filter(
        (s) => s.verificationStatus === "unverified"
      ).length,
    };

    const projectStats = {
      total: projectsList.length,
      leads: projectsList.filter((p) => p.status === "ליד חדש").length,
      building: projectsList.filter((p) => p.status === "בניית הצעה").length,
      quotesSent: projectsList.filter((p) => p.status === "הצעה נשלחה").length,
      approved: projectsList.filter((p) => p.status === "אושר").length,
      pricing: projectsList.filter((p) => p.status === "מחיר בהערכה").length,
      inProgress: projectsList.filter((p) => p.status === "בביצוע").length,
    };

    const totalRevenue = projectsList.reduce(
      (sum, p) => sum + (p.totalPrice || 0),
      0
    );
    const projectsWithMargin = projectsList.filter((p) => p.profitMargin > 0);
    const avgMargin =
      projectsWithMargin.length > 0
        ? Math.round(
            projectsWithMargin.reduce((sum, p) => sum + p.profitMargin, 0) /
              projectsWithMargin.length
          )
        : 0;

    return {
      suppliers: supplierStats,
      projects: projectStats,
      revenue: { total: totalRevenue, avgMargin },
    };
  },
});

// ─── Morning HQ: events today + tomorrow ───
export const morningHQ = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const tomorrow = new Date(now.getTime() + 86_400_000)
      .toISOString()
      .split("T")[0];

    // Get calendar events for today and tomorrow
    const calendarEvents = await ctx.db.query("calendarEvents").collect();
    const relevantEvents = calendarEvents.filter(
      (e) => e.date === today || e.date === tomorrow
    );

    // Get projects to enrich event data
    const projects = await ctx.db.query("projects").collect();
    const projectMap = new Map(projects.map((p) => [p._id.toString(), p]));

    const events = relevantEvents.map((e) => {
      const project = e.projectId ? projectMap.get(e.projectId) : null;
      return {
        id: e._id,
        title: e.title,
        date: e.date,
        startTime: e.startTime ?? null,
        endTime: e.endTime ?? null,
        type: e.type ?? null,
        projectId: e.projectId ?? null,
        participants: project?.participants ?? 0,
        region: project?.region ?? null,
        projectName: project?.name ?? null,
      };
    });

    // Also include projects with dates matching today/tomorrow
    const projectEvents = projects
      .filter((p) => p.date === today || p.date === tomorrow)
      .filter(
        (p) => !relevantEvents.some((e) => e.projectId === p._id.toString())
      )
      .map((p) => ({
        id: p._id,
        title: p.name,
        date: p.date ?? today,
        startTime: null,
        endTime: null,
        type: "project" as const,
        projectId: p._id.toString(),
        participants: p.participants,
        region: p.region ?? null,
        projectName: p.name,
      }));

    return {
      today,
      tomorrow,
      events: [...events, ...projectEvents],
    };
  },
});

// ─── Quote Heat Meter ───
export const quoteHeatMeter = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();

    const sent = projects.filter((p) => p.status === "הצעה נשלחה").length;
    const discussing = projects.filter(
      (p) => p.status === "בניית הצעה" || p.status === "מחיר בהערכה"
    ).length;
    const closed = projects.filter(
      (p) => p.status === "אושר" || p.status === "בביצוע"
    ).length;
    const lost = projects.filter((p) => p.status === "בוטל").length;
    const total = sent + discussing + closed + lost;
    const closeRate = total > 0 ? Math.round((closed / total) * 100) : 0;

    return { sent, discussing, closed, lost, total, closeRate };
  },
});

// ─── Urgent Alerts ───
export const urgentAlerts = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    const alerts: {
      id: string;
      type: "document" | "booking" | "invoice";
      message: string;
      severity: "red" | "yellow" | "orange";
      link: string;
    }[] = [];

    // Supplier documents expiring in 7 days
    const docs = await ctx.db.query("supplierDocuments").collect();
    const suppliers = await ctx.db.query("suppliers").collect();
    const supplierMap = new Map(suppliers.map((s) => [s._id.toString(), s]));

    for (const doc of docs) {
      if (doc.expiry) {
        const expiryDate = new Date(doc.expiry).getTime();
        const daysUntilExpiry = Math.ceil((expiryDate - now) / 86_400_000);
        if (daysUntilExpiry <= 0) {
          const supplier = supplierMap.get(doc.supplierId.toString());
          alerts.push({
            id: doc._id.toString(),
            type: "document",
            message: `מסמך "${doc.name}" של ${supplier?.name ?? "ספק"} פג תוקף`,
            severity: "red",
            link: `/suppliers/${doc.supplierId}`,
          });
        } else if (daysUntilExpiry <= 7) {
          const supplier = supplierMap.get(doc.supplierId.toString());
          alerts.push({
            id: doc._id.toString(),
            type: "document",
            message: `מסמך "${doc.name}" של ${supplier?.name ?? "ספק"} יפוג בעוד ${daysUntilExpiry} ימים`,
            severity: "orange",
            link: `/suppliers/${doc.supplierId}`,
          });
        }
      }
    }

    // Bookings expiring soon
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_status", (q) => q.eq("status", "reserved"))
      .collect();

    for (const booking of bookings) {
      if (booking.expiresAt && booking.expiresAt < now + sevenDaysMs) {
        const supplier = supplierMap.get(booking.supplierId.toString());
        const project = await ctx.db.get(booking.projectId);
        const daysLeft = Math.max(
          0,
          Math.ceil((booking.expiresAt - now) / 86_400_000)
        );
        alerts.push({
          id: booking._id.toString(),
          type: "booking",
          message: `שריון ${supplier?.name ?? "ספק"} לפרויקט "${project?.name ?? ""}" יפוג בעוד ${daysLeft} ימים`,
          severity: daysLeft <= 1 ? "red" : "yellow",
          link: `/projects/${booking.projectId}`,
        });
      }
    }

    // Invoices with pending status
    const invoices = await ctx.db
      .query("invoiceTracking")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    for (const inv of invoices) {
      const supplier = supplierMap.get(inv.supplierId.toString());
      const project = await ctx.db.get(inv.projectId);
      alerts.push({
        id: inv._id.toString(),
        type: "invoice",
        message: `חשבונית חסרה מ${supplier?.name ?? "ספק"} לפרויקט "${project?.name ?? ""}"`,
        severity: "yellow",
        link: `/projects/${inv.projectId}`,
      });
    }

    // Sort by severity
    const severityOrder = { red: 0, orange: 1, yellow: 2 };
    alerts.sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    );

    return alerts.slice(0, 20);
  },
});

// ─── Open Reservations ───
export const openReservations = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_status", (q) => q.eq("status", "reserved"))
      .collect();

    const suppliers = await ctx.db.query("suppliers").collect();
    const supplierMap = new Map(suppliers.map((s) => [s._id.toString(), s]));

    const reservations: {
      id: string;
      supplierName: string;
      projectName: string;
      projectId: string;
      date: string;
      expiresAt: number | null;
      status: string;
      participants: number;
    }[] = [];
    for (const b of bookings) {
      const supplier = supplierMap.get(b.supplierId.toString());
      const project = await ctx.db.get(b.projectId);
      reservations.push({
        id: b._id,
        supplierName: supplier?.name ?? "ספק לא ידוע",
        projectName: project?.name ?? "פרויקט לא ידוע",
        projectId: b.projectId,
        date: b.date,
        expiresAt: b.expiresAt ?? null,
        status: b.status,
        participants: b.participants,
      });
    }

    return reservations;
  },
});

// ─── Event Headcount (today) ───
export const eventHeadcount = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const projects = await ctx.db.query("projects").collect();
    const todayProjects = projects.filter((p) => p.date === today);

    const totalParticipants = todayProjects.reduce(
      (sum, p) => sum + (p.participants || 0),
      0
    );

    return {
      date: today,
      eventCount: todayProjects.length,
      totalParticipants,
      events: todayProjects.map((p) => ({
        id: p._id,
        name: p.name,
        participants: p.participants,
        region: p.region ?? null,
      })),
    };
  },
});

// ─── Supplier Stats (for supplier dashboard) ───
export const supplierStats = query({
  args: { supplierId: v.id("suppliers") },
  handler: async (ctx, args) => {
    const [requests, bookings, ratings, documents] = await Promise.all([
      ctx.db
        .query("availabilityRequests")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
        .collect(),
      ctx.db
        .query("bookings")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
        .collect(),
      ctx.db
        .query("supplierRatings")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
        .collect(),
      ctx.db
        .query("supplierDocuments")
        .withIndex("by_supplierId", (q) => q.eq("supplierId", args.supplierId))
        .collect(),
    ]);

    const pendingRequests = requests.filter(
      (r) => r.status === "pending"
    ).length;
    const activeBookings = bookings.filter(
      (b) => b.status === "reserved" || b.status === "confirmed"
    ).length;
    const avgRating =
      ratings.length > 0
        ? Math.round(
            (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) *
              10
          ) / 10
        : 0;
    const totalRatings = ratings.length;
    const missingDocs = documents.filter(
      (d) => d.status === "expired" || d.status === "warning"
    ).length;

    return {
      pendingRequests,
      activeBookings,
      avgRating,
      totalRatings,
      missingDocs,
      totalDocs: documents.length,
    };
  },
});

// ─── Admin Stats ───
export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    const [users, projects, suppliers] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("projects").collect(),
      ctx.db.query("suppliers").collect(),
    ]);

    const producers = users.filter((u) => u.role === "producer").length;
    const supplierUsers = users.filter((u) => u.role === "supplier").length;
    const admins = users.filter((u) => u.role === "admin").length;
    const pendingApprovals = suppliers.filter(
      (s) => s.registrationStatus === "pending"
    ).length;

    return {
      totalUsers: users.length,
      producers,
      supplierUsers,
      admins,
      totalProjects: projects.length,
      totalSuppliers: suppliers.length,
      pendingApprovals,
    };
  },
});

// ─── Admin KPIs ───
export const adminKPIs = query({
  args: {},
  handler: async (ctx) => {
    const [users, projects, suppliers] = await Promise.all([
      ctx.db.query("users").collect(),
      ctx.db.query("projects").collect(),
      ctx.db.query("suppliers").collect(),
    ]);

    const registeredSuppliers = suppliers.length;
    const producers = users.filter((u) => u.role === "producer").length;
    const quotesBuilt = projects.filter(
      (p) =>
        p.status === "הצעה נשלחה" ||
        p.status === "אושר" ||
        p.status === "בביצוע"
    ).length;

    // Profile completion: suppliers with all key fields filled
    const completedProfiles = suppliers.filter(
      (s) => s.name && s.category && s.phone && s.email && s.region
    ).length;
    const profileCompletionRate =
      registeredSuppliers > 0
        ? Math.round((completedProfiles / registeredSuppliers) * 100)
        : 0;

    return {
      registeredSuppliers,
      producers,
      quotesBuilt,
      profileCompletionRate,
    };
  },
});
