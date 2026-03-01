// Mock data for TravelPro application

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  category: string;
  categoryColor: string;
  region: string;
  rating: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  notes: string;
  icon: string;
  address?: string;
  location?: { lat: number; lng: number };
}

export interface Project {
  id: string;
  name: string;
  client: string;
  company: string;
  participants: number;
  region: string;
  status: string;
  statusColor: string;
  totalPrice: number;
  pricePerPerson: number;
  profitMargin: number;
  date: string;
}

export type CalendarEventType = 'meeting' | 'deadline' | 'reminder' | 'personal';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: CalendarEventType;
  color: string;
  projectId?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  status: 'active' | 'lead' | 'inactive';
  notes: string;
  totalProjects: number;
  totalRevenue: number;
  createdAt: string;
}

export interface QuoteVersion {
  id: string;
  version: number;
  date: string;
  totalPrice: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
}

export const suppliers: Supplier[] = [
  {
    id: '1',
    name: 'הסעות מסיילי הצפון',
    phone: '514423982',
    category: 'תחבורה',
    categoryColor: '#3b82f6',
    region: 'צפון',
    rating: 4.5,
    verificationStatus: 'verified',
    notes: '-',
    icon: '🚌',
  },
  {
    id: '2',
    name: 'קייטרינג סאמי המזרח',
    phone: '032115664',
    category: 'מזון',
    categoryColor: '#22c55e',
    region: 'ירושלים',
    rating: 4.0,
    verificationStatus: 'pending',
    notes: 'מסמכים חסרים',
    icon: '🍽️',
  },
  {
    id: '3',
    name: 'ספורט אתגרי בנגב',
    phone: '520038441',
    category: 'אטרקציות',
    categoryColor: '#a855f7',
    region: 'דרום',
    rating: 5.0,
    verificationStatus: 'unverified',
    notes: 'נדרש חידוש ביטוח',
    icon: '🏃',
  },
  {
    id: '4',
    name: 'מלון פלאזה - מרכז',
    phone: '510098442',
    category: 'לינה',
    categoryColor: '#ec4899',
    region: 'מרכז',
    rating: 3.2,
    verificationStatus: 'verified',
    notes: '-',
    icon: '🏨',
  },
  {
    id: '5',
    name: 'יקב רמת נפתלי',
    phone: '049876543',
    category: 'אטרקציות',
    categoryColor: '#a855f7',
    region: 'צפון',
    rating: 4.8,
    verificationStatus: 'verified',
    notes: '-',
    icon: '🍷',
  },
  {
    id: '6',
    name: 'אוטובוסים הגליל',
    phone: '047654321',
    category: 'תחבורה',
    categoryColor: '#3b82f6',
    region: 'צפון',
    rating: 4.2,
    verificationStatus: 'verified',
    notes: '-',
    icon: '🚌',
  },
];

export const projects: Project[] = [
  {
    id: '4829-24',
    name: 'נופש שנתי גליל עליון',
    client: 'סייבר-גלובל',
    company: 'סייבר-גלובל',
    participants: 120,
    region: 'גליל עליון',
    status: 'בניית הצעה',
    statusColor: '#f97316',
    totalPrice: 102000,
    pricePerPerson: 850,
    profitMargin: 25,
    date: '2024-03-15',
  },
  {
    id: '4830-24',
    name: 'כנס מכירות Q1',
    client: 'טכנו-פלוס',
    company: 'טכנו-פלוס',
    participants: 80,
    region: 'אילת',
    status: 'ליד חדש',
    statusColor: '#3b82f6',
    totalPrice: 0,
    pricePerPerson: 0,
    profitMargin: 0,
    date: '2024-03-20',
  },
  {
    id: '4831-24',
    name: 'יום כיף צוות פיתוח',
    client: 'קליקסופט',
    company: 'קליקסופט',
    participants: 45,
    region: 'מרכז',
    status: 'הצעה נשלחה',
    statusColor: '#8b5cf6',
    totalPrice: 38250,
    pricePerPerson: 850,
    profitMargin: 22,
    date: '2024-03-10',
  },
  {
    id: '4832-24',
    name: 'אירוע חברה שנתי',
    client: 'מדיה-וורקס',
    company: 'מדיה-וורקס',
    participants: 200,
    region: 'ירושלים',
    status: 'אושר',
    statusColor: '#22c55e',
    totalPrice: 180000,
    pricePerPerson: 900,
    profitMargin: 28,
    date: '2024-02-28',
  },
  {
    id: '4833-24',
    name: 'סדנת גיבוש הנהלה',
    client: 'פיננס-פרו',
    company: 'פיננס-פרו',
    participants: 25,
    region: 'גולן',
    status: 'מחיר בהערכה',
    statusColor: '#eab308',
    totalPrice: 0,
    pricePerPerson: 0,
    profitMargin: 0,
    date: '2024-03-18',
  },
];

