# Angular Doctor report

> Self-contained findings for coding agents. Re-run `npx @abiramcodes/angular-doctor@latest --verbose` after fixes.

## Summary

- **Health score:** 24/100
- **Errors:** 327
- **Warnings:** 652
- **Infos:** 116
- **Project:** panel (angular-cli)
- **Angular:** 22.1.3
- **Scan duration:** 7723ms

## Official Angular migrations

Hub: [angular.dev/reference/migrations](https://angular.dev/reference/migrations)

Prefer official `ng generate @angular/core:*` schematics over hand edits when this report links one.
Use `--dry-run` first, then apply with `--path` for incremental modernization.
Run `ng build` and tests between multi-step migrations (especially standalone).

## Recommended migration commands

Commands deduplicated from this scan, in a sensible order. Scope with the `--path` shown or your project root.

### CommonModule to standalone imports

- **Docs:** https://angular.dev/reference/migrations/common-to-standalone
- **Command:**

```bash
ng generate @angular/core:common-to-standalone --dry-run
ng generate @angular/core:common-to-standalone
```

### Control flow syntax

- **Docs:** https://angular.dev/reference/migrations/control-flow
- **Command:**

```bash
ng generate @angular/core:control-flow --dry-run
ng generate @angular/core:control-flow
```

### inject() function

- **Docs:** https://angular.dev/reference/migrations/inject-function
- **Command:**

```bash
ng generate @angular/core:inject --dry-run
ng generate @angular/core:inject
```

### Signal inputs

- **Docs:** https://angular.dev/reference/migrations/signal-inputs
- **Command:**

```bash
ng generate @angular/core:signal-input-migration --dry-run
ng generate @angular/core:signal-input-migration
```

### Signal queries

- **Docs:** https://angular.dev/reference/migrations/signal-queries
- **Command:**

```bash
ng generate @angular/core:signal-queries-migration --dry-run
ng generate @angular/core:signal-queries-migration
```

### ngClass to class bindings

- **Docs:** https://angular.dev/reference/migrations/ngclass-to-class
- **Command:**

```bash
ng generate @angular/core:ngclass-to-class --dry-run
ng generate @angular/core:ngclass-to-class
```

### @Injectable to @Service

- **Docs:** https://angular.dev/reference/migrations/service
- **Command:**

```bash
ng generate @angular/core:service --dry-run
ng generate @angular/core:service
```

## How to fix

**Style guide:** [angular.dev/style-guide](https://angular.dev/style-guide)

1. Run applicable migrations from the hub and the **Recommended migration commands** section.
2. Fix style guide findings using the linked section per rule (naming, structure, components, templates).
3. Read grouped findings below for anything migrations do not cover.
4. Align with the `angular-developer` skill.
5. Re-scan with `npx @abiramcodes/angular-doctor@latest --verbose --scope changed`.

## performance

### angular-doctor/getter-in-template (error) — 308 occurrences in 24 files

- **Message:** Template reads getter "sidenavWidth". Getters re-run on every change detection cycle, with no caching.
- **Reference:** https://angular.dev/best-practices/runtime-performance
- **Locations:**
  - `src\app\admin\admin.component.html:8:43` (fix: Replace the getter with a computed() and read it as sidenavWidth() in the template, or precompute the value into a signal.)
  - `src\app\admin\admin.component.ts:8:43` (fix: Replace the getter with a computed() and read it as sidenavWidth() in the template, or precompute the value into a signal.)
  - `src\app\admin\dashboard\dashboard.component.html:24:46` — Template reads getter "selectedMonthsDisplay". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedMonthsDisplay() in the template, or precompute the value into a signal.)
  - `src\app\admin\dashboard\dashboard.component.ts:24:46` — Template reads getter "selectedMonthsDisplay". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedMonthsDisplay() in the template, or precompute the value into a signal.)
  - `src\app\admin\firm-management\firm-management.component.html:93:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\firm-management\firm-management.component.html:149:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\firm-management\firm-management.component.html:149:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\firm-management\firm-management.component.ts:93:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\firm-management\firm-management.component.ts:149:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\firm-management\firm-management.component.ts:149:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.html:109:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.html:170:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.html:202:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.html:202:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.html:202:62` — Template reads getter "activeListLength". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeListLength() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.html:276:24` — Template reads getter "activeCategories". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeCategories() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.ts:109:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.ts:170:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.ts:202:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.ts:202:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.ts:202:62` — Template reads getter "activeListLength". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeListLength() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\categories\categories.component.ts:276:24` — Template reads getter "activeCategories". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeCategories() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:16:69` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:22:69` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:37:8` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:56:12` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:57:40` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:75:37` — Template reads getter "totalCommoditiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalCommoditiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:80:52` — Template reads getter "totalUnitsByUomSummary". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalUnitsByUomSummary() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:86:37` — Template reads getter "totalStockWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalStockWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:92:54` — Template reads getter "zeroStockCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as zeroStockCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:93:12` — Template reads getter "zeroStockCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as zeroStockCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:154:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:207:36` — Template reads getter "stockPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as stockPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:282:38` — Template reads getter "stockPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as stockPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:283:87` — Template reads getter "stockPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as stockPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:314:20` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:315:46` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:354:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:499:36` — Template reads getter "adjPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as adjPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:500:85` — Template reads getter "adjPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as adjPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:519:46` — Template reads getter "totalStockInKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalStockInKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:524:46` — Template reads getter "totalStockOutKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalStockOutKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:530:12` — Template reads getter "netStockMovementKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netStockMovementKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:530:62` — Template reads getter "netStockMovementKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netStockMovementKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:605:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:743:36` — Template reads getter "movPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as movPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:744:83` — Template reads getter "movPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as movPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:784:18` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:827:20` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:829:28` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:829:76` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:830:27` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:831:55` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:893:40` — Template reads getter "computedAverageWeightKg". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as computedAverageWeightKg() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:950:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:1085:24` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.html:1093:24` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:16:69` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:22:69` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:37:8` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:56:12` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:57:40` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:75:37` — Template reads getter "totalCommoditiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalCommoditiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:80:52` — Template reads getter "totalUnitsByUomSummary". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalUnitsByUomSummary() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:86:37` — Template reads getter "totalStockWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalStockWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:92:54` — Template reads getter "zeroStockCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as zeroStockCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:93:12` — Template reads getter "zeroStockCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as zeroStockCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:154:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:207:36` — Template reads getter "stockPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as stockPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:282:38` — Template reads getter "stockPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as stockPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:283:87` — Template reads getter "stockPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as stockPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:314:20` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:315:46` — Template reads getter "pendingAdjustmentsCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pendingAdjustmentsCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:354:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:499:36` — Template reads getter "adjPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as adjPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:500:85` — Template reads getter "adjPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as adjPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:519:46` — Template reads getter "totalStockInKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalStockInKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:524:46` — Template reads getter "totalStockOutKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalStockOutKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:530:12` — Template reads getter "netStockMovementKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netStockMovementKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:530:62` — Template reads getter "netStockMovementKpi". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netStockMovementKpi() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:605:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:743:36` — Template reads getter "movPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as movPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:744:83` — Template reads getter "movPageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as movPageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:784:18` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:827:20` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:829:28` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:829:76` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:830:27` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:831:55` — Template reads getter "liveSelectedStock". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as liveSelectedStock() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:893:40` — Template reads getter "computedAverageWeightKg". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as computedAverageWeightKg() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:950:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:1085:24` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:1093:24` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.html:91:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.html:127:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.html:127:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.html:166:24` — Template reads getter "activeSubCategories". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeSubCategories() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:91:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:127:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:127:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:166:24` — Template reads getter "activeSubCategories". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeSubCategories() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.html:110:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.html:141:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.html:141:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.html:182:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.html:213:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.html:213:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.ts:110:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.ts:141:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.ts:141:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.ts:182:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.ts:213:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\uom\uom.component.ts:213:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.html:28:34` — Template reads getter "totalCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.html:38:45` — Template reads getter "activeCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.html:48:45` — Template reads getter "inactiveCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as inactiveCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.html:58:46` — Template reads getter "citiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as citiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.html:169:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.html:238:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.html:238:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:28:34` — Template reads getter "totalCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:38:45` — Template reads getter "activeCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:48:45` — Template reads getter "inactiveCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as inactiveCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:58:46` — Template reads getter "citiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as citiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:169:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:238:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:238:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:31:12` — Template reads getter "totalInvoicedAmountInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalInvoicedAmountInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:39:12` — Template reads getter "totalIssuedInvoiceAmountInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalIssuedInvoiceAmountInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:47:12` — Template reads getter "totalPaidInvoiceAmountInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPaidInvoiceAmountInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:63:12` — Template reads getter "totalPendingPayableInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPendingPayableInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:66:12` — Template reads getter "payablePartiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as payablePartiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:67:12` — Template reads getter "totalPaidInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPaidInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:74:12` — Template reads getter "totalPendingReceivableInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPendingReceivableInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:77:12` — Template reads getter "receivablePartiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as receivablePartiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:78:12` — Template reads getter "totalReceivedInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalReceivedInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:84:45` — Template reads getter "netOverallPositionInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netOverallPositionInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:85:16` — Template reads getter "netOverallPositionInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netOverallPositionInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:88:14` — Template reads getter "netOverallPositionInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netOverallPositionInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:247:54` — Template reads getter "pageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:779:28` — Template reads getter "partyDropdownOptions". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as partyDropdownOptions() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:823:26` — Template reads getter "saudaOptionsForPayment". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as saudaOptionsForPayment() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1029:26` — Template reads getter "partyDropdownOptions". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as partyDropdownOptions() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1111:20` — Template reads getter "originalCalculatedInvoiceTotal". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as originalCalculatedInvoiceTotal() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1122:11` — Template reads getter "originalCalculatedInvoiceTotal". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as originalCalculatedInvoiceTotal() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1126:51` — Template reads getter "originalCalculatedInvoiceTotal". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as originalCalculatedInvoiceTotal() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1460:77` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1461:24` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1477:77` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.html:1478:24` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:31:12` — Template reads getter "totalInvoicedAmountInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalInvoicedAmountInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:39:12` — Template reads getter "totalIssuedInvoiceAmountInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalIssuedInvoiceAmountInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:47:12` — Template reads getter "totalPaidInvoiceAmountInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPaidInvoiceAmountInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:63:12` — Template reads getter "totalPendingPayableInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPendingPayableInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:66:12` — Template reads getter "payablePartiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as payablePartiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:67:12` — Template reads getter "totalPaidInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPaidInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:74:12` — Template reads getter "totalPendingReceivableInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalPendingReceivableInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:77:12` — Template reads getter "receivablePartiesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as receivablePartiesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:78:12` — Template reads getter "totalReceivedInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as totalReceivedInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:84:45` — Template reads getter "netOverallPositionInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netOverallPositionInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:85:16` — Template reads getter "netOverallPositionInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netOverallPositionInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:88:14` — Template reads getter "netOverallPositionInr". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as netOverallPositionInr() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:247:54` — Template reads getter "pageSize". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as pageSize() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:779:28` — Template reads getter "partyDropdownOptions". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as partyDropdownOptions() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:823:26` — Template reads getter "saudaOptionsForPayment". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as saudaOptionsForPayment() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1029:26` — Template reads getter "partyDropdownOptions". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as partyDropdownOptions() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1111:20` — Template reads getter "originalCalculatedInvoiceTotal". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as originalCalculatedInvoiceTotal() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1122:11` — Template reads getter "originalCalculatedInvoiceTotal". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as originalCalculatedInvoiceTotal() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1126:51` — Template reads getter "originalCalculatedInvoiceTotal". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as originalCalculatedInvoiceTotal() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1460:77` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1461:24` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1477:77` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1478:24` — Template reads getter "selectedSenderFirm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSenderFirm() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:16:76` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:21:76` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:39:37` — Template reads getter "activeSaudasList". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeSaudasList() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:44:37` — Template reads getter "purchaseCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as purchaseCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:49:37` — Template reads getter "salesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as salesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:54:37` — Template reads getter "brokerageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as brokerageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:95:31` — Template reads getter "firmFilterOptions". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as firmFilterOptions() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:192:70` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:210:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:210:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:333:22` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:392:70` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.html:572:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:16:76` — Template reads getter "isMaker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isMaker() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:21:76` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:39:37` — Template reads getter "activeSaudasList". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeSaudasList() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:44:37` — Template reads getter "purchaseCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as purchaseCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:49:37` — Template reads getter "salesCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as salesCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:54:37` — Template reads getter "brokerageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as brokerageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:95:31` — Template reads getter "firmFilterOptions". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as firmFilterOptions() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:192:70` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:210:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:210:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:333:22` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:392:70` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:572:14` — Template reads getter "isChecker". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as isChecker() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:28:37` — Template reads getter "activeTrucksList". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeTrucksList() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:33:37` — Template reads getter "purchaseLinkedCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as purchaseLinkedCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:38:37` — Template reads getter "salesLinkedCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as salesLinkedCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:43:37` — Template reads getter "deliveredCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as deliveredCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:189:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:189:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:446:15` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:453:11` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:497:14` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:499:14` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:500:44` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:501:42` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:502:14` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:512:24` — Template reads getter "eligibleSaudasForForm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as eligibleSaudasForForm() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:518:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:520:26` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:520:78` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:521:23` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:521:96` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:528:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:537:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:537:62` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:538:56` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:538:85` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:539:44` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:539:73` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:540:47` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:541:18` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:541:46` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:550:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:622:22` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:628:26` — Template reads getter "selectedSaudaCommodities". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaCommodities() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:632:18` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:632:64` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:634:27` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:669:70` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:684:27` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:685:14` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:689:12` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:689:35` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:689:55` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:692:27` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:693:21` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:697:12` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:697:58` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:697:79` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:697:99` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:700:62` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:701:20` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:702:20` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.html:732:17` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:28:37` — Template reads getter "activeTrucksList". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as activeTrucksList() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:33:37` — Template reads getter "purchaseLinkedCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as purchaseLinkedCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:38:37` — Template reads getter "salesLinkedCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as salesLinkedCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:43:37` — Template reads getter "deliveredCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as deliveredCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:189:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:189:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:446:15` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:453:11` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:497:14` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:499:14` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:500:44` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:501:42` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:502:14` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:512:24` — Template reads getter "eligibleSaudasForForm". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as eligibleSaudasForForm() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:518:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:520:26` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:520:78` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:521:23` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:521:96` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:528:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:537:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:537:62` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:538:56` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:538:85` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:539:44` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:539:73` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:540:47` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:541:18` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:541:46` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:550:16` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:622:22` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:628:26` — Template reads getter "selectedSaudaCommodities". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaCommodities() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:632:18` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:632:64` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:634:27` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:669:70` — Template reads getter "commodityRows". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as commodityRows() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:684:27` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:685:14` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:689:12` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:689:35` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:689:55` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:692:27` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:693:21` — Template reads getter "selectedSaudaRemainingMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedSaudaRemainingMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:697:12` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:697:58` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:697:79` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:697:99` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:700:62` — Template reads getter "selectedWarehouse". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedWarehouse() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:701:20` — Template reads getter "availableWarehouseStockMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as availableWarehouseStockMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:702:20` — Template reads getter "formTotalWeightMt". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as formTotalWeightMt() in the template, or precompute the value into a signal.)
  - `src\app\admin\truck-management\truck-management.component.ts:732:17` — Template reads getter "selectedLinkedSauda". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as selectedLinkedSauda() in the template, or precompute the value into a signal.)
  - `src\app\admin\user-management\user-management.component.html:154:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\user-management\user-management.component.html:251:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\user-management\user-management.component.html:251:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)
  - `src\app\admin\user-management\user-management.component.ts:154:45` — Template reads getter "itemsPerPageCount". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as itemsPerPageCount() in the template, or precompute the value into a signal.)
  - `src\app\admin\user-management\user-management.component.ts:251:20` — Template reads getter "showingStart". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingStart() in the template, or precompute the value into a signal.)
  - `src\app\admin\user-management\user-management.component.ts:251:42` — Template reads getter "showingEnd". Getters re-run on every change detection cycle, with no caching. (fix: Replace the getter with a computed() and read it as showingEnd() in the template, or precompute the value into a signal.)

### angular-doctor/zone-js (warning) — 2 occurrences in 2 files

- **Message:** zone.js is still a dependency. Angular 20+ can run zoneless and drop this runtime.
- **Reference:** https://angular.dev/guide/zoneless
- **Locations:**
  - `src\environments\environment.ts:18:4` — This file imports zone.js. Zoneless apps do not need that import. (fix: Remove the zone.js import after switching the app to zoneless.)
  - `package.json:37:5` (fix: Provide zoneless change detection and remove zone.js.)

### angular-doctor/explicit-eager-change-detection (info) — 12 occurrences in 12 files

- **Message:** Explicit Eager change detection checks more of the component tree.
- **Suggested fix:** Omit changeDetection on Angular 22+ (OnPush is the default) or set ChangeDetectionStrategy.OnPush.
- **Reference:** https://angular.dev/best-practices/runtime-performance
- **Locations:**
  - `src\app\admin\admin.component.ts:29:5`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:18:5`
  - `src\app\admin\loginpages\otp\otp.component.ts:22:5`
  - `src\app\admin\loginpages\signin\signin.component.ts:59:5`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:37:3`
  - `src\app\admin\sidenav\sidenav.component.ts:23:5`
  - `src\app\app.component.ts:8:5`
  - `src\app\website\components\components.component.ts:7:5`
  - `src\app\website\components\navbar\navbar.component.ts:10:5`
  - `src\app\website\components\testimonials\testimonials.component.ts:26:5`
  - `src\app\website\home\home.component.ts:13:3`
  - `src\app\website\notification\notification.component.ts:16:5`

## correctness

### angular-doctor/prefer-take-until-destroyed (error) — 9 occurrences in 9 files

- **Message:** Subject teardown in ngOnDestroy. Prefer takeUntilDestroyed().
- **Suggested fix:** Remove the destroy subject. Pipe subscriptions with takeUntilDestroyed() from @angular/core/rxjs-interop. Pass DestroyRef when the call is outside an injection context. Complete a subject you still own from DestroyRef.onDestroy(), not ngOnDestroy.
- **Reference:** https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.ts:361:5`
  - `src\app\admin\firm-management\firm-management.component.ts:74:5`
  - `src\app\admin\inventory-management\categories\categories.component.ts:88:5`
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:102:5`
  - `src\app\admin\masters\uom\uom.component.ts:85:5`
  - `src\app\admin\masters\warehouse\warehouse.component.ts:98:5`
  - `src\app\admin\sauda-management\sauda-management.component.ts:203:5`
  - `src\app\admin\truck-management\truck-management.component.ts:141:5`
  - `src\app\admin\user-management\user-management.component.ts:105:5`

### angular-doctor/prefer-control-flow (error) — 1 occurrence

- **Message:** Legacy structural directive *ngIf found. Prefer built-in control flow (@if, @for, @switch).
- **Suggested fix:** Run the control-flow migration, then verify templates. Add track on every @for.
- **Migration docs:** https://angular.dev/reference/migrations/control-flow
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:control-flow --dry-run
ng generate @angular/core:control-flow
```
- **Locations:**
  - `src\app\spinner\spinner.component.html:1:11`

