import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { BoardState, Task, Action, ColumnId } from '../types'
import { LOCAL_STORAGE_KEY } from '../constants'
import { useDebouncedEffect } from '../hooks/useLocalStorage'

const initialState: BoardState = { tasks: [] }

function reducer(state: BoardState, action: Action): BoardState {
  switch (action.type) {
    case 'ADD_TASK': {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
      const newTask: Task = { id, title: action.payload.title, column: 'todo' }
      return { ...state, tasks: [newTask, ...state.tasks] }
    }
    case 'DELETE_TASK': {
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload.id) }
    }
    case 'MOVE_TASK': {
      const { id, to } = action.payload
      return { ...state, tasks: state.tasks.map(t => (t.id === id ? { ...t, column: to } : t)) }
    }
    case 'SET_STATE':
      return action.payload
    default:
      return state
  }
}

const BoardContext = createContext<{
  state: BoardState
  dispatch: React.Dispatch<Action>
} | null>(null)

export const BoardProvider: React.FC<{ children: React.ReactNode }>= ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as BoardState
        dispatch({ type: 'SET_STATE', payload: parsed })
      }
    } catch (e) {
      console.error('Failed to read localStorage', e)
    }
  }, [])

  // Persist with debounce
  useDebouncedEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.error('Failed to write localStorage', e)
    }
  }, [state], 200)

  return <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>
}

export function useBoard() {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be used within BoardProvider')
  return ctx
}
