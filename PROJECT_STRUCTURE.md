Project structure for FlowBoard

Top-level files
- package.json: npm scripts and dependencies.
- vite.config.ts: Vite configuration for dev/build.
- tsconfig.json: TypeScript configuration.
- index.html: App entry HTML.
- README.md (to add): Setup and run instructions.
- ARCHITECTURE.md: High-level architecture and rationale.
- CHAT_HISTORY.md: Conversation and prompt history.

src/
- main.tsx: React entry; mounts `App`.
- App.tsx: Root container; wires `BoardProvider` and top-level UI (Topbar, theme toggle).
- index.css: Global styles, theme variables and responsive layout.

src/components/
- Board.tsx: Top-level board layout; holds `SearchBar` and renders columns.
- Column.tsx: Column component; header and task list region; handles drop targets.
- TaskCard.tsx: Task UI; move/delete controls and pointer-based drag handlers.
- AddTaskForm.tsx: Simple form to add a title-only task to To Do.
- SearchBar.tsx: Search input used on desktop and mobile placements.

src/context/
- BoardContext.tsx: `BoardProvider` that contains `useReducer` state, persistence (localStorage hydration and debounced writes), and `useBoard()` hook for consumers.

src/hooks/
- useLocalStorage.ts: Debounced persistence helper (useDebouncedEffect) and related helpers.

src/types.ts
- Shared TypeScript types (Task, BoardState, Action, ColumnId).

src/constants.ts
- App constants (localStorage key, column definitions).

public/ (optional)
- static assets, favicon, video placeholder for submission (if needed).

tests/ (optional)
- Unit tests for reducer and hooks (e.g., reducer.spec.ts).

Notes & conventions
- State: single source-of-truth in `BoardProvider`; components read via `useBoard()`.
- Styling: CSS variables and responsive rules in `index.css`; components use classNames for scoping.
- Drag & Drop: pointer-based handlers in `TaskCard` with `data-column` attributes on `.column` elements; Move buttons provide accessible fallback.
- Persistence: stored under the key defined in `src/constants.ts`; schema versioning recommended.

Where to look for common tasks
- Edit reducer/actions: `src/context/BoardContext.tsx`.
- Add a new component: place under `src/components/` and export from `App` or `Board` as appropriate.
- Change styles/theme: `src/index.css` and `:root` variables.

Run the app
1. `npm install`
2. `npm run start`

This file is a quick map to help reviewers and contributors find the main pieces of FlowBoard.