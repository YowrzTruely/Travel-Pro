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
