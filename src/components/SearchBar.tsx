import React from 'react'

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="search-bar">
      <input
        aria-label="Search tasks"
        placeholder="Search tasks"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
