import React, { useState, useEffect } from "react";
import { Task, Member, LabelType, PriorityType } from "../../../types";
import { Checklist } from "./Checklist";
import { useKanbanStore } from "../../../store/kanbanStore";
import { IconPlus, IconSave } from "shared/icons";

interface TaskModalProps {
  task: Task | null;
  columnId: string;
  members: Member[];
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const LABELS: LabelType[] = ["Feature", "Bug", "Issue", "Undefined"];
const PRIORITIES: PriorityType[] = ["Low", "Medium", "High", "Critical"];
const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=300&fit=crop",
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=300&fit=crop",
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=300&fit=crop",
  "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=300&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=300&fit=crop",
];

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  columnId,
  members,
  onClose,
  onSave,
  onDelete,
}) => {
  const {
    addChecklistItem,
    toggleChecklistItem,
    deleteChecklistItem,
    columns,
  } = useKanbanStore();

  const isNew = !task;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [assigneeIds, setAssigneeIds] = useState<string[]>(
    task?.assigneeIds ?? [],
  );
  const [dueDate, setDueDate] = useState(task?.dueDate ?? "");
  const [label, setLabel] = useState<LabelType | "">(task?.label ?? "");
  const [priority, setPriority] = useState<PriorityType | "">(
    task?.priority ?? "",
  );
  const [selectedColumnId, setSelectedColumnId] = useState(
    task?.columnId ?? columnId,
  );
  const [coverImage, setCoverImage] = useState<string | null>(
    task?.coverImage ?? null,
  );
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentTask = task
    ? (useKanbanStore.getState().tasks.find((t) => t.id === task.id) ?? task)
    : null;
  const checklist = currentTask?.checklist ?? [];
  const progress = checklist.length
    ? Math.round(
        (checklist.filter((c) => c.completed).length / checklist.length) * 100,
      )
    : 0;

  const toggleAssignee = (id: string) => {
    setAssigneeIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    const saved: Task = {
      id: task?.id ?? "",
      title: title.trim(),
      description,
      assigneeIds,
      dueDate: dueDate || null,
      label: (label as LabelType) || null,
      priority: (priority as PriorityType) || null,
      checklist: currentTask?.checklist ?? [],
      attachments: task?.attachments ?? [],
      coverImage,
      columnId: selectedColumnId,
      order: task?.order ?? 999,
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
    };
    onSave(saved);
    console.log(saved);
  };

  return (
    <div
      className="kb-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="kb-modal">
        {/* Cover */}
        {coverImage && (
          <div className="kb-modal__cover-area">
            <img src={coverImage} alt="" className="kb-modal__cover" />
            <div className="kb-modal__cover-overlay" />
            <button
              className="kb-modal__cover-btn"
              onClick={() => setShowCoverPicker(true)}
            >
              🖼 Change Cover
            </button>
            <button
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
              onClick={() => setCoverImage(null)}
            >
              Remove
            </button>
          </div>
        )}

        {/* Header */}
        <div className="kb-modal__header">
          <textarea
            className="kb-modal__title-input"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
          />
          <button className="kb-modal__close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Body */}
        <div className="kb-modal__body">
          {/* Main */}
          <div className="kb-modal__main">
            {/* Description */}
            <div className="kb-form-group">
              <label className="kb-form-label">Description</label>
              <textarea
                className="kb-form-textarea"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Cover picker */}
            {!coverImage && (
              <div className="kb-form-group">
                <button
                  className="kb-btn kb-btn-ghost"
                  style={{ fontSize: 12 }}
                  onClick={() => setShowCoverPicker(!showCoverPicker)}
                >
                  🖼 Add Cover Image
                </button>
              </div>
            )}
            {showCoverPicker && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                {COVER_IMAGES.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    style={{
                      width: 80,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 6,
                      cursor: "pointer",
                      border:
                        coverImage === img
                          ? "2px solid var(--kb-primary)"
                          : "2px solid transparent",
                    }}
                    onClick={() => {
                      setCoverImage(img);
                      setShowCoverPicker(false);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="kb-divider" />

            {/* Checklist */}
            <div className="kb-form-group">
              <label className="kb-form-label">
                ✅ Checklist
                {checklist.length > 0 && (
                  <span
                    style={{
                      marginLeft: 8,
                      color: "var(--kb-primary)",
                      fontWeight: 700,
                    }}
                  >
                    {progress}%
                  </span>
                )}
              </label>
              {task ? (
                <Checklist
                  items={checklist}
                  taskId={task.id}
                  onToggle={toggleChecklistItem}
                  onAdd={addChecklistItem}
                  onDelete={deleteChecklistItem}
                  progress={progress}
                />
              ) : (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--kb-text-muted)",
                    padding: "8px 0",
                  }}
                >
                  Save task first to add checklist items.
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="kb-divider" />

            {/* Attachments */}
            <div className="kb-form-group">
              <label className="kb-form-label">📎 Attachments</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(task?.attachments ?? []).map((att) => (
                  <div key={att.id} className="kb-attachment">
                    <div className="kb-attachment-icon">
                      {att.type === "pdf"
                        ? "📄"
                        : att.type === "fig"
                          ? "🎨"
                          : "📁"}
                    </div>
                    <span>{att.name}</span>
                  </div>
                ))}
                <div
                  style={{
                    border: "2px dashed var(--kb-border)",
                    borderRadius: 8,
                    padding: "12px 16px",
                    textAlign: "center",
                    color: "var(--kb-text-muted)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  📎 Drop & drop files here or browse from device
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="kb-modal__sidebar">
            {/* Assignees */}
            <div className="kb-meta-item">
              <span className="kb-meta-label">Assignees</span>
              <div className="kb-member-list">
                {members.map((m) => (
                  <button
                    key={m.id}
                    className={`kb-member-chip ${assigneeIds.includes(m.id) ? "selected" : ""}`}
                    onClick={() => toggleAssignee(m.id)}
                    style={{
                      borderColor: assigneeIds.includes(m.id)
                        ? m.color
                        : undefined,
                    }}
                  >
                    <div
                      className="kb-avatar"
                      style={{
                        background: m.color,
                        width: 20,
                        height: 20,
                        fontSize: 9,
                      }}
                    >
                      {m.avatar}
                    </div>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="kb-divider" style={{ margin: "8px 0" }} />

            {/* Due Date */}
            <div className="kb-meta-item">
              <span className="kb-meta-label">Due Date</span>
              <input
                type="date"
                className="kb-form-input"
                style={{ fontSize: 13, padding: "8px 12px" }}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Column */}
            <div className="kb-meta-item">
              <span className="kb-meta-label">Column</span>
              <select
                className="kb-form-select"
                style={{ fontSize: 13, padding: "8px 12px" }}
                value={selectedColumnId}
                onChange={(e) => {
                  setSelectedColumnId(e.target.value);
                  console.log(e.target.value);
                }}
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Label */}
            <div className="kb-meta-item">
              <span className="kb-meta-label">Label</span>
              <select
                className="kb-form-select"
                style={{ fontSize: 13, padding: "8px 12px" }}
                value={label}
                onChange={(e) => setLabel(e.target.value as LabelType | "")}
              >
                <option value="">None</option>
                {LABELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="kb-meta-item">
              <span className="kb-meta-label">Priority</span>
              <select
                className="kb-form-select"
                style={{ fontSize: 13, padding: "8px 12px" }}
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as PriorityType | "")
                }
              >
                <option value="">None</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Delete */}
            {task && onDelete && (
              <>
                <div className="kb-divider" style={{ margin: "8px 0" }} />
                {showDeleteConfirm ? (
                  <div
                    style={{ fontSize: 12, color: "var(--kb-text-secondary)" }}
                  >
                    <p style={{ marginBottom: 8 }}>Delete this task?</p>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        className="kb-btn kb-btn-danger"
                        style={{ flex: 1, padding: "7px 10px", fontSize: 12 }}
                        onClick={() => onDelete(task.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="kb-btn kb-btn-ghost"
                        style={{ flex: 1, padding: "7px 10px", fontSize: 12 }}
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="kb-btn kb-btn-danger"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    🗑 Delete Task
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="kb-modal__footer">
          <button className="kb-btn kb-btn-ghost" onClick={onClose}>
            Discard
          </button>
          <button
            className="kb-btn kb-btn-primary"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            {isNew ? (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconPlus />
                Create Task
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconSave />
                Save Changes
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
