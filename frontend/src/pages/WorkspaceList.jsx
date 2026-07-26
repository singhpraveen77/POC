import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from "../redux/workspace/workspaceSlice";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { extractFieldErrors } from "../utils/errorHelper";
import toast from "react-hot-toast";
import { WorkspaceSkeleton } from "../components/loader/WorkspaceLoader";
import RoleBadge from "../components/collaboration/RoleBadge";
import { validateWorkspace, hasErrors } from "../utils/validators";



export default function WorkspaceList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.workspaces);
  const currentUser = useSelector((state) => state.auth.user);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [createErrors, setCreateErrors] = useState({});
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editErrors, setEditErrors] = useState({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchWorkspaces());
    }
  }, [status, dispatch]);

  const handleCreate = (e) => {
    e.preventDefault();
    const clientErrors = validateWorkspace({ name, slug });
    if (hasErrors(clientErrors)) { setCreateErrors(clientErrors); return; }
    setCreateErrors({});
    setIsSubmittingCreate(true);

    dispatch(createWorkspace({ name, slug }))
      .unwrap()
      .then(() => {
        setIsCreateOpen(false);
        setName("");
        setSlug("");
      })
      .catch((err) => {
        // Field-level errors
        const fields = extractFieldErrors(err);
        setCreateErrors(fields);
      })
      .finally(() => {
        setIsSubmittingCreate(false);
      });
  };

  const handleEditClick = (ws, e) => {
    e.stopPropagation();
    setEditingWorkspace(ws);
    setEditName(ws.name);
    setEditSlug(ws.slug);
    setEditErrors({});
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const clientErrors = validateWorkspace({ name: editName, slug: editSlug });
    if (hasErrors(clientErrors)) { setEditErrors(clientErrors); return; }
    setEditErrors({});
    setIsSubmittingEdit(true);

    dispatch(updateWorkspace({ id: editingWorkspace.id, data: { name: editName, slug: editSlug } }))
      .unwrap()
      .then(() => {
        setEditingWorkspace(null);
        setEditName("");
        setEditSlug("");
      })
      .catch((err) => {
        const fields = extractFieldErrors(err);
        setEditErrors(fields);
      })
      .finally(() => {
        setIsSubmittingEdit(false);
      });
  };

  const handleDeleteClick = (ws, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete workspace "${ws.name}"? All associated boards and tasks will be permanently removed.`)) {
      dispatch(deleteWorkspace(ws.id));
    }
  };

  return (
    <div className="px-6 py-10 max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display-md text-[var(--color-on-surface)] m-0 font-extrabold">Workspaces</h1>
          <p className="text-[var(--color-on-surface-variant)] mt-1 mb-0 text-sm">Create and manage collaborative spaces for your projects.</p>
        </div>
        <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Workspace</Button>
      </div>

      {status === "loading" && items.length === 0 ? (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          <WorkspaceSkeleton />
          <WorkspaceSkeleton />
          <WorkspaceSkeleton />
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {items.map((ws) => {
            const myMembership = ws.members?.find((m) => m.userId === currentUser?.id);
            const myRole = myMembership?.role;
            const canManage = myRole === "OWNER" || myRole === "ADMIN";

            return (
            <div
              key={ws.id}
              onClick={() => navigate(`/workspaces/${ws.id}`)}
              className="p-6 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg cursor-pointer flex justify-between items-start transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-gray-300"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-[17px] font-bold mt-0 mb-1 text-[var(--color-on-surface)] overflow-hidden text-ellipsis whitespace-nowrap">
                  {ws.name}
                </h2>
                <p className="text-[13px] text-[var(--color-on-surface-variant)] mt-0 mb-2 overflow-hidden text-ellipsis whitespace-nowrap">
                  {ws.slug}
                </p>
                {myRole && <RoleBadge role={myRole} />}
              </div>
              
              {canManage && (
              <div className="flex gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleEditClick(ws, e)}
                  className="border-none bg-transparent cursor-pointer p-1 flex rounded text-[var(--color-on-surface-variant)] hover:bg-slate-100 hover:text-orange-600"
                  title="Edit Workspace"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                {myRole === "OWNER" && (
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(ws, e)}
                  className="border-none bg-transparent cursor-pointer p-1 flex rounded text-[var(--color-on-surface-variant)] hover:bg-red-50 hover:text-red-600"
                  title="Delete Workspace"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
                )}
              </div>
              )}
            </div>
            );
          })}

          {items.length === 0 && (
            <div className="col-span-full py-12 px-6 text-center border-2 border-dashed border-[var(--color-outline-variant)] rounded-lg text-[var(--color-on-surface-variant)]">
              <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)] mb-3 block">folder_open</span>
              <p className="text-base font-semibold mt-0 mb-1">No workspaces found</p>
              <p className="text-sm mt-0 mb-4 text-[var(--color-on-surface-variant)]">Get started by creating your first workspace.</p>
              <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Workspace</Button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Workspace">
        <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Workspace Name *</label>
            <input 
              required 
              placeholder="e.g. Engineering Team" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none focus:border-orange-500"
            />
            {createErrors.name && (
              <span className="text-xs text-[var(--color-error)] font-medium">{createErrors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Workspace Slug *</label>
            <input 
              required 
              placeholder="e.g. engineering-team" 
              value={slug} 
              onChange={e => setSlug(e.target.value)}
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none focus:border-orange-500"
            />
            {createErrors.slug && (
              <span className="text-xs text-[var(--color-error)] font-medium">{createErrors.slug}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingCreate}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingWorkspace} onClose={() => setEditingWorkspace(null)} title="Edit Workspace">
        <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Workspace Name *</label>
            <input 
              required 
              placeholder="e.g. Engineering Team" 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none focus:border-orange-500"
            />
            {editErrors.name && (
              <span className="text-xs text-[var(--color-error)] font-medium">{editErrors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Workspace Slug *</label>
            <input 
              required 
              placeholder="e.g. engineering-team" 
              value={editSlug} 
              onChange={e => setEditSlug(e.target.value)}
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-sm outline-none focus:border-orange-500"
            />
            {editErrors.slug && (
              <span className="text-xs text-[var(--color-error)] font-medium">{editErrors.slug}</span>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="outline" onClick={() => setEditingWorkspace(null)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingEdit}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
