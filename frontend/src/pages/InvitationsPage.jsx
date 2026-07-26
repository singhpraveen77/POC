import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIncomingInvites } from "../redux/invite/workspaceInviteSlice";
import IncomingInviteCard from "../components/collaboration/IncomingInviteCard";
import OutgoingInviteCard from "../components/collaboration/OutgoingInviteCard";
import { TailSpin } from "react-loader-spinner";
import Button from "../components/common/Button";

export default function InvitationsPage() {
  const dispatch = useDispatch();
  const { incoming, outgoing, status } = useSelector((state) => state.workspaceInvites);
  const [activeTab, setActiveTab] = useState("incoming");

  useEffect(() => {
    dispatch(fetchIncomingInvites());
  }, [dispatch]);

  const isLoading = status === "loading" && incoming.length === 0 && outgoing.length === 0;
  const isEmpty = incoming.length === 0 && outgoing.length === 0 && status !== "loading";

  return (
    <div className="px-6 py-10 max-w-[900px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-display-md text-[var(--color-on-surface)] m-0 font-extrabold">
          Invitations
        </h1>
        <Button variant="outline" size="sm" icon="refresh" onClick={() => dispatch(fetchIncomingInvites())}>
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          className={
            activeTab === "incoming"
              ? "px-5 py-2 rounded-md border-none cursor-pointer font-semibold text-sm bg-[#f97316] text-white"
              : "px-5 py-2 rounded-md border border-[var(--color-outline-variant)] cursor-pointer font-semibold text-sm bg-transparent text-[var(--color-on-surface-variant)]"
          }
          onClick={() => setActiveTab("incoming")}
        >
          Incoming
        </button>
        <button
          className={
            activeTab === "outgoing"
              ? "px-5 py-2 rounded-md border-none cursor-pointer font-semibold text-sm bg-[#f97316] text-white"
              : "px-5 py-2 rounded-md border border-[var(--color-outline-variant)] cursor-pointer font-semibold text-sm bg-transparent text-[var(--color-on-surface-variant)]"
          }
          onClick={() => setActiveTab("outgoing")}
        >
          Outgoing
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center pt-12">
          <TailSpin color="#f97316" height={40} width={40} />
        </div>
      ) : isEmpty ? (
        <div className="py-12 px-6 text-center border-2 border-dashed border-[var(--color-outline-variant)] rounded-lg text-[var(--color-on-surface-variant)]">
          <span
            className="material-symbols-outlined text-[48px] text-[var(--color-outline)] mb-3 block"
          >
            mail
          </span>
          <p className="text-base font-semibold mt-0 mb-1">No invitations found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeTab === "incoming" &&
            incoming.map((invite) => (
              <IncomingInviteCard invite={invite} key={invite.id} />
            ))}
          {activeTab === "outgoing" &&
            outgoing.map((invite) => (
              <OutgoingInviteCard invite={invite} workspaceId={invite.workspaceId} key={invite.id} />
            ))}
        </div>
      )}
    </div>
  );
}
