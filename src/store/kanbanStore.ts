import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Column, Member, FilterState, ChecklistItem, LabelType, PriorityType } from '../types';

const MEMBERS: Member[] = [
  { id: 'm1', name: 'Andi', avatar: 'A', color: '#6366f1' },
  { id: 'm2', name: 'Budi', avatar: 'B', color: '#f59e0b' },
  { id: 'm3', name: 'Citra', avatar: 'C', color: '#10b981' },
  { id: 'm4', name: 'Dewi', avatar: 'D', color: '#ef4444' },
  { id: 'm5', name: 'Eko', avatar: 'E', color: '#8b5cf6' },
];

const INITIAL_COLUMNS: Column[] = [
  { id: 'col-todo', title: 'To Do', color: '#6366f1', order: 0 },
  { id: 'col-doing', title: 'Doing', color: '#f59e0b', order: 1 },
  { id: 'col-review', title: 'Review', color: '#3b82f6', order: 2 },
  { id: 'col-done', title: 'Done', color: '#10b981', order: 3 },
  { id: 'col-rework', title: 'Rework', color: '#ef4444', order: 4 },
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1', title: 'Research for a podcast and video website',
    description: 'Conduct thorough research on modern podcast platforms and video streaming sites.',
    assigneeIds: ['m1', 'm2'], dueDate: '2025-08-08', label: 'Feature', priority: 'High',
    checklist: [
      { id: 'c1', text: 'Analyze competitor platforms', completed: true },
      { id: 'c2', text: 'Document key features', completed: false },
    ],
    attachments: [{ id: 'a1', name: 'research.pdf', type: 'pdf' }],
    coverImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=200&fit=crop',
    columnId: 'col-todo', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't2', title: 'Debug checkout process for the e-commerce website',
    description: 'Fix critical bugs in the checkout flow that are causing cart abandonment.',
    assigneeIds: ['m3'], dueDate: '2025-10-19', label: 'Bug', priority: 'Critical',
    checklist: [
      { id: 'c3', text: 'Reproduce the bug', completed: true },
      { id: 'c4', text: 'Fix payment gateway', completed: true },
      { id: 'c5', text: 'Write regression tests', completed: false },
    ],
    attachments: [], coverImage: null,
    columnId: 'col-todo', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't3', title: 'Design wireframes for the landing page revamp',
    description: 'Create modern wireframes for the new landing page with improved UX.',
    assigneeIds: ['m2', 'm4'], dueDate: '2025-08-12', label: 'Feature', priority: 'Medium',
    checklist: [{ id: 'c6', text: 'Sketch initial concepts', completed: true }],
    attachments: [{ id: 'a2', name: 'wireframes.fig', type: 'fig' }],
    coverImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=200&fit=crop',
    columnId: 'col-doing', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't4', title: 'Install and set up a marketing tool for team operations',
    description: 'Evaluate and deploy a marketing automation platform.',
    assigneeIds: ['m1', 'm3', 'm5'], dueDate: '2025-08-14', label: 'Undefined', priority: 'Low',
    checklist: [], attachments: [], coverImage: null,
    columnId: 'col-doing', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't5', title: 'Create and refine logo designs for the UI brand',
    description: 'Develop a comprehensive brand identity including logo variations.',
    assigneeIds: ['m2', 'm4'], dueDate: '2025-09-02', label: 'Issue', priority: 'High',
    checklist: [
      { id: 'c7', text: 'Initial logo concepts', completed: true },
      { id: 'c8', text: 'Refine top 3 concepts', completed: false },
    ],
    attachments: [],
    coverImage: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=200&fit=crop',
    columnId: 'col-review', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't6', title: 'Create an icon library for the project',
    description: 'Build a consistent icon set following design system guidelines.',
    assigneeIds: ['m1'], dueDate: '2025-07-18', label: 'Feature', priority: 'Medium',
    checklist: [], attachments: [], coverImage: null,
    columnId: 'col-review', order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't7', title: 'Create the Email Page layout and necessary components',
    description: 'Build responsive email template with reusable components.',
    assigneeIds: ['m3', 'm5'], dueDate: '2025-08-05', label: 'Feature', priority: 'High',
    checklist: [
      { id: 'c9', text: 'Email layout structure', completed: true },
      { id: 'c10', text: 'Responsive testing', completed: true },
    ],
    attachments: [], coverImage: null,
    columnId: 'col-done', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 't8', title: 'Blog Edit Page Modification and Playlist Page Design',
    description: 'Update the blog editor and create a new playlist browsing page.',
    assigneeIds: ['m2', 'm4'], dueDate: '2025-08-08', label: 'Feature', priority: 'Medium',
    checklist: [
      { id: 'c11', text: 'Blog editor updates', completed: true },
      { id: 'c12', text: 'Playlist page mockup', completed: false },
      { id: 'c13', text: 'Implementation', completed: false },
    ],
    attachments: [],
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
    columnId: 'col-rework', order: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

interface KanbanStore {
  tasks: Task[];
  columns: Column[];
  members: Member[];
  filter: FilterState;
  darkMode: boolean;

  // Task CRUD
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: string, targetOrder?: number) => void;

  // Checklist
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;

  // Column CRUD
  addColumn: (title: string) => void;
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;

  // Filter
  setFilter: (filter: Partial<FilterState>) => void;
  clearFilter: () => void;

  // UI
  toggleDarkMode: () => void;

  // Selectors
  getFilteredTasks: () => Task[];
  getTasksByColumn: (columnId: string) => Task[];
  getTaskProgress: (task: Task) => number;
}

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      tasks: INITIAL_TASKS,
      columns: INITIAL_COLUMNS,
      members: MEMBERS,
      filter: { search: '', assigneeId: null, label: null, dueDate: null },
      darkMode: false,

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ tasks: [...s.tasks, task] }));
        return task;
      },

      updateTask: (id, updates) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      deleteTask: (id) => {
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
      },

      moveTask: (taskId, targetColumnId, targetOrder) => {
        set((s) => {
          const task = s.tasks.find((t) => t.id === taskId);
          if (!task) return s;
          const colTasks = s.tasks
            .filter((t) => t.columnId === targetColumnId && t.id !== taskId)
            .sort((a, b) => a.order - b.order);
          const newOrder = targetOrder ?? colTasks.length;
          return {
            tasks: s.tasks.map((t) => {
              if (t.id === taskId) return { ...t, columnId: targetColumnId, order: newOrder, updatedAt: new Date().toISOString() };
              if (t.columnId === targetColumnId && t.id !== taskId && t.order >= newOrder)
                return { ...t, order: t.order + 1 };
              return t;
            }),
          };
        });
      },

      addChecklistItem: (taskId, text) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, checklist: [...t.checklist, { id: generateId(), text, completed: false }], updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      toggleChecklistItem: (taskId, itemId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, completed: !c.completed } : c)),
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      deleteChecklistItem: (taskId, itemId) => {
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, checklist: t.checklist.filter((c) => c.id !== itemId), updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      addColumn: (title) => {
        const cols = get().columns;
        set((s) => ({
          columns: [
            ...s.columns,
            { id: generateId(), title, color: '#6366f1', order: cols.length },
          ],
        }));
      },

      updateColumn: (id, title) => {
        set((s) => ({
          columns: s.columns.map((c) => (c.id === id ? { ...c, title } : c)),
        }));
      },

      deleteColumn: (id) => {
        set((s) => ({
          columns: s.columns.filter((c) => c.id !== id),
          tasks: s.tasks.filter((t) => t.columnId !== id),
        }));
      },

      setFilter: (filter) => {
        set((s) => ({ filter: { ...s.filter, ...filter } }));
      },

      clearFilter: () => {
        set({ filter: { search: '', assigneeId: null, label: null, dueDate: null } });
      },

      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      getFilteredTasks: () => {
        const { tasks, filter } = get();
        return tasks.filter((t) => {
          if (filter.search && !t.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
          if (filter.assigneeId && !t.assigneeIds.includes(filter.assigneeId)) return false;
          if (filter.label && t.label !== filter.label) return false;
          if (filter.dueDate) {
            const now = new Date(); now.setHours(0, 0, 0, 0);
            const due = t.dueDate ? new Date(t.dueDate) : null;
            if (!due) return false;
            if (filter.dueDate === 'overdue' && due >= now) return false;
            if (filter.dueDate === 'today') {
              const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
              if (due < now || due >= tomorrow) return false;
            }
            if (filter.dueDate === 'week') {
              const nextWeek = new Date(now); nextWeek.setDate(nextWeek.getDate() + 7);
              if (due < now || due >= nextWeek) return false;
            }
          }
          return true;
        });
      },

      getTasksByColumn: (columnId) => {
        const filtered = get().getFilteredTasks();
        return filtered.filter((t) => t.columnId === columnId).sort((a, b) => a.order - b.order);
      },

      getTaskProgress: (task) => {
        if (!task.checklist.length) return 0;
        return Math.round((task.checklist.filter((c) => c.completed).length / task.checklist.length) * 100);
      },
    }),
    { name: 'kanban-store' }
  )
);
