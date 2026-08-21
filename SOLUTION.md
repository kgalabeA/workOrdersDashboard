# Technical Solution & Architecture Document

**Project**: Angular Mini Dashboard & Single-Step Status Update  
**Target Domain**: Telecommunications Infrastructure Delivery and SLA Governance  
**Author**: Albert Kgalabe Mogodi

---

## 1. Executive Summary & Core Decisions

This solution fulfills all technical requirements for the Angular Frontend with pagination and filters

### Key Architectural Decisions

| Decision Area | Selected Strategy | Rationale & Justification |
| :--- | :--- | :--- |
| **Component Architecture** | Angular 20+ Standalone Components | Simplifies module configuration, reduces bundle size, and aligns with modern Angular standards. |
| **State Management** | Native Angular Signals (`signal`, `computed`) | Lightweight, fine-grained reactivity. Avoids heavy boilerplates like NgRx or Akita for a simple tabular workflow while delivering instantaneous template updates. |
| **Table Component** | Angular Material `MatTable` | Zero external licensing dependencies, built-in accessibility (a11y), excellent performance at 500 rows, and high ecosystem familiarity. |
| **REST Mocking** | `json-server` (Port 3000) | Provides real HTTP REST requests (`GET`, `PATCH`) over network sockets rather than mock in-memory stubs, demonstrating realistic asynchronous handling. |
| **Update Strategy** | In-Place Signal Array Patching | On successful `PATCH`, the local signal array is updated in-place via `workOrders.update(...)` rather than triggering a 500-row refetch. This nudges efficiency and reduces server load. |

---

## 2. Technical Implementation Details

### Task 1: Data Heavy Dashboard & SLA Governance
- **Dataset**: 500 programmatically generated work orders with a deterministic random seed (`scripts/generate-data.ts`), ensuring reproducible test environments.
- **Computed Derived Metrics**: `summaryMetrics` signal computes `totalCount`, `overdueCount`, `withinSlaCount`, `blockedCount`, and `slaCompliancePct` in real-time off the raw dataset.
- **Instant Filtering**: `filteredWorkOrders` computed signal performs multi-column matching (Site, Owner, ID, Region, Status) with instantaneous DOM response.

### Task 2: Single-Step Status Update & Graceful Failure Path
- **Interface**: Compact standalone Reactive Form modal with Material selects and inputs.
- **Latency & Failure Simulation**:
  - A mandatory `timer(600)` delay via RxJS simulates realistic network latency.
  - Failure path triggered conditionally (via header toggle or note containing keyword `'fail'`) returning an `HttpErrorResponse` with HTTP 500 status.
- **Error Resilience**: Errors are caught in the component subscription, surfacing a styled error notification. The application state remains consistent without page reload or table degradation.

### Task 3: Unit Testing Suite
- Executed via Angular CLI unit test runner (`ng test`).
- **`work-order.service.spec.ts`**: Verifies REST `GET` array deserialization and `PATCH` HTTP 500 failure handling using `HttpTestingController`.
- **`dashboard.component.spec.ts`**: Verifies reactive signal filtering set sizes and computed SLA metric calculations using Angular `TestBed`.

---

## 3. Trade-Offs & Future Enhancements

### Design Trade-Offs Made
1. **Virtual Scrolling (`cdk-virtual-scroll`) vs Plain `MatTable`**:
   - *Choice*: Rendered 500 rows directly inside a scrollable `MatTable` container.
   
2. **In-Place Signal Patch vs Full Refetch**:
   - *Choice*: Updated local signal state directly upon PATCH success.
   - *Trade-off*: Saves bandwidth and eliminates table flash, though multi-user concurrent edits would eventually benefit from WebSockets or periodic background polling.
