import { createContext, useCallback, useContext, useState } from 'react'
import mockTasks from '../data/mockTasks'

const VALID_STATUSES = ['todo', 'in-progress', 'review', 'done']

const TaskContext = createContext({
  tasks: [],
  addTask: () => {},
  updateTask: () => {},
  deleteTask: () => {},
  moveTask: () => {},
})

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(mockTasks)

  const addTask = useCallback((taskData) => {
    const status = VALID_STATUSES.includes(taskData.status) ? taskData.status : 'todo'
    const newTask = {
      description: '',
      labels: [],
      priority: 'low',
      dueDate: null,
      comments: 0,
      progress: null,
      assignee: { name: 'Unassigned', initials: 'UA' },
      ...taskData,
      status,
      id: crypto.randomUUID(),
    }
    setTasks(prev => [...prev, newTask])
  }, [])

  const updateTask = useCallback((id, changes) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...changes } : t))
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTask = useCallback((id, toStatus, toIndex) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id)
      if (!task) return prev
      const updated = { ...task, status: toStatus }
      const rest = prev.filter(t => t.id !== id)
      const sameColumn = rest.filter(t => t.status === toStatus)
      const otherColumns = rest.filter(t => t.status !== toStatus)
      const clampedIndex = Math.min(toIndex, sameColumn.length)
      sameColumn.splice(clampedIndex, 0, updated)
      return [...otherColumns, ...sameColumn]
    })
  }, [])

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  return useContext(TaskContext)
}
