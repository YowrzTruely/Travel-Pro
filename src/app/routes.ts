import { createBrowserRouter } from "react-router";
import { ActivityLog } from "./components/admin/ActivityLog";
import { ApproveSuppliers } from "./components/admin/ApproveSuppliers";
import { UserManagement } from "./components/admin/UserManagement";
import { CalendarPage } from "./components/CalendarPage";
import { ClassificationWizard } from "./components/ClassificationWizard";
import { ClientQuote } from "./components/ClientQuote";
import { ClientsPage } from "./components/ClientsPage";
import { LeadDetail } from "./components/crm/LeadDetail";
import { LeadsPage } from "./components/crm/LeadsPage";
import { DocumentsPage } from "./components/DocumentsPage";
import { AdminDashboard } from "./components/dashboards/AdminDashboard";
import { ProducerDashboard } from "./components/dashboards/ProducerDashboard";
import { SupplierDashboard } from "./components/dashboards/SupplierDashboard";
import { RootErrorBoundary } from "./components/ErrorBoundary";
import { FieldOperationsHQ } from "./components/field/FieldOperationsHQ";
import { ImportWizard } from "./components/ImportWizard";
import { Layout } from "./components/Layout";
import { NotFoundPage } from "./components/PlaceholderPage";
import { ProjectsList } from "./components/ProjectsList";
import { QuoteEditor } from "./components/QuoteEditor";
import { ScannedProducts } from "./components/ScannedProducts";
import { SupplierArchive } from "./components/SupplierArchive";
import { SupplierBank } from "./components/SupplierBank";
import { SupplierDetail } from "./components/SupplierDetail";
import { SettingsPage } from "./components/settings/SettingsPage";
import { AvailabilityCalendar } from "./components/supplier/AvailabilityCalendar";
import { MyDocuments } from "./components/supplier/MyDocuments";
import { MyProducts } from "./components/supplier/MyProducts";
import { ProductEditPage } from "./components/supplier/ProductEditPage";
import { RequestsPage } from "./components/supplier/RequestsPage";
import { SupplierPreview } from "./components/supplier/SupplierPreview";
import { SupplierProfile } from "./components/supplier/SupplierProfile";
import { SupplierPromotions } from "./components/supplier/SupplierPromotions";
import { SupplierRatings } from "./components/supplier/SupplierRatings";

/** Producer router — current main app routes */
export function createProducerRouter() {
  return createBrowserRouter([
    {
      path: "/",
      Component: Layout,
      ErrorBoundary: RootErrorBoundary,
      children: [
        { index: true, Component: ProducerDashboard },
        { path: "projects", Component: ProjectsList },
        { path: "projects/:id", Component: QuoteEditor },
        { path: "suppliers", Component: SupplierBank },
        { path: "suppliers/archive", Component: SupplierArchive },
        { path: "suppliers/import", Component: ImportWizard },
        { path: "suppliers/classify", Component: ClassificationWizard },
        { path: "suppliers/scan", Component: ScannedProducts },
        { path: "suppliers/:id", Component: SupplierDetail },
        { path: "clients", Component: ClientsPage },
        { path: "crm", Component: LeadsPage },
        { path: "crm/:id", Component: LeadDetail },
        { path: "documents", Component: DocumentsPage },
        { path: "settings", Component: SettingsPage },
        { path: "calendar", Component: CalendarPage },
        { path: "quote/:id", Component: ClientQuote },
        { path: "field/:projectId", Component: FieldOperationsHQ },
        { path: "*", Component: NotFoundPage },
      ],
    },
  ]);
}

/** Supplier portal router */
export function createSupplierRouter() {
  return createBrowserRouter([
    {
      path: "/",
      Component: Layout,
      ErrorBoundary: RootErrorBoundary,
      children: [
        { index: true, Component: SupplierDashboard },
        { path: "products", Component: MyProducts },
        { path: "products/:id", Component: ProductEditPage },
        { path: "documents", Component: MyDocuments },
        { path: "availability", Component: AvailabilityCalendar },
        { path: "requests", Component: RequestsPage },
        { path: "profile", Component: SupplierProfile },
        { path: "preview", Component: SupplierPreview },
        { path: "promotions", Component: SupplierPromotions },
        { path: "ratings", Component: SupplierRatings },
        { path: "settings", Component: SettingsPage },
        { path: "*", Component: NotFoundPage },
      ],
    },
  ]);
}

/** Admin portal router */
export function createAdminRouter() {
  return createBrowserRouter([
    {
      path: "/",
      Component: Layout,
      ErrorBoundary: RootErrorBoundary,
      children: [
        { index: true, Component: AdminDashboard },
        { path: "approve-suppliers", Component: ApproveSuppliers },
        { path: "users", Component: UserManagement },
        { path: "activity", Component: ActivityLog },
        { path: "settings", Component: SettingsPage },
        { path: "*", Component: NotFoundPage },
      ],
    },
  ]);
}

/** @deprecated Use createProducerRouter() instead. Kept for backward compatibility. */
export const router = createProducerRouter();
