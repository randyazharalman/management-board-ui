export type LabelType = "Feature" | "Bug" | "Issue" | "Undefined";
export type PriorityType = "Low" | "Medium" | "High" | "Critical";

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeIds: string[];
  dueDate: string | null;
  label: LabelType | null;
  priority: PriorityType | null;
  checklist: ChecklistItem[];
  attachments: Attachment[];
  coverImage: string | null;
  columnId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  order: number;
}

export interface FilterState {
  search: string;
  assigneeId: string | null;
  label: LabelType | null;
  dueDate: "overdue" | "today" | "week" | null;
}
