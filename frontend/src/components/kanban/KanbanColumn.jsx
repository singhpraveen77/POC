import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TailSpin } from 'react-loader-spinner'
import TaskCard from './TaskCard'
import { deleteColumn, updateColumn } from '../../redux/column/columnSlice'

export default function KanbanColumn({ columnId, title, tasks, onCardClick, activeId, children }) {
  const dispatch = useDispatch()
  const { setNodeRef, isOver } = useDroppable({ id: columnId })

  const [isHovered, setIsHovered] = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName]   = useState(title)
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function clickOutside(e) { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    if (menuOpen) document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [menuOpen])

  const handleRenameSubmit = () => {
    const trimmed = editName.trim()
    if (trimmed && trimmed !== title) {
      setIsRenaming(true)
      dispatch(updateColumn({ id: columnId, data: { name: trimmed } }))
        .unwrap().catch(() => {}).finally(() => { setIsRenaming(false); setIsEditing(false) })
      return
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    dispatch(deleteColumn(columnId)).unwrap().catch(() => {}).finally(() => { setIsDeleting(false); setMenuOpen(false) })
  }

  const isProcessing = isRenaming || isDeleting
  const menuItemBase = 'w-full px-3 py-2 text-left text-[12.5px] flex items-center gap-2 bg-transparent border-none cursor-pointer transition-colors hover:bg-[var(--color-hover)]'

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0  min-w-[25vw] h-fit min-h-[30vh] rounded-sm flex flex-col bg-[var(--color-column-bg)] border border-emerald-700 "
     
    >
      {}
      <div className="flex items-center justify-between px-3.5 py-3 shrink-0 ">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isEditing ? (
            <div className="relative flex-1">
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                     onBlur={handleRenameSubmit}
                     onKeyDown={e => { if (e.key === 'Enter') handleRenameSubmit(); if (e.key === 'Escape') setIsEditing(false) }}
                     autoFocus
                     className="text-[13px] font-semibold w-full px-2 py-0.5 rounded outline-none bg-[var(--color-surface)] border border-[var(--color-btn)] text-[var(--color-text)]" />
              {isRenaming && (
                <div className="absolute top-1/2 right-2 -translate-y-1/2">
                  <TailSpin height={13} width={13} color="#669DF1" ariaLabel="renaming" />
                </div>
              )}
            </div>
          ) : (
            <h3 onClick={() => setIsEditing(true)} title="Click to rename"
                className="text-[13px] font-semibold truncate cursor-pointer m-0 text-[var(--color-text)]">
              {title}
            </h3>
          )}
          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-surface-high)] text-[var(--color-text-muted)]">
            {tasks.length}
          </span>
        </div>

        {}
        <div className="relative shrink-0 ml-1" ref={menuRef}>
          <button type="button" disabled={isProcessing}
                  onClick={() => !isProcessing && setMenuOpen(!menuOpen)}
                  className="p-1 rounded bg-transparent border-none cursor-pointer text-[var(--color-text-subtle)] transition-colors">
            <span className="material-symbols-outlined text-[17px]">more_horiz</span>
          </button>
          {menuOpen && (
            <div className="absolute top-7 right-0 z-50 py-1 rounded-lg min-w-[130px] bg-[var(--color-surface-highest)] border border-[var(--color-border)] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              <button type="button" disabled={isProcessing} onClick={() => { if (!isProcessing) { setIsEditing(true); setMenuOpen(false) } }}
                      className={`${menuItemBase} text-[var(--color-text-muted)]`}>
                {isRenaming ? 'Renaming…' : 'Rename'}
              </button>
              <button type="button" disabled={isProcessing} onClick={handleDelete}
                      className={`${menuItemBase}`}>
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>

   
      {isOver && <div className="mx-3 mt-1 h-0.5 rounded-full shrink-0 bg-[var(--color-btn)] shadow-[0_0_8px_rgba(102,157,241,0.5)]" />}

      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-1 max-h-fit! h-[10vh] overflow-y-auto scrollbar-thin overflow-x-auto p-3 flex flex-col gap-2.5" style={{ minHeight: 80 }}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} isDone={title.toLowerCase() === 'done'} onClick={() => onCardClick(task.id)} />
          ))}
          <div className={`transition-opacity duration-150 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {children}
          </div>
        </div>
      </SortableContext>
    </div>
  )
}