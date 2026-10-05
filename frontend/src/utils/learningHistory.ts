// Utility to track and retrieve student learning history (videos watched, notes read)
export interface LearningHistoryItem {
  id: string;
  itemId: string;
  title: string;
  type: 'video' | 'material';
  subject?: string;
  targetClass?: string;
  timestamp: number;
  duration?: string;
  pages?: number;
}

const getStorageKey = (studentId?: string): string => {
  return studentId ? `lcc_learning_history_${studentId}` : 'lcc_learning_history_guest';
};

export const getLearningHistory = (studentId?: string): LearningHistoryItem[] => {
  try {
    const raw = localStorage.getItem(getStorageKey(studentId));
    if (!raw) return [];
    const items: LearningHistoryItem[] = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch (e) {
    return [];
  }
};

export const recordLearningHistory = (
  item: Omit<LearningHistoryItem, 'id' | 'timestamp'>,
  studentId?: string
): void => {
  try {
    const key = getStorageKey(studentId);
    const existing = getLearningHistory(studentId);
    // Remove if already exists so we move it to the top
    const filtered = existing.filter(i => !(i.itemId === item.itemId && i.type === item.type));
    const newItem: LearningHistoryItem = {
      ...item,
      id: `hist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now()
    };
    filtered.unshift(newItem);
    // Keep last 30 items
    const trimmed = filtered.slice(0, 30);
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to record learning history:', e);
  }
};

export const clearLearningHistory = (studentId?: string): void => {
  try {
    localStorage.removeItem(getStorageKey(studentId));
  } catch (e) {}
};
