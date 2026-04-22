import React from "react";
import { Task, Member } from "../../../types";
import { MemberAvatarGroup } from "../../../shared/components/MemberAvatar";

interface TaskCardProps {
  task: Task;
  members: Member[];
  progress: number;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: "#94a3b8",
  Medium: "#f59e0b",
  High: "#ef4444",
  Critical: "#ef4444",
};

const formatDate = (
  dateStr: string | null,
): { text: string; status: "normal" | "overdue" | "warning" } => {
  if (!dateStr) return { text: "", status: "normal" };
  const date = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 3);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  if (date < now) return { text: `${day} ${month}`, status: "overdue" };
  if (date <= tomorrow) return { text: `${day} ${month}`, status: "warning" };
  return { text: `${day} ${month}`, status: "normal" };
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  members,
  progress,
  onClick,
  onDragStart,
  onDragEnd,
}) => {
  const { text: dateText, status: dateStatus } = formatDate(task.dueDate);
  const completedItems = task.checklist.filter((c) => c.completed).length;
  const totalItems = task.checklist.length;

  return (
    <div
      className="kb-card"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {task.coverImage && (
        <div className="kb-card__cover-wrap">
          <img
            src={task.coverImage}
            alt=""
            className="kb-card__cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="kb-card__body">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: task.label ? 8 : 0,
          }}
        >
          {task.label && (
            <span className={`kb-card__label kb-card__label--${task.label}`}>
              {task.label}
            </span>
          )}
          {task.priority && (
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                flexShrink: 0,
                background: PRIORITY_COLORS[task.priority] ?? "#94a3b8",
                boxShadow: `0 0 0 3px ${PRIORITY_COLORS[task.priority] ?? "#94a3b8"}22`,
                marginLeft: "auto",
              }}
              title={`Priority: ${task.priority}`}
            />
          )}
        </div>
        <div className="kb-card__title">{task.title}</div>
        {totalItems > 0 && (
          <div className="kb-card__progress">
            <div className="kb-card__progress-header">
              <span className="kb-card__progress-label">
                {completedItems}/{totalItems} done
              </span>
              <span className="kb-card__progress-pct">{progress}%</span>
            </div>
            <div className="kb-card__progress-track">
              <div
                className="kb-card__progress-fill"
                style={{
                  width: `${progress}%`,
                  background:
                    progress === 100
                      ? "linear-gradient(90deg, #10b981, #34d399)"
                      : undefined,
                }}
              />
            </div>
          </div>
        )}
        <div className="kb-card__footer">
          <div className="kb-card__meta">
            {dateText && (
              <span
                className={`kb-card__badge kb-card__badge--date ${dateStatus}`}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {dateText}
              </span>
            )}
            {totalItems > 0 && (
              <span className="kb-card__badge">
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                {completedItems}/{totalItems}
              </span>
            )}
            {task.attachments.length > 0 && (
              <span className="kb-card__badge">
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
                {task.attachments.length}
              </span>
            )}
          </div>
          {task.assigneeIds.length > 0 && (
            <MemberAvatarGroup memberIds={task.assigneeIds} members={members} />
          )}
        </div>
      </div>
    </div>
  );
};
