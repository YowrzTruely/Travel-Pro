import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProjectsList } from './components/ProjectsList';
import { QuoteEditor } from './components/QuoteEditor';
import { SupplierBank } from './components/SupplierBank';
import { SupplierDetail } from './components/SupplierDetail';
import { SupplierArchive } from './components/SupplierArchive';
import { ImportWizard } from './components/ImportWizard';
import { ClassificationWizard } from './components/ClassificationWizard';
import { ScannedProducts } from './components/ScannedProducts';
import { ClientQuote } from './components/ClientQuote';
import { PRDDocument } from './components/PRDDocument';
import { RootErrorBoundary } from './components/ErrorBoundary';
import { ClientsPage } from './components/ClientsPage';
import {
  SettingsPage,
  NotFoundPage,
} from './components/PlaceholderPage';
import { CalendarPage } from './components/CalendarPage';
import { DocumentsPage } from './components/DocumentsPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Layout,
      ErrorBoundary: RootErrorBoundary,
      children: [
        { index: true, Component: Dashboard },
        { path: 'projects', Component: ProjectsList },
        { path: 'projects/:id', Component: QuoteEditor },
        { path: 'suppliers', Component: SupplierBank },
        { path: 'suppliers/archive', Component: SupplierArchive },
        { path: 'suppliers/import', Component: ImportWizard },
        { path: 'suppliers/classify', Component: ClassificationWizard },
        { path: 'suppliers/scan', Component: ScannedProducts },
        { path: 'suppliers/:id', Component: SupplierDetail },
        { path: 'clients', Component: ClientsPage },
        { path: 'documents', Component: DocumentsPage },
        { path: 'settings', Component: SettingsPage },
        { path: 'calendar', Component: CalendarPage },
        { path: 'quote/:id', Component: ClientQuote },
        { path: 'prd', Component: PRDDocument },
        { path: '*', Component: NotFoundPage },
      ],
    },
  ]
);