## maintainability

### angular-doctor/prefer-host-bindings (error) — 5 occurrences in 4 files

- **Message:** @HostListener is backwards-compatible. Use the host option instead.
- **Suggested fix:** Move the binding into the host object of @Component or @Directive, for example '[class.active]': 'isActive()' or '(keydown)': 'updateValue($event)'.
- **Reference:** https://angular.dev/guide/components/host-elements
- **Locations:**
  - `src\app\admin\admin.component.ts:115:3`
  - `src\app\admin\admin.component.ts:164:3`
  - `src\app\admin\dashboard\dashboard.component.ts:109:3`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:160:3`
  - `src\app\website\components\navbar\navbar.component.ts:71:3`

### angular-doctor/deprecated-animations (error) — 1 occurrence

- **Message:** `@angular/animations` is deprecated and still listed in package.json.
- **Suggested fix:** Remove the dependency. New animation code should use native CSS animate.enter and animate.leave.
- **Reference:** https://angular.dev/guide/legacy-animations
- **Locations:**
  - `package.json:13:5`

### angular-doctor/prefer-inject (warning) — 31 occurrences in 31 files

- **Message:** Constructor parameter injection detected. Prefer the inject() function for dependencies.
- **Suggested fix:** Run the inject() migration scoped with --path, then fix any manual edge cases.
- **Migration docs:** https://angular.dev/reference/migrations/inject-function
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:inject --dry-run
ng generate @angular/core:inject
```
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.ts:344:3`
  - `src\app\admin\firm-management\firm-management.component.ts:52:3`
  - `src\app\admin\inventory-management\categories\categories.component.ts:60:3`
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:72:3`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:36:3`
  - `src\app\admin\loginpages\otp\otp.component.ts:29:3`
  - `src\app\admin\loginpages\signin\signin.component.ts:77:3`
  - `src\app\admin\masters\uom\uom.component.ts:61:3`
  - `src\app\admin\masters\warehouse\warehouse.component.ts:74:3`
  - `src\app\admin\sauda-management\sauda-management.component.ts:129:3`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:122:3`
  - `src\app\admin\sidenav\sidenav.component.ts:32:3`
  - `src\app\admin\truck-management\truck-management.component.ts:98:3`
  - `src\app\admin\user-management\user-management.component.ts:78:3`
  - `src\app\core\auth\auth-guard.ts:12:3`
  - `src\app\core\auth\direct-access-guard.ts:15:3`
  - `src\app\core\auth\student-auth-guard.ts:12:3`
  - `src\app\core\pipe\safe-url.pipe.ts:6:3`
  - `src\app\core\services\api.service.ts:12:3`
  - `src\app\core\services\auth.interceptor.ts:8:3`
  - `src\app\core\services\calendar.service.ts:13:3`
  - `src\app\core\services\classe-routines.service.ts:13:3`
  - `src\app\core\services\Employee.service.ts:17:3`
  - `src\app\core\services\Inquiry.service.ts:13:3`
  - `src\app\core\services\jwt.service.ts:9:3`
  - `src\app\core\services\loading.interceptor.ts:15:3`
  - `src\app\core\services\login.service.ts:13:3`
  - `src\app\core\services\notification.service.ts:11:3`
  - `src\app\core\services\notificationnew.service.ts:19:3`
  - `src\app\spinner\spinner.component.ts:13:3`
  - `src\app\website\components\navbar\navbar.component.ts:52:3`

### angular-doctor/prefer-functional-interceptor (warning) — 7 occurrences in 5 files

- **Message:** Class-based HTTP interceptors are the legacy API.
- **Suggested fix:** Register a functional interceptor with provideHttpClient(withInterceptors([...])).
- **Reference:** https://angular.dev/guide/http
- **Locations:**
  - `src\app\app.config.ts:4:53`
  - `src\app\app.config.ts:36:16`
  - `src\app\app.config.ts:37:16`
  - `src\app\core\services\auth.interceptor.ts:7:30`
  - `src\app\core\services\error.interceptor.ts:4:29`
  - `src\app\core\services\internet-interceptor.ts:13:34`
  - `src\app\core\services\loading.interceptor.ts:12:33`

### angular-doctor/prefer-signal-query (warning) — 3 occurrences in 2 files

- **Message:** Decorator-based query @ViewChild found. Prefer the viewChild() signal query.
- **Suggested fix:** Run signal-queries-migration and re-run tests.
- **Migration docs:** https://angular.dev/reference/migrations/signal-queries
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:signal-queries-migration --dry-run
ng generate @angular/core:signal-queries-migration
```
- **Locations:**
  - `src\app\admin\admin.component.ts:38:3`
  - `src\app\admin\admin.component.ts:39:3`
  - `src\app\admin\dashboard\dashboard.component.ts:107:3`

### angular-doctor/lifecycle-hook-complexity (warning) — 2 occurrences in 2 files

- **Message:** ngOnInit contains 26 lines; prefer delegating to named methods.
- **Suggested fix:** Call small private methods from the lifecycle hook.
- **Reference:** https://angular.dev/style-guide#components-and-directives
- **Locations:**
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:46:3`
  - `src\app\admin\loginpages\otp\otp.component.ts:48:3` — ngOnInit contains 25 lines; prefer delegating to named methods.

### angular-doctor/lifecycle-interface (warning) — 1 occurrence

- **Message:** ngOnDestroy is declared but class does not implement OnDestroy.
- **Suggested fix:** Add implements OnDestroy and import it from @angular/core.
- **Reference:** https://angular.dev/style-guide#components-and-directives
- **Locations:**
  - `src\app\admin\loginpages\signin\signin.component.ts:209:3`

### angular-doctor/prefer-class-binding (info) — 63 occurrences in 14 files

