import React from 'react'
import { ColumnId } from '../types'
import TaskCard from './TaskCard'
import { useBoard } from '../context/BoardContext'
import { COLUMNS } from '../constants'

export default function Column({ id, filter }: { id: ColumnId; filter?: string }) {
  const { state, dispatch } = useBoard()
  const col = COLUMNS.find(c => c.id === id)!

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (id) dispatch({ type: 'MOVE_TASK', payload: { id, to: col.id } })
  }

  const tasks = state.tasks
    .filter(t => t.column === id)
    .filter(t => (filter ? t.title.toLowerCase().includes(filter.toLowerCase()) : true))

  return (
    <section className="column" data-column={col.id} onDragOver={onDragOver} onDrop={onDrop} aria-label={col.title}>
      <header className="column-header">
        <h2>{col.title}</h2>
      </header>
      <div className="task-list" role="list">
        {tasks.length === 0 && <div className="empty">No tasks</div>}
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </section>
  )
}
