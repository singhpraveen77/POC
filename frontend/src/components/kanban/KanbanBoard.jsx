import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardDetails, moveTaskOptimistically, clearDndOperation } from '../../redux/board/boardSlice'
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
import BoardHeader from './BoardHeader'
import ColumnFormModal from './ColumnFormModal'
import TaskCreateModal from './TaskCreateModal'
import TaskEditModal from './TaskEditModal'
import { extractFieldErrors } from '../../utils/errorHelper'
import { validateColumn, validateTask, hasErrors } from '../../utils/validators'

export default function KanbanBoard() {
  const { boardId } = useParams()
  const dispatch = useDispatch()
  const { currentBoard, status } = useSelector(state => state.boards)
  const { members } = useSelector(state => state.workspaceMembers)
  const currentUser = useSelector(state => state.auth.user)
  const currentUserRole = members.find(m => m.userId === currentUser?.id)?.role

  const [activeId, setActiveId] = useState(null)

  // ── Column modal state ──
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [columnName, setColumnName] = useState('')
  const [columnErrors, setColumnErrors] = useState({})
  const [isSubmittingColumn, setIsSubmittingColumn] = useState(false)

  // ── Create task modal state ──
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskColumnId, setTaskColumnId] = useState(null)
  const [taskAssigneeId, setTaskAssigneeId] = useState('')
  const [taskErrors, setTaskErrors] = useState({})
  const [isSubmittingTask, setIsSubmittingTask] = useState(false)

  // ── Edit task modal state ──
  const [editingTask, setEditingTask] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editColumnId, setEditColumnId] = useState('')
  const [editAssigneeId, setEditAssigneeId] = useState('')
  const [editErrors, setEditErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    dispatch(fetchBoardDetails(boardId))
  }, [boardId, dispatch])

  useEffect(() => {
    if (currentBoard?.workspaceId) dispatch(fetchMembers(currentBoard.workspaceId))
  }, [currentBoard?.workspaceId, dispatch])

  // ── DnD ──
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = ({ active }) => setActiveId(active.id)

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (!over) return

    let activeTask = null, fromColumnId = null
    currentBoard?.columns.forEach(c => {
      const t = c.tasks?.find(x => x.id === active.id)
      if (t) { activeTask = t; fromColumnId = c.id }
    })
    if (!activeTask) return

    let toColumnId = over.id
    if (!currentBoard?.columns.find(c => c.id === over.id)) {
      currentBoard?.columns.forEach(c => {
        if (c.tasks?.find(x => x.id === over.id)) toColumnId = c.id
      })
    }
    if (!toColumnId || fromColumnId === toColumnId) return

    const operationId = `${activeTask.id}-${Date.now()}`
    dispatch(moveTaskOptimistically({ taskId: activeTask.id, fromColumnId, toColumnId, operationId }))

    dispatch(updateTask({ id: activeTask.id, data: { columnId: toColumnId, isDnd: true, operationId } }))
      .unwrap()
      .then(() => dispatch(clearDndOperation({ operationId })))
      .catch(err => { toast.error(err || 'Failed to move task'); dispatch(clearDndOperation({ operationId })) })
  }

  // ── Column CRUD ──
  const handleCreateColumn = (e) => {
    e.preventDefault()
    const errs = validateColumn({ name: columnName })
    if (hasErrors(errs)) { setColumnErrors(errs); return }
    setColumnErrors({})
    setIsSubmittingColumn(true)
    dispatch(createColumn({ name: columnName, boardId }))
      .unwrap()
      .then(() => { setIsColumnModalOpen(false); setColumnName('') })
      .catch(err => setColumnErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingColumn(false))
  }

  // ── Task create ──
  const handleCreateTask = (e) => {
    e.preventDefault()
    const errs = validateTask({ title: taskTitle })
    if (hasErrors(errs)) { setTaskErrors(errs); return }
    setTaskErrors({})
    setIsSubmittingTask(true)
    dispatch(createTask({ title: taskTitle, columnId: taskColumnId, assigneeId: taskAssigneeId || undefined }))
      .unwrap()
      .then(() => { setIsTaskModalOpen(false); setTaskTitle(''); setTaskColumnId(null); setTaskAssigneeId('') })
      .catch(err => setTaskErrors(extractFieldErrors(err)))
      .finally(() => setIsSubmittingTask(false))
  }

  // ── Task edit/delete ──
  const openEditTask = (taskId) => {
    const task = currentBoard?.columns?.flatMap(c => c.tasks || []).find(t => t.id === taskId)
    if (!task) return
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditColumnId(task.columnId || '')
    setEditAssigneeId(task.assigneeId || '')
    setEditErrors({})
  }

  const handleUpdateTask = (e) => {
    e.preventDefault()
    const errs = validateTask({ title: editTitle })
    if (hasErrors(errs)) { setEditErrors(errs); return }
    setEditErrors({})
    setIsSaving(true)

    const updateData = { title: editTitle, description: editDescription }
    if (editColumnId) updateData.columnId = editColumnId
    if (editAssigneeId) updateData.assigneeId = editAssigneeId

    dispatch(updateTask({ id: editingTask.id, data: updateData }))
      .unwrap()
      .then(() => setEditingTask(null))
      .catch(err => setEditErrors(extractFieldErrors(err)))
      .finally(() => setIsSaving(false))
  }

  const handleDeleteTask = () => {
    setIsDeleting(true)
    dispatch(deleteTask(editingTask.id))
      .unwrap()
      .then(() => setEditingTask(null))
      .finally(() => setIsDeleting(false))
  }

  const activeTask = activeId
    ? currentBoard?.columns?.flatMap(c => c.tasks || []).find(t => t.id === activeId)
    : null

  // ── Loading / error states ──
  if (status === 'loading' && !currentBoard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <TailSpin height="48" width="48" color="var(--color-btn)" ariaLabel="loading" />
        <span className="text-[14px] font-semibold text-[var(--color-text-muted)]">Loading board…</span>
      </div>
    )
  }

  if (!currentBoard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <span className="text-[15px] font-semibold text-[var(--color-text-muted)]">Board not found</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {}
      <BoardHeader
        board={currentBoard}
        currentUserRole={currentUserRole}
        onRefresh={() => dispatch(fetchBoardDetails(boardId))}
        onAddColumn={() => setIsColumnModalOpen(true)}
      />

      {}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="flex h-full overflow-x-auto scrollbar-thin px-4 py-5 gap-4"
               style={{ overscrollBehaviorX: 'contain' }}>
            {currentBoard.columns?.map(col => (
              <KanbanColumn
                key={col.id}
                columnId={col.id}
                title={col.name}
                tasks={col.tasks || []}
                activeId={activeId}
                onCardClick={openEditTask}
              >
                {currentUserRole !== 'VIEWER' && (
                  <button
                    type="button"
                    onClick={() => { setTaskColumnId(col.id); setIsTaskModalOpen(true) }}
                    className="mt-1 w-full text-[12px] font-semibold py-2 rounded-lg cursor-pointer transition-all duration-150 border-none text-[var(--color-text-muted)] hover:bg-[var(--color-hover)] hover:border-[var(--color-btn)] hover:text-[var(--color-btn)]"
                >
                  + Add Card
                </button>
                )}
              </KanbanColumn>
            ))}
          </div>
        </div>

        <DragOverlay zIndex={100} dropAnimation={null}>
          {activeTask ? (
            <div className="w-[280px] shadow-2xl opacity-5 scale-[1.02] touch-none">
              <TaskCard task={activeTask} isDone={activeTask.status === 'DONE'}  />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {}
      <ColumnFormModal
        isOpen={isColumnModalOpen}
        onClose={() => { setIsColumnModalOpen(false); setColumnName(''); setColumnErrors({}) }}
        columnName={columnName}
        onChange={setColumnName}
        onSubmit={handleCreateColumn}
        errors={columnErrors}
        isSubmitting={isSubmittingColumn}
      />

      <TaskCreateModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setTaskTitle(''); setTaskErrors({}) }}
        taskTitle={taskTitle}
        onTitleChange={setTaskTitle}
        taskAssigneeId={taskAssigneeId}
        onAssigneeChange={setTaskAssigneeId}
        members={members}
        onSubmit={handleCreateTask}
        errors={taskErrors}
        isSubmitting={isSubmittingTask}
      />

      <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        editingTask={editingTask}
        title={editTitle}
        onTitleChange={setEditTitle}
        description={editDescription}
        onDescriptionChange={setEditDescription}
        columnId={editColumnId}
        onColumnChange={setEditColumnId}
        assigneeId={editAssigneeId}
        onAssigneeChange={setEditAssigneeId}
        columns={currentBoard.columns}
        members={members}
        errors={editErrors}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onSave={handleUpdateTask}
        onDelete={handleDeleteTask}
        currentUserRole={currentUserRole}
      />
    </div>
  )
}