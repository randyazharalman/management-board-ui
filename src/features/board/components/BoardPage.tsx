import React, { useState, useRef, useEffect } from "react";
import { BoardColumn } from "./BoardColumn";
import { FilterBar } from "./FilterBar";
import { TaskModal } from "../../task/components/TaskModal";
import { useKanbanStore } from "../../../store/kanbanStore";
import { Task } from "../../../types";
import { useToast } from "../../../shared/components/ToastProvider";
import { IconMoon, IconPlus, IconSearch, IconSun, IconX } from "shared/icons";

interface DeleteColDialogProps {
  columnTitle: string;
  taskCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}
const DeleteColDialog: React.FC<DeleteColDialogProps> = ({
  columnTitle,
  taskCount,
  onConfirm,
  onCancel,
}) => (
  <div className="kb-modal-overlay" onClick={onCancel}>
    <div className="kb-confirm-dialog" onClick={(e) => e.stopPropagation()}>
      <div className="kb-confirm-dialog__icon">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--kb-danger)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          <path d="M10 11v6" />
          <path d="M14 11v6" />
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        </svg>
      </div>
      <h3 className="kb-confirm-dialog__title">Delete "{columnTitle}"?</h3>
      <p className="kb-confirm-dialog__desc">
        {taskCount > 0
          ? `This will permanently delete the column and all ${taskCount} task${taskCount !== 1 ? "s" : ""} inside it.`
          : "This will permanently delete the column."}{" "}
        This action cannot be undone.
      </p>
      <div className="kb-confirm-dialog__actions">
        <button className="kb-btn kb-btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="kb-btn kb-btn-danger"
          style={{ boxShadow: "0 2px 8px rgba(239,68,68,0.3)" }}
          onClick={onConfirm}
        >
          Delete Column
        </button>
      </div>
    </div>
  </div>
);

export const BoardPage: React.FC = () => {
  const {
    columns,
    members,
    filter,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    setFilter,
    clearFilter,
    addColumn,
    updateColumn,
    deleteColumn,
    getTasksByColumn,
    darkMode,
    toggleDarkMode,
    tasks,
  } = useKanbanStore();

  const { showToast } = useToast();

  const [modalState, setModalState] = useState<{
    open: boolean;
    task: Task | null;
    columnId: string;
  }>({ open: false, task: null, columnId: "" });

  const [showAddCol, setShowAddCol] = useState(false);
  const [newColName, setNewColName] = useState("");

  // Column rename
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColName, setEditingColName] = useState("");

  // Column delete confirm
  const [deleteColId, setDeleteColId] = useState<string | null>(null);

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  const totalTasks = tasks.length;

  // ── Handlers ──
  const openCreateModal = (colId: string) =>
    setModalState({ open: true, task: null, columnId: colId });
  const openEditModal = (task: Task) =>
    setModalState({ open: true, task, columnId: task.columnId });
  const closeModal = () =>
    setModalState({ open: false, task: null, columnId: "" });

  const handleSave = (taskData: Task) => {
    if (modalState.task) {
      updateTask(taskData.id, taskData);
      showToast("Task updated", "success");
    } else {
      addTask({
        ...taskData,
        order: getTasksByColumn(modalState.columnId).length,
      });
      console.log(taskData);
      console.log(modalState.columnId);
      showToast("Task created", "success");
    }
    closeModal();
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    showToast("Task deleted", "error");
    closeModal();
  };

  const handleDrop = (taskId: string, colId: string) => {
    const task = useKanbanStore.getState().tasks.find((t) => t.id === taskId);
    if (!task || task.columnId === colId) return;
    moveTask(taskId, colId);
    const targetCol = columns.find((c) => c.id === colId);
    showToast(`Moved to "${targetCol?.title}"`, "info");
  };

  const handleAddColumn = () => {
    if (!newColName.trim()) return;
    addColumn(newColName.trim());
    showToast(`Column "${newColName.trim()}" added`, "success");
    setNewColName("");
    setShowAddCol(false);
  };

  const handleStartRename = (colId: string, currentTitle: string) => {
    setEditingColId(colId);
    setEditingColName(currentTitle);
  };

  const handleConfirmRename = () => {
    if (!editingColId || !editingColName.trim()) {
      setEditingColId(null);
      return;
    }
    updateColumn(editingColId, editingColName.trim());
    showToast("Column renamed", "success");
    setEditingColId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteColId) return;
    const col = columns.find((c) => c.id === deleteColId);
    deleteColumn(deleteColId);
    showToast(`Column "${col?.title}" deleted`, "error");
    setDeleteColId(null);
  };

  const deleteColTaskCount = deleteColId
    ? tasks.filter((t) => t.columnId === deleteColId).length
    : 0;
  const deleteColTitle = deleteColId
    ? (columns.find((c) => c.id === deleteColId)?.title ?? "")
    : "";

  return (
    <>
      {/* HEADER  */}
      <header className="kb-header">
        <a
          className="kb-header__logo"
          href="#"
          onClick={(e) => e.preventDefault()}
        >
          <span className="kb-header__logo-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
            </svg>
          </span>
          <span className="kb-header__logo-text">Adhivasindo</span>
          <span className="kb-header__logo-dot" />
        </a>

        <span className="kb-header__sep" />

        {/* Board info */}
        <div className="kb-header__board-info">
          <span className="kb-header__board-name">Northern Light</span>
          <span className="kb-header__board-meta">
            {totalTasks} tasks · {columns.length} columns
          </span>
        </div>

        {/* Actions */}
        <div className="kb-header__actions">
          <div className="kb-avatars" style={{ marginRight: 4 }}>
            {members.map((m) => (
              <div
                key={m.id}
                className="kb-avatar kb-avatar--md"
                style={{ background: m.color }}
                title={m.name}
              >
                {m.avatar}
              </div>
            ))}
            <div
              className="kb-avatar kb-avatar--md"
              style={{ background: "skyblue" }}
              title={"Invite"}
            >
              <IconPlus />
            </div>
          </div>
          <div className="kb-header-search">
            <IconSearch />
            <input
              placeholder="Search tasks..."
              value={filter.search}
              onChange={(e) => setFilter({ search: e.target.value })}
            />
            {filter.search && (
              <button
                className="kb-header-search__clear"
                onClick={() => setFilter({ search: "" })}
                title="Clear search"
              >
                <IconX />
              </button>
            )}
          </div>

          {/* New Task */}
          <button
            className="kb-btn kb-btn-primary"
            style={{ fontSize: 12, padding: "7px 14px", gap: 6 }}
            onClick={() => openCreateModal(sortedColumns[0]?.id ?? "")}
          >
            <IconPlus />
            <span className="kb-header__btn-text">New Task</span>
          </button>

          {/* Dark mode */}
          <button
            className="kb-dark-toggle"
            onClick={toggleDarkMode}
            title="Toggle theme"
          >
            {darkMode ? <IconSun /> : <IconMoon />}
            <span className="kb-dark-toggle__text">
              {darkMode ? "Light" : "Dark"}
            </span>
          </button>
        </div>
      </header>

      {/* FILTER */}
      <FilterBar
        filter={filter}
        members={members}
        onFilterChange={setFilter}
        onClear={clearFilter}
      />

      {/* BOARD  */}
      <div className="kb-board">
        {sortedColumns.map((col) => (
          <BoardColumn
            key={col.id}
            column={col}
            tasks={getTasksByColumn(col.id)}
            members={members}
            onAddTask={openCreateModal}
            onEditTask={openEditModal}
            onDrop={handleDrop}
            onRenameColumn={handleStartRename}
            onDeleteColumn={(id) => setDeleteColId(id)}
            editingColId={editingColId}
            editingColName={editingColName}
            onEditingColNameChange={setEditingColName}
            onConfirmRename={handleConfirmRename}
            onCancelRename={() => setEditingColId(null)}
          />
        ))}

        {/* ADD COLUMN  */}
        {showAddCol ? (
          <div className="kb-add-column-form">
            <input
              className="kb-form-input"
              placeholder="Column name..."
              value={newColName}
              onChange={(e) => setNewColName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddColumn();
                if (e.key === "Escape") setShowAddCol(false);
              }}
              autoFocus
              style={{ fontSize: 13 }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                className="kb-btn kb-btn-primary"
                style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
                onClick={handleAddColumn}
              >
                Add Column
              </button>
              <button
                className="kb-btn kb-btn-ghost"
                style={{ fontSize: 12 }}
                onClick={() => setShowAddCol(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            className="kb-add-column"
            onClick={() => setShowAddCol(true)}
            aria-label="Add new column"
          >
            <span className="kb-add-column__icon">
              <IconPlus />
            </span>
            Add List
          </button>
        )}
      </div>

      {/* TASK MODAL */}
      {modalState.open && (
        <TaskModal
          task={modalState.task}
          columnId={modalState.columnId}
          members={members}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={modalState.task ? handleDeleteTask : undefined}
        />
      )}

      {/* DELETE CONFIRM DIALOG */}
      {deleteColId && (
        <DeleteColDialog
          columnTitle={deleteColTitle}
          taskCount={deleteColTaskCount}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteColId(null)}
        />
      )}
    </>
  );
};
