export type ColumnId = 'todo' | 'inprogress' | 'done'

export interface Task {
  id: string
  title: string
  column: ColumnId
}

export interface BoardState {
  tasks: Task[]
}

export type Action =
  | { type: 'ADD_TASK'; payload: { title: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'MOVE_TASK'; payload: { id: string; to: ColumnId } }
  | { type: 'SET_STATE'; payload: BoardState }
