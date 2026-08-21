# Telecom Infrastructure Work Orders Dashboard

A lightweight, modern Angular 20+ standalone application for managing 500+ telecommunications infrastructure work orders with single-step REST updates, SLA metrics, reactive signals, and simulated latency/failure handling.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on Node v24.18.0)
- **npm**: `v9.0.0` or higher

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 3. Generate Seed Data (Optional)
The project comes pre-seeded with `db.json` containing 500 reproducible work orders. To re-generate fresh reproducible seed data at any time:
```bash
npm run generate-data
```

### 4. Run Locally (Single Command)
Run both the REST API server (`json-server` on `http://localhost:3000`) and the Angular app (`http://localhost:4200`) concurrently with a single command:
```bash
npm start
```

Open your browser to [http://localhost:4200](http://localhost:4200).

---

## 🧪 Running Unit Tests

Run the Angular CLI test suite (runs in headless Chrome):
```bash
npm test
```

### Test Coverage Highlights
- **Service Unit Tests** (`src/app/services/work-order.service.spec.ts`):
  - `GET /workOrders` happy path returning 500 items.
  - `PATCH /workOrders/:id` failure path verifying HTTP 500 error propagation.
- **Component Unit Tests** (`src/app/components/dashboard/dashboard.component.spec.ts`):
  - Reactive signal filter set size calculation.
  - Computed SLA overdue and compliance summary metrics.

---

## ⚡ Testing Error & Latency Handling (Task 2)

The application simulates network latency (600ms) and provides two convenient ways to test simulated REST API failure:
1. **Header Toggle**: Flip the **"Simulate API Failure (500)"** toggle switch in the top header. Any subsequent status update will fail with an HTTP 500 error.
2. **Keyword Trigger**: In the status update modal note textarea, type `"fail"` (e.g. *"Hardware defect fail"*).

### Expected Behavior on Failure:
- An inline error banner is rendered inside the modal without a full page reload.
- The original work order status in the table remains unchanged.
- The user can edit their input and retry submitting directly.


### AI tools
- Antigravity was used throughout the project to assist with development, UI design, styling, testing, and improving the overall code quality.

- AI assistance was also used to help configure a fake/mock backend, allowing the application to be developed and tested without relying on a live production backend.

- The following tasks were completed with AI assistance:
    * Mock/Fake Backend
       - Assisted with setting up the fake backend and mock data structure.
    * Data Generation
      - Stabilized the generate-data file to ensure it consistently generates 500 records.
    * UI/UX Design
     - Assisted with designing a clean, modern interface appropriate for a telecommunications company.
    * Code Quality
      - Reviewed existing code and suggested improvements to make it cleaner and easier to maintain.
    * Documentation & Development Support
      - AI was used as a development assistant for understanding errors, reviewing implementation approaches, and suggesting improvements.
      - It was also used to help explain unfamiliar code and provide alternative implementation approaches where appropriate.
