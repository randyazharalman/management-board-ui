import React, { useState } from "react";
import { ChecklistItem } from "../../../types";

interface ChecklistProps {
  items: ChecklistItem[];
  taskId: string;
  onToggle: (taskId: string, itemId: string) => void;
  onAdd: (taskId: string, text: string) => void;
  onDelete: (taskId: string, itemId: string) => void;
  progress: number;
}

export const Checklist: React.FC<ChecklistProps> = ({
  items,
  taskId,
  onToggle,
  onAdd,
  onDelete,
  progress,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    const text = newItem.trim();
    if (!text) return;
    onAdd(taskId, text);
    setNewItem("");
  };

  return (
    <div>
      {items.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--kb-text-muted)",
                fontWeight: 600,
              }}
            >
              {items.filter((i) => i.completed).length}/{items.length} completed
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--kb-primary)",
                fontWeight: 700,
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            style={{
              background: "var(--kb-border)",
              height: 6,
              borderRadius: 3,
              marginBottom: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background:
                  progress === 100
                    ? "var(--kb-success)"
                    : "linear-gradient(90deg, var(--kb-primary), var(--kb-primary-light))",
                width: `${progress}%`,
                borderRadius: 3,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <div>
            {items.map((item) => (
              <div key={item.id} className="kb-checklist-item">
                <button
                  className={`kb-checklist-check ${item.completed ? "checked" : ""}`}
                  onClick={() => onToggle(taskId, item.id)}
                >
                  {item.completed && (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <polyline
                        points="2,6 5,9 10,3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span
                  className={`kb-checklist-text ${item.completed ? "done" : ""}`}
                >
                  {item.text}
                </span>
                <button
                  className="kb-checklist-delete"
                  onClick={() => onDelete(taskId, item.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <input
          className="kb-form-input"
          style={{ flex: 1, fontSize: 13, padding: "8px 12px" }}
          placeholder="Add a subtask..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <button
          className="kb-btn kb-btn-primary"
          style={{ padding: "8px 14px" }}
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
};
