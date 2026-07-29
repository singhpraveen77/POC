import { useDispatch } from 'react-redux'
import { cancelInvite } from '../../redux/invite/workspaceInviteSlice'
import RoleBadge from './RoleBadge'
import Button from '../common/Button'
export default function OutgoingInviteCard({ invite, workspaceId }) {
  const dispatch = useDispatch()
  return (
    <div className=" p-4 flex items-center gap-3 transition-colors bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[14px] mt-0 mb-0.5 m-0 text-[var(--color-text)]">
          {invite.invitedUser.name}
        </p>
        <p className="text-[12px] mt-0 mb-2 m-0 text-[var(--color-text-muted)]">
          @{invite.invitedUser.username}
        </p>
        <div className="flex items-center gap-2">
          <RoleBadge role={invite.role} />
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-high)] text-[var(--color-warning)]">
            {invite.status}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm"
              onClick={() => dispatch(cancelInvite({ workspaceId, inviteId: invite.id }))}>
        Cancel
      </Button>
    </div>
  )
}