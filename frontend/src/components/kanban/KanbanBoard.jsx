import { useState } from 'react'
import {
  DndContext, DragOverlay,
  MouseSensor, KeyboardSensor, TouchSensor,
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
    // MouseSensor for desktop — 8px distance threshold prevents accidental drags on click
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    // TouchSensor for mobile — 250ms hold + 5px tolerance prevents conflict with page scroll
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
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
      <div className="flex-shrink-0 px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-bold text-[var(--color-on-surface)] m-0">Q3 Product Launch</h1>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]">4 columns · {tasks.length} tasks</p>
        </div>
        <button
          onClick={() => { setPresetStatus('todo'); setIsCreateModalOpen(true) }}
          className="btn btn-solid flex items-center gap-1.5 text-sm px-4 py-2"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban canvas */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 min-h-0 overflow-hidden">
          <div
            className="flex h-full overflow-x-auto scrollbar-thin px-3 sm:px-4 py-3 sm:py-4 gap-3 sm:gap-4"
            style={{
              overscrollBehaviorX: 'contain', // Prevents browser from taking over horizontal scroll during drag
              WebkitOverflowScrolling: 'touch', // Smooth inertia scroll on iOS
            }}
          >
            {/* Each column has a fixed width so they sit side-by-side at all screen sizes */}
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
            <div 
              className="w-[280px] shadow-2xl opacity-90 scale-[1.02] transform-none"
              style={{
                // Important for touch devices
                touchAction: 'none',
              }}
            >
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