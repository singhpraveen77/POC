import { useDispatch } from "react-redux";
import { acceptInvite, rejectInvite } from "../../redux/invite/workspaceInviteSlice";
import RoleBadge from "./RoleBadge";
import Button from "../common/Button";

export default function IncomingInviteCard({ invite }) {
  const dispatch = useDispatch();

  return (
    <div className="border border-[var(--color-outline-variant)] rounded-lg p-4 flex items-center gap-3 bg-[var(--color-surface)]">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[15px] mt-0 mb-0.5 text-[var(--color-on-surface)]">
          {invite.workspace.name}
        </p>
        <p className="text-[13px] mt-0 mb-1.5 text-[var(--color-on-surface-variant)]">
          Invited by {invite.invitedBy.name}
        </p>
        <RoleBadge role={invite.role} />
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button variant="solid" size="sm" onClick={() => dispatch(acceptInvite(invite.id))}>
          Accept
        </Button>
        <Button variant="outline" size="sm" onClick={() => dispatch(rejectInvite(invite.id))}>
          Decline
        </Button>
      </div>
    </div>
  );
}
