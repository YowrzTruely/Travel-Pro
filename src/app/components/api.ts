// ═══════════════════════════════════════════════════
// TravelPro — API Client
// Communicates with the Supabase Edge Function server
// ═══════════════════════════════════════════════════

import { projectId, publicAnonKey } from '/utils/supabase/info';
import type { Supplier, Project, Client, CalendarEvent } from './data';

const BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0045c7fc`;

// ─── Generic fetch wrapper ───────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${BASE}${path}`;
  const method = options?.method || 'GET';

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      console.error(`API error [${method} ${path}]:`, errorBody);
      throw new Error(errorBody.error || `HTTP ${res.status}`);
    }

    const json = await res.json();
    return json.data as T;
  } catch (err) {
    console.error(`API request failed [${method} ${path}]:`, err);
    throw err;
  }
}

// ─── Suppliers ───────────────────────────────────

export const suppliersApi = {
  list: (): Promise<Supplier[]> => request<Supplier[]>('/suppliers'),

  get: (id: string): Promise<Supplier> => request<Supplier>(`/suppliers/${encodeURIComponent(id)}`),

  summaries: (): Promise<Record<string, any>> => request<Record<string, any>>('/suppliers/summaries'),

  create: (data: Partial<Supplier>): Promise<Supplier> =>
    request<Supplier>('/suppliers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Supplier>): Promise<Supplier> =>
    request<Supplier>(`/suppliers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  bulkImport: (suppliers: Record<string, any>[]): Promise<{ imported: number; skipped: number; suppliers: Supplier[] }> =>
    request<{ imported: number; skipped: number; suppliers: Supplier[] }>('/suppliers/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ suppliers }),
    }),

  bulkRollback: (supplierIds: string[]): Promise<{ deleted: number; notFound: number }> =>
    request<{ deleted: number; notFound: number }>('/suppliers/bulk-rollback', {
      method: 'POST',
      body: JSON.stringify({ supplierIds }),
    }),

  archive: (id: string): Promise<Supplier> =>
    request<Supplier>(`/suppliers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify({ category: 'ארכיון', categoryColor: '#94a3b8' }),
    }),
};

// ─── Supplier Sub-resources ──────────────────────

export interface SupplierContact {
  id: string;
  supplierId: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  primary: boolean;
}

export interface SupplierProduct {
  id: string;
  supplierId: string;
  name: string;
  price: number;
  description: string;
  unit: string;
  images?: { id: string; url: string; name: string; path?: string }[];
  notes?: string;
}

export interface SupplierDocument {
  id: string;
  supplierId: string;
  name: string;
  expiry: string;
  status: 'valid' | 'warning' | 'expired';
  fileName?: string;
}

export const supplierContactsApi = {
  list: (supplierId: string): Promise<SupplierContact[]> =>
    request<SupplierContact[]>(`/suppliers/${encodeURIComponent(supplierId)}/contacts`),
  create: (supplierId: string, data: Partial<SupplierContact>): Promise<SupplierContact> =>
    request<SupplierContact>(`/suppliers/${encodeURIComponent(supplierId)}/contacts`, { method: 'POST', body: JSON.stringify(data) }),
  delete: (supplierId: string, contactId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(supplierId)}/contacts/${encodeURIComponent(contactId)}`, { method: 'DELETE' }),
};

export const supplierProductsApi = {
  list: (supplierId: string): Promise<SupplierProduct[]> =>
    request<SupplierProduct[]>(`/suppliers/${encodeURIComponent(supplierId)}/products`),
  create: (supplierId: string, data: Partial<SupplierProduct>): Promise<SupplierProduct> =>
    request<SupplierProduct>(`/suppliers/${encodeURIComponent(supplierId)}/products`, { method: 'POST', body: JSON.stringify(data) }),
  update: (supplierId: string, productId: string, data: Partial<SupplierProduct>): Promise<SupplierProduct> =>
    request<SupplierProduct>(`/suppliers/${encodeURIComponent(supplierId)}/products/${encodeURIComponent(productId)}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (supplierId: string, productId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(supplierId)}/products/${encodeURIComponent(productId)}`, { method: 'DELETE' }),
  uploadImage: (supplierId: string, productId: string, file: File): Promise<SupplierProduct> => {
    return new Promise(async (resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const result = await request<SupplierProduct>(
              `/suppliers/${encodeURIComponent(supplierId)}/products/${encodeURIComponent(productId)}/images`,
              { method: 'POST', body: JSON.stringify({ base64, fileName: file.name, contentType: file.type }) }
            );
            resolve(result);
          } catch (err) { reject(err); }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      } catch (err) { reject(err); }
    });
  },
  deleteImage: (supplierId: string, productId: string, imageId: string): Promise<SupplierProduct> =>
    request<SupplierProduct>(
      `/suppliers/${encodeURIComponent(supplierId)}/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
      { method: 'DELETE' }
    ),
};