- **Message:** ngClass binding found. Prefer native class bindings.
- **Suggested fix:** Run ngclass-to-class migration where templates are eligible.
- **Migration docs:** https://angular.dev/reference/migrations/ngclass-to-class
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:ngclass-to-class --dry-run
ng generate @angular/core:ngclass-to-class
```
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.html:462:53`
  - `src\app\admin\dashboard\dashboard.component.html:595:17`
  - `src\app\admin\firm-management\firm-management.component.html:119:63`
  - `src\app\admin\firm-management\firm-management.component.html:133:56`
  - `src\app\admin\firm-management\firm-management.component.html:135:39`
  - `src\app\admin\firm-management\firm-management.component.html:260:45`
  - `src\app\admin\inventory-management\categories\categories.component.html:112:63`
  - `src\app\admin\inventory-management\categories\categories.component.html:124:56`
  - `src\app\admin\inventory-management\categories\categories.component.html:126:39`
  - `src\app\admin\inventory-management\categories\categories.component.html:174:63`
  - `src\app\admin\inventory-management\categories\categories.component.html:186:56`
  - `src\app\admin\inventory-management\categories\categories.component.html:188:39`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:98:63`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:112:56`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:114:39`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:24:11`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:79:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:116:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:130:23`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:164:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:179:27`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:223:11`
  - `src\app\admin\loginpages\otp\otp.component.html:19:11`
  - `src\app\admin\loginpages\otp\otp.component.html:47:11`
  - `src\app\admin\loginpages\signin\signin.component.html:21:11`
  - `src\app\admin\loginpages\signin\signin.component.html:44:11`
  - `src\app\admin\loginpages\signin\signin.component.html:46:31`
  - `src\app\admin\masters\uom\uom.component.html:114:63`
  - `src\app\admin\masters\uom\uom.component.html:126:56`
  - `src\app\admin\masters\uom\uom.component.html:128:39`
  - `src\app\admin\masters\uom\uom.component.html:186:63`
  - `src\app\admin\masters\uom\uom.component.html:198:56`
  - `src\app\admin\masters\uom\uom.component.html:200:39`
  - `src\app\admin\masters\warehouse\warehouse.component.html:120:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:127:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:134:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:140:40`
  - `src\app\admin\masters\warehouse\warehouse.component.html:202:63`
  - `src\app\admin\masters\warehouse\warehouse.component.html:223:56`
  - `src\app\admin\masters\warehouse\warehouse.component.html:225:39`
  - `src\app\admin\masters\warehouse\warehouse.component.html:411:45`
  - `src\app\admin\masters\warehouse\warehouse.component.html:562:9`
  - `src\app\admin\party-ledger\party-ledger.component.html:84:34`
  - `src\app\admin\party-ledger\party-ledger.component.html:257:42`
  - `src\app\admin\party-ledger\party-ledger.component.html:379:44`
  - `src\app\admin\party-ledger\party-ledger.component.html:515:44`
  - `src\app\admin\sauda-management\sauda-management.component.html:175:42`
  - `src\app\admin\sauda-management\sauda-management.component.html:545:38`
  - `src\app\admin\truck-management\truck-management.component.html:164:39`
  - `src\app\admin\truck-management\truck-management.component.html:170:42`
  - `src\app\admin\truck-management\truck-management.component.html:264:35`
  - `src\app\admin\truck-management\truck-management.component.html:330:42`
  - `src\app\admin\truck-management\truck-management.component.html:500:33`
  - `src\app\admin\truck-management\truck-management.component.html:501:31`
  - `src\app\admin\truck-management\truck-management.component.html:538:45`
  - `src\app\admin\truck-management\truck-management.component.html:539:33`
  - `src\app\admin\user-management\user-management.component.html:204:17`
  - `src\app\admin\user-management\user-management.component.html:234:19`
  - `src\app\admin\user-management\user-management.component.html:237:39`
  - `src\app\admin\user-management\user-management.component.html:444:15`
  - `src\app\admin\user-management\user-management.component.html:548:9`
  - `src\app\website\notification\notification.component.html:3:31`
  - `src\app\website\notification\notification.component.html:7:9`

### angular-doctor/prefer-signal-forms (info) — 15 occurrences in 15 files

- **Message:** Reactive or template-driven forms API (FormsModule). New forms should use signal forms.
- **Suggested fix:** Prefer the signal forms API for new form work.
- **Reference:** https://angular.dev/guide/forms/signals
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.ts:10:1`
  - `src\app\admin\firm-management\firm-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\inventory-management\categories\categories.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:4:1`
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:2:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\loginpages\otp\otp.component.ts:2:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\loginpages\signin\signin.component.ts:16:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\masters\uom\uom.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\masters\warehouse\warehouse.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\party-ledger\party-ledger.component.ts:4:1`
  - `src\app\admin\sauda-management\sauda-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormArray, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\truck-management\truck-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormArray, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\admin\user-management\user-management.component.ts:3:1` — Reactive or template-driven forms API (FormGroup, FormBuilder, FormsModule). New forms should use signal forms.
  - `src\app\app.config.ts:15:1`

### angular-doctor/prefer-common-imports (info) — 13 occurrences in 13 files

- **Message:** CommonModule import detected. Prefer explicit standalone directive/pipe imports.
- **Suggested fix:** Run common-to-standalone migration for minimal imports per template.
- **Migration docs:** https://angular.dev/reference/migrations/common-to-standalone
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:common-to-standalone --dry-run
ng generate @angular/core:common-to-standalone
```
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.ts:9:10`
  - `src\app\admin\firm-management\firm-management.component.ts:2:10`
  - `src\app\admin\inventory-management\categories\categories.component.ts:2:10`
  - `src\app\admin\inventory-management\inventory\inventory.component.ts:1:10`
  - `src\app\admin\inventory-management\product-master\product-master.component.ts:2:10`
  - `src\app\admin\masters\uom\uom.component.ts:2:10`
  - `src\app\admin\masters\warehouse\warehouse.component.ts:2:10`
  - `src\app\admin\party-ledger\party-ledger.component.ts:1:10`
  - `src\app\admin\sauda-management\sauda-management.component.ts:2:10`
  - `src\app\admin\truck-management\truck-management.component.ts:2:10`
  - `src\app\admin\user-management\user-management.component.ts:2:10`
  - `src\app\app.config.ts:6:20`
  - `src\app\website\notification\notification.component.ts:2:10`

### angular-doctor/prefer-service-decorator (info) — 12 occurrences in 12 files

- **Message:** @Injectable found. Angular 22+ supports @Service for singletons.
- **Suggested fix:** Run service migration where @Service applies; keep @Injectable for multi providers.
- **Migration docs:** https://angular.dev/reference/migrations/service
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:service --dry-run
ng generate @angular/core:service
```
- **Locations:**
  - `src\app\core\auth\auth-guard.ts:7:1`
  - `src\app\core\auth\student-auth-guard.ts:7:1`
  - `src\app\core\services\calendar.service.ts:6:1`
  - `src\app\core\services\classe-routines.service.ts:6:1`
  - `src\app\core\services\Employee.service.ts:7:1`
  - `src\app\core\services\Inquiry.service.ts:6:1`
  - `src\app\core\services\jwt.service.ts:5:1`
  - `src\app\core\services\loader.service.ts:3:1`
  - `src\app\core\services\login.service.ts:6:1`
  - `src\app\core\services\notification.service.ts:7:1`
  - `src\app\core\services\notificationnew.service.ts:12:1`
  - `src\app\core\services\sauda-erp-mock.service.ts:413:1`

### angular-doctor/prefer-signal-input (info) — 1 occurrence

- **Message:** @Input decorator found. Prefer signal-based input() API.
- **Suggested fix:** Run signal-input-migration; verify public API compatibility.
- **Migration docs:** https://angular.dev/reference/migrations/signal-inputs
- **Automated fix (dry-run first):**

```bash
ng generate @angular/core:signal-input-migration --dry-run
ng generate @angular/core:signal-input-migration
```
- **Locations:**
  - `src\app\website\notification\notification.component.ts:33:3`

## security

### angular-doctor/target-blank (error) — 3 occurrences in 2 files

- **Message:** target="_blank" needs rel="noopener" or rel="noreferrer".
- **Reference:** https://angular.dev/best-practices/security
- **Locations:**
  - `src\app\admin\firm-management\firm-management.component.html:110:15`
  - `src\app\admin\firm-management\firm-management.component.html:289:13`
  - `src\app\website\components\footer\footer.component.html:187:11`

### angular-doctor/security-bypass (warning) — 1 occurrence

- **Message:** DomSanitizer bypass API usage requires strict review.
- **Suggested fix:** Avoid bypassing sanitization. Prefer binding safe values or server-side sanitization.
- **Reference:** https://angular.dev/best-practices/security
- **Locations:**
  - `src\app\core\pipe\safe-url.pipe.ts:9:27`

## hygiene

### oxlint/no-explicit-any (warning) — 229 occurrences in 32 files

- **Message:** Unexpected `any`. Specify a different type.
- **Locations:**
  - `src\app\admin\admin.component.ts:51:20`
  - `src\app\admin\admin.component.ts:116:19`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:80:16`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:81:17`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:96:20`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:147:20`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:179:33`
  - `src\app\admin\loginpages\otp\otp.component.ts:27:9`
  - `src\app\admin\loginpages\otp\otp.component.ts:28:11`
  - `src\app\admin\loginpages\otp\otp.component.ts:47:10`
  - `src\app\admin\loginpages\otp\otp.component.ts:89:16`
  - `src\app\admin\loginpages\otp\otp.component.ts:93:17`
  - `src\app\admin\loginpages\otp\otp.component.ts:117:71`
  - `src\app\admin\loginpages\otp\otp.component.ts:145:33`
  - `src\app\admin\loginpages\signin\signin.component.ts:70:16`
  - `src\app\admin\loginpages\signin\signin.component.ts:71:17`
  - `src\app\admin\loginpages\signin\signin.component.ts:166:32`
  - `src\app\admin\loginpages\signin\signin.component.ts:198:33`
  - `src\app\admin\sauda-management\sauda-management.component.ts:751:56`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:46:25`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:166:11`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:189:17`
  - `src\app\admin\sidenav-header\sidenav-header.component.ts:193:16`
  - `src\app\admin\sidenav\sidenav.component.ts:39:10`
  - `src\app\admin\truck-management\truck-management.component.ts:661:56`
  - `src\app\core\auth\direct-access-guard.ts:26:20`
  - `src\app\core\model-class\course-batch.ts:13:15`
  - `src\app\core\model-class\course-batch.ts:20:24`
  - `src\app\core\model-class\course-batch.ts:37:14`
  - `src\app\core\model-class\course-batch.ts:38:13`
  - `src\app\core\model-class\course-batch.ts:43:13`
  - `src\app\core\model-class\course-batch.ts:44:17`
  - `src\app\core\model-class\course-batch.ts:52:12`
  - `src\app\core\model-class\course-batch.ts:53:14`
  - `src\app\core\model-class\course-batch.ts:57:16`
  - `src\app\core\model-class\course-batch.ts:58:10`
  - `src\app\core\model-class\course-batch.ts:62:12`
  - `src\app\core\model-class\course-batch.ts:63:11`
  - `src\app\core\model-class\course-batch.ts:72:17`
  - `src\app\core\model-class\course-batch.ts:74:15`
  - `src\app\core\model-class\course-batch.ts:83:12`
  - `src\app\core\model-class\course-batch.ts:84:20`
  - `src\app\core\model-class\course-batch.ts:88:13`
  - `src\app\core\model-class\course-batch.ts:89:18`
  - `src\app\core\model-class\employee.ts:31:16`
  - `src\app\core\model-class\employee.ts:32:14`
  - `src\app\core\model-class\employee.ts:34:14`
  - `src\app\core\model-class\employee.ts:35:13`
  - `src\app\core\model-class\employee.ts:37:13`
  - `src\app\core\model-class\employee.ts:38:17`
  - `src\app\core\model-class\employee.ts:39:13`
  - `src\app\core\model-class\employee.ts:44:11`
  - `src\app\core\model-class\employee.ts:45:12`
  - `src\app\core\model-class\fee-management.ts:4:9`
  - `src\app\core\model-class\fee-management.ts:18:9`
  - `src\app\core\model-class\fee-management.ts:25:12`
  - `src\app\core\model-class\fee-management.ts:39:11`
  - `src\app\core\model-class\fee-management.ts:41:14`
  - `src\app\core\model-class\fee-management.ts:42:24`
  - `src\app\core\model-class\fee-management.ts:72:12`
  - `src\app\core\model-class\fee-management.ts:76:22`
  - `src\app\core\model-class\fee-management.ts:79:28`
  - `src\app\core\model-class\fee-management.ts:115:19`
  - `src\app\core\model-class\fee-management.ts:116:20`
  - `src\app\core\model-class\fee-management.ts:117:15`
  - `src\app\core\model-class\fee-management.ts:122:23`
  - `src\app\core\model-class\fee-management.ts:127:19`
  - `src\app\core\model-class\fee-management.ts:129:15`
  - `src\app\core\model-class\fee-management.ts:130:20`
  - `src\app\core\model-class\fee-management.ts:131:11`
  - `src\app\core\model-class\fee-management.ts:152:16`
  - `src\app\core\model-class\fee-management.ts:153:19`
  - `src\app\core\model-class\fee-management.ts:154:23`
  - `src\app\core\model-class\fee-management.ts:155:16`
  - `src\app\core\model-class\fee-management.ts:156:17`
  - `src\app\core\model-class\fee-management.ts:157:23`
  - `src\app\core\model-class\fee-management.ts:158:21`
  - `src\app\core\model-class\fee-management.ts:165:12`
  - `src\app\core\model-class\fee-management.ts:166:24`
  - `src\app\core\model-class\fee-management.ts:167:23`
  - `src\app\core\model-class\fee-management.ts:168:22`
  - `src\app\core\model-class\fee-management.ts:169:21`
  - `src\app\core\model-class\fee-management.ts:170:23`
  - `src\app\core\model-class\fee-management.ts:232:23`
  - `src\app\core\model-class\file-extension-validator.directive.ts:4:55`
  - `src\app\core\model-class\login-signup.ts:48:13`
  - `src\app\core\model-class\login-signup.ts:49:26`
  - `src\app\core\model-class\login-signup.ts:50:12`
  - `src\app\core\model-class\login-signup.ts:51:9`
  - `src\app\core\model-class\parties.ts:7:17`
  - `src\app\core\model-class\parties.ts:8:18`
  - `src\app\core\model-class\parties.ts:9:21`
  - `src\app\core\model-class\parties.ts:10:21`
  - `src\app\core\model-class\parties.ts:23:17`
  - `src\app\core\model-class\parties.ts:24:18`
  - `src\app\core\model-class\parties.ts:25:21`
  - `src\app\core\model-class\parties.ts:26:21`
  - `src\app\core\model-class\test.ts:3:11`
  - `src\app\core\model-class\validations.ts:42:36`
  - `src\app\core\pipe\number-format.pipe.ts:9:20`
  - `src\app\core\services\api.service.ts:19:34`
  - `src\app\core\services\api.service.ts:76:30`
  - `src\app\core\services\api.service.ts:76:52`
  - `src\app\core\services\api.service.ts:82:27`
  - `src\app\core\services\api.service.ts:82:41`
  - `src\app\core\services\api.service.ts:82:63`
  - `src\app\core\services\api.service.ts:92:28`
  - `src\app\core\services\api.service.ts:92:42`
  - `src\app\core\services\api.service.ts:92:64`
  - `src\app\core\services\api.service.ts:102:33`
  - `src\app\core\services\api.service.ts:102:55`
  - `src\app\core\services\api.service.ts:112:29`
  - `src\app\core\services\api.service.ts:112:43`
  - `src\app\core\services\api.service.ts:112:65`
  - `src\app\core\services\api.service.ts:122:40`
  - `src\app\core\services\api.service.ts:122:57`
  - `src\app\core\services\api.service.ts:132:67`
  - `src\app\core\services\api.service.ts:142:41`
  - `src\app\core\services\api.service.ts:142:58`
  - `src\app\core\services\api.service.ts:155:17`
  - `src\app\core\services\api.service.ts:164:25`
  - `src\app\core\services\auth.interceptor.ts:10:30`
  - `src\app\core\services\auth.interceptor.ts:10:77`
  - `src\app\core\services\calendar.service.ts:19:26`
  - `src\app\core\services\calendar.service.ts:24:28`
  - `src\app\core\services\calendar.service.ts:29:29`
  - `src\app\core\services\calendar.service.ts:38:22`
  - `src\app\core\services\calendar.service.ts:43:23`
  - `src\app\core\services\calendar.service.ts:52:23`
  - `src\app\core\services\calendar.service.ts:57:33`
  - `src\app\core\services\calendar.service.ts:65:31`
  - `src\app\core\services\data.service.ts:12:26`
  - `src\app\core\services\Employee.service.ts:13:15`
  - `src\app\core\services\Employee.service.ts:14:18`
  - `src\app\core\services\Employee.service.ts:15:18`
  - `src\app\core\services\Employee.service.ts:31:19`
  - `src\app\core\services\Employee.service.ts:38:21`
  - `src\app\core\services\Employee.service.ts:38:38`
  - `src\app\core\services\Employee.service.ts:51:19`
  - `src\app\core\services\Employee.service.ts:58:30`
  - `src\app\core\services\error.interceptor.ts:6:30`
  - `src\app\core\services\error.interceptor.ts:8:29`
  - `src\app\core\services\Inquiry.service.ts:23:26`
  - `src\app\core\services\Inquiry.service.ts:23:42`
  - `src\app\core\services\Inquiry.service.ts:32:21`
  - `src\app\core\services\Inquiry.service.ts:37:24`
  - `src\app\core\services\Inquiry.service.ts:42:31`
  - `src\app\core\services\Inquiry.service.ts:51:23`
  - `src\app\core\services\Inquiry.service.ts:56:27`
  - `src\app\core\services\Inquiry.service.ts:70:74`
  - `src\app\core\services\Inquiry.service.ts:87:37`
  - `src\app\core\services\Inquiry.service.ts:87:47`
  - `src\app\core\services\Inquiry.service.ts:91:35`
  - `src\app\core\services\Inquiry.service.ts:91:45`
  - `src\app\core\services\Inquiry.service.ts:91:60`
  - `src\app\core\services\Inquiry.service.ts:99:33`
  - `src\app\core\services\Inquiry.service.ts:103:30`
  - `src\app\core\services\Inquiry.service.ts:114:39`
  - `src\app\core\services\Inquiry.service.ts:114:49`
  - `src\app\core\services\Inquiry.service.ts:119:35`
  - `src\app\core\services\Inquiry.service.ts:119:45`
  - `src\app\core\services\Inquiry.service.ts:119:60`
  - `src\app\core\services\Inquiry.service.ts:126:24`
  - `src\app\core\services\Inquiry.service.ts:130:30`
  - `src\app\core\services\Inquiry.service.ts:135:84`
  - `src\app\core\services\Inquiry.service.ts:147:23`
  - `src\app\core\services\Inquiry.service.ts:152:26`
  - `src\app\core\services\Inquiry.service.ts:159:34`
  - `src\app\core\services\Inquiry.service.ts:166:34`
  - `src\app\core\services\Inquiry.service.ts:166:50`
  - `src\app\core\services\Inquiry.service.ts:172:40`
  - `src\app\core\services\Inquiry.service.ts:181:41`
  - `src\app\core\services\Inquiry.service.ts:181:51`
  - `src\app\core\services\Inquiry.service.ts:185:32`
  - `src\app\core\services\Inquiry.service.ts:185:42`
  - `src\app\core\services\Inquiry.service.ts:185:57`
  - `src\app\core\services\Inquiry.service.ts:191:33`
  - `src\app\core\services\Inquiry.service.ts:191:43`
  - `src\app\core\services\Inquiry.service.ts:191:58`
  - `src\app\core\services\Inquiry.service.ts:197:45`
  - `src\app\core\services\Inquiry.service.ts:197:55`
  - `src\app\core\services\Inquiry.service.ts:201:28`
  - `src\app\core\services\Inquiry.service.ts:207:32`
  - `src\app\core\services\Inquiry.service.ts:212:23`
  - `src\app\core\services\Inquiry.service.ts:212:30`
  - `src\app\core\services\Inquiry.service.ts:218:23`
  - `src\app\core\services\Inquiry.service.ts:222:29`
  - `src\app\core\services\Inquiry.service.ts:232:41`
  - `src\app\core\services\Inquiry.service.ts:232:51`
  - `src\app\core\services\Inquiry.service.ts:236:37`
  - `src\app\core\services\Inquiry.service.ts:236:47`
  - `src\app\core\services\Inquiry.service.ts:236:62`
  - `src\app\core\services\Inquiry.service.ts:243:48`
  - `src\app\core\services\Inquiry.service.ts:243:58`
  - `src\app\core\services\Inquiry.service.ts:247:39`
  - `src\app\core\services\Inquiry.service.ts:247:49`
  - `src\app\core\services\Inquiry.service.ts:247:64`
  - `src\app\core\services\Inquiry.service.ts:257:39`
  - `src\app\core\services\Inquiry.service.ts:257:49`
  - `src\app\core\services\Inquiry.service.ts:257:64`
  - `src\app\core\services\Inquiry.service.ts:257:73`
  - `src\app\core\services\Inquiry.service.ts:257:80`
  - `src\app\core\services\Inquiry.service.ts:257:92`
  - `src\app\core\services\internet-interceptor.ts:17:26`
  - `src\app\core\services\internet-interceptor.ts:19:27`
  - `src\app\core\services\jwt.service.ts:29:20`
  - `src\app\core\services\login.service.ts:19:23`
  - `src\app\core\services\login.service.ts:19:40`
  - `src\app\core\services\login.service.ts:23:32`
  - `src\app\core\services\login.service.ts:23:49`
  - `src\app\core\services\login.service.ts:25:19`
  - `src\app\core\services\login.service.ts:32:28`
  - `src\app\core\services\login.service.ts:32:45`
  - `src\app\core\services\login.service.ts:34:19`
  - `src\app\core\services\login.service.ts:41:29`
  - `src\app\core\services\login.service.ts:51:19`
  - `src\app\core\services\login.service.ts:57:25`
  - `src\app\core\services\login.service.ts:57:39`
  - `src\app\core\services\login.service.ts:61:23`
  - `src\app\core\services\login.service.ts:61:37`
  - `src\app\core\services\login.service.ts:65:30`
  - `src\app\core\services\notification.service.ts:17:29`
  - `src\app\core\services\notification.service.ts:20:32`
  - `src\app\core\services\sauda-erp-mock.service.ts:50:20`
  - `src\app\core\services\sauda-erp-mock.service.ts:2747:14`
  - `src\app\core\services\sauda-erp-mock.service.ts:2810:54`
  - `src\app\website\components\navbar\navbar.component.ts:58:26`
  - `src\app\website\components\testimonials\testimonials.component.ts:126:52`
  - `src\app\website\components\testimonials\testimonials.component.ts:127:37`

### oxlint/no-unused-vars (warning) — 54 occurrences in 21 files

- **Message:** Identifier 'Observable' is imported but never used.
- **Locations:**
  - `src\app\admin\admin.component.ts:16:10` — Identifier 'ThemePalette' is imported but never used.
  - `src\app\admin\admin.component.ts:116:12` — Parameter 'event' is declared but never used. Unused parameters should start with a '_'.
  - `src\app\admin\dashboard\dashboard.component.ts:12:19` — Identifier 'combineLatest' is imported but never used.
  - `src\app\admin\dashboard\dashboard.component.ts:18:3` — Identifier 'SaudaRecord' is imported but never used.
  - `src\app\admin\dashboard\dashboard.component.ts:19:3` — Identifier 'TruckEntryRecord' is imported but never used.
  - `src\app\admin\dashboard\dashboard.component.ts:20:3` — Identifier 'WarehouseRecord' is imported but never used.
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:2:10` — Identifier 'AbstractControl' is imported but never used.
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:4:10` — Identifier 'SendOtp' is imported but never used.
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:4:19` — Identifier 'OtpVerify' is imported but never used.
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.ts:5:10` — Identifier 'Validations' is imported but never used.
  - `src\app\admin\loginpages\loginpages.component.ts:1:46` — Identifier 'signal' is imported but never used.
  - `src\app\admin\loginpages\otp\otp.component.ts:5:3` — Identifier 'SendOtp' is imported but never used.
  - `src\app\admin\loginpages\otp\otp.component.ts:6:3` — Identifier 'OtpVerify' is imported but never used.
  - `src\app\admin\loginpages\otp\otp.component.ts:10:10` — Identifier 'Validations' is imported but never used.
  - `src\app\admin\loginpages\otp\otp.component.ts:110:13` — Variable 'headers' is declared but never used. Unused variables should start with a '_'.
  - `src\app\admin\loginpages\signin\signin.component.ts:11:3` — Identifier 'ViewChildren' is imported but never used.
  - `src\app\admin\loginpages\signin\signin.component.ts:12:3` — Identifier 'QueryList' is imported but never used.
  - `src\app\admin\loginpages\signin\signin.component.ts:13:3` — Identifier 'ElementRef' is imported but never used.
  - `src\app\admin\loginpages\signin\signin.component.ts:23:19` — Identifier 'NgOptimizedImage' is imported but never used.
  - `src\app\admin\party-ledger\party-ledger.component.ts:10:3` — Identifier 'InvoiceLinkedSauda' is imported but never used.
  - `src\app\admin\party-ledger\party-ledger.component.ts:11:3` — Identifier 'InvoicePaymentRecord' is imported but never used.
  - `src\app\admin\party-ledger\party-ledger.component.ts:13:3` — Identifier 'InvoiceStatus' is imported but never used.
  - `src\app\admin\sauda-management\sauda-management.component.ts:23:3` — Identifier 'SaudaAmendmentRecord' is imported but never used.
  - `src\app\admin\user-management\user-management.component.ts:18:3` — Identifier 'AccountStatus' is imported but never used.
  - `src\app\admin\user-management\user-management.component.ts:19:3` — Identifier 'PasswordSetupStatus' is imported but never used.
  - `src\app\core\auth\auth-guard.ts:17:5` — Parameter 'next' is declared but never used. Unused parameters should start with a '_'.
  - `src\app\core\auth\auth-guard.ts:18:5` — Parameter 'state' is declared but never used. Unused parameters should start with a '_'.
  - `src\app\core\auth\direct-access-guard.ts:7:3` — Identifier 'PRIMARY_OUTLET' is imported but never used.
  - `src\app\core\auth\direct-access-guard.ts:8:3` — Identifier 'UrlTree' is imported but never used.
  - `src\app\core\auth\direct-access-guard.ts:18:5` — Parameter 'next' is declared but never used. Unused parameters should start with a '_'.
  - `src\app\core\auth\direct-access-guard.ts:19:5` — Parameter 'state' is declared but never used. Unused parameters should start with a '_'.
  - `src\app\core\auth\student-auth-guard.ts:17:5` — Parameter 'next' is declared but never used. Unused parameters should start with a '_'.
  - `src\app\core\auth\student-auth-guard.ts:18:5` — Parameter 'state' is declared but never used. Unused parameters should start with a '_'.
  - `src\app\core\services\api.service.ts:2:35` — Identifier 'HttpParams' is imported but never used.
  - `src\app\core\services\api.service.ts:3:22` — Identifier 'of' is imported but never used.
  - `src\app\core\services\api.service.ts:4:22` — Identifier 'map' is imported but never used.
  - `src\app\core\services\calendar.service.ts:5:27`
  - `src\app\core\services\classe-routines.service.ts:5:27`
  - `src\app\core\services\Employee.service.ts:5:27` — Identifier 'catchError' is imported but never used.
  - `src\app\core\services\Employee.service.ts:5:56` — Identifier 'throwError' is imported but never used.
  - `src\app\core\services\Inquiry.service.ts:57:11` — Variable 'headers' is declared but never used. Unused variables should start with a '_'.
  - `src\app\core\services\Inquiry.service.ts:127:11` — Variable 'headers' is declared but never used. Unused variables should start with a '_'.
  - `src\app\core\services\Inquiry.service.ts:131:11` — Variable 'headers' is declared but never used. Unused variables should start with a '_'.
  - `src\app\core\services\Inquiry.service.ts:160:11` — Variable 'headers' is declared but never used. Unused variables should start with a '_'.
  - `src\app\core\services\Inquiry.service.ts:167:11` — Variable 'headers' is declared but never used. Unused variables should start with a '_'.
  - `src\app\core\services\Inquiry.service.ts:213:11` — Variable 'headers' is declared but never used. Unused variables should start with a '_'.
  - `src\app\core\services\jwt.service.ts:3:10`
  - `src\app\core\services\notification.service.ts:1:22` — Identifier 'HttpHeaders' is imported but never used.
  - `src\app\core\services\notification.service.ts:5:10` — Identifier 'BehaviorSubject' is imported but never used.
  - `src\app\core\services\notification.service.ts:5:27`
  - `src\app\core\services\notificationnew.service.ts:4:3` — Identifier 'Injector' is imported but never used.
  - `src\app\core\services\notificationnew.service.ts:9:10` — Identifier 'BehaviorSubject' is imported but never used.
  - `src\app\website\home\home.component.ts:6:10` — Identifier 'RouterLink' is imported but never used.
  - `src\app\website\home\home.component.ts:8:10` — Identifier 'NgOptimizedImage' is imported but never used.

### oxlint/no-wrapper-object-types (warning) — 29 occurrences in 4 files

- **Message:** Do not use wrapper object types.
- **Locations:**
  - `src\app\core\model-class\fee-management.ts:57:12`
  - `src\app\core\model-class\login-signup.ts:43:22`
  - `src\app\core\model-class\login-signup.ts:56:12`
  - `src\app\core\services\Inquiry.service.ts:70:54`
  - `src\app\core\services\Inquiry.service.ts:135:64`
  - `src\app\core\services\jwt.service.ts:76:21`
  - `src\app\core\services\jwt.service.ts:80:27`
  - `src\app\core\services\jwt.service.ts:83:18`
  - `src\app\core\services\jwt.service.ts:91:25`
  - `src\app\core\services\jwt.service.ts:94:23`
  - `src\app\core\services\jwt.service.ts:97:18`
  - `src\app\core\services\jwt.service.ts:100:22`
  - `src\app\core\services\jwt.service.ts:104:25`
  - `src\app\core\services\jwt.service.ts:108:14`
  - `src\app\core\services\jwt.service.ts:112:18`
  - `src\app\core\services\jwt.service.ts:116:15`
  - `src\app\core\services\jwt.service.ts:120:20`
  - `src\app\core\services\jwt.service.ts:125:18`
  - `src\app\core\services\jwt.service.ts:129:26`
  - `src\app\core\services\jwt.service.ts:133:16`
  - `src\app\core\services\jwt.service.ts:137:23`
  - `src\app\core\services\jwt.service.ts:174:28`
  - `src\app\core\services\jwt.service.ts:178:34`
  - `src\app\core\services\jwt.service.ts:182:22`
  - `src\app\core\services\jwt.service.ts:186:27`
  - `src\app\core\services\jwt.service.ts:191:25`
  - `src\app\core\services\jwt.service.ts:195:33`
  - `src\app\core\services\jwt.service.ts:199:23`
  - `src\app\core\services\jwt.service.ts:203:30`

### angular-doctor/missing-spec-file (warning) — 20 occurrences in 20 files

- **Message:** Testable Angular declaration has no sibling .spec.ts file.
- **Reference:** https://angular.dev/style-guide#naming
- **Locations:**
  - `src\app\admin\masters\uom\uom.component.ts:1:1` (fix: Add uom.component.spec.ts next to this file.)
  - `src\app\admin\masters\warehouse\warehouse.component.ts:1:1` (fix: Add warehouse.component.spec.ts next to this file.)
  - `src\app\admin\party-ledger\party-ledger.component.ts:1:1` (fix: Add party-ledger.component.spec.ts next to this file.)
  - `src\app\admin\sauda-management\sauda-management.component.ts:1:1` (fix: Add sauda-management.component.spec.ts next to this file.)
  - `src\app\admin\truck-management\truck-management.component.ts:1:1` (fix: Add truck-management.component.spec.ts next to this file.)
  - `src\app\core\auth\auth-guard.ts:1:1` (fix: Add auth-guard.spec.ts next to this file.)
  - `src\app\core\auth\direct-access-guard.ts:1:1` (fix: Add direct-access-guard.spec.ts next to this file.)
  - `src\app\core\auth\student-auth-guard.ts:1:1` (fix: Add student-auth-guard.spec.ts next to this file.)
  - `src\app\core\pipe\reverse-list.pipe.ts:1:1` (fix: Add reverse-list.pipe.spec.ts next to this file.)
  - `src\app\core\pipe\safe-url.pipe.ts:1:1` (fix: Add safe-url.pipe.spec.ts next to this file.)
  - `src\app\core\services\auth.interceptor.ts:1:1` (fix: Add auth.interceptor.spec.ts next to this file.)
  - `src\app\core\services\calendar.service.ts:1:1` (fix: Add calendar.service.spec.ts next to this file.)
  - `src\app\core\services\classe-routines.service.ts:1:1` (fix: Add classe-routines.service.spec.ts next to this file.)
  - `src\app\core\services\Employee.service.ts:1:1` (fix: Add Employee.service.spec.ts next to this file.)
  - `src\app\core\services\Inquiry.service.ts:1:1` (fix: Add Inquiry.service.spec.ts next to this file.)
  - `src\app\core\services\internet-interceptor.ts:1:1` (fix: Add internet-interceptor.spec.ts next to this file.)
  - `src\app\core\services\jwt.service.ts:1:1` (fix: Add jwt.service.spec.ts next to this file.)
  - `src\app\core\services\notification.service.ts:1:1` (fix: Add notification.service.spec.ts next to this file.)
  - `src\app\core\services\notificationnew.service.ts:1:1` (fix: Add notificationnew.service.spec.ts next to this file.)
  - `src\app\core\services\sauda-erp-mock.service.ts:1:1` (fix: Add sauda-erp-mock.service.spec.ts next to this file.)

### angular-doctor/filename-class-mismatch (warning) — 16 occurrences in 16 files

- **Message:** File stem "calendar" does not match class "UpdateHoliday".
- **Reference:** https://angular.dev/style-guide#naming
- **Locations:**
  - `src\app\core\model-class\calendar.ts:1:1` (fix: Prefer a file name like update-holiday.ts for this class.)
  - `src\app\core\model-class\course-batch.ts:1:1` — File stem "course-batch" does not match class "courses". (fix: Prefer a file name like courses.ts for this class.)
  - `src\app\core\model-class\fee-management.ts:1:1` — File stem "fee-management" does not match class "CreateFee". (fix: Prefer a file name like create-fee.ts for this class.)
  - `src\app\core\model-class\login-signup.ts:1:1` — File stem "login-signup" does not match class "SignIn". (fix: Prefer a file name like sign-in.ts for this class.)
  - `src\app\core\model-class\onboard.ts:1:1` — File stem "onboard" does not match class "OnBoardStudent". (fix: Prefer a file name like on-board-student.ts for this class.)
  - `src\app\core\model-class\parties.ts:1:1` — File stem "parties" does not match class "Createparty". (fix: Prefer a file name like createparty.ts for this class.)
  - `src\app\core\pipe\number-format.pipe.ts:1:1` — File stem "number-format.pipe" does not match class "NumberFormatPipe". (fix: Prefer a file name like number-format.ts for this class.)
  - `src\app\core\pipe\reverse-list.pipe.ts:1:1` — File stem "reverse-list.pipe" does not match class "ReverseIterablePipe". (fix: Prefer a file name like reverse-iterable.ts for this class.)
  - `src\app\core\pipe\safe-url.pipe.ts:1:1` — File stem "safe-url.pipe" does not match class "SafeUrlPipe". (fix: Prefer a file name like safe-url.ts for this class.)
  - `src\app\core\services\auth.interceptor.ts:1:1` — File stem "auth.interceptor" does not match class "AuthInterceptor". (fix: Prefer a file name like auth-interceptor.ts for this class.)
  - `src\app\core\services\classe-routines.service.ts:1:1` — File stem "classe-routines" does not match class "CalssService". (fix: Prefer a file name like calss.ts for this class.)
  - `src\app\core\services\Employee.service.ts:1:1` — File stem "Employee" does not match class "EmployeeService". (fix: Prefer a file name like employee.ts for this class.)
  - `src\app\core\services\error.interceptor.ts:1:1` — File stem "error.interceptor" does not match class "ErrorIntercept". (fix: Prefer a file name like error-intercept.ts for this class.)
  - `src\app\core\services\Inquiry.service.ts:1:1` — File stem "Inquiry" does not match class "InquiryService". (fix: Prefer a file name like inquiry.ts for this class.)
  - `src\app\core\services\loading.interceptor.ts:1:1` — File stem "loading.interceptor" does not match class "LoadingInterceptor". (fix: Prefer a file name like loading-interceptor.ts for this class.)
  - `src\app\core\services\notificationnew.service.ts:1:1` — File stem "notificationnew" does not match class "NotificationService". (fix: Prefer a file name like notification.ts for this class.)

### oxlint/eqeqeq (warning) — 16 occurrences in 6 files

- **Message:** Expected !== and instead saw !=
- **Locations:**
  - `src\app\core\auth\direct-access-guard.ts:29:30` — Expected === and instead saw ==
  - `src\app\core\auth\direct-access-guard.ts:35:19`
  - `src\app\core\model-class\file-extension-validator.directive.ts:9:24` — Expected === and instead saw ==
  - `src\app\core\services\error.interceptor.ts:19:37` — Expected === and instead saw ==
  - `src\app\core\services\Inquiry.service.ts:261:18`
  - `src\app\core\services\Inquiry.service.ts:267:14`
  - `src\app\core\services\Inquiry.service.ts:271:14`
  - `src\app\core\services\Inquiry.service.ts:271:33` — Expected === and instead saw ==
  - `src\app\core\services\Inquiry.service.ts:274:19`
  - `src\app\core\services\Inquiry.service.ts:274:40` — Expected === and instead saw ==
  - `src\app\core\services\Inquiry.service.ts:277:19`
  - `src\app\core\services\Inquiry.service.ts:277:40`
  - `src\app\core\services\jwt.service.ts:18:18`
  - `src\app\core\services\jwt.service.ts:42:20`
  - `src\app\core\services\jwt.service.ts:147:23`
  - `src\app\core\services\loading.interceptor.ts:25:32` — Expected === and instead saw ==

### angular-doctor/file-hyphen-case (warning) — 2 occurrences in 2 files

- **Message:** File name should use hyphens between words.
- **Suggested fix:** Rename to kebab-case (for example user-profile.ts).
- **Reference:** https://angular.dev/style-guide#naming
- **Locations:**
  - `src\app\core\services\Employee.service.ts:1:1`
  - `src\app\core\services\Inquiry.service.ts:1:1`

### oxlint/no-unused-expressions (warning) — 1 occurrence

- **Message:** Expected expression to be used
- **Locations:**
  - `src\app\website\components\testimonials\testimonials.component.ts:143:5`

## accessibility

### template-eslint/label-has-associated-control (warning) — 161 occurrences in 14 files

- **Message:** A label component must be associated with a form element
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.html:5:7`
  - `src\app\admin\dashboard\dashboard.component.html:18:7`
  - `src\app\admin\firm-management\firm-management.component.html:187:9`
  - `src\app\admin\firm-management\firm-management.component.html:198:9`
  - `src\app\admin\firm-management\firm-management.component.html:208:9`
  - `src\app\admin\inventory-management\categories\categories.component.html:232:9`
  - `src\app\admin\inventory-management\categories\categories.component.html:273:9`
  - `src\app\admin\inventory-management\categories\categories.component.html:283:9`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:123:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:129:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:142:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:156:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:338:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:344:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:356:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:558:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:564:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:575:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:586:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:596:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:607:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:618:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:624:11`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:783:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:797:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:809:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:819:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:844:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:868:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:878:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:884:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:891:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:900:13`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:1067:11`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:157:9`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:163:9`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:176:11`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:185:11`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:194:11`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:15:9`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:57:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:70:13`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:108:17`
  - `src\app\admin\loginpages\forgot-password\forgot-password.component.html:156:21`
  - `src\app\admin\loginpages\otp\otp.component.html:11:7`
  - `src\app\admin\loginpages\otp\otp.component.html:39:7`
  - `src\app\admin\loginpages\signin\signin.component.html:17:7`
  - `src\app\admin\loginpages\signin\signin.component.html:38:9`
  - `src\app\admin\masters\uom\uom.component.html:246:11`
  - `src\app\admin\masters\uom\uom.component.html:288:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:279:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:293:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:303:11`
  - `src\app\admin\masters\warehouse\warehouse.component.html:314:13`
  - `src\app\admin\masters\warehouse\warehouse.component.html:323:13`
  - `src\app\admin\masters\warehouse\warehouse.component.html:331:13`
  - `src\app\admin\masters\warehouse\warehouse.component.html:340:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:136:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:142:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:152:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:177:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:183:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:192:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:202:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:760:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:770:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:775:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:786:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:796:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:805:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:811:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:820:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:832:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:838:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:881:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:889:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:895:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:901:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:907:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:950:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:955:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:961:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:967:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:973:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1016:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1026:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1036:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1047:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1115:15`
  - `src\app\admin\party-ledger\party-ledger.component.html:1130:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1193:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1200:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1205:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1214:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1220:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1226:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1232:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1433:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1447:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1488:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1502:13`
  - `src\app\admin\party-ledger\party-ledger.component.html:1518:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:76:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:82:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:92:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:102:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:256:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:265:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:272:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:286:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:301:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:316:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:336:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:351:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:360:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:365:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:374:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:380:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:386:13`
  - `src\app\admin\sauda-management\sauda-management.component.html:414:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:419:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:424:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:433:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:450:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:456:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:461:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:471:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:477:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:482:11`
  - `src\app\admin\sauda-management\sauda-management.component.html:498:9`
  - `src\app\admin\sauda-management\sauda-management.component.html:504:9`
  - `src\app\admin\sauda-management\sauda-management.component.html:885:9`
  - `src\app\admin\sauda-management\sauda-management.component.html:977:9`
  - `src\app\admin\truck-management\truck-management.component.html:65:11`
  - `src\app\admin\truck-management\truck-management.component.html:70:11`
  - `src\app\admin\truck-management\truck-management.component.html:80:11`
  - `src\app\admin\truck-management\truck-management.component.html:89:11`
  - `src\app\admin\truck-management\truck-management.component.html:99:11`
  - `src\app\admin\truck-management\truck-management.component.html:509:11`
  - `src\app\admin\truck-management\truck-management.component.html:527:11`
  - `src\app\admin\truck-management\truck-management.component.html:549:11`
  - `src\app\admin\truck-management\truck-management.component.html:559:11`
  - `src\app\admin\truck-management\truck-management.component.html:568:11`
  - `src\app\admin\truck-management\truck-management.component.html:577:11`
  - `src\app\admin\truck-management\truck-management.component.html:585:11`
  - `src\app\admin\truck-management\truck-management.component.html:590:11`
  - `src\app\admin\truck-management\truck-management.component.html:595:11`
  - `src\app\admin\truck-management\truck-management.component.html:606:11`
  - `src\app\admin\truck-management\truck-management.component.html:625:13`
  - `src\app\admin\truck-management\truck-management.component.html:640:13`
  - `src\app\admin\truck-management\truck-management.component.html:649:13`
  - `src\app\admin\truck-management\truck-management.component.html:654:13`
  - `src\app\admin\truck-management\truck-management.component.html:663:13`
  - `src\app\admin\truck-management\truck-management.component.html:710:9`
  - `src\app\admin\truck-management\truck-management.component.html:716:9`
  - `src\app\admin\truck-management\truck-management.component.html:787:9`
  - `src\app\admin\user-management\user-management.component.html:291:11`
  - `src\app\admin\user-management\user-management.component.html:301:13`
  - `src\app\admin\user-management\user-management.component.html:309:13`
  - `src\app\admin\user-management\user-management.component.html:323:11`
  - `src\app\admin\user-management\user-management.component.html:341:11`

### template-eslint/click-events-have-key-events (warning) — 63 occurrences in 12 files

- **Message:** click must be accompanied by either keyup, keydown or keypress event for accessibility.
- **Locations:**
  - `src\app\admin\dashboard\dashboard.component.html:32:9`
  - `src\app\admin\dashboard\dashboard.component.html:590:15`
  - `src\app\admin\firm-management\firm-management.component.html:159:1`
  - `src\app\admin\firm-management\firm-management.component.html:160:3`
  - `src\app\admin\firm-management\firm-management.component.html:237:1`
  - `src\app\admin\firm-management\firm-management.component.html:238:3`
  - `src\app\admin\inventory-management\categories\categories.component.html:212:1`
  - `src\app\admin\inventory-management\categories\categories.component.html:213:3`
  - `src\app\admin\inventory-management\categories\categories.component.html:253:1`
  - `src\app\admin\inventory-management\categories\categories.component.html:254:3`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:759:3`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:760:5`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:926:3`
  - `src\app\admin\inventory-management\inventory\inventory.component.html:927:5`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:137:1`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:138:3`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:215:1`
  - `src\app\admin\inventory-management\product-master\product-master.component.html:216:3`
  - `src\app\admin\masters\uom\uom.component.html:225:1`
  - `src\app\admin\masters\uom\uom.component.html:226:3`
  - `src\app\admin\masters\uom\uom.component.html:267:1`
  - `src\app\admin\masters\uom\uom.component.html:268:3`
  - `src\app\admin\masters\warehouse\warehouse.component.html:251:1`
  - `src\app\admin\masters\warehouse\warehouse.component.html:252:3`
  - `src\app\admin\masters\warehouse\warehouse.component.html:372:1`
  - `src\app\admin\masters\warehouse\warehouse.component.html:373:3`
  - `src\app\admin\masters\warehouse\warehouse.component.html:483:1`
  - `src\app\admin\masters\warehouse\warehouse.component.html:484:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:739:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:740:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:860:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:861:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:929:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:930:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:995:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:996:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:1154:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:1155:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:1254:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:1255:5`
  - `src\app\admin\party-ledger\party-ledger.component.html:1392:3`
  - `src\app\admin\party-ledger\party-ledger.component.html:1393:5`
  - `src\app\admin\sauda-management\sauda-management.component.html:539:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:540:3`
  - `src\app\admin\sauda-management\sauda-management.component.html:779:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:780:3`
  - `src\app\admin\sauda-management\sauda-management.component.html:849:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:850:3`
  - `src\app\admin\sauda-management\sauda-management.component.html:915:1`
  - `src\app\admin\sauda-management\sauda-management.component.html:916:3`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:19:5`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:28:7`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:43:11`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:81:7`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:101:11`
  - `src\app\admin\truck-management\truck-management.component.html:750:1`
  - `src\app\admin\truck-management\truck-management.component.html:751:3`
  - `src\app\admin\user-management\user-management.component.html:263:1`
  - `src\app\admin\user-management\user-management.component.html:264:3`
  - `src\app\admin\user-management\user-management.component.html:384:1`
  - `src\app\admin\user-management\user-management.component.html:385:3`
  - `src\app\admin\user-management\user-management.component.html:499:1`
  - `src\app\admin\user-management\user-management.component.html:500:3`

### template-eslint/button-has-type (warning) — 13 occurrences in 4 files

- **Message:** Type for <button> is missing
- **Locations:**
  - `src\app\admin\sidenav-header\sidenav-header.component.html:4:5`
  - `src\app\admin\sidenav-header\sidenav-header.component.html:35:11`
  - `src\app\admin\sidenav\sidenav.component.html:52:5`
  - `src\app\website\components\navbar\navbar.component.html:17:9`
  - `src\app\website\components\navbar\navbar.component.html:43:9`
  - `src\app\website\components\navbar\navbar.component.html:61:9`
  - `src\app\website\components\navbar\navbar.component.html:92:7`
  - `src\app\website\components\navbar\navbar.component.html:109:9`
  - `src\app\website\components\navbar\navbar.component.html:130:9`
  - `src\app\website\components\navbar\navbar.component.html:144:9`
  - `src\app\website\components\testimonials\testimonials.component.html:45:5`
  - `src\app\website\components\testimonials\testimonials.component.html:52:9`
  - `src\app\website\components\testimonials\testimonials.component.html:56:5`

### template-eslint/no-autofocus (warning) — 1 occurrence

- **Message:** The `autofocus` attribute should not be used, as it reduces usability and accessibility for users
- **Locations:**
  - `src\app\admin\firm-management\firm-management.component.html:189:11`

---

```json
{
  "score": 24.25,
  "totals": {
    "error": 327,
    "warning": 652,
    "info": 116,
    "byCategory": {
      "correctness": 10,
      "performance": 322,
      "maintainability": 154,
      "security": 4,
      "accessibility": 238,
      "hygiene": 367
    }
  },
  "migrationsHub": "https://angular.dev/reference/migrations",
  "styleGuideUrl": "https://angular.dev/style-guide",
  "ruleCatalogVersion": "1",
  "recommendedCommands": [
    "ng generate @angular/core:common-to-standalone",
    "ng generate @angular/core:control-flow",
    "ng generate @angular/core:inject",
    "ng generate @angular/core:signal-input-migration",
    "ng generate @angular/core:signal-queries-migration",
    "ng generate @angular/core:ngclass-to-class",
    "ng generate @angular/core:service"
  ]
}
```
