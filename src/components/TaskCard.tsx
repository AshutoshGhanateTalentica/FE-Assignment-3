import React from 'react'
import { Task, ColumnId } from '../types'
import { useBoard } from '../context/BoardContext'

export default function TaskCard({ task }: { task: Task }) {
  const { dispatch } = useBoard()
  const elRef = React.useRef<HTMLDivElement | null>(null)
  const currentColRef = React.useRef<HTMLElement | null>(null)
  const ghostRef = React.useRef<HTMLElement | null>(null)

  function onDelete() {
    dispatch({ type: 'DELETE_TASK', payload: { id: task.id } })
  }

  function move(to: ColumnId) {
    dispatch({ type: 'MOVE_TASK', payload: { id: task.id, to } })
  }

  // Pointer-based drag for touch/mouse (basic)
  function onPointerDown(e: React.PointerEvent) {
    // ignore non-primary buttons and interactions started on controls
    if (e.button && e.button !== 0) return
    if ((e.target as HTMLElement).closest('.task-controls')) return
    const el = elRef.current
    if (!el) return

    el.setPointerCapture?.(e.pointerId)

    const rect = el.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top

    // create ghost
    const ghost = el.cloneNode(true) as HTMLElement
    ghost.classList.add('drag-ghost')
    ghost.style.position = 'fixed'
    ghost.style.left = `${e.clientX - offsetX}px`
    ghost.style.top = `${e.clientY - offsetY}px`
    ghost.style.width = `${rect.width}px`
    ghost.style.pointerEvents = 'none'
    document.body.appendChild(ghost)
    ghostRef.current = ghost

    function onPointerMove(ev: PointerEvent) {
      if (!ghostRef.current) return
      ghostRef.current.style.left = `${ev.clientX - offsetX}px`
      ghostRef.current.style.top = `${ev.clientY - offsetY}px`

      // highlight column under pointer
      const target = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null
      const colEl = target?.closest?.('.column') as HTMLElement | null
      if (currentColRef.current && currentColRef.current !== colEl) {
        currentColRef.current.classList.remove('drag-over')
        currentColRef.current = null
      }
      if (colEl && colEl !== currentColRef.current) {
        colEl.classList.add('drag-over')
        currentColRef.current = colEl
      }
    }

    function onPointerUp(ev: PointerEvent) {
      // determine drop column
      const target = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement | null
      const colEl = target?.closest?.('.column') as HTMLElement | null
      if (colEl && colEl.dataset?.column) {
        const to = colEl.dataset.column as ColumnId
        dispatch({ type: 'MOVE_TASK', payload: { id: task.id, to } })
      }

      // cleanup
      if (ghostRef.current) {
        ghostRef.current.remove()
        ghostRef.current = null
      }
      if (currentColRef.current) {
        currentColRef.current.classList.remove('drag-over')
        currentColRef.current = null
      }
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      try { el.releasePointerCapture?.((e as any).pointerId) } catch {}
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  return (
    <div className="task-card" ref={elRef} onPointerDown={onPointerDown} role="listitem">
      <div className="task-title" title={task.title}>{task.title}</div>
      <div className="task-controls">
        <button aria-label="Move Left" onClick={() => move(task.column === 'inprogress' ? 'todo' : task.column === 'done' ? 'inprogress' : 'todo')}>◀</button>
        <button aria-label="Move Right" onClick={() => move(task.column === 'todo' ? 'inprogress' : task.column === 'inprogress' ? 'done' : 'done')}>▶</button>
        <button aria-label="Delete" onClick={onDelete}>✕</button>
      </div>
    </div>
  )
}