export const supplierDocumentsApi = {
  list: (supplierId: string): Promise<SupplierDocument[]> =>
    request<SupplierDocument[]>(`/suppliers/${encodeURIComponent(supplierId)}/documents`),
  create: (supplierId: string, data: Partial<SupplierDocument>): Promise<SupplierDocument> =>
    request<SupplierDocument>(`/suppliers/${encodeURIComponent(supplierId)}/documents`, { method: 'POST', body: JSON.stringify(data) }),
  update: (supplierId: string, docId: string, data: Partial<SupplierDocument>): Promise<SupplierDocument> =>
    request<SupplierDocument>(`/suppliers/${encodeURIComponent(supplierId)}/documents/${encodeURIComponent(docId)}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (supplierId: string, docId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/suppliers/${encodeURIComponent(supplierId)}/documents/${encodeURIComponent(docId)}`, { method: 'DELETE' }),
};

// ─── Projects ────────────────────────────────────

export const projectsApi = {
  list: (): Promise<Project[]> => request<Project[]>('/projects'),

  get: (id: string): Promise<Project> => request<Project>(`/projects/${encodeURIComponent(id)}`),

  create: (data: Partial<Project>): Promise<Project> =>
    request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Project>): Promise<Project> =>
    request<Project>(`/projects/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// ─── Clients ────────────────────────────────────

export const clientsApi = {
  list: (): Promise<Client[]> => request<Client[]>('/clients'),

  get: (id: string): Promise<Client> => request<Client>(`/clients/${encodeURIComponent(id)}`),

  create: (data: Partial<Client>): Promise<Client> =>
    request<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Client>): Promise<Client> =>
    request<Client>(`/clients/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/clients/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// ─── Dashboard ───────────────────────────────────

export interface DashboardStats {
  suppliers: { total: number; verified: number; pending: number; unverified: number };
  projects: { total: number; leads: number; building: number; quotesSent: number; approved: number; pricing: number; inProgress: number };
  revenue: { total: number; avgMargin: number };
}

export const dashboardApi = {
  stats: (): Promise<DashboardStats> => request<DashboardStats>('/dashboard/stats'),
};

// ─── Quote Items ─────────────────────────────────

export interface QuoteItem {
  id: string;
  projectId: string;
  type: string;
  icon: string;
  name: string;
  supplier: string;
  description: string;
  cost: number;
  directPrice: number;
  sellingPrice: number;
  profitWeight: number;
  status: string; // 'approved' | 'modified' | 'pending'
  alternatives?: { id: string; name: string; description: string; costPerPerson: number; selected: boolean }[];
  images?: { id: string; url: string; name: string }[];
  notes?: string;
}

export interface TimelineEvent {
  id: string;
  projectId: string;
  time: string;
  title: string;
  description: string;
  icon: string;
}

export const quoteItemsApi = {
  list: (projectId: string): Promise<QuoteItem[]> =>
    request<QuoteItem[]>(`/projects/${encodeURIComponent(projectId)}/items`),

  create: (projectId: string, data: Partial<QuoteItem>): Promise<QuoteItem> =>
    request<QuoteItem>(`/projects/${encodeURIComponent(projectId)}/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (projectId: string, itemId: string, data: Partial<QuoteItem>): Promise<QuoteItem> =>
    request<QuoteItem>(`/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (projectId: string, itemId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}`, {
      method: 'DELETE',
    }),

  uploadImage: (projectId: string, itemId: string, file: File): Promise<QuoteItem> => {
    return new Promise(async (resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const result = await request<QuoteItem>(
              `/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}/images`,
              {
                method: 'POST',
                body: JSON.stringify({ base64, fileName: file.name, contentType: file.type }),
              }
            );
            resolve(result);
          } catch (err) { reject(err); }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      } catch (err) { reject(err); }
    });
  },

  deleteImage: (projectId: string, itemId: string, imageId: string): Promise<QuoteItem> =>
    request<QuoteItem>(
      `/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}/images/${encodeURIComponent(imageId)}`,
      { method: 'DELETE' }
    ),
};

export const timelineApi = {
  list: (projectId: string): Promise<TimelineEvent[]> =>
    request<TimelineEvent[]>(`/projects/${encodeURIComponent(projectId)}/timeline`),

  create: (projectId: string, data: Partial<TimelineEvent>): Promise<TimelineEvent> =>
    request<TimelineEvent>(`/projects/${encodeURIComponent(projectId)}/timeline`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (projectId: string, eventId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/projects/${encodeURIComponent(projectId)}/timeline/${encodeURIComponent(eventId)}`, {
      method: 'DELETE',
    }),
};

export const publicApi = {
  quote: (id: string) => request<any>(`/public/quote/${encodeURIComponent(id)}`),
  approve: (id: string) => request<{ success: boolean }>(`/public/quote/${encodeURIComponent(id)}/approve`, { method: 'POST' }),
};

// ─── Kanban Tasks ────────────────────────────────

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  type: 'TASK' | 'FEATURE' | 'BUG';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ideas' | 'todo' | 'in-progress' | 'on-hold' | 'done';
  feature: string;
  estimate: string;
  tags: string[];
  createdAt: string;
  version: 'V1' | 'V2';
  attachments?: { name: string; type: string; dataUrl: string }[];
}

export const kanbanApi = {
  list: (): Promise<KanbanTask[]> =>
    request<KanbanTask[]>('/kanban/tasks'),

  create: (task: Partial<KanbanTask>): Promise<KanbanTask> =>
    request<KanbanTask>('/kanban/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  update: (id: string, data: Partial<KanbanTask>): Promise<KanbanTask> =>
    request<KanbanTask>(`/kanban/tasks/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/kanban/tasks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  seed: (tasks: KanbanTask[], version: string): Promise<{ skipped: boolean; count?: number }> =>
    request<{ skipped: boolean; count?: number }>('/kanban/seed', {
      method: 'POST',
      body: JSON.stringify({ tasks, version }),
    }),

  bulkUpdate: (tasks: KanbanTask[]): Promise<{ updated: number }> =>
    request<{ updated: number }>('/kanban/tasks-bulk', {
      method: 'PUT',
      body: JSON.stringify({ tasks }),
    }),
};

// ─── Project Documents ──────────────────────────

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  type: 'contract' | 'proposal' | 'agreement' | 'invoice' | 'other';
  expiry?: string;
  status: 'valid' | 'warning' | 'expired' | 'active';
  fileName?: string;
  createdAt?: string;
}

export const projectDocumentsApi = {
  list: (projectId: string): Promise<ProjectDocument[]> =>
    request<ProjectDocument[]>(`/projects/${encodeURIComponent(projectId)}/documents`),
  create: (projectId: string, data: Partial<ProjectDocument>): Promise<ProjectDocument> =>
    request<ProjectDocument>(`/projects/${encodeURIComponent(projectId)}/documents`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (projectId: string, docId: string, data: Partial<ProjectDocument>): Promise<ProjectDocument> =>
    request<ProjectDocument>(`/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(docId)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (projectId: string, docId: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/projects/${encodeURIComponent(projectId)}/documents/${encodeURIComponent(docId)}`, {
      method: 'DELETE',
    }),
};

// ─── Calendar Events ─────────────────────────────

export const calendarApi = {
  list: (): Promise<CalendarEvent[]> =>
    request<CalendarEvent[]>('/calendar'),

  get: (id: string): Promise<CalendarEvent> =>
    request<CalendarEvent>(`/calendar/${encodeURIComponent(id)}`),

  create: (data: Partial<CalendarEvent>): Promise<CalendarEvent> =>
    request<CalendarEvent>('/calendar', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> =>
    request<CalendarEvent>(`/calendar/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string): Promise<{ success: boolean; id: string }> =>
    request<{ success: boolean; id: string }>(`/calendar/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// ─── Seed ────────────────────────────────────────

let _seedPromise: Promise<void> | null = null;

async function seedWithRetry(attempts = 3, delayMs = 2000): Promise<any> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await request<any>('/seed', { method: 'POST' });
    } catch (err) {
      console.warn(`[TravelPro] Seed attempt ${i + 1}/${attempts} failed:`, err);
      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
}

export function ensureSeeded(): Promise<void> {
  if (!_seedPromise) {
    _seedPromise = seedWithRetry()
      .then((res) => {
        if (res?.skipped) {
          console.log('[TravelPro] Data already seeded');
        } else {
          console.log('[TravelPro] Initial data seeded:', res);
        }
      })
      .catch((err) => {
        console.error('[TravelPro] Seed failed after retries:', err);
        _seedPromise = null; // Allow retry
      });
  }
  return _seedPromise;
}

// ─── Convenience grouped export ──────────────────

export const api = {
  suppliers: suppliersApi,
  projects: projectsApi,
  clients: clientsApi,
  dashboard: dashboardApi,
  quoteItems: quoteItemsApi,
  timeline: timelineApi,
  public: publicApi,
  kanban: kanbanApi,
  projectDocuments: projectDocumentsApi,
  calendar: calendarApi,
  ensureSeeded,
};