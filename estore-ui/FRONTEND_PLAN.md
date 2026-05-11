# 🎨 E-Store Frontend Plan (React)

**Repository Name:** `estore-ui`  
**Owner:** Student B

## 🛠️ Tech Stack & Requirements

- **Framework:** React 18+ (Vite)
- **Language:** JavaScript
- **Styling:** Tailwind CSS + shadcn/ui (Required)
- **State Management:** Context API (Auth/Cart) or TanStack Query (Server State)
- **Routing:** React Router v6
- **Architecture:** Feature-based structure matching the Backend Domains.

## 🚀 Implementation Roadmap

### Phase 1: Setup & Design (Day 1)

- [ ] Initialize Vite project with JavaScript and Tailwind.
- [ ] Setup folder structure: `src/[core, shared, features, hooks, assets]`.
- [ ] Implement Base Layout: Navbar, Footer, and responsive Sidebar using shadcn/ui.
- [ ] Axios Config: Setup interceptors for JWT token attachment and 401/403 handling.

### Phase 2: User Experience (Day 2)

- [ ] **Auth Feature:** Login and Registration pages with **React Hook Form** validation.
- [ ] **Catalog Feature:** Product Grid with Category Filtering and Search Bar.
- [ ] **Details View:** Product page showing info, Stock status, and **MongoDB Reviews**.

### Phase 3: Transaction Flow (Day 3)

- [ ] **Cart Feature:** Persistent Cart (LocalStorage) with slide-over or dedicated page.
- [ ] **Checkout Flow:** Shipping info form -> Order summary -> Validation.
- [ ] **Profile Feature:** User profile view and update. **Order History** list.

### Phase 4: Bonuses & Polish (Day 4)

- [ ] **Admin Dashboard:** Simple views to manage products and view inventory levels (Bonus).
- [ ] **Pagination:** Implement client-side or server-side pagination for the catalog.
- [ ] **Error Handling:** Professional Toast notifications for success/error messages.
- [ ] **Responsive Polish:** Ensure perfect mobile-first experience.

## 📂 Project Structure (Annexe B Compliance)

```text
src/
├── core/           # Interceptors, Auth Guards, API Client
├── shared/         # Common UI Components (Button, Input, Navbar)
├── layouts/        # MainLayout, AdminLayout
├── features/       # Domain-specific logic
│   ├── auth/       # Login, Register
│   ├── catalog/    # ProductList, ProductCard, CategoryFilter
│   ├── cart/       # CartItem, CartSummary
│   ├── orders/     # OrderHistory, CheckoutForm
│   ├── profile/    # ProfileDetail
│   └── reviews/    # MongoDB Review List & Form
├── hooks/          # Custom hooks (useCart, useAuth)
└── utils/          # Formatters, Validations
```
