import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembers } from "../redux/member/workspaceMemberSlice";
import MemberList from "../components/collaboration/MemberList";
import { TailSpin } from "react-loader-spinner";

export default function WorkspaceMembersPage() {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const { members, status } = useSelector((state) => state.workspaceMembers);
  const currentUser = useSelector((state) => state.auth.user);

  const currentUserRole = members.find((m) => m.userId === currentUser?.id)?.role;

  useEffect(() => {
    dispatch(fetchMembers(workspaceId));
  }, [workspaceId, dispatch]);

  return (
    <div className="px-6 py-10 min-w-[900px] w- mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display-md text-[var(--color-on-surface)] m-0 font-extrabold">Members</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-1 mb-0 text-sm">{members.length} member(s) in this workspace</p>
        </div>
      </div>

      {status === "loading" && members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <TailSpin height={40} width={40} color="var(--color-primary)" ariaLabel="loading-members" />
          <span className="text-sm text-[var(--color-on-surface-variant)] font-semibold">Loading members...</span>
        </div>
      ) : (
        <MemberList members={members} currentUserRole={currentUserRole} workspaceId={workspaceId} />
      )}
    </div>
  );
}
