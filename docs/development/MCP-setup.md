# הגדרת MCP (Model Context Protocol)

## קובץ `.mcp.json`

הפרויקט כולל תצורת MCP עם: Playwright, Miro, Vercel, Clerk, Resend, Supabase.

### Resend – שליחת אימייל

1. **התקנה:**  
   Clone והרצה:
   ```bash
   git clone https://github.com/resend/mcp-send-email.git
   cd mcp-send-email
   npm install && npm run build
   ```

2. **עדכון `.mcp.json`:**  
   החלף את `ABSOLUTE_PATH_TO_MCP_SEND_EMAIL_PROJECT` בנתיב המלא לתיקיית הפרויקט (למשל ב‑Windows: `C:\\Users\\User\\mcp-send-email`).

3. **מפתח API:**  
   הוסף ל־command ארגומנט: `--key=YOUR_RESEND_API_KEY`  
   או הגדר משתנה סביבה `RESEND_API_KEY`.  
   מפתח: [resend.com/api-keys](https://resend.com/api-keys).

### Supabase

ה־`project_ref` בתצורה הוא `mvmoewcvc`. אם אתה משתמש בפרויקט Supabase אחר – עדכן בהתאם.
