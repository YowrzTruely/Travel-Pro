import { createBrowserRouter } from "react-router";
import { CalendarPage } from "./components/CalendarPage";
import { ClassificationWizard } from "./components/ClassificationWizard";
import { ClientQuote } from "./components/ClientQuote";
import { ClientsPage } from "./components/ClientsPage";
import { Dashboard } from "./components/Dashboard";
import { DocumentsPage } from "./components/DocumentsPage";
import { RootErrorBoundary } from "./components/ErrorBoundary";
import { ImportWizard } from "./components/ImportWizard";
import { Layout } from "./components/Layout";
import { NotFoundPage, SettingsPage } from "./components/PlaceholderPage";
import { PRDDocument } from "./components/PRDDocument";
import { ProjectsList } from "./components/ProjectsList";
import { QuoteEditor } from "./components/QuoteEditor";
import { ScannedProducts } from "./components/ScannedProducts";
import { SupplierArchive } from "./components/SupplierArchive";
import { SupplierBank } from "./components/SupplierBank";
import { SupplierDetail } from "./components/SupplierDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: RootErrorBoundary,
    children: [
      { index: true, Component: Dashboard },
      { path: "projects", Component: ProjectsList },
      { path: "projects/:id", Component: QuoteEditor },
      { path: "suppliers", Component: SupplierBank },
      { path: "suppliers/archive", Component: SupplierArchive },
      { path: "suppliers/import", Component: ImportWizard },
      { path: "suppliers/classify", Component: ClassificationWizard },
      { path: "suppliers/scan", Component: ScannedProducts },
      { path: "suppliers/:id", Component: SupplierDetail },
      { path: "clients", Component: ClientsPage },
      { path: "documents", Component: DocumentsPage },
      { path: "settings", Component: SettingsPage },
      { path: "calendar", Component: CalendarPage },
      { path: "quote/:id", Component: ClientQuote },
      { path: "prd", Component: PRDDocument },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
