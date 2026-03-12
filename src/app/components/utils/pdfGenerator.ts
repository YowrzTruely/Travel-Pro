import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ─── Types ─────────────────────────────────────────────────── */

interface PdfProject {
  client?: string;
  company?: string;
  date?: string;
  name: string;
  openingParagraph?: string;
  participants: number;
  pricePerPerson: number;
  region?: string;
  totalPrice: number;
  tripName?: string;
}

interface PdfQuoteItem {
  cost: number;
  description?: string;
  equipmentRequirements?: string[];
  grossTime?: number;
  name: string;
  netTime?: number;
  sellingPrice: number;
  supplier?: string;
  type?: string;
}

interface PdfTimelineEvent {
  description?: string;
  time: string;
  title: string;
}

/* ─── Helpers ───────────────────────────────────────────────── */

/** Reverse Hebrew text segments for PDF rendering (jsPDF doesn't support RTL natively) */
function reverseHebrew(text: string): string {
  // Split into lines, reverse each line's character order for RTL display
  return text
    .split("\n")
    .map((line) => line.split("").reverse().join(""))
    .join("\n");
}

/** Format currency */
function formatCurrency(amount: number): string {
  return `₪${amount.toLocaleString("he-IL")}`;
}

/** Format date for display */
function formatDate(date?: string): string {
  if (!date) {
    return new Date().toLocaleDateString("he-IL");
  }
  return date;
}

/** Common PDF setup */
function createPdf(): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  return doc;
}

/** Add branded header to PDF */
function addHeader(doc: jsPDF, title: string, subtitle?: string) {
  // Orange accent bar
  doc.setFillColor(255, 140, 0);
  doc.rect(0, 0, 210, 12, "F");

  // Title
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Eventos", 105, 8, { align: "center" });

  // Main title below bar
  doc.setFontSize(20);
  doc.setTextColor(24, 21, 16);
  doc.text(reverseHebrew(title), 105, 25, { align: "center" });

  if (subtitle) {
    doc.setFontSize(11);
    doc.setTextColor(141, 120, 94);
    doc.text(reverseHebrew(subtitle), 105, 33, { align: "center" });
  }
}

