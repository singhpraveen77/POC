import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIncomingInvites, acceptInvite, rejectInvite, cancelInvite } from '../../redux/invite/workspaceInviteSlice.js'
import RoleBadge from '../collaboration/RoleBadge.jsx'
import Button from '../common/Button.jsx'
export default function InvitationsPanel() {
  const dispatch = useDispatch()
  const { incoming, outgoing } = useSelector(state => state.workspaceInvites)
  const [activeTab, setActiveTab] = useState('incoming')
  const tabCls = (tab) =>
    `bg-transparent border-none cursor-pointer px-4 py-2 text-[13px] font-semibold capitalize transition-all duration-150 -mb-px border-b-2 ${activeTab === tab ? 'border-[var(--color-btn)] text-[var(--color-btn)]' : 'border-transparent text-[var(--color-text-muted)]'}`
  const inviteRow = 'flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)]'
  return (
    <div className="overflow-hidden bg-[var(--color-surface-low)] border border-[var(--color-border)]">
      <div className="px-6 pt-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-semibold m-0 text-[var(--color-text)]">Invitations</h2>
          <Button variant="outline" size="sm"  onClick={() => dispatch(fetchIncomingInvites())}>Refresh</Button>
        </div>
        <div className="flex gap-0 border-b border-[var(--color-border)]">
          {['incoming', 'outgoing'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={tabCls(tab)}>
              {tab}
              {tab === 'incoming' && incoming.length > 0 && (
                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-btn)] text-[var(--color-btn-text)]">
                  {incoming.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-2.5">
        {activeTab === 'incoming' && (
          incoming.length === 0
            ? <p className="text-sm text-center py-4 m-0 text-[var(--color-text-muted)]">No incoming invitations</p>
            : incoming.map(invite => (
              <div key={invite.id} className={inviteRow}>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm m-0 mb-0.5 text-[var(--color-text)]">{invite.workspace?.name}</p>
                  <p className="text-xs m-0 text-[var(--color-text-muted)]">Invited by {invite.invitedBy?.name}</p>
                </div>
                <RoleBadge role={invite.role} />
                <div className="flex gap-2 shrink-0">
                  <Button variant="solid" size="sm" onClick={() => dispatch(acceptInvite(invite.id))}>Accept</Button>
                  <Button variant="outline" size="sm" onClick={() => dispatch(rejectInvite(invite.id))}>Decline</Button>
                </div>
              </div>
            ))
        )}
        {activeTab === 'outgoing' && (
          outgoing.length === 0
            ? <p className="text-sm text-center py-4 m-0 text-[var(--color-text-muted)]">To see invites you sent, open a workspace and visit its Members page.</p>
            : outgoing.map(invite => (
              <div key={invite.id} className={inviteRow}>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm m-0 mb-0.5 text-[var(--color-text)]">{invite.invitedUser?.name}</p>
                  <p className="text-xs m-0 text-[var(--color-text-muted)]">@{invite.invitedUser?.username}</p>
                </div>
                <RoleBadge role={invite.role} />
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-high)] text-[var(--color-warning)]">
                  {invite.status}
                </span>
                <Button variant="outline" size="sm" onClick={() => dispatch(cancelInvite({ workspaceId: invite.workspaceId, inviteId: invite.id }))}>Cancel</Button>
              </div>
            ))
        )}
      </div>
    </div>
  )
}