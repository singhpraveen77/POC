import { useDispatch } from "react-redux";
import { cancelInvite } from "../../redux/invite/workspaceInviteSlice";
import RoleBadge from "./RoleBadge";
import Button from "../common/Button";

const STATUS_STYLES = {
  PENDING: { backgroundColor: "#fef9c3", color: "#a16207" },
};

export default function OutgoingInviteCard({ invite, workspaceId }) {
  const dispatch = useDispatch();
  const statusStyle = STATUS_STYLES[invite.status] ?? {};

  return (
    <div className="border border-[var(--color-outline-variant)] rounded-lg p-4 flex items-center gap-3 bg-[var(--color-surface)]">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[15px] mt-0 mb-0.5 text-[var(--color-on-surface)]">
          {invite.invitedUser.name}
        </p>
        <p className="text-[13px] mt-0 mb-2 text-[var(--color-on-surface-variant)]">
          @{invite.invitedUser.username}
        </p>
        <div className="flex items-center gap-2">
          <RoleBadge role={invite.role} />
          <span
            style={statusStyle}
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          >
            {invite.status}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => dispatch(cancelInvite({ workspaceId, inviteId: invite.id }))}
      >
        Cancel
      </Button>
    </div>
  );
}
