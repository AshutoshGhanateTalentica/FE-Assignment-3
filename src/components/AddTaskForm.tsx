import React, { useState } from 'react'
import { useBoard } from '../context/BoardContext'

export default function AddTaskForm() {
  const [title, setTitle] = useState('')
  const { dispatch } = useBoard()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    dispatch({ type: 'ADD_TASK', payload: { title: t } })
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="add-form">
      <input
        aria-label="New task title"
        placeholder="Add task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={200}
      />
      <button type="submit" aria-label="Add task">Add</button>
    </form>
  )
}
