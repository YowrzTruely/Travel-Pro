# Plan 11 — Kanban & Task Integration

**Phase:** 5 (Integration & Polish)
**Depends on:** Plan 02 (Multi-Role Auth), Plan 04 (CRM), Plan 07 (Availability Workflow)
**Blocks:** None

---

## Goal

Add Kanban route to the app, link tasks to projects, auto-create tasks when projects move to execution phase, and integrate with the project workflow.

---

## Current State

- `KanbanBoard.tsx` — fully functional component with react-dnd drag & drop
- 5 columns: רעיונות / לעשות / בביצוע / מושהה / הושלם
- `kanbanTasks` table with full CRUD in `convex/kanbanTasks.ts`
- **Not routed** — KanbanBoard has no entry in `routes.ts`
- Tasks are standalone — not linked to projects

---

## Implementation

### 1. Add Kanban Route

**File: `src/app/routes.ts`** (modify)

Add to producer routes:
```ts
{ path: "/kanban", element: KanbanBoard }
```

The sidebar already includes a קנבן item in the Plan 02 nav config.

### 2. Link Tasks to Projects

**File: `convex/schema.ts`** (modify kanbanTasks)

Add optional project link:
```ts
// New fields on kanbanTasks:
projectId: v.optional(v.id("projects")),
projectLegacyId: v.optional(v.string()),  // for display
assignedTo: v.optional(v.id("users")),
dueDate: v.optional(v.string()),
```

Add index:
```ts
.index("by_projectId", ["projectId"])
```

### 3. Auto-Create Tasks on Project Approval

When a project moves to "בביצוע" (in execution) after client approval, auto-generate a checklist of tasks:

**File: `convex/kanbanTasks.ts`** (extend)

```ts
createProjectTasks: mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    const items = await ctx.db
      .query("quoteItems")
      .withIndex("by_projectId", q => q.eq("projectId", projectId))
      .collect();

    const tasks = [
      { title: `אישור סופי מול כל הספקים — ${project.name}`, type: "task", priority: "high" },
      { title: `שליחת פרטי הגעה ללקוח — ${project.name}`, type: "task", priority: "medium" },
      { title: `הכנת חומרים — ${project.name}`, type: "task", priority: "medium" },
    ];

    // Per-supplier tasks
    for (const item of items) {
      tasks.push({
        title: `תיאום סופי עם ${item.supplier} — ${item.name}`,
        type: "task",
        priority: "medium",
      });
    }

    tasks.push(
      { title: `בדיקת מסמכים ואישורים — ${project.name}`, type: "task", priority: "low" },
      { title: `סיכום ומשוב אחרי האירוע — ${project.name}`, type: "task", priority: "low" },
    );

    for (const task of tasks) {
      await ctx.db.insert("kanbanTasks", {
        ...task,
        status: "todo",
        feature: project.name,
        projectId,
        projectLegacyId: project.legacyId,
        estimate: "",
        tags: [],
        description: "",
        createdAt: Date.now(),
        version: "auto",
        attachments: [],
      });
    }
  },
})
```

**Trigger:** Call this from `publicQuote.approveQuote` after setting status to "אושר".

### 4. Project Filter on Kanban

**File: `src/app/components/KanbanBoard.tsx`** (modify)

Add project filter dropdown at top:

```
┌─────────────────────────────────────────────────────┐
│  קנבן                                               │
│                                                     │
│  Filter: [כל הפרויקטים ▼] [כל העדיפויות ▼]         │
│          [כל הסוגים ▼]                               │
│                                                     │
│  ... existing Kanban columns ...                     │
└─────────────────────────────────────────────────────┘
```

Filter options:
- All projects
- Specific project (from dropdown)
- Unlinked tasks (no project)

### 5. Task Card Enhancement

**File: `src/app/components/KanbanBoard.tsx`** (modify)

Add to task cards:
- Project badge: clickable link showing `projectLegacyId` → navigates to QuoteEditor
- Assigned user avatar (if assigned)
- Due date badge (if set)

### 6. Quick Add from QuoteEditor

**File: `src/app/components/QuoteEditor.tsx`** (modify)

Add "📋 הוסף משימה" button in QuoteEditor that creates a kanban task pre-linked to the project:
- Opens a small modal: title, priority, type
- Auto-fills projectId and feature name

### 7. Dashboard Integration

The producer dashboard (Plan 03) shows "משימות דחופות מהקנבן":
- Query kanban tasks with priority="high" and status!="done"
- Show as compact list with checkboxes
- Clicking → navigates to /kanban

---

## New Files

None — all modifications to existing files.

## Modified Files

| File | Changes |
|------|---------|
| `src/app/routes.ts` | Add `/kanban` route |
| `convex/schema.ts` | Add projectId, assignedTo, dueDate to kanbanTasks |
| `convex/kanbanTasks.ts` | Add createProjectTasks, filter by projectId |
| `src/app/components/KanbanBoard.tsx` | Project filter, enhanced cards |
| `src/app/components/QuoteEditor.tsx` | "Add task" button |
| `convex/publicQuote.ts` | Call createProjectTasks on approval |
