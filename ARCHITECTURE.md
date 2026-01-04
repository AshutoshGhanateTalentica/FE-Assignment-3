**ARCHITECTURE**

**Chosen Architectural Pattern**:
- Container / Presentational pattern using React functional components with TypeScript.
- Global board state lives in a `BoardProvider` (Context) implemented with `useReducer` to centralize complex state transitions (ADD, DELETE, MOVE, SET_STATE).
- Side-effects and persistence handled by small, focused custom hooks (`useLocalStorage`, debounced writes).
- Small utilities and constants live in `utils/` and `constants.ts` to keep components pure and testable.

**Component Hierarchy (visual)**:

App (Container)
├─ Topbar (Presentational)
└─ BoardProvider (Container)
   └─ Board (Container)
      ├─ SearchBar (Presentational)
      ├─ ColumnWrapper* (layout)
      │  └─ Column (Container/Presentational)
      │     ├─ ColumnHeader
      │     ├─ AddTaskForm (present in To Do)
      │     └─ TaskList (Presentational, role=list)
      │        └─ TaskCard (Presentational with small pointer handlers)
      └─ ... (3 columns: To Do / In Progress / Done)

Notes:
- Presentational components receive data + callbacks via `useBoard()` to avoid deep prop drilling.
- `TaskCard` is intentionally small; pointer-drag logic is encapsulated locally and kept minimal.

**State Management Explanation**:
- Source-of-truth: single `BoardState` in `BoardProvider`.
- Suggested state shape (TypeScript):

  interface Task { id: string; title: string; column: 'todo'|'inprogress'|'done' }
  interface BoardState { tasks: Task[] }

- Use `useReducer` with typed actions: `ADD_TASK`, `DELETE_TASK`, `MOVE_TASK`, `SET_STATE`.
- Rationale for `useReducer`+Context:
  - Centralizes multi-step transitions (move + reorder) and makes them testable.
  - Keeps components simple (dispatch actions rather than mutating many local states).
  - Avoids an external state library which would be overkill for the assignment.
- Selectors / derived data (e.g., tasks per column, filtered lists) are computed in containers (Column) to keep derived logic out of render-heavy components when necessary.

**LocalStorage Persistence**:
- Hydrate on provider mount: read `LOCAL_STORAGE_KEY` and dispatch `SET_STATE` if valid.
- Persist on state change using a debounced write (150–300ms) via `useLocalStorage`/`useDebouncedEffect` to reduce frequent I/O.
- Store a simple schema version alongside data to enable safe migrations later.

**Drag-Drop Implementation Rationale**:
- Chosen approach: Hybrid — accessible Move Left/Right buttons as primary controls + custom Pointer-based drag enhancement for mouse and touch.

Why this choice:
- Accessibility: Buttons provide keyboard and screen-reader friendly controls guaranteeing functional parity for non-pointer users.
- Mobile support: Pointer Events (pointerdown/move/up) work consistently on touch and mouse; HTML5 DnD has poor/touch-inconsistent behavior on many mobile browsers.
- Control & UX: Custom pointer-based drag allows creating a visual ghost, fine-grained drop-target detection, and smoother animations without relying on external libraries.
- Complexity balance: Implementing pointer logic is more code than HTML5 DnD but is encapsulated in small handlers (or a `useDragDrop` hook) so the surface API of `TaskCard` remains small.
- Constraints compliance: No external drag-drop libraries required by the assignment; this approach uses only browser pointer APIs.

**Extensibility Notes**:
- New columns/statuses: add to `constants.COLUMNS` and UI will map automatically; reducer handles task column field generically.
- Undo/Redo: could be layered by storing previous states in the reducer (history stack) without changing external interfaces.
- Reordering within columns: add `position` fields to `Task` and extend reducer actions; UI updates minimal.

**Testing & Validation**:
- Unit-test reducer logic (add/move/delete) and `useLocalStorage` behavior.
- Manual integration: verify add/move/delete flows, persistence across reloads, keyboard-only interactions, and mobile drag behavior.

**Files of interest**:
- `src/context/BoardContext.tsx` — provider, reducer, persistence wiring
- `src/components/*` — UI components (Board, Column, TaskCard, AddTaskForm, SearchBar)
- `src/hooks/useLocalStorage.ts` — debounced persistence helper
- `src/constants.ts`, `src/types.ts` — canonical types and constants

---

This document summarizes the high-level architecture and reasoning for FlowBoard. Adjustments can be made before the final submission (e.g., adding ARIA live regions, keyboard reordering, or additional tests).
