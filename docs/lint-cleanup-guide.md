# Lint Cleanup Guide — Travelprov

> Generated 2026-03-02. Covers: `bun lint`, `bun tsc`, `bun ultracite`.

## Summary

| Tool | Errors | Warnings |
|---|---|---|
| `bun lint` (biome + tsc) | 8,076 | 86 |
| `bun tsc` | 91 | 0 |
| `bun ultracite` | 9,508 | 86 |

~90% of the errors are **auto-fixable** with one command. The remaining ~200 need targeted manual fixes.

---

## Phase 1 — Auto-fix (eliminates ~90% of errors)

Run a single command:

```bash
bunx biome check src convex --write --max-diagnostics=99999
```

This fixes **~7,900 issues** automatically, including:

| Rule | Count | Fix |
|---|---|---|
| `nursery/useSortedClasses` | 6,711 | Reorders Tailwind classes (84 files) |
| `style/useBlockStatements` | 178 | Adds `{}` to single-line if/throw |
| `suspicious/noUselessEscapeInString` | 113 | Removes unnecessary `\` in strings |
| `style/useImportType` | 41 | Adds `type` keyword to type-only imports |
| `style/useTemplate` (partial) | ~30 | Converts string concat to template literals |
| `style/noUnusedTemplateLiteral` | 18 | Simplifies backtick strings with no expressions |
| `style/useNumberNamespace` | 23 | `parseInt()` → `Number.parseInt()` etc. |
| `style/noNegationElse` | 16 | Flips `if(!x)...else` to `if(x)...else` |
| `style/useNumericSeparators` | 16 | Adds `_` to long numbers |
| `complexity/useSimplifiedLogicExpression` | 15 | Simplifies boolean expressions |
| `correctness/noUnusedImports` | 29 | Removes unused imports |
| `complexity/useOptionalChain` | 3 | `a && a.b` → `a?.b` |
| `complexity/useLiteralKeys` | 3 | `obj["key"]` → `obj.key` |
| `style/useExponentiationOperator` | 2 | `Math.pow()` → `**` |
| `style/useCollapsedElseIf` | 1 | `else { if }` → `else if` |

After running, verify with:

```bash
bunx biome lint src convex --max-diagnostics=99999 2>&1 | tail -5
```

Expected: **~200 remaining errors** (all require manual fixes).

---

## Phase 2 — Manual Fixes by Category

### 2a. Non-null assertions (`noNonNullAssertion`) — 63 errors

**Files**: All `convex/*.ts` backend files + `src/main.tsx`

**Pattern**: After `db.get(id)`, the result is `T | null`. Code uses `event!` to assert non-null.

**Fix strategy**: Add a null-guard before the return:

```typescript
// Before (errors):
const event = await ctx.db.get(id);
return { ...event!, id: event!._id };

// After (clean):
const event = await ctx.db.get(id);
if (!event) { throw new Error("Not found"); }
return { ...event, id: event._id };
```

For `src/main.tsx`, the standard `document.getElementById("root")!` is acceptable — suppress with a biome-ignore comment or add a guard.

**Files to edit** (convex backend):
- `convex/calendarEvents.ts` (4)
- `convex/clients.ts` (4)
- `convex/projectDocuments.ts` (4)
- `convex/quoteItems.ts` (4)
- `convex/supplierDocuments.ts` (4)
- `convex/supplierProducts.ts` (4)
- `convex/supplierContacts.ts` (2)
- `convex/suppliers.ts` (~10)
- `convex/projects.ts` (~10)
- `convex/kanbanTasks.ts` (~6)
- `convex/publicQuote.ts` (~6)
- `convex/dashboard.ts` (~4)
- `convex/timelineEvents.ts` (2)
- `convex/seed.ts` (~3)
- `src/main.tsx` (1)

### 2b. Missing image dimensions (`useImageSize`) — 37 errors

**Rule**: All `<img>` tags must have explicit `width` and `height` attributes (prevents layout shift).

**Affected files**: Primarily `src/imports/` Figma-generated files and component files with `<img>` tags.

**Fix**: Add `width` and `height` attributes to all `<img>` tags. For responsive images, use the intrinsic size and let CSS handle display size:

```tsx
// Before:
<img src={url} alt="..." className="w-full h-auto" />

// After:
<img src={url} alt="..." width={800} height={600} className="w-full h-auto" />
```

### 2c. Unused variables (`noUnusedVariables`) — 31 errors

**Fix**: Simply delete the unused variable declarations. Most are leftover from refactoring.

**Affected files** (sample):
- `src/app/components/SupplierBank.tsx` — `totalSuppliers`, `verifiedCount`, `pendingCount`, `docsIssues`
- `src/app/components/QuoteEditor.tsx` — `KAYAK_IMG`, `BUS_IMG`, `createEvent`, `removeEvent`
- `src/app/components/SupplierDetail.tsx` — `updateDocExpiry`, `isValid`
- `src/app/components/ImportWizard.tsx` — `existingSuppliers`, `skipCount`
- `src/app/components/ItemEditor.tsx` — `projectId`, `newImage`, `currentStatus`
- `src/app/components/IsraelMap.tsx` — `activeRegions`
- `convex/suppliers.ts` — `existingNames`

### 2d. Template literals for string concat (`useTemplate`) — 29 remaining (not auto-fixed)

Some template literal conversions are marked unsafe. Review and convert manually:

```typescript
// Before:
const msg = "Error: " + name + " not found";
// After:
const msg = `Error: ${name} not found`;
```

### 2e. Exhaustive dependencies (`useExhaustiveDependencies`) — 15 warnings

**Rule**: React hook dependency arrays must include all referenced values.

**Fix**: Either add missing deps or wrap values in `useCallback`/`useMemo`. Review each case individually — some may need `// biome-ignore` if adding the dep would cause infinite re-renders.

### 2f. Top-level regex (`useTopLevelRegex`) — 8 errors

**Rule**: Regex literals inside functions are re-compiled on every call.

**Fix**: Move regex to module scope:

```typescript
// Before (inside function):
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// After (module scope):
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### 2g. Type definitions consistency (`useConsistentTypeDefinitions`) — 5 errors

**Rule**: Use `type` instead of `interface` (or vice-versa, per config).

**Fix**: Convert `interface Foo { ... }` to `type Foo = { ... }` (check ultracite/biome config for which is preferred).

### 2h. Remaining small categories

| Rule | Count | Fix |
|---|---|---|
| `noGlobalIsNan` | 3 | `isNaN(x)` → `Number.isNaN(x)` |
| `noUnusedFunctionParameters` | 3 | Remove or prefix with `_` |
| `useParseIntRadix` | 2 | `parseInt(s)` → `parseInt(s, 10)` |
| `noShadowRestrictedNames` | 1 | Rename variable shadowing a builtin |
| `noDocumentCookie` | 1 | Use a cookie utility instead |
| `useDefaultSwitchClause` | 1 | Add `default:` case to switch |
| `noDangerouslySetInnerHtml` | 1 | Review for XSS safety, add biome-ignore if intentional |
| `noInvalidPositionAtImportRule` | 1 | Move `@import` before `@source` in `tailwind.css` |
| `noUselessStringConcat` | 1 | Merge adjacent string literals |
| `useConsistentObjectDefinitions` | 1 | Match object definition style |

---

## Phase 3 — TypeScript Errors (`bun tsc`) — 91 errors

### 3a. Unused declarations (TS6133/TS6192/TS6196) — 72 errors

Largest category. These overlap with Biome's `noUnusedImports`/`noUnusedVariables`. After Phase 1 auto-fix removes unused imports, many of these will resolve automatically.

**Remaining** after Phase 1: Delete unused local variables that Biome doesn't auto-remove.

### 3b. Type mismatches (TS2322) — 5 errors

All in `src/app/components/CalendarPage.tsx`:
- `DisplayEvent[]` type doesn't match constructed objects
- `string` assigned to `Id<"calendarEvents">`

**Fix**: Update the `DisplayEvent` type or add proper type casts. Check that `date`, `type` fields are properly typed.

### 3c. Possibly undefined (TS18048) — 4 errors

In `ClientsPage.tsx` lines 70-72: `c.company`, `c.phone`, `c.email` may be `undefined`.

**Fix**: Add optional chaining or nullish coalescing:

```typescript
c.company?.toLowerCase() // or
c.company ?? ""
```

### 3d. Missing type declarations (TS7016) — 2 errors

Module `leaflet` has no types.

**Fix**:

```bash
bun add -d @types/leaflet
```

### 3e. Property doesn't exist (TS2339/TS2551) — 5 errors

- `Dashboard.tsx:440`, `Layout.tsx:191` — `user_metadata` doesn't exist on auth user type
- `ImportWizard.tsx:330-331` — `supplierIds` should be `suppliers`

**Fix**: Update property accesses to match actual types.

### 3f. Implicit any (TS7006) — 1 error

`SupplierMap.tsx:78` — parameter `el` needs a type annotation.

**Fix**: Add `: HTMLElement | null` type.

### 3g. Index type undefined (TS2538) — 2 errors

`CalendarPage.tsx:116-117` — using `undefined` as index.

**Fix**: Add null checks before indexing.

---

## Phase 4 — Ultracite-specific Errors — 17 errors

These are additional to Biome lint:

| Rule | Count | Fix |
|---|---|---|
| `assist/source/organizeImports` | 5 | Run `bunx biome check --write` (auto-fixes import ordering) |
| `style/noNonNullAssertion` | 4 | Same as Phase 2a |
| `style/useBlockStatements` | 4 | Same as Phase 1 auto-fix |
| `correctness/noGlobalDirnameFilename` | 2 | Use `import.meta.dirname` / `import.meta.filename` instead of `__dirname`/`__filename` |
| `suspicious/noBiomeFirstException` | 1 | Remove `"**"` from `biome.jsonc` includes array |
| `style/useNodejsImportProtocol` | 1 | `import "path"` → `import "node:path"` |

---

## Recommended Execution Order

```bash
# Step 1: Auto-fix everything possible (biggest bang for buck)
bunx biome check src convex --write --max-diagnostics=99999

# Step 2: Install missing types
bun add -d @types/leaflet

# Step 3: Fix biome.jsonc config issue
# Remove "**" from files.includes array in biome.jsonc

# Step 4: Fix tailwind.css import order
# Move @import 'tw-animate-css' BEFORE @source directive

# Step 5: Fix non-null assertions in convex/ files
# Add null guards (see Phase 2a pattern)

# Step 6: Delete unused variables/imports that auto-fix missed
# Focus on files listed in Phase 2c

# Step 7: Fix TypeScript type errors in CalendarPage, ClientsPage, ImportWizard
# See Phase 3b-3g

# Step 8: Final verification
bun lint && bun tsc && bun ultracite
```

## Quick Win Estimate

| Phase | Effort | Errors Fixed |
|---|---|---|
| Phase 1 (auto-fix) | 1 command | ~8,000 |
| Phase 2a (null assertions) | ~30 min | ~63 |
| Phase 2b (image sizes) | ~20 min | ~37 |
| Phase 2c+3a (unused vars) | ~15 min | ~100 |
| Phase 3b-3g (TS types) | ~20 min | ~19 |
| Phase 4 (ultracite) | ~5 min | ~17 |
| **Total** | **~90 min** | **~8,236** |