/** Add footer to PDF */
function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(184, 169, 144);
    doc.text(
      `Eventos | ${new Date().toLocaleDateString("he-IL")} | ${reverseHebrew("עמוד")} ${i}/${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }
}

/** Trigger browser download */
function downloadPdf(doc: jsPDF, filename: string) {
  doc.save(filename);
}

/* ─── PDF Generators ────────────────────────────────────────── */

/**
 * Generate a branded client quote PDF
 */
export function generateQuotePdf(
  project: PdfProject,
  items: PdfQuoteItem[],
  timeline: PdfTimelineEvent[]
) {
  const doc = createPdf();
  const projectName = project.tripName || project.name;

  addHeader(
    doc,
    reverseHebrew("הצעת מחיר"),
    `${reverseHebrew(projectName)} — ${reverseHebrew(project.company || "")}`
  );

  let y = 40;

  // Opening paragraph
  if (project.openingParagraph) {
    doc.setFontSize(10);
    doc.setTextColor(24, 21, 16);
    const lines = doc.splitTextToSize(
      reverseHebrew(project.openingParagraph),
      170
    );
    doc.text(lines, 105, y, { align: "center" });
    y += lines.length * 5 + 5;
  }

  // Summary boxes
  doc.setFillColor(248, 247, 245);
  doc.roundedRect(15, y, 180, 20, 3, 3, "F");

  doc.setFontSize(9);
  doc.setTextColor(141, 120, 94);
  const summaryItems = [
    { label: "משתתפים", value: String(project.participants) },
    { label: "מחיר לאדם", value: formatCurrency(project.pricePerPerson) },
    { label: 'סה"כ', value: formatCurrency(project.totalPrice) },
    { label: "אזור", value: project.region || "-" },
    { label: "תאריך", value: formatDate(project.date) },
  ];

  const boxWidth = 180 / summaryItems.length;
  for (let i = 0; i < summaryItems.length; i++) {
    const x = 15 + boxWidth * i + boxWidth / 2;
    doc.setFontSize(7);
    doc.setTextColor(141, 120, 94);
    doc.text(reverseHebrew(summaryItems[i].label), x, y + 7, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setTextColor(24, 21, 16);
    doc.text(summaryItems[i].value, x, y + 14, { align: "center" });
  }

  y += 28;

  // Items table
  if (items.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(24, 21, 16);
    doc.text(reverseHebrew("פירוט רכיבים"), 195, y, { align: "right" });

    // Orange underline
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [
        [
          reverseHebrew("מחיר"),
          reverseHebrew("ספק"),
          reverseHebrew("רכיב"),
          reverseHebrew("סוג"),
        ],
      ],
      body: items.map((item) => [
        formatCurrency(item.sellingPrice),
        reverseHebrew(item.supplier || "-"),
        reverseHebrew(item.name),
        reverseHebrew(item.type || "-"),
      ]),
      foot: [
        [formatCurrency(project.totalPrice), "", "", reverseHebrew('סה"כ')],
      ],
      styles: {
        fontSize: 9,
        cellPadding: 4,
        halign: "center",
      },
      headStyles: {
        fillColor: [248, 247, 245],
        textColor: [141, 120, 94],
        fontStyle: "bold",
        halign: "center",
      },
      footStyles: {
        fillColor: [24, 21, 16],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [252, 251, 250],
      },
      margin: { left: 15, right: 15 },
    });

    y = (doc as any).lastAutoTable?.finalY ?? y + 50;
    y += 10;
  }

  // Timeline
  if (timeline.length > 0) {
    // Check if we need a new page
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(24, 21, 16);
    doc.text(reverseHebrew('לו"ז הפעילות'), 195, y, { align: "right" });
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 10;

    for (const event of timeline) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      // Time badge
      doc.setFillColor(255, 140, 0);
      doc.roundedRect(170, y - 4, 25, 8, 2, 2, "F");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(event.time, 182.5, y + 1, { align: "center" });

      // Title
      doc.setFontSize(10);
      doc.setTextColor(24, 21, 16);
      doc.text(reverseHebrew(event.title), 165, y + 1, { align: "right" });

      // Description
      if (event.description) {
        doc.setFontSize(8);
        doc.setTextColor(141, 120, 94);
        const descLines = doc.splitTextToSize(
          reverseHebrew(event.description),
          150
        );
        doc.text(descLines, 165, y + 6, { align: "right" });
        y += 6 + descLines.length * 4;
      } else {
        y += 8;
      }

      y += 4;
    }
  }

  addFooter(doc);
  downloadPdf(doc, `quote-${project.name.replace(/\s+/g, "-")}.pdf`);
}

/**
 * Generate an equipment list PDF
 */
export function generateEquipmentPdf(
  project: PdfProject,
  items: PdfQuoteItem[]
) {
  const doc = createPdf();
  addHeader(
    doc,
    reverseHebrew("רשימת ציוד"),
    reverseHebrew(project.tripName || project.name)
  );

  const y = 42;

  // Collect all equipment requirements
  const equipmentByItem = items
    .filter(
      (item) =>
        item.equipmentRequirements && item.equipmentRequirements.length > 0
    )
    .map((item) => ({
      activity: item.name,
      supplier: item.supplier || "-",
      equipment: item.equipmentRequirements || [],
    }));

  if (equipmentByItem.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(141, 120, 94);
    doc.text(reverseHebrew("לא נמצאו דרישות ציוד עבור הפרויקט הזה"), 105, y, {
      align: "center",
    });
  } else {
    // Build flat table rows
    const rows: string[][] = [];
    for (const item of equipmentByItem) {
      for (const eq of item.equipment) {
        rows.push([
          reverseHebrew(eq),
          reverseHebrew(item.supplier),
          reverseHebrew(item.activity),
        ]);
      }
    }

    autoTable(doc, {
      startY: y,
      head: [
        [reverseHebrew("ציוד"), reverseHebrew("ספק"), reverseHebrew("פעילות")],
      ],
      body: rows,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        halign: "center",
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 247, 245],
      },
      margin: { left: 15, right: 15 },
    });
  }

  addFooter(doc);
  downloadPdf(doc, `equipment-${project.name.replace(/\s+/g, "-")}.pdf`);
}

/**
 * Generate a driver trip file PDF
 */
export function generateDriverTripFile(
  project: PdfProject,
  items: PdfQuoteItem[],
  timeline: PdfTimelineEvent[],
  includePhones: boolean
) {
  const doc = createPdf();
  addHeader(
    doc,
    reverseHebrew("קובץ נהג"),
    reverseHebrew(project.tripName || project.name)
  );

  let y = 42;

  // Project info box
  doc.setFillColor(248, 247, 245);
  doc.roundedRect(15, y, 180, 25, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(141, 120, 94);

  const infoLines = [
    `${reverseHebrew("תאריך")}: ${formatDate(project.date)}`,
    `${reverseHebrew("משתתפים")}: ${project.participants}`,
    `${reverseHebrew("אזור")}: ${reverseHebrew(project.region || "-")}`,
    `${reverseHebrew("לקוח")}: ${reverseHebrew(project.client || project.company || "-")}`,
  ];
  doc.text(infoLines, 190, y + 6, { align: "right", lineHeightFactor: 1.6 });
  y += 32;

  // Route schedule table
  if (timeline.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(24, 21, 16);
    doc.text(reverseHebrew("מסלול ולוח זמנים"), 195, y, { align: "right" });
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;

    const routeRows = timeline.map((event, i) => [
      reverseHebrew(event.description || "-"),
      reverseHebrew(event.title),
      event.time,
      String(i + 1),
    ]);

    autoTable(doc, {
      startY: y,
      head: [
        [
          reverseHebrew("פרטים"),
          reverseHebrew("תחנה"),
          reverseHebrew("שעה"),
          "#",
        ],
      ],
      body: routeRows,
      styles: { fontSize: 9, cellPadding: 4, halign: "center" },
      headStyles: {
        fillColor: [24, 21, 16],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 247, 245] },
      margin: { left: 15, right: 15 },
    });

    y = (doc as any).lastAutoTable?.finalY ?? y + 50;
    y += 10;
  }

  // Supplier contacts
  if (includePhones && items.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(24, 21, 16);
    doc.text(reverseHebrew("אנשי קשר — ספקים"), 195, y, { align: "right" });
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;

    const contactRows = items.map((item) => [
      reverseHebrew(item.supplier || "-"),
      reverseHebrew(item.name),
      reverseHebrew(item.type || "-"),
    ]);

    autoTable(doc, {
      startY: y,
      head: [
        [reverseHebrew("ספק"), reverseHebrew("פעילות"), reverseHebrew("סוג")],
      ],
      body: contactRows,
      styles: { fontSize: 9, cellPadding: 4, halign: "center" },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [248, 247, 245] },
      margin: { left: 15, right: 15 },
    });
  }

  addFooter(doc);
  downloadPdf(doc, `driver-${project.name.replace(/\s+/g, "-")}.pdf`);
}

/**
 * Generate a client trip file PDF (no costs)
 */
export function generateClientTripFile(
  project: PdfProject,
  items: PdfQuoteItem[],
  timeline: PdfTimelineEvent[]
) {
  const doc = createPdf();
  const projectName = project.tripName || project.name;
  addHeader(
    doc,
    reverseHebrew(projectName),
    reverseHebrew(`${formatDate(project.date)} | ${project.region || ""}`)
  );

  let y = 40;

  // Opening paragraph
  if (project.openingParagraph) {
    doc.setFontSize(10);
    doc.setTextColor(24, 21, 16);
    const lines = doc.splitTextToSize(
      reverseHebrew(project.openingParagraph),
      170
    );
    doc.text(lines, 105, y, { align: "center" });
    y += lines.length * 5 + 8;
  }

  // Activities (no prices)
  if (items.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(24, 21, 16);
    doc.text(reverseHebrew("הפעילויות שלנו"), 195, y, { align: "right" });
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 8;

    const activityRows = items.map((item) => [
      reverseHebrew(item.description || "-"),
      reverseHebrew(item.name),
      reverseHebrew(item.type || "-"),
    ]);

    autoTable(doc, {
      startY: y,
      head: [
        [reverseHebrew("תיאור"), reverseHebrew("פעילות"), reverseHebrew("סוג")],
      ],
      body: activityRows,
      styles: { fontSize: 9, cellPadding: 4, halign: "center" },
      headStyles: {
        fillColor: [255, 140, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [252, 251, 250] },
      margin: { left: 15, right: 15 },
    });

    y = (doc as any).lastAutoTable?.finalY ?? y + 50;
    y += 10;
  }

  // Timeline
  if (timeline.length > 0) {
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(24, 21, 16);
    doc.text(reverseHebrew("תוכנית היום"), 195, y, { align: "right" });
    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);
    y += 10;

    for (const event of timeline) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      // Time badge
      doc.setFillColor(255, 140, 0);
      doc.roundedRect(170, y - 4, 25, 8, 2, 2, "F");
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(event.time, 182.5, y + 1, { align: "center" });

      // Title
      doc.setFontSize(10);
      doc.setTextColor(24, 21, 16);
      doc.text(reverseHebrew(event.title), 165, y + 1, { align: "right" });

      if (event.description) {
        doc.setFontSize(8);
        doc.setTextColor(141, 120, 94);
        const descLines = doc.splitTextToSize(
          reverseHebrew(event.description),
          150
        );
        doc.text(descLines, 165, y + 6, { align: "right" });
        y += 6 + descLines.length * 4;
      } else {
        y += 8;
      }

      y += 4;
    }
  }

  // Info box at bottom
  doc.setFillColor(248, 247, 245);
  const infoY = Math.min(y + 5, 260);
  doc.roundedRect(15, infoY, 180, 15, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(141, 120, 94);
  doc.text(
    `${reverseHebrew("משתתפים")}: ${project.participants} | ${reverseHebrew("אזור")}: ${reverseHebrew(project.region || "-")}`,
    105,
    infoY + 9,
    { align: "center" }
  );

  addFooter(doc);
  downloadPdf(doc, `trip-${project.name.replace(/\s+/g, "-")}.pdf`);
}
