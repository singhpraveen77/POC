import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards, createBoard, updateBoard, deleteBoard } from "../redux/board/boardSlice";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { extractFieldErrors } from "../utils/errorHelper";
import toast from "react-hot-toast";
import { BoardSkeleton } from "../components/loader/BoardLoader";



export default function BoardList() {
  const { workspaceId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.boards);
  
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

  const handleCreate = (e) => {
    e.preventDefault();
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
    <div style={{ padding: "40px 24px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 className="text-display-md" style={{ color: "var(--color-on-surface)", margin: 0, fontWeight: 800 }}>Boards</h1>
          <p style={{ color: "var(--color-on-surface-variant)", margin: "4px 0 0 0", fontSize: 14 }}>Manage your workflows, tasks, and column groupings.</p>
        </div>
        <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Board</Button>
      </div>

      {status === "loading" && items.length === 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        }}>
          <BoardSkeleton />
          <BoardSkeleton />
          <BoardSkeleton />
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20
        }}>
          {items.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/boards/${board.id}`)}
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
                  {board.name}
                </h2>
                <p style={{ fontSize: 13, color: "var(--color-on-surface-variant)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {board.description || "No description"}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 4 }} className="flex-shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleEditClick(board, e)}
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
                  title="Edit Board"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteClick(board, e)}
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
                  title="Delete Board"
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
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--color-outline)", marginBottom: 12 }}>view_week</span>
              <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px 0" }}>No boards found</p>
              <p style={{ fontSize: 14, margin: "0 0 16px 0", color: "var(--color-on-surface-variant)" }}>Get started by creating your first board inside this workspace.</p>
              <Button variant="solid" onClick={() => setIsCreateOpen(true)} icon="add">Create Board</Button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Board">
        <form onSubmit={handleCreate} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Board Name *</label>
            <input 
              required 
              placeholder="e.g. Sprint Backlog" 
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
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Description</label>
            <textarea 
              placeholder="e.g. Tracking sprint tasks and progress." 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none",
                resize: "vertical"
              }}
              className="focus:border-orange-500"
            />
            {createErrors.description && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{createErrors.description}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingCreate}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingBoard} onClose={() => setEditingBoard(null)} title="Edit Board">
        <form onSubmit={handleUpdate} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Board Name *</label>
            <input 
              required 
              placeholder="e.g. Sprint Backlog" 
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
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Description</label>
            <textarea 
              placeholder="e.g. Tracking sprint tasks and progress." 
              value={editDescription} 
              onChange={e => setEditDescription(e.target.value)}
              rows={3}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none",
                resize: "vertical"
              }}
              className="focus:border-orange-500"
            />
            {editErrors.description && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{editErrors.description}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button variant="outline" onClick={() => setEditingBoard(null)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingEdit}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
