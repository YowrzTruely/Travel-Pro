# Plan 09 — Messaging System

**Phase:** 4 (Communication)
**Depends on:** Plan 01 (Data Model), Plan 02 (Multi-Role Auth), Plan 05 (Supplier Portal)
**Blocks:** None

---

## Goal

Build an in-app messaging system with 3 conversation types: direct (producer↔supplier), project-threaded (per project per supplier), and client (producer↔client post-approval).

---

## Current State

- No messaging system exists
- Plan 01 defines `conversations` and `messages` tables
- Convex real-time queries make this naturally reactive (messages appear instantly)

---

## Implementation

### 1. Backend — Messaging Functions

**File: `convex/conversations.ts`** (new)

```ts
// Queries
listForUser         — all conversations the current user participates in, sorted by lastMessageAt
get                 — single conversation by ID
getByParticipants   — find existing conversation between specific users
listByProject       — all conversations linked to a project (project threads)
getUnreadCount      — count of conversations with unread messages for current user

// Mutations
create: mutation({
  args: {
    type: v.union(v.literal("direct"), v.literal("project"), v.literal("client")),
    participants: v.array(v.id("users")),
    projectId: v.optional(v.id("projects")),
    supplierId: v.optional(v.id("suppliers")),
  },
  handler: async (ctx, args) => {
    // Check if conversation already exists (for direct type, prevent duplicates)
    // Create conversation
    // Return conversation ID
  },
})

getOrCreate: mutation({
  args: { /* same as create */ },
  handler: async (ctx, args) => {
    // For direct: find existing or create new
    // For project: find by projectId+supplierId or create
    // For client: find by projectId+type="client" or create
  },
})
```

**File: `convex/messages.ts`** (new)

```ts
// Queries
listByConversation: query({
  args: { conversationId: v.id("conversations"), limit: v.optional(v.number()) },
  // Returns messages sorted by createdAt, paginated
  // Most recent first (or oldest first with cursor-based pagination)
})

// Mutations
send: mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    type: v.union(v.literal("text"), v.literal("file"), v.literal("system")),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Create message with senderId from auth
    // Update conversation.lastMessageAt
    // Create notifications for other participants (Plan 10)
  },
})

markRead: mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    // Add current userId to readBy array of all unread messages in conversation
  },
})
```

### 2. Messages Page (Main View)

**File: `src/app/components/messaging/MessagesPage.tsx`** (new)

WhatsApp-style layout:

```
┌─────────────────────────────────────────────────────────┐
│  הודעות                                                  │
│                                                         │
│  ┌──────────────────┐ ┌────────────────────────────────┐│
│  │  Conversation     │ │  Chat Window                   ││
│  │  List             │ │                                ││
│  │                   │ │  [Header: name + avatar]       ││
│  │  ┌──────────────┐ │ │                                ││
│  │  │ 🏢 יקב הגולן │ │ │  ┌─ 10:00 ────────────────┐  ││
│  │  │ "מחר אוכל..." │ │ │  │ שלום, לגבי הטיול ב-15  │  ││
│  │  │ 14:30 • 🔵 2  │ │ │  │ אפריל...               │  ││
│  │  ├──────────────┤ │ │  └─────────────────────────┘  ││
│  │  │ 🏢 שף אבי   │ │ │                                ││
│  │  │ "אישרתי..."  │ │ │  ┌─ 14:30 ────────────────┐  ││
│  │  │ 12:00        │ │ │  │ מעולה, אשמח. 45 איש    │  ││
│  │  ├──────────────┤ │ │  │ נכון?                   │  ││
│  │  │ ...          │ │ │  └─────────────────────────┘  ││
│  │  └──────────────┘ │ │                                ││
│  │                   │ │  ┌─────────────────────────┐  ││
│  │  [Filter tabs:]   │ │  │ [📎] Type message... [→] │  ││
│  │  הכל | פרויקטים | │ │  └─────────────────────────┘  ││
│  │  ספקים | לקוחות  │ │                                ││
│  └──────────────────┘ └────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### 3. Conversation List Component

**File: `src/app/components/messaging/ConversationList.tsx`** (new)

Features:
- Lists all conversations for current user
- Shows: avatar, name, last message preview, timestamp, unread badge
- Filter tabs: All, Projects (threaded), Suppliers (direct), Clients
- Click → select conversation → load in chat window
- Project-threaded conversations show project name as group header
- Real-time updates via `useQuery`

### 4. Chat Window Component

**File: `src/app/components/messaging/ChatWindow.tsx`** (new)

Features:
- Message bubbles: sent (left in RTL) vs received (right in RTL)
- Message types:
  - Text — standard bubble
  - File — shows file name + download link
  - System — centered, muted style ("בקשת זמינות נשלחה")
- Timestamp + read status (✓ sent, ✓✓ read)
- Auto-scroll to bottom on new messages
- Mark as read when conversation is opened (`markRead` mutation)

### 5. Message Input Component

**File: `src/app/components/messaging/MessageInput.tsx`** (new)

```ts
interface MessageInputProps {
  conversationId: Id<"conversations">;
  onSend: (content: string, type: "text" | "file", fileUrl?: string) => void;
}
```

Features:
- Text input with send button
- File attachment button (uses `useImageUpload` hook for file storage)
- Enter to send, Shift+Enter for newline
- Typing indicator (optional/stretch)

### 6. Project Thread View

**File: `src/app/components/messaging/ProjectThreads.tsx`** (new)

Shows all conversation threads for a specific project:

```
┌── פרויקט "גיבוש ABC" ──────────────┐
│   ├── Thread: ספק הסעות "מוביל+"    │  (3 unread)
│   ├── Thread: ספק אטרקציות "יקב X"  │
│   └── Thread: ספק קייטרינג "שף Y"   │
└─────────────────────────────────────┘
```

Linked from QuoteEditor — "💬 הודעות" button per supplier.

### 7. Quick Chat from Other Pages

Add "chat" buttons across the app:

**SupplierBank / SupplierDetail:**
- "💬 צ'אט" button → opens/creates direct conversation with supplier

**QuoteEditor:**
- Per-item "💬" button → opens/creates project-threaded conversation with that item's supplier

**Implementation:** These buttons call `conversations.getOrCreate` then navigate to `/messages?conversation={id}`.

### 8. System Messages

Auto-generated system messages inserted into relevant conversations:

| Event | System Message |
|-------|---------------|
| Availability request sent | "בקשת זמינות נשלחה ל-{date}" |
| Supplier approved availability | "הספק אישר זמינות ל-{date}" |
| Supplier declined | "הספק דחה את הבקשה" |
| Quote sent to client | "הצעת מחיר נשלחה ללקוח" |
| Client approved quote | "הלקוח אישר את ההצעה!" |
| Client requested changes | "הלקוח ביקש שינויים" |

These are created by the respective mutations (availability, quote, etc.) by calling `messages.send` with `type: "system"`.

### 9. Mobile Responsiveness

The messages page should work on mobile (especially for suppliers who may use phones):
- On mobile: conversation list takes full width
- Click conversation → full-width chat window with back button
- Use `useIsMobile()` hook from `src/app/components/ui/use-mobile.ts`

### 10. Route Registration

Add to both producer and supplier routes:
```ts
{ path: "/messages", element: MessagesPage },
{ path: "/messages/:conversationId", element: MessagesPage },  // deep link to specific conversation
```

---

## New Files

| File | Type |
|------|------|
| `convex/conversations.ts` | Backend |
| `convex/messages.ts` | Backend |
| `src/app/components/messaging/MessagesPage.tsx` | Page |
| `src/app/components/messaging/ConversationList.tsx` | Component |
| `src/app/components/messaging/ChatWindow.tsx` | Component |
| `src/app/components/messaging/MessageInput.tsx` | Component |
| `src/app/components/messaging/ProjectThreads.tsx` | Component |

## Modified Files

| File | Changes |
|------|---------|
| `src/app/routes.ts` | Add /messages route to producer + supplier routes |
| `src/app/components/Layout.tsx` | Already has "הודעות" in nav (Plan 02) |
| `src/app/components/SupplierDetail.tsx` | Add "צ'אט" button |
| `src/app/components/QuoteEditor.tsx` | Add per-supplier "💬" button |
| Various mutation files | Insert system messages on key events |
