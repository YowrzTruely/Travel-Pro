YOMKEF OS - Supplier & Proposal System

FINAL SPEC (גרסה סופית להעברה לפיתוח)

---

🎯 מטרת המערכת

בניית מערכת SaaS למפיקים לניהול ספקים, מידע, תמחור והצעות מחיר דיגיטליות, כולל:

- מאגר ספקים אישי לכל מפיק
- מאגר ספקים כללי (Marketplace)
- מנוע AI לקליטת מידע אוטומטי
- מערכת אימות מידע חכמה
- מערכת מסמכים והתראות
- יצירת הצעות מחיר דיגיטליות

---

👤 מודל משתמשים

מפיקים (Producers)

- רואים רק את הדאטה שלהם (Private DB)
- יכולים למשוך ספקים מהמאגר הכללי
- יכולים לשכפל ספק למאגר שלהם
- שולטים בתמחור
- מנהלים מסמכים והתראות

---

ספקים (Suppliers)

סטטוסים:

- Private (רק אצל מפיק)
- Public (במאגר הכללי)
- Verified (אומת ע"י ספק)
- Premium (משלם)

שדות מערכת:

- is_public
- is_verified
- is_premium
- created_by_producer_id

---

🔄 שיתוף ספקים (Growth Engine)

Flow:

1. מפיק מזין ספק
2. המערכת מזהה חוסרים
3. נשלחת הודעה לספק
4. הספק נכנס לעמוד אישי
5. משלים מידע + מאשר
6. אם אישר → נכנס למאגר הכללי

---

🤖 Agent 1 - קליטת ספקים (AI)

קלטים מאושרים:

- WhatsApp (ערוץ ראשי)
- PDF / קבצים
- טופס (רק לספקים)

תהליך:

1. קבלת קלט
2. זיהוי סוג קלט
3. AI מנתח
4. זיהוי סוג ספק (אוטומטי)
5. שליפת נתונים
6. בדיקת כפילויות
7. בניית JSON
8. הצגה לאישור
9. שמירה ל-Firebase

רמת אוטומציה:

- חצי אוטומטי (אישור משתמש חובה)

---

📊 מקור אמת (Source of Truth)

סדר אמינות סופי:

1. מידע שאומת ע"י ספק
2. אתר רשמי
3. PDF / מחירון
4. מידע מהמפיק
5. רשתות חברתיות (קישורים בלבד)

---

🔗 רשתות חברתיות

שדות:

- facebook_url
- instagram_url
- tiktok_url
- youtube_url

⚠ אין גרידה - רק קישורים

---

🔍 כפילויות ספקים

לוגיקה:

- זיהוי לפי:
  - טלפון
  - שם
  - אתר

התנהגות:

- התראה למשתמש
- AI מציע מיזוג
- החלטה ידנית

---

📂 מבנה ספק (Supplier Schema)

מידע בסיסי:

- name
- description_short
- description_full
- categories[]
- tags[]
- region_main
- region_sub
- address
- google_maps_url
- waze_url
- latitude
- longitude
- images[]
- videos[]

---

אנשי קשר:

- contacts[]
  - name
  - role
  - phone
  - email
  - whatsapp
  - notes

---

כספת מסמכים:

- documents[]
  - type:
    - ביטוח
    - רישיון עסק
    - כשרות
    - טופס ביטוחי מול מפיק
  - file_url
  - expiry_date
  - is_valid
  - uploaded_by

---

🔔 מערכת התראות

מסמכים:

- התראה לפני פקיעה
- התראה אחרי פקיעה

בזמן סגירת אירוע:

- אם אין ביטוח → התראה קריטית

---

💰 מודל מחירים

שדות:

- base_price (מחיר ספק)
- producer_price (מחיר למפיק)

מחירים מיוחדים:

- special_prices[]
  - producer_id
  - price
  - valid_until

---

תמחור מפיק:

- pricing_rules:
  - markup_type (אחוז / קבוע)
  - markup_value
  - custom_price_override

⚠ נשמר אצל המפיק בלבד

---

🧠 מידע לפי סוג ספק (Dynamic Schema)

מלון:

- rooms_count
- room_types[]
- conference_rooms[]
- seating_layouts
- board_type
- facilities

---

מסעדה:

- cuisine_type
- kosher
- menus[]
- capacity
- private_rooms

---

אטרקציה:

- duration
- min_people
- max_people
- age_limit
- requirements

---

📍 אזורים

Level 1:

- צפון
- מרכז
- דרום
- ירושלים והסביבה
- אילת והערבה
- יהודה ושומר