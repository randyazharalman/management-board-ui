import React from "react";
import { Member } from "../../types";

interface MemberAvatarProps {
  member: Member;
  size?: "sm" | "md";
  showTooltip?: boolean;
}

export const MemberAvatar: React.FC<MemberAvatarProps> = ({
  member,
  size = "sm",
  showTooltip = false,
}) => {
  return (
    <div
      className={`kb-avatar ${size === "md" ? "kb-avatar--lg" : ""}`}
      style={{ background: member.color }}
      title={showTooltip ? member.name : undefined}
    >
      {member.avatar}
    </div>
  );
};

interface MemberAvatarGroupProps {
  memberIds: string[];
  members: Member[];
  max?: number;
}

export const MemberAvatarGroup: React.FC<MemberAvatarGroupProps> = ({
  memberIds,
  members,
  max = 3,
}) => {
  const assigned = memberIds
    .map((id) => members.find((m) => m.id === id))
    .filter(Boolean) as Member[];

  const visible = assigned.slice(0, max);
  const extra = assigned.length - max;

  return (
    <div className="kb-avatars">
      {extra > 0 && (
        <div className="kb-avatar" style={{ background: "#94a3b8" }}>
          +{extra}
        </div>
      )}
      {[...visible].reverse().map((m) => (
        <MemberAvatar key={m.id} member={m} showTooltip />
      ))}
    </div>
  );
};
