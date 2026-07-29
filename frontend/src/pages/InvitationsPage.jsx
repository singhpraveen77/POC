import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchIncomingInvites } from '../redux/invite/workspaceInviteSlice.js'
import IncomingInviteCard from '../components/collaboration/IncomingInviteCard.jsx'
import OutgoingInviteCard from '../components/collaboration/OutgoingInviteCard.jsx'
import { TailSpin } from 'react-loader-spinner'
import Button from '../components/common/Button.jsx'
export default function InvitationsPage() {
  const dispatch = useDispatch()
  const { incoming, outgoing, status } = useSelector(state => state.workspaceInvites)
  const [activeTab, setActiveTab] = useState('incoming')
  useEffect(() => {
    dispatch(fetchIncomingInvites())
  }, [dispatch])
  const isLoading = status === 'loading' && incoming.length === 0 && outgoing.length === 0
  const isEmpty = incoming.length === 0 && outgoing.length === 0 && status !== 'loading'
  const tabCls = (tab) => [
    'px-5 py-2 rounded-md border-none cursor-pointer font-semibold text-[13px] transition-all duration-150',
    activeTab === tab
      ? 'text-[var(--color-btn-text)]'
      : 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
  ].join(' ')
  return (
    <div className="px-6 py-10 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-bold m-0 text-[var(--color-text)]">Invitations</h1>
        <Button variant="outline" size="sm" onClick={() => dispatch(fetchIncomingInvites())}>
          Refresh
        </Button>
      </div>
      {}
      <div className="flex gap-2 mb-6 p-1 rounded-lg w-fit bg-[var(--color-surface-low)] border border-[var(--color-border)]">
        {['incoming', 'outgoing'].map(tab => (
          <button key={tab} className={tabCls(tab)} onClick={() => setActiveTab(tab)}
                  style={activeTab === tab ? { backgroundColor: 'var(--color-btn)' } : {}}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'incoming' && incoming.length > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${activeTab === tab ? 'text-[var(--color-btn-text)]' : 'text-[var(--color-text)]'}`}>
                {incoming.length}
              </span>
            )}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="flex justify-center pt-12">
          <TailSpin color="var(--color-btn)" height={40} width={40} />
        </div>
      ) : isEmpty ? (
        <div className="py-12 px-6 text-center rounded-xl border-2 border-dashed border-[var(--color-border)]">
          <span className="material-symbols-outlined text-[48px] mb-3 block text-[var(--color-text-subtle)]">mail</span>
          <p className="text-[15px] font-semibold mt-0 mb-1 text-[var(--color-text-muted)]">No invitations found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeTab === 'incoming' && incoming.map(invite => (
            <IncomingInviteCard invite={invite} key={invite.id} />
          ))}
          {activeTab === 'outgoing' && outgoing.map(invite => (
            <OutgoingInviteCard invite={invite} workspaceId={invite.workspaceId} key={invite.id} />
          ))}
        </div>
      )}
    </div>
  )
}