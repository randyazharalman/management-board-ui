import React, { useState, useRef, useEffect } from "react";
import { Member, LabelType, FilterState } from "../../../types";
import { IconCalendar, IconChevronDown, IconFilter, IconTag, IconUser, IconX } from "shared/icons";

interface FilterBarProps {
  filter: FilterState;
  members: Member[];
  onFilterChange: (f: Partial<FilterState>) => void;
  onClear: () => void;
}

const LABELS: LabelType[] = ["Feature", "Bug", "Issue", "Undefined"];
const DUE_OPTIONS = [
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Due Today" },
  { value: "week", label: "This Week" },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  members,
  onFilterChange,
  onClear,
}) => {
  const [showAssignee, setShowAssignee] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [showDue, setShowDue] = useState(false);
  const assigneeRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!assigneeRef.current?.contains(e.target as Node))
        setShowAssignee(false);
      if (!labelRef.current?.contains(e.target as Node)) setShowLabel(false);
      if (!dueRef.current?.contains(e.target as Node)) setShowDue(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasFilter = filter.assigneeId || filter.label || filter.dueDate;
  const activeAssigneeName = filter.assigneeId
    ? members.find((m) => m.id === filter.assigneeId)?.name
    : null;
  const activeDueLabel =
    DUE_OPTIONS.find((d) => d.value === filter.dueDate)?.label ?? null;

  return (
    <div className="kb-filter-bar">
      {/* Filter icon label */}
      <span className="kb-filter-bar__label">
        <IconFilter />
        Filter
      </span>

      <span className="kb-filter-bar__sep" />

      {/* ── Assignee ── */}
      <div className="kb-dropdown" ref={assigneeRef}>
        <button
          className={`kb-filter-chip ${filter.assigneeId ? "active" : ""}`}
          onClick={() => {
            setShowAssignee((v) => !v);
            setShowLabel(false);
            setShowDue(false);
          }}
        >
          <IconUser />
          {activeAssigneeName ?? "Assignee"}
          {!filter.assigneeId && <IconChevronDown />}
          {filter.assigneeId && (
            <span
              className="kb-filter-chip__clear"
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange({ assigneeId: null });
              }}
            >
              <IconX />
            </span>
          )}
        </button>
        {showAssignee && (
          <div className="kb-dropdown__menu" style={{ minWidth: 190 }}>
            <div className="kb-dropdown__header">Assign to</div>
            <button
              className={`kb-dropdown__item ${!filter.assigneeId ? "kb-dropdown__item--checked" : ""}`}
              onClick={() => {
                onFilterChange({ assigneeId: null });
                setShowAssignee(false);
              }}
            >
              <span className="kb-dropdown__item-check">
                {!filter.assigneeId && <CheckIcon />}
              </span>
              All Members
            </button>
            {members.map((m) => (
              <button
                key={m.id}
                className={`kb-dropdown__item ${filter.assigneeId === m.id ? "kb-dropdown__item--checked" : ""}`}
                onClick={() => {
                  onFilterChange({ assigneeId: m.id });
                  setShowAssignee(false);
                }}
              >
                <span className="kb-dropdown__item-check">
                  {filter.assigneeId === m.id && <CheckIcon />}
                </span>
                <div
                  className="kb-avatar"
                  style={{
                    background: m.color,
                    width: 20,
                    height: 20,
                    fontSize: 9,
                    flexShrink: 0,
                    border: "none",
                    margin: 0,
                  }}
                >
                  {m.avatar}
                </div>
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="kb-dropdown" ref={labelRef}>
        <button
          className={`kb-filter-chip ${filter.label ? "active" : ""}`}
          onClick={() => {
            setShowLabel((v) => !v);
            setShowAssignee(false);
            setShowDue(false);
          }}
        >
          <IconTag />
          {filter.label ?? "Label"}
          {!filter.label && <IconChevronDown />}
          {filter.label && (
            <span
              className="kb-filter-chip__clear"
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange({ label: null });
              }}
            >
              <IconX />
            </span>
          )}
        </button>
        {showLabel && (
          <div className="kb-dropdown__menu">
            <div className="kb-dropdown__header">Filter by label</div>
            <button
              className={`kb-dropdown__item ${!filter.label ? "kb-dropdown__item--checked" : ""}`}
              onClick={() => {
                onFilterChange({ label: null });
                setShowLabel(false);
              }}
            >
              <span className="kb-dropdown__item-check">
                {!filter.label && <CheckIcon />}
              </span>
              All Labels
            </button>
            {LABELS.map((l) => (
              <button
                key={l}
                className={`kb-dropdown__item ${filter.label === l ? "kb-dropdown__item--checked" : ""}`}
                onClick={() => {
                  onFilterChange({ label: l });
                  setShowLabel(false);
                }}
              >
                <span className="kb-dropdown__item-check">
                  {filter.label === l && <CheckIcon />}
                </span>
                <span className={`kb-label-dot kb-label-dot--${l}`} />
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Due Date */}
      <div className="kb-dropdown" ref={dueRef}>
        <button
          className={`kb-filter-chip ${filter.dueDate ? "active" : ""}`}
          onClick={() => {
            setShowDue((v) => !v);
            setShowAssignee(false);
            setShowLabel(false);
          }}
        >
          <IconCalendar />
          {activeDueLabel ?? "Due Date"}
          {!filter.dueDate && <IconChevronDown />}
          {filter.dueDate && (
            <span
              className="kb-filter-chip__clear"
              onClick={(e) => {
                e.stopPropagation();
                onFilterChange({ dueDate: null });
              }}
            >
              <IconX />
            </span>
          )}
        </button>
        {showDue && (
          <div className="kb-dropdown__menu">
            <div className="kb-dropdown__header">Filter by due date</div>
            <button
              className={`kb-dropdown__item ${!filter.dueDate ? "kb-dropdown__item--checked" : ""}`}
              onClick={() => {
                onFilterChange({ dueDate: null });
                setShowDue(false);
              }}
            >
              <span className="kb-dropdown__item-check">
                {!filter.dueDate && <CheckIcon />}
              </span>
              Any Date
            </button>
            {DUE_OPTIONS.map((d) => (
              <button
                key={d.value}
                className={`kb-dropdown__item ${filter.dueDate === d.value ? "kb-dropdown__item--checked" : ""}`}
                onClick={() => {
                  onFilterChange({ dueDate: d.value as any });
                  setShowDue(false);
                }}
              >
                <span className="kb-dropdown__item-check">
                  {filter.dueDate === d.value && <CheckIcon />}
                </span>
                {d.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear all */}
      {hasFilter && (
        <button className="kb-filter-chip active-clear" onClick={onClear}>
          <IconX />
          Clear Filters
        </button>
      )}
    </div>
  );
};

const CheckIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
