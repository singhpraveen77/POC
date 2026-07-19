import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardDetails, moveTaskOptimistically, rollbackMoveTask, clearMoveBackup } from '../../redux/board/boardSlice'
import { createColumn } from '../../redux/column/columnSlice'
import { createTask, updateTask, deleteTask } from '../../redux/task/taskSlice'
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

export default function KanbanBoard() {
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const { currentBoard, status } = useSelector(state => state.boards)
  
  const [activeId, setActiveId] = useState(null)
  
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [columnName, setColumnName] = useState("")
  const [columnErrors, setColumnErrors] = useState({})
  const [isSubmittingColumn, setIsSubmittingColumn] = useState(false)

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskColumnId, setTaskColumnId] = useState(null)
  const [taskErrors, setTaskErrors] = useState({})
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)

  const [editingTask, setEditingTask] = useState(null)
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [editTaskDescription, setEditTaskDescription] = useState("")
  const [editTaskStatus, setEditTaskStatus] = useState("")
  const [editTaskErrors, setEditTaskErrors] = useState({})
  const [isSubmittingEditTask, setIsSubmittingEditTask] = useState(false)

  useEffect(() => {
    dispatch(fetchBoardDetails(boardId))
  }, [boardId, dispatch])

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

      dispatch(updateTask({
        id: activeTask.id,
        data: { columnId: toColumnId }
      })).unwrap()
        .then(() => {
          dispatch(clearMoveBackup());
        })
        .catch((err) => {
          toast.error(err || "Failed to move task. Reverting.");
          dispatch(rollbackMoveTask());
        });
    }
  }

  const handleCreateColumn = (e) => {
    e.preventDefault()
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
    setTaskErrors({})
    setIsSubmittingTask(true)

    dispatch(createTask({ title: taskTitle, columnId: taskColumnId }))
      .unwrap()
      .then(() => {
        setIsTaskModalOpen(false)
        setTaskTitle("")
        setTaskColumnId(null)
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
      setEditTaskErrors({})
    }
  }

  const handleUpdateTask = (e) => {
    e.preventDefault()
    setEditTaskErrors({})
    setIsSubmittingEditTask(true)

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
        setIsSubmittingEditTask(false)
      })
  }

  const handleDeleteTask = () => {
    if (window.confirm(`Are you sure you want to delete the task "${editingTask.title}"?`)) {
      setIsSubmittingEditTask(true)
      dispatch(deleteTask(editingTask.id))
        .unwrap()
        .then(() => {
          setEditingTask(null)
        })
        .finally(() => {
          setIsSubmittingEditTask(false)
        })
    }
  }

  const activeTask = activeId ? currentBoard?.columns?.flatMap(c => c.tasks || []).find(t => t.id === activeId) : null

  if (status === 'loading' && !currentBoard) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
        <TailSpin height="50" width="50" color="var(--color-primary)" ariaLabel="loading" />
        <span style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Loading board details...</span>
      </div>
    )
  }

  if (!currentBoard) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 12 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--color-outline)' }}>error</span>
        <span style={{ fontSize: 15, color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>Board not found</span>
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
        <Button variant="solid" onClick={() => setIsColumnModalOpen(true)} icon="add">
          Add Column
        </Button>
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
                  className="mt-3 w-full text-xs font-semibold py-2.5 text-center text-orange-600 hover:bg-orange-50 border border-dashed border-orange-200 rounded-lg cursor-pointer transition-colors"
                >
                  + Add Task Card
                </button>
              </KanbanColumn>
            ))}
          </div>
        </div>

        <DragOverlay zIndex={100} dropAnimation={null}>
          {activeTask ? (
            <div className="w-[280px] shadow-2xl opacity-90 scale-[1.02] transform-none" style={{ touchAction: 'none' }}>
              <TaskCard task={activeTask} isDone={activeTask.status === 'DONE'} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Column creation modal */}
      <Modal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} title="New Column">
        <form onSubmit={handleCreateColumn} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Column Name *</label>
            <input 
              required 
              placeholder="e.g. In Progress" 
              value={columnName} 
              onChange={e => setColumnName(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {columnErrors.name && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{columnErrors.name}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button variant="outline" onClick={() => setIsColumnModalOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingColumn}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Task creation modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="New Task Card">
        <form onSubmit={handleCreateTask} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Task Title *</label>
            <input 
              required 
              placeholder="e.g. Implement Oauth login" 
              value={taskTitle} 
              onChange={e => setTaskTitle(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {taskErrors.title && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{taskErrors.title}</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)} type="button">Cancel</Button>
            <Button variant="solid" type="submit" loading={isSubmittingTask}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Task Edit / Detail Modal */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="Task Card Options">
        <form onSubmit={handleUpdateTask} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Title *</label>
            <input 
              required 
              placeholder="Task Title" 
              value={editTaskTitle} 
              onChange={e => setEditTaskTitle(e.target.value)} 
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none"
              }}
              className="focus:border-orange-500"
            />
            {editTaskErrors.title && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{editTaskErrors.title}</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Description</label>
            <textarea 
              placeholder="Task details and description..." 
              value={editTaskDescription} 
              onChange={e => setEditTaskDescription(e.target.value)}
              rows={4}
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
            {editTaskErrors.description && (
              <span style={{ fontSize: 12, color: "var(--color-error)", fontWeight: 500 }}>{editTaskErrors.description}</span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--color-on-surface)" }}>Task Segment / Column</label>
            <select
              value={editTaskStatus}
              onChange={e => setEditTaskStatus(e.target.value)}
              style={{
                padding: "10px 12px",
                border: "1px solid var(--color-outline)",
                borderRadius: 6,
                fontSize: 14,
                outline: "none",
                backgroundColor: "var(--color-surface)"
              }}
              className="focus:border-orange-500"
            >
              {currentBoard.columns?.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12 }}>
            <Button variant="danger" onClick={handleDeleteTask} type="button" loading={isSubmittingEditTask} icon="delete">
              Delete Task
            </Button>
            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="outline" onClick={() => setEditingTask(null)} type="button">Cancel</Button>
              <Button variant="solid" type="submit" loading={isSubmittingEditTask}>Save Changes</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  )
}