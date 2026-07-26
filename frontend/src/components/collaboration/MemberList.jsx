import { useState } from "react";
import MemberCard from "./MemberCard";
import ChangeRoleModal from "./ChangeRoleModal";
import RemoveMemberModal from "./RemoveMemberModal";

export default function MemberList({ members, currentUserRole, workspaceId }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  function handleChangeRole(member) {
    setSelectedMember(member);
    setIsChangeRoleOpen(true);
  }

  function handleRemove(member) {
    setSelectedMember(member);
    setIsRemoveOpen(true);
  }

  return (
    <div>
      {members.map((member) => (
        <MemberCard
          key={member.userId}
          member={member}
          currentUserRole={currentUserRole}
          onChangeRole={handleChangeRole}
          onRemove={handleRemove}
        />
      ))}
      <ChangeRoleModal
        isOpen={isChangeRoleOpen}
        onClose={() => setIsChangeRoleOpen(false)}
        member={selectedMember}
        workspaceId={workspaceId}
      />
      <RemoveMemberModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        member={selectedMember}
        workspaceId={workspaceId}
      />
    </div>
  );
}
