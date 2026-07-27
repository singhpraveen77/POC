import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProfileStats from "../components/Profile/ProfileStats";
import RecentWorkspaces from "../components/Profile/RecentWorkspaces";
import RecentBoards from "../components/Profile/RecentBoards";
import RecentTasks from "../components/Profile/RecentTasks";
import ProfileHeader from "../components/profile/ProfileHeader";
import { getProfile } from "../redux/profile/profileThunk";
import MainLoader from "../components/loader/MainLoader";
import { fetchIncomingInvites, acceptInvite, rejectInvite, cancelInvite } from "../redux/invite/workspaceInviteSlice";
import RoleBadge from "../components/collaboration/RoleBadge";
import Button from "../components/common/Button";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);
  const { incoming, outgoing } = useSelector((state) => state.workspaceInvites);
  const [activeInviteTab, setActiveInviteTab] = useState("incoming");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await dispatch(getProfile()).unwrap();
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIncomingInvites());
  }, [dispatch]);

  if (loading) return <MainLoader message="Loading Profile..." />;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>No profile found.</div>;

  return (
    <div className="flex-1 overflow-y-auto bg-[#f5f6fa] p-6">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
        <ProfileHeader user={profile.user} />
        <ProfileStats stats={profile.stats} />

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}>
          <RecentWorkspaces workspaces={profile.recentWorkspaces} />
          <RecentBoards boards={profile.recentBoards} />
        </div>

        <RecentTasks tasks={profile.recentTasks} />

        <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden">
          <div className="px-6 pt-5 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px]  m-0 text-[var(--color-on-surface)]">Invitations</h2>
              <Button variant="outline" size="sm" icon="refresh" onClick={() => dispatch(fetchIncomingInvites())}>
                Refresh
              </Button>
            </div>
            <div className="flex gap-0 border-b border-[var(--color-outline-variant)]">
              {["incoming", "outgoing"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveInviteTab(tab)}
                  className={[
                    "bg-transparent border-none cursor-pointer px-4 py-2 text-sm  capitalize transition-all duration-150 -mb-px",
                    activeInviteTab === tab
                      ? "text-[var(--color-primary)] border-b-2 "
                      : "text-[var(--color-on-surface-variant)] border-b-2 border-transparent"
                  ].join(" ")}
                >
                  {tab}
                  {tab === "incoming" && incoming.length > 0 && (
                    <span className="ml-1.5 text-[11px] font-bold bg-orange-500 text-white rounded-full px-1.5 py-0.5">
                      {incoming.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 flex flex-col gap-2.5">
            {activeInviteTab === "incoming" && (
              incoming.length === 0 ? (
                <p className="text-sm text-[var(--color-on-surface-variant)] text-center py-4">No incoming invitations</p>
              ) : (
                incoming.map((invite) => (
                  <div key={invite.id} className="flex items-center gap-3 px-4 py-3 border rounded-lg bg-[var(--color-surface-container-lowest)]">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm m-0 mb-0.5 text-[var(--color-on-surface)]">{invite.workspace?.name}</p>
                      <p className="text-xs m-0 text-[var(--color-on-surface-variant)]">Invited by {invite.invitedBy?.name}</p>
                    </div>
                    <RoleBadge role={invite.role} />
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="solid" size="sm" onClick={() => dispatch(acceptInvite(invite.id))}>Accept</Button>
                      <Button variant="outline" size="sm" onClick={() => dispatch(rejectInvite(invite.id))}>Decline</Button>
                    </div>
                  </div>
                ))
              )
            )}

            {activeInviteTab === "outgoing" && (
              outgoing.length === 0 ? (
                <p className="text-sm text-[var(--color-on-surface-variant)] text-center py-4">
                  To see invites you sent, open a workspace and visit its Members page.
                </p>
              ) : (
                outgoing.map((invite) => (
                  <div key={invite.id} className="flex items-center gap-3 px-4 py-3 border border-[var(--color-outline-variant)] rounded-lg bg-[var(--color-surface-container-lowest)]">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm m-0 mb-0.5 text-[var(--color-on-surface)]">{invite.invitedUser?.name}</p>
                      <p className="text-xs m-0 text-[var(--color-on-surface-variant)]">@{invite.invitedUser?.username}</p>
                    </div>
                    <RoleBadge role={invite.role} />
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-[#a16207]">{invite.status}</span>
                    <Button variant="outline" size="sm" onClick={() => dispatch(cancelInvite({ workspaceId: invite.workspaceId, inviteId: invite.id }))}>Cancel</Button>
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
