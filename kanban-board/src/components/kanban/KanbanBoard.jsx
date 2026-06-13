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
      
      {/* Kanban canvas - Horizontal scroll layout for all screens */}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 h-full overflow-hidden">
          <div
            className="flex h-full overflow-x-auto scrollbar-thin px-2 sm:px-4 py-2 sm:py-4 gap-2 sm:gap-4"
            style={{
              maxHeight: '100%',
              // Ensure smooth scrolling
              scrollBehavior: 'smooth',
            }}
          >
            {/* Wrap columns in container that maintains column width */}
            <div className="flex gap-2 sm:gap-4 min-w-max">
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