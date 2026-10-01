// In-App Offline Document Vault
// Stores study notes, DPPs, and chapter materials locally in IndexedDB / localStorage for zero-internet access.

export interface OfflineDoc {
  id: string;
  title: string;
  category: string;
  targetClass: string;
  subject?: string;
  fileUrl: string;
  fileType: string;
  fileSize?: string;
  contentSnippet?: string;
  downloadedAt: string;
}

const OFFLINE_KEY = 'lcc_offline_vault_docs';

export const getOfflineDocs = (): OfflineDoc[] => {
  try {
    const raw = localStorage.getItem(OFFLINE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveOfflineDoc = (doc: Omit<OfflineDoc, 'downloadedAt'>): boolean => {
  try {
    const existing = getOfflineDocs();
    const filtered = existing.filter(d => d.id !== doc.id);
    const newEntry: OfflineDoc = {
      ...doc,
      downloadedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };
    filtered.unshift(newEntry);
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    console.error('Failed to save offline doc:', e);
    return false;
  }
};

export const deleteOfflineDoc = (id: string): boolean => {
  try {
    const existing = getOfflineDocs();
    const updated = existing.filter(d => d.id !== id);
    localStorage.setItem(OFFLINE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    return false;
  }
};

export const isDocOffline = (id: string): boolean => {
  const existing = getOfflineDocs();
  return existing.some(d => d.id === id);
};
