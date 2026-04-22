import React, { useState, useRef, useEffect } from "react";
import { Column, Task, Member } from "../../../types";
import { TaskCard } from "../../task/components/TaskCard";
import { useKanbanStore } from "../../../store/kanbanStore";
import { IconCheck, IconClose, IconDots, IconPencil, IconPlus, IconTrash } from "shared/icons";

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  members: Member[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDrop: (taskId: string, columnId: string) => void;

  onRenameColumn: (id: string, currentTitle: string) => void;
  onDeleteColumn: (id: string) => void;
  editingColId: string | null;
  editingColName: string;
  onEditingColNameChange: (val: string) => void;
  onConfirmRename: () => void;
  onCancelRename: () => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  column,
  tasks,
  members,
  onAddTask,
  onEditTask,
  onDrop,
  onRenameColumn,
  onDeleteColumn,
  editingColId,
  editingColName,
  onEditingColNameChange,
  onConfirmRename,
  onCancelRename,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showColMenu, setShowColMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const renameRef = useRef<HTMLInputElement>(null);
  const { getTaskProgress } = useKanbanStore();

  const isEditing = editingColId === column.id;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setShowColMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (isEditing) setTimeout(() => renameRef.current?.select(), 30);
  }, [isEditing]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node))
      setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onDrop(taskId, column.id);
  };
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`kb-column ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kb-column__header">
        <span
          className="kb-column__indicator"
          style={{ background: column.color }}
        />
        {isEditing ? (
          <div className="kb-column__rename-row">
            <input
              ref={renameRef}
              className="kb-column__rename-input"
              value={editingColName}
              onChange={(e) => onEditingColNameChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onConfirmRename();
                if (e.key === "Escape") onCancelRename();
              }}
              maxLength={40}
            />
            <button
              className="kb-column__rename-action kb-column__rename-action--confirm"
              onClick={onConfirmRename}
              title="Save"
            >
              <IconCheck />
            </button>
            <button
              className="kb-column__rename-action kb-column__rename-action--cancel"
              onClick={onCancelRename}
              title="Cancel"
            >
              <IconClose />
            </button>
          </div>
        ) : (
          <span className="kb-column__title">{column.title}</span>
        )}

        {!isEditing && (
          <>
            <span className="kb-column__count">{tasks.length}</span>
            <button
              className="kb-column__btn"
              onClick={() => onAddTask(column.id)}
              title="Add task"
            >
              <IconPlus />
            </button>
            <div
              className="kb-dropdown"
              ref={menuRef}
              style={{ position: "relative" }}
            >
              <button
                className="kb-column__btn"
                onClick={() => setShowColMenu((v) => !v)}
                title="Column options"
              >
                <IconDots />
              </button>
              {showColMenu && (
                <div
                  className="kb-dropdown__menu"
                  style={{ right: 0, minWidth: 170 }}
                >
                  <button
                    className="kb-dropdown__item"
                    onClick={() => {
                      onRenameColumn(column.id, column.title);
                      setShowColMenu(false);
                    }}
                  >
                    <IconPencil /> Rename Column
                  </button>
                  <div className="kb-dropdown__divider" />
                  <button
                    className="kb-dropdown__item kb-dropdown__item--danger"
                    onClick={() => {
                      onDeleteColumn(column.id);
                      setShowColMenu(false);
                    }}
                  >
                    <IconTrash /> Delete Column
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <div className="kb-column__body">
        {isDragOver && tasks.length === 0 && (
          <div className="kb-column__drop-hint" />
        )}
        {tasks.length === 0 && !isDragOver && (
          <div className="kb-empty">
            <div className="kb-empty__icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--kb-text-muted)"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="13" y2="13" />
              </svg>
            </div>
            <span className="kb-empty__title">No tasks</span>
            <span className="kb-empty__desc">Drag here or click + to add</span>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            members={members}
            progress={getTaskProgress(task)}
            onClick={() => onEditTask(task)}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={() => {}}
          />
        ))}

        {isDragOver && tasks.length > 0 && (
          <div className="kb-column__drop-hint" style={{ marginTop: 4 }} />
        )}
      </div>
      <button
        className="kb-column__add-btn"
        onClick={() => onAddTask(column.id)}
      >
        <IconPlus />
        Add Task
      </button>
    </div>
  );
};
