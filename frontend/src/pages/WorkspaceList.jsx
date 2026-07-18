import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace } from "../redux/workspace/workspaceSlice";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { extractFieldErrors, getErrorMessage } from "../utils/errorHelper";
import toast from "react-hot-toast";

const WorkspaceSkeleton = () => (
  <div className="animate-pulse" style={{
    padding: 24,
    backgroundColor: "var(--color-surface-container-low)",
    border: "1px solid var(--color-outline-variant)",
    borderRadius: "8px",
    height: "108px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }}>
    <div style={{ height: 18, backgroundColor: "var(--color-surface-container-high)", borderRadius: 4, width: "60%" }}></div>
    <div style={{ height: 14, backgroundColor: "var(--color-surface-container-high)", borderRadius: 4, width: "40%" }}></div>
  </div>
);

export default function WorkspaceList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.workspaces);
  
  // Create state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [createErrors, setCreateErrors] = useState({});
  const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

  // Edit state
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
    <div style={{ padding: "40px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 className="text-display-md" style={{ color: "var(--color-on-surface)", margin: 0, fontWeight: 800 }}>Workspaces</h1>
          <p style={{ color: "var(--color-on-surface-variant)", margin: "4px 0 0 0", fontSize: 14 }}>Create and manage collaborative spaces for your projects.</p>
        </div>
        <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Workspace</Button>
      </div>

      {status === "loading" && items.length === 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        }}>
          <WorkspaceSkeleton />
          <WorkspaceSkeleton />
          <WorkspaceSkeleton />
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        }}>
          {items.map((ws) => (
            <div
              key={ws.id}
              onClick={() => navigate(`/workspaces/${ws.id}`)}
              style={{
                padding: 24,
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
              }}
              className="hover:shadow-md hover:border-gray-300"
            >
              <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px 0", color: "var(--color-on-surface)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ws.name}
                </h2>
                <p style={{ fontSize: 13, color: "var(--color-on-surface-variant)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ws.slug}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 4 }} className="flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleEditClick(ws, e)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    borderRadius: 4,
                    color: "var(--color-on-surface-variant)"
                  }}
                  className="hover:bg-slate-100 hover:text-orange-600"
                  title="Edit Workspace"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(ws, e)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    borderRadius: 4,
                    color: "var(--color-on-surface-variant)"
                  }}
                  className="hover:bg-red-50 hover:text-red-600"
                  title="Delete Workspace"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div style={{
              gridColumn: "1 / -1",
              padding: "48px 24px",
              textAlign: "center",
              border: "2px dashed var(--color-outline-variant)",
              borderRadius: 8,
              color: "var(--color-on-surface-variant)"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--color-outline)", marginBottom: 12 }}>folder_open</span>
              <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px 0" }}>No workspaces found</p>
              <p style={{ fontSize: 14, margin: "0 0 16px 0", color: "var(--color-on-surface-variant)" }}>Get started by creating your first workspace.</p>
              <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Workspace</Button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Workspace">
        <form onSubmit={handleCreate} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Workspace Name *</label>
            <input 
              required 
              placeholder="e.g. Engineering Team" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {createErrors.name && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{createErrors.name}</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Workspace Slug *</label>
            <input 
              required 
              placeholder="e.g. engineering-team" 
              value={slug} 
              onChange={e => setSlug(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {createErrors.slug && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{createErrors.slug}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingCreate}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingWorkspace} onClose={() => setEditingWorkspace(null)} title="Edit Workspace">
        <form onSubmit={handleUpdate} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Workspace Name *</label>
            <input 
              required 
              placeholder="e.g. Engineering Team" 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {editErrors.name && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{editErrors.name}</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Workspace Slug *</label>
            <input 
              required 
              placeholder="e.g. engineering-team" 
              value={editSlug} 
              onChange={e => setEditSlug(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {editErrors.slug && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{editErrors.slug}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button variant="outline" onClick={() => setEditingWorkspace(null)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingEdit}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
