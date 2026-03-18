YOMKEF OS - Supplier System Specification (גרסה ראשונה)

🎯 מטרת המערכת

מערכת SaaS לניהול ספקים עבור מפיקים, הכוללת:

- מאגר ספקים אישי לכל מפיק
- מאגר ספקים כללי (Marketplace)
- מנוע AI לאיסוף, ניתוח וסידור מידע
- מערכת אימות מידע והתראות
- יצירת הצעות מחיר דיגיטליות

---

🧱 ארכיטקטורה כללית

ישויות מרכזיות:

- Producers (מפיקים)
- Suppliers (ספקים)
- Supplier Database (מאגר כללי)
- Producer Private DB (מאגר אישי)
- Documents Vault (כספת מסמכים)
- Pricing Engine
- AI Ingestion Agent

---

👤 מפיקים (Producers)

הרשאות:

- רואה רק את הספקים שלו
- יכול למשוך ספקים מהמאגר הכללי
- יכול לשכפל ספקים למאגר אישי

יכולות:

- יצירת הצעות מחיר
- תמחור ספקים
- ניהול מסמכים והתראות
- קבלת המלצות AI

---

🏪 ספקים (Suppliers)

מצבים:

- פרטי (Private)
- ציבורי (Public)
- מאומת (Verified)
- פרימיום (Paid)

שדות מערכת:

- is_public
- is_verified
- is_premium
- created_by_producer_id

---

🔄 שיתוף ספקים

Flow:

1. מפיק מוסיף ספק
2. המערכת מזהה חוסרים
3. נשלחת הודעה לספק
4. הספק מאשר/משלים מידע
5. אם אישר → נכנס למאגר הכללי

---

🤖 Agent 1 - קליטת ספקים (AI Ingestion)

קלטים:

- WhatsApp (מרכזי)
- PDF / קבצים
- טופס (לספק בלבד)

תהליך:

1. זיהוי סוג קלט
2. ניתוח AI
3. זיהוי סוג ספק (אוטומטי)
4. שליפת מידע
5. בדיקת כפילויות
6. בניית JSON
7. תצוגה לאישור
8. שמירה ל-Firebase

רמת אוטומציה:

- חצי אוטומטי (דורש אישור משתמש)

---

📊 מקורות מידע (Source of Truth)

סדר אמינות:

1. מידע שאומת ע"י ספק
2. אתר רשמי
3. PDF / מחירון
4. מפיק
5. רשתות חברתיות (קישורים בלבד)

---

🔍 כפילויות ספקים

לוגיקה:

- זיהוי לפי שם / טלפון / אתר
- הצגת התראה
- AI מציע מיזוג
- החלטה ידנית של המשתמש

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

---

כספת מסמכים:

- documents[]
  - type (ביטוח / רישיון / כשרות)
  - file_url
  - expiry_date
  - is_valid

---

תמחור:

- base_price
- producer_price
- special_prices[]
- pricing_rules (markup)

---

מידע דינמי לפי סוג ספק:

- hotel_data
- restaurant_data
- attraction_data

---

🏨 דוגמה - מלון

- rooms_count
- room_types[]
- halls[]
- seating_layouts
- board_type
- facilities

---

📍 אזורים

Level 1:

- צפון / מרכז / דרום / ירושלים / אילת / חו"ל

Level 2 (תיירותי):

- עמק יזרעאל
- גזר
- עמק האלה
- חיפה והכרמל
- מדבר יהודה
- ועוד...

Level 3:

- כתובת + מפה + קואורדינטות

---

📌 סטטוס שדות מידע

לכל שדה:

- verified_by_supplier
- from_website
- from_pdf
- conflict
- missing
- outdated

---

🔔 מערכת התראות

מסמכים:

- התראה לפני פקיעה
- התראה אחרי פקיעה

אירוע:

- חסר ביטוח → התראה קריטית

---

🔄 עדכון מידע

כאשר ספק מעדכן:

- המערכת מציעה למפיק לעדכן
- שדות קריטיים יכולים להתעדכן אוטומטית:
  - טלפון
  - מייל
  - כתובת

---

📈 מודל מידע ספק

3 רמות מידע:

1. תקציר

- שם
- תיאור קצר
- מ