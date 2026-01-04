import React, { useState } from 'react'
import Column from './Column'
import { COLUMNS } from '../constants'
import AddTaskForm from './AddTaskForm'
import SearchBar from './SearchBar'

export default function Board() {
  const [query, setQuery] = useState('')

  return (
    <>
      <div className="desktop-search">
        <SearchBar value={query} onChange={setQuery} />
      </div>
      <main className="board">
        {COLUMNS.map((c) => (
          <div key={c.id} className="column-wrapper">
            {c.id === 'todo' && (
              <>
                <div className="mobile-search">
                  <SearchBar value={query} onChange={setQuery} />
                </div>
                <AddTaskForm />
              </>
            )}
            <Column id={c.id} filter={query} />
          </div>
        ))}
      </main>
    </>
  )
}
