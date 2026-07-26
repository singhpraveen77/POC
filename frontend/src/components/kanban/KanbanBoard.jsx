import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardDetails, moveTaskOptimistically } from '../../redux/board/boardSlice'
import { createColumn } from '../../redux/column/columnSlice'
import { createTask, updateTask, deleteTask } from '../../redux/task/taskSlice'
import { fetchMembers } from '../../redux/member/workspaceMemberSlice'
import toast from 'react-hot-toast'
import { TailSpin } from 'react-loader-spinner'
import {
  DndContext, DragOverlay,
  MouseSensor, KeyboardSensor, TouchSensor,
  closestCorners, useSensor, useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { extractFieldErrors } from '../../utils/errorHelper'
import TaskOptionsLoader from '../loader/TaskOptionsLoader'
import { validateColumn, validateTask, hasErrors } from '../../utils/validators'

export default function KanbanBoard() {
  const moveTimers = useRef({});
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const { currentBoard, status } = useSelector(state => state.boards)
  const { members } = useSelector(state => state.workspaceMembers)
  const currentUser = useSelector(state => state.auth.user)
  const currentUserRole = members.find(m => m.userId === currentUser?.id)?.role
  
  const [activeId, setActiveId] = useState(null)
  
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [columnName, setColumnName] = useState("")
  const [columnErrors, setColumnErrors] = useState({})
  const [isSubmittingColumn, setIsSubmittingColumn] = useState(false)

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskColumnId, setTaskColumnId] = useState(null)
  const [taskAssigneeId, setTaskAssigneeId] = useState("")
  const [taskErrors, setTaskErrors] = useState({})
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)

  const [editingTask, setEditingTask] = useState(null)
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [editTaskDescription, setEditTaskDescription] = useState("")
  const [editTaskStatus, setEditTaskStatus] = useState("")
  const [editTaskAssigneeId, setEditTaskAssigneeId] = useState("")
  const [editTaskErrors, setEditTaskErrors] = useState({})
  const [isSavingEditTask, setIsSavingEditTask] = useState(false)
  const [isDeletingTask, setIsDeletingTask] = useState(false)
  const isTaskOptionsLoading = isSavingEditTask || isDeletingTask

  useEffect(() => {
    dispatch(fetchBoardDetails(boardId))
  }, [boardId, dispatch])

  const handleRefresh = () => {
    dispatch(fetchBoardDetails(boardId))
  }

  useEffect(() => {
    if (currentBoard?.workspaceId) {
      dispatch(fetchMembers(currentBoard.workspaceId))
    }
  }, [currentBoard?.workspaceId, dispatch])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = ({ active }) => {
    setActiveId(active.id)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    let activeTask = null;
    let fromColumnId = null;
    currentBoard?.columns.forEach(c => {
      const t = c.tasks?.find(x => x.id === active.id)
      if (t) {
        activeTask = t;
        fromColumnId = c.id;
      }
    })

    if (!activeTask) return;

    let toColumnId = over.id;
    const isOverTask = !currentBoard?.columns.find(c => c.id === over.id);
    if (isOverTask) {
      currentBoard?.columns.forEach(c => {
        if (c.tasks?.find(x => x.id === over.id)) {
          toColumnId = c.id;
        }
      });
    }

    if (!toColumnId) return;

      if (fromColumnId !== toColumnId) {
        dispatch(moveTaskOptimistically({ taskId: activeTask.id, fromColumnId, toColumnId }));

        const taskId = activeTask.id;

        // Cancel previous timer
        if (moveTimers.current[taskId]) {
            clearTimeout(moveTimers.current[taskId]);
        }

        // Schedule API — isDnd:true tells the reducer to skip column re-placement on success
        moveTimers.current[taskId] = setTimeout(() => {

        dispatch(
            updateTask({
                id: taskId,
                data: {
                    columnId: toColumnId,
                    isDnd: true,
                },
            })
        )
        .unwrap()
        .catch((err) => {
            toast.error(err || "Failed to move task");
            // Rollback is handled by updateTask.rejected in boardSlice
        });

        delete moveTimers.current[taskId];

        }, 2000);
    }
  }

  const handleCreateColumn = (e) => {
    e.preventDefault()
    const clientErrors = validateColumn({ name: columnName })
    if (hasErrors(clientErrors)) { setColumnErrors(clientErrors); return; }
    setColumnErrors({})
    setIsSubmittingColumn(true)

    dispatch(createColumn({ name: columnName, boardId }))
      .unwrap()
      .then(() => {
        setIsColumnModalOpen(false)
        setColumnName("")
      })
      .catch((err) => {
        const fields = extractFieldErrors(err)
        setColumnErrors(fields)
      })
      .finally(() => {
        setIsSubmittingColumn(false)
      })
  }

  const handleCreateTask = (e) => {
    e.preventDefault()
    const clientErrors = validateTask({ title: taskTitle })
    if (hasErrors(clientErrors)) { setTaskErrors(clientErrors); return; }
    setTaskErrors({})
    setIsSubmittingTask(true)

    dispatch(createTask({ title: taskTitle, columnId: taskColumnId, assigneeId: taskAssigneeId || undefined }))
      .unwrap()
      .then(() => {
        setIsTaskModalOpen(false)
        setTaskTitle("")
        setTaskColumnId(null)
        setTaskAssigneeId("")
      })
      .catch((err) => {
        const fields = extractFieldErrors(err)
        setTaskErrors(fields)
      })
      .finally(() => {
        setIsSubmittingTask(false)
      })
  }

  const handleCardClick = (taskId) => {
    const task = currentBoard?.columns?.flatMap(c => c.tasks || []).find(t => t.id === taskId)
    if (task) {
      setEditingTask(task)
      setEditTaskTitle(task.title)
      setEditTaskDescription(task.description || "")
      setEditTaskStatus(task.status || "TODO")
      setEditTaskAssigneeId(task.assigneeId || "")
      setEditTaskErrors({})
    }
  }

  const handleUpdateTask = (e) => {
    e.preventDefault()
    const clientErrors = validateTask({ title: editTaskTitle })
    if (hasErrors(clientErrors)) { setEditTaskErrors(clientErrors); return; }
    setEditTaskErrors({})
    setIsSavingEditTask(true)
    setIsDeletingTask(false)

    const targetStatus = editTaskStatus.toLowerCase().replace('_', '-');
    const targetColumn = currentBoard?.columns?.find(c => {
      const colName = c.name.toLowerCase().replace('_', '-');
      return colName === targetStatus || c.id === editTaskStatus;
    });
    
    const updateData = {
      title: editTaskTitle,
      description: editTaskDescription,
    };
    
    if (targetColumn) {
      updateData.columnId = targetColumn.id;
    }
    if (editTaskAssigneeId) {
      updateData.assigneeId = editTaskAssigneeId;
    }

    dispatch(updateTask({ id: editingTask.id, data: updateData }))
      .unwrap()
      .then(() => {
        setEditingTask(null)
      })
      .catch((err) => {
        const fields = extractFieldErrors(err)
        setEditTaskErrors(fields)
      })
      .finally(() => {
        setIsSavingEditTask(false)
      })
  }

  const handleDeleteTask = () => {
      setIsDeletingTask(true)
      setIsSavingEditTask(false)
      dispatch(deleteTask(editingTask.id))
        .unwrap()
        .then(() => {
          setEditingTask(null)
        })
        .finally(() => {
          setIsDeletingTask(false)
        })
    
  }

  const activeTask = activeId ? currentBoard?.columns?.flatMap(c => c.tasks || []).find(t => t.id === activeId) : null

  if (status === 'loading' && !currentBoard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <TailSpin height="50" width="50" color="var(--color-primary)" ariaLabel="loading" />
        <span className="text-[14px] text-[var(--color-on-surface-variant)] font-semibold">Loading board details...</span>
      </div>
    )
  }

  if (!currentBoard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <span className="material-symbols-outlined text-[48px] text-[var(--color-outline)]">error</span>
        <span className="text-[15px] text-[var(--color-on-surface-variant)] font-semibold">Board not found</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--color-background)] overflow-hidden">
      {/* Board Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl font-extrabold text-[var(--color-on-surface)] m-0">{currentBoard.name}</h1>
          <p className="text-[12.5px] text-[var(--color-on-surface-variant)] font-semibold">{currentBoard.columns?.length || 0} columns in board</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} icon="refresh" size="sm">
            Refresh
          </Button>
          {currentUserRole !== 'VIEWER' && (
            <Button variant="solid" onClick={() => setIsColumnModalOpen(true)} icon="add">
              Add Column
            </Button>
          )}
        </div>
      </div>

      {/* Board Columns Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="flex h-full overflow-x-auto scrollbar-thin px-4 py-5 gap-4" style={{ overscrollBehaviorX: 'contain' }}>
            {currentBoard.columns?.map(col => (
              <KanbanColumn
                key={col.id}
                columnId={col.id}
                title={col.name}
                tasks={col.tasks || []}
                activeId={activeId}
                onCardClick={handleCardClick}
              >
                <button
                  type="button"
                  onClick={() => { setTaskColumnId(col.id); setIsTaskModalOpen(true); }}
                  className={`mt-3 w-full text-xs font-semibold py-2.5 text-center text-orange-600 hover:bg-orange-50 border border-dashed border-orange-200 rounded-lg cursor-pointer transition-colors${currentUserRole === 'VIEWER' ? ' hidden' : ''}`}
                >
                  + Add Task Card
                </button>
              </KanbanColumn>
            ))}
          </div>
        </div>

        <DragOverlay zIndex={100} dropAnimation={null}>
          {activeTask ? (
            <div className="w-[280px] shadow-2xl opacity-90 scale-[1.02] transform-none touch-none">
              <TaskCard task={activeTask} isDone={activeTask.status === 'DONE'} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Column creation modal */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} title="New Column">
        <form onSubmit={handleCreateColumn} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Column Name *</label>
            <input 
              required 
              placeholder="e.g. In Progress" 
              value={columnName} 
              onChange={e => setColumnName(e.target.value)} 
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-[14px] outline-none focus:border-orange-500"
            />
            {columnErrors.name && (
              <span className="text-[12px] text-[var(--color-error)] font-medium">{columnErrors.name}</span>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsColumnModalOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingColumn}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Task creation modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="New Task Card">
        <form onSubmit={handleCreateTask} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Task Title *</label>
            <input 
              required 
              placeholder="e.g. Implement Oauth login" 
              value={taskTitle} 
              onChange={e => setTaskTitle(e.target.value)} 
              className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-[14px] outline-none focus:border-orange-500"
            />
            {taskErrors.title && (
              <span className="text-[12px] text-[var(--color-error)] font-medium">{taskErrors.title}</span>
            )}
          </div>

          {members.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Assignee</label>
              <select
                value={taskAssigneeId}
                onChange={e => setTaskAssigneeId(e.target.value)}
                className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-[14px] outline-none bg-[var(--color-surface)] focus:border-orange-500"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.userId} value={m.userId}>{m.user.name} (@{m.user.username})</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingTask}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Task Edit / Detail Modal */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Task Card Options">
        {isTaskOptionsLoading ? (
          <TaskOptionsLoader/>
        ) : (
          <form onSubmit={handleUpdateTask} className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Title *</label>
              <input 
                required 
                placeholder="Task Title" 
                value={editTaskTitle} 
                onChange={e => setEditTaskTitle(e.target.value)} 
                className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-[14px] outline-none focus:border-orange-500"
              />
              {editTaskErrors.title && (
                <span className="text-[12px] text-[var(--color-error)] font-medium">{editTaskErrors.title}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Description</label>
              <textarea 
                placeholder="Task details and description..." 
                value={editTaskDescription} 
                onChange={e => setEditTaskDescription(e.target.value)}
                rows={4}
                className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-[14px] outline-none resize-y focus:border-orange-500"
              />
              {editTaskErrors.description && (
                <span className="text-[12px] text-[var(--color-error)] font-medium">{editTaskErrors.description}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Task Segment / Column</label>
              <select
                value={editTaskStatus}
                onChange={e => setEditTaskStatus(e.target.value)}
                className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-[14px] outline-none bg-[var(--color-surface)] focus:border-orange-500"
              >
                {currentBoard.columns?.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>

            {members.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-[var(--color-on-surface)]">Assignee</label>
                <select
                  value={editTaskAssigneeId}
                  onChange={e => setEditTaskAssigneeId(e.target.value)}
                  className="px-3 py-2.5 border border-[var(--color-outline)] rounded-[6px] text-[14px] outline-none bg-[var(--color-surface)] focus:border-orange-500"
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.userId} value={m.userId}>{m.user.name} (@{m.user.username})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-between gap-3 mt-3">
              {(currentUserRole === 'OWNER' || currentUserRole === 'ADMIN') && (
              <Button variant="danger" onClick={handleDeleteTask} type="button" loading={isDeletingTask} icon="delete" disabled={isTaskOptionsLoading}>
                Delete Task
              </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button variant="outline" onClick={() => setEditingTask(null)} type="button" disabled={isTaskOptionsLoading}>Cancel</Button>
                {currentUserRole !== 'VIEWER' && (
                <Button variant="solid" type="submit" loading={isSavingEditTask} disabled={isTaskOptionsLoading}>Save Changes</Button>
                )}
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