export const dashboardAlerts = [
  { id: '1', projectId: '4833-24', projectName: 'סדנת גיבוש הנהלה', message: 'מחיר בהערכה', type: 'pricing' as const },
  { id: '2', projectId: '4829-24', projectName: 'נופש שנתי גליל עליון', message: 'ביטוח ספק פג תוקף', type: 'document' as const },
  { id: '3', projectId: '4831-24', projectName: 'יום כיף צוות פיתוח', message: 'ממתין לאישור לקוח', type: 'approval' as const },
];

export const supplierQueue = [
  { id: '1', name: 'אלפא שיווק בע"מ', code: '987321', status: 'current' as const },
  { id: '2', name: 'בטא לוגיסטיקה', code: '112233', status: 'pending' as const },
  { id: '3', name: 'גמא שירותי מחשוב', code: '445566', status: 'pending' as const },
  { id: '4', name: 'דלתא בנייה ושיפוצים', code: '778899', status: 'pending' as const },
];

export const importPreviewData = [
  { id: '1', name: 'גן אירועים קיסריה', category: 'אולמות וגנים', status: 'valid' as const, duplicate: false },
  { id: '2', name: 'קייטרינג סעמים', category: 'קייטרינג', status: 'duplicate' as const, duplicate: true },
  { id: '3', name: 'די.ג\'יי רועי כהן', category: 'מוזיקה', status: 'valid' as const, duplicate: false },
  { id: '4', name: 'סטודיו צילום "רגעים"', category: 'צילום', status: 'duplicate' as const, duplicate: true },
];

export const scannedProducts = [
  {
    id: '1',
    name: 'מקדחה חשמלית 18V - Brushless',
    description: 'מקדחות אימפקט מקצועית מסדרת ה-XR, מנוע ללא פחמים לאורך חיים ממושך. כולל 2 סוללות 5.0Ah ומטען מהיר במזוודה קשיחה.',
    price: 849.00,
    category: 'כלי עבודה חשמליים',
    sourceUrl: 'https://supplier-site.com/tools/drill-v18',
    status: 'complete' as const,
    image: 'drill',
  },
  {
    id: '2',
    name: 'ארון כלים מודולרי 7 מגירות',
    description: 'מערכת אחסון מקצועית למוסכים ומדראות. עשוי פלדה עמידה עם ציפוי נגד חלודה, גלגלים מחוזקים עם נעילה ומכנגנון מגיעת פתיחה כפולה.',
    price: 1250.00,
    category: 'שם מוצר שזוהה',
    sourceUrl: 'https://supplier-site.com/storage/cabinet-7drw',
    status: 'complete' as const,
    image: 'cabinet',
  },
  {
    id: '3',
    name: 'ערכת בטיחות "SafeWork"',
    description: 'המוצר לא הצליח להמיר תיאור מלא מהדף. מומלץ לרופכם לקישור המקור ולהוסיף תיאור ידנית.',
    price: 0,
    category: '',
    sourceUrl: 'https://supplier-site.com/p/safety-kit-2024',
    status: 'incomplete' as const,
    image: 'safety',
  },
];

export const quoteComponents = [
  {
    id: '1',
    type: 'תחבורה',
    icon: '🚌',
    supplier: 'אוטובוסים הגליל',
    description: '3 אוטובוסים ממוגנים, איסוף מהמרכז',
    cost: 7500,
    sellingPrice: 9000,
    profitWeight: 2,
  },
  {
    id: '2',
    type: 'פעילות בוקר',
    icon: '🎯',
    supplier: 'רייזרס בגוף',
    description: 'מתחם רייזרים בגוף',
    cost: 28800,
    sellingPrice: 36000,
    profitWeight: 4,
    alternatives: [
      { id: 'a1', name: 'רייזרים בגוף', description: 'מתחם ג\'ונגל/רייזרים', cost: 240, image: 'kayak', selected: true },
      { id: 'a2', name: 'קייקי הגליל', description: 'מתחם פעילות/רייזרים', cost: 110, image: 'bus' },
      { id: 'a3', name: 'ספק מהאינטרנט', description: 'מתחם ביער/בגוף', cost: 180, image: 'globe' },
    ],
  },
];

export const timelineEvents = [
  { time: '08:00', title: 'יציאה ואיסוף', description: 'נקודת מפגש: חניון הבימה מיני גלילות. חלוקת ערכות בוקר.', icon: '🚌' },
  { time: '10:30', title: 'פעילות בוקר - רייזרים', description: 'הגעה למתחם רייזרים בגוף. מדריך בטיחות ויציאה למסלול!', icon: '🎯' },
  { time: '13:00', title: 'ארוחת צהריים', description: 'ארוחת בשרים כשרה למהדרין במסעדת "החווה".', icon: '🍽️' },
];