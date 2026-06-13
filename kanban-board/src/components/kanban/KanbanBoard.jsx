import { useState } from 'react'
import {
  DndContext, DragOverlay,
  PointerSensor, KeyboardSensor, TouchSensor,
  closestCorners, useSensor, useSensors,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useTask } from '../../context/TaskContext'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'
import TaskDetailsDrawer from './TaskDetailsDrawer'
import CreateTaskModal from './CreateTaskModal'
import Avatar from '../common/Avatar'
import Button from '../common/Button'

const COLUMNS = [
  { id: 'todo', title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
]
const COLUMN_IDS = COLUMNS.map(c => c.id)
const MOCK_MEMBERS = [{ name: 'Alex Rivera' }, { name: 'Sam Chen' }, { name: 'Maria Lopez' }]

function getColumnId(overId, tasks) {
  if (!overId) return null
  if (COLUMN_IDS.includes(overId)) return overId
  return tasks.find(t => t.id === overId)?.status ?? null
}

export default function KanbanBoard() {
  const { tasks, moveTask } = useTask()
  const [activeId, setActiveId] = useState(null)
  const [drawerTaskId, setDrawerTaskId] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [presetStatus, setPresetStatus] = useState('todo')
  const [announcement, setAnnouncement] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 10 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

  function handleDragStart({ active }) {
    setActiveId(active.id)
    const t = tasks.find(t => t.id === active.id)
    if (t) setAnnouncement(`Picked up: ${t.title}`)
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null)
    setAnnouncement('')
    if (!over) return
    const toStatus = getColumnId(over.id, tasks)
    if (!toStatus) return
    const colTasks = tasks.filter(t => t.status === toStatus && t.id !== active.id)
    let toIndex = colTasks.length
    if (!COLUMN_IDS.includes(over.id)) {
      const idx = colTasks.findIndex(t => t.id === over.id)
      if (idx >= 0) toIndex = idx
    }
    moveTask(active.id, toStatus, toIndex)
  }

  return (
    /* This div must fill the flex column from Layout */
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--color-background)] overflow-hidden">
      <div aria-live="assertive" aria-atomic="true" style={{ position: 'absolute', left: -9999 }}>{announcement}</div>

      {/* Board header */}
      <div className="flex-shrink-0 px-5 py-3 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] flex items-center justify-between gap-3 flex-wrap">
        {/* Left: title + meta */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--color-on-surface)] m-0">
              Q3 Product Launch
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] uppercase tracking-wider">Public</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-sm text-[var(--color-on-surface-variant)]">
            <div className="flex -space-x-1.5 overflow-hidden">
              {MOCK_MEMBERS.map((m) => (
                <div key={m.name} className="inline-block ring-2 ring-[var(--color-surface)] rounded-full">
                  <Avatar name={m.name} size="xs" />
                </div>
              ))}
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-surface-container-highest)] ring-2 ring-[var(--color-surface)] text-[10px] font-bold">+2</div>
            </div>
            <span className="text-[var(--color-outline)]">·</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>14 days left</span>
            </div>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="hidden sm:flex btn btn-outline btn-sm items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">filter_list</span>
            <span>Filter</span>
          </button>
          <button
            onClick={() => { setPresetStatus('todo'); setIsCreateModalOpen(true) }}
            className="btn btn-solid btn-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Kanban canvas */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 h-full overflow-hidden">
          <div
            className="grid grid-cols-2 grid-rows-2 md:grid-cols-none md:grid-rows-none md:grid-flow-col md:auto-cols-[300px] gap-2 md:gap-4 p-2 md:p-4 h-full overflow-hidden md:overflow-x-auto scrollbar-thin"
            style={{
              maxHeight: '100%',
            }}
          >
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                columnId={col.id}
                title={col.title}
                tasks={tasks.filter(t => t.status === col.id)}
                activeId={activeId}
                onCardClick={id => setDrawerTaskId(id)}
              />
            ))}
          </div>
        </div>

        <DragOverlay zIndex={100} dropAnimation={null}>
          {activeTask ? (
            <div className="w-[280px] shadow-2xl opacity-90 scale-[1.02] transform-none">
              <TaskCard task={activeTask} isDone={activeTask.status === 'done'} onClick={() => { }} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailsDrawer taskId={drawerTaskId} onClose={() => setDrawerTaskId(null)} />
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} presetStatus={presetStatus} />
    </div>
  )
}

