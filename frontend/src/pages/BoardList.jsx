import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards, createBoard, updateBoard, deleteBoard } from "../redux/board/boardSlice";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { extractFieldErrors } from "../utils/errorHelper";
import toast from "react-hot-toast";
import { BoardSkeleton } from "../components/loader/BoardLoader";
import { fetchMembers } from '../redux/member/workspaceMemberSlice'
import InviteMemberModal from '../components/collaboration/InviteMemberModal'
import { validateBoard, hasErrors } from '../utils/validators'



export default function BoardList() {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.boards);
  const { members } = useSelector((state) => state.workspaceMembers)
  const currentUser = useSelector((state) => state.auth.user)
  const currentUserRole = members.find((m) => m.userId === currentUser?.id)?.role
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createErrors, setCreateErrors] = useState({});
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  const [editingBoard, setEditingBoard] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editErrors, setEditErrors] = useState({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchBoards(workspaceId));
  }, [workspaceId, dispatch]);

  useEffect(() => {
    dispatch(fetchMembers(workspaceId))
  }, [workspaceId, dispatch])

  const handleRefresh = () => {
    dispatch(fetchBoards(workspaceId))
    dispatch(fetchMembers(workspaceId))
  }

  const handleCreate = (e) => {
    e.preventDefault();
    const clientErrors = validateBoard({ name });
    if (hasErrors(clientErrors)) { setCreateErrors(clientErrors); return; }
    setCreateErrors({});
    setIsSubmittingCreate(true);

    dispatch(createBoard({ name, description, workspaceId }))
      .unwrap()
      .then(() => {
        setIsCreateOpen(false);
        setName("");
        setDescription("");
      })
      .catch((err) => {
        const fields = extractFieldErrors(err);
        setCreateErrors(fields);
      })
      .finally(() => {
        setIsSubmittingCreate(false);
      });
  };

  const handleEditClick = (board, e) => {
    e.stopPropagation();
    setEditingBoard(board);
    setEditName(board.name);
    setEditDescription(board.description || "");
    setEditErrors({});
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const clientErrors = validateBoard({ name: editName });
    if (hasErrors(clientErrors)) { setEditErrors(clientErrors); return; }
    setEditErrors({});
    setIsSubmittingEdit(true);

    dispatch(updateBoard({ id: editingBoard.id, data: { name: editName, description: editDescription } }))
      .unwrap()
      .then(() => {
        setEditingBoard(null);
        setEditName("");
        setEditDescription("");
      })
      .catch((err) => {
        const fields = extractFieldErrors(err);
        setEditErrors(fields);
      })
      .finally(() => {
        setIsSubmittingEdit(false);
      });
  };

  const handleDeleteClick = (board, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete board "${board.name}"? All tasks and columns will be permanently removed.`)) {
      dispatch(deleteBoard(board.id));
    }
  };

  return (
    <div className="px-6 py-10 max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display-md text-[var(--color-on-surface)] m-0 font-extrabold">Boards</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-1 mb-0 text-sm">Manage your workflows, tasks, and column groupings.</p>
        </div>
        <div className="flex items-center gap-3">
          
          <Button variant="outline" size="sm" onClick={handleRefresh} icon="refresh">
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/workspaces/${workspaceId}/members`)} icon="group">
            Members
          </Button>
          {(currentUserRole === "OWNER" || currentUserRole === "ADMIN") && (
            <Button variant="outline" onClick={() => setIsInviteModalOpen(true)} icon="person_add">
              Invite
            </Button>
          )}
          <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Board</Button>
        </div>
      </div>

      {status === "loading" ? (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          <BoardSkeleton />
          <BoardSkeleton />
          <BoardSkeleton />
          <BoardSkeleton />
          <BoardSkeleton />
          <BoardSkeleton />
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {items.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/boards/${board.id}`)}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg cursor-pointer flex justify-between items-start transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-300"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-[17px] font-bold mt-0 mb-1.5 text-[var(--color-on-surface)] overflow-hidden text-ellipsis whitespace-nowrap">
                  {board.name}
                </h2>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                  {board.description || "No description"}
                </p>
              </div>

              {/* Action Buttons — only OWNER/ADMIN */}
              {(currentUserRole === "OWNER" || currentUserRole === "ADMIN") && (
              <div className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleEditClick(board, e)}
                  className="border-none bg-transparent cursor-pointer p-1 flex rounded text-[var(--color-on-surface-variant)] hover:bg-slate-100 hover:text-orange-600"
                  title="Edit Board"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(board, e)}
                  className="border-none bg-transparent cursor-pointer p-1 flex rounded text-[var(--color-on-surface-variant)] hover:bg-red-50 hover:text-red-600"
                  title="Delete Board"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-12 px-6 text-center border-2 border-dashed border-[var(--color-outline-variant)] rounded-lg text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)] mb-3 block">view_week</span>
              <p className="text-base font-semibold mt-0 mb-1">No boards found</p>
              <p className="text-sm mt-0 mb-4 text-[var(--color-on-surface-variant)]">Get started by creating your first board inside this workspace.</p>
              <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Board</Button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Board">
        <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Board Name *</label>
            <input 
              required 
              placeholder="e.g. Sprint Backlog" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none focus:border-orange-500"
            />
            {createErrors.name && (
              <span className="text-xs text-[var(--color-error)] font-medium">{createErrors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Description</label>
            <textarea 
              placeholder="e.g. Tracking sprint tasks and progress." 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none resize-y focus:border-orange-500"
            />
            {createErrors.description && (
              <span className="text-xs text-[var(--color-error)] font-medium">{createErrors.description}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingCreate}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingBoard} onClose={() => setEditingBoard(null)} title="Edit Board">
        <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Board Name *</label>
            <input 
              required 
              placeholder="e.g. Sprint Backlog" 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none focus:border-orange-500"
            />
            {editErrors.name && (
              <span className="text-xs text-[var(--color-error)] font-medium">{editErrors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Description</label>
            <textarea 
              placeholder="e.g. Tracking sprint tasks and progress." 
              value={editDescription} 
              onChange={e => setEditDescription(e.target.value)}
              rows={3}
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none resize-y focus:border-orange-500"
            />
            {editErrors.description && (
              <span className="text-xs text-[var(--color-error)] font-medium">{editErrors.description}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setEditingBoard(null)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingEdit}>Save Changes</Button>
          </div>
        </form>
      </Modal>

      <InviteMemberModal
        workspaceId={workspaceId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
