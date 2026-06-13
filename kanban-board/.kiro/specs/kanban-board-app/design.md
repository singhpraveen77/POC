# ZenFlow Kanban Board — Design Document

## Overview

ZenFlow is a client-side SaaS Kanban application built on **Vite 8 + React 19 + Tailwind CSS v4**. There is no backend: all state is held in React Context, seeded from static mock data, and persisted only to `localStorage` (for theme preference). The application runs entirely in the browser.

The primary user-facing feature is a drag-and-drop Kanban board with four fixed workflow columns (Todo → In Progress → Review → Done). Supporting pages include a Dashboard home, a Settings page, and mock authentication (Login / Signup) with protected routing.

The visual language is the **Kinetic Enterprise** design system — a Material Design 3-inspired token set built with Tailwind v4's `@theme {}` block, Inter font, and Material Symbols Outlined icons.

### Key Libraries to Install

```
npm install react-router-dom@6
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

Tailwind v4 is already wired via `@tailwindcss/vite` in `vite.config.js` — no `tailwind.config.js` is needed.

---

## Architecture

### High-Level Component Tree

```
<html class="dark?">
  └─ ThemeContext.Provider
       └─ AuthContext.Provider
            └─ TaskContext.Provider
                 └─ BrowserRouter
                      ├─ /login          → <LoginPage>
                      ├─ /signup         → <SignupPage>
                      └─ <ProtectedRoute>
                           └─ <Layout>           (Sidebar + Navbar + Outlet)
                                ├─ /             → <Dashboard>
                                ├─ /boards       → <KanbanBoard>
                                ├─ /analytics    → placeholder
                                ├─ /activity     → placeholder
                                └─ /settings     → <Settings>
```

Provider nesting order is intentional:
- `ThemeContext` is outermost because the `dark` class needs to be applied to `<html>` before any component renders, and it has no dependencies.
- `AuthContext` comes next because `TaskContext` could potentially filter data per user in the future.
- `TaskContext` is innermost of the three so it is always inside both theme and auth.
- The Router is inside all three providers so route-level components can freely access all contexts.

### Data Flow

```
mockTasks.js ──► TaskContext (tasks, addTask, updateTask, deleteTask, moveTask)
                      │
                      ├──► KanbanBoard ──► KanbanColumn ──► TaskCard
                      ├──► Dashboard (stat aggregation)
                      └──► CreateTaskModal / TaskDetailsDrawer

localStorage("theme") ──► ThemeContext (theme, toggleTheme)
                                │
                                └──► html.classList / Navbar / Settings

MockUser ──► AuthContext (user, login, logout, signup)
                  │
                  ├──► ProtectedRoute (redirect guard)
                  ├──► Navbar (avatar)
                  ├──► Dashboard (greeting)
                  └──► Settings (Profile tab)
```

### State Colocation Strategy

| State | Location | Rationale |
|---|---|---|
| `tasks[]` | `TaskContext` | Shared by Board, Dashboard, CreateTaskModal, TaskDetailsDrawer |
| `theme` | `ThemeContext` | Shared by Navbar, Settings, LoginPage, SignupPage, `<html>` element |
| `user` | `AuthContext` | Shared by ProtectedRoute, Navbar, Dashboard, Settings, Sidebar (logout) |
| `isModalOpen` | `KanbanBoard` (local) | CreateTaskModal is only opened from Board header / Sidebar |
| `activeTask` | `KanbanBoard` (local) | Which task's drawer is open — board-local concern |
| `sidebarOpen` | `Layout` (local) | Mobile drawer state — layout-local concern |
| Form state | Each form component (local) | Login, Signup, CreateTaskModal, Settings each own their fields |
| `activeId` (DnD) | `KanbanBoard` (local) | Drag overlay state is board-local |

---

## Components and Interfaces

### Common Components (`src/components/common/`)

#### `Button.jsx`

Reusable button with three variants. Used in: LoginPage, SignupPage, CreateTaskModal, TaskDetailsDrawer, Dashboard, Settings, Sidebar.

```jsx
Button.propTypes = {
  variant:   PropTypes.oneOf(['solid', 'outline', 'ghost']),  // default: 'solid'
  size:      PropTypes.oneOf(['sm', 'md', 'lg']),              // default: 'md'
  icon:      PropTypes.string,   // Material Symbol name, rendered before children
  iconAfter: PropTypes.string,   // Material Symbol name, rendered after children
  disabled:  PropTypes.bool,
  type:      PropTypes.oneOf(['button', 'submit', 'reset']),   // default: 'button'
  onClick:   PropTypes.func,
  className: PropTypes.string,   // escape hatch for layout overrides
  children:  PropTypes.node,
}
```

**Variant styles:**
- `solid`: `bg-primary text-on-primary hover:bg-primary-container` — high emphasis
- `outline`: `border border-outline text-on-surface hover:bg-surface-container` — secondary
- `ghost`: `text-on-surface-variant hover:bg-surface-container` — toolbar / sidebar items

**Size styles:**
- `sm`: `h-7 px-3 text-label-sm`
- `md`: `h-9 px-4 text-label-md`
- `lg`: `h-11 px-6 text-body-lg`

#### `Input.jsx`

Labeled input with optional icon prefix and error state. Height 40px. Used in: LoginPage, SignupPage, CreateTaskModal, TaskDetailsDrawer, Settings, Navbar (search variant).

```jsx
Input.propTypes = {
  id:          PropTypes.string.isRequired,
  label:       PropTypes.string,             // shown above input; omit for search
  icon:        PropTypes.string,             // Material Symbol name prefix
  type:        PropTypes.string,             // default: 'text'
  placeholder: PropTypes.string,
  value:       PropTypes.string.isRequired,
  onChange:    PropTypes.func.isRequired,
  onBlur:      PropTypes.func,
  error:       PropTypes.string,             // if truthy, renders below input in error color
  disabled:    PropTypes.bool,
  className:   PropTypes.string,
  autoFocus:   PropTypes.bool,
}
```

**Focus state:** 2px ring in `primary` color (`ring-2 ring-primary`). Error state: `border-error text-error` with error message as `<p role="alert">`.

#### `Modal.jsx`

Generic modal shell: backdrop, centered container, focus trap, Escape-to-close. Used as the wrapper for `CreateTaskModal`.

```jsx
Modal.propTypes = {
  isOpen:    PropTypes.bool.isRequired,
  onClose:   PropTypes.func.isRequired,   // called on backdrop click or Escape
  title:     PropTypes.string,            // rendered in modal header if provided
  children:  PropTypes.node.isRequired,
  className: PropTypes.string,            // overrides for container width/padding
}
```

**Behavior:**
- Rendered via `ReactDOM.createPortal` into `document.body`.
- Backdrop: `fixed inset-0 bg-black/50 backdrop-blur-sm z-50`.
- Container: `bg-surface-container-lowest rounded-lg shadow-xl` positioned at viewport center.
- Focus trap: on mount, focus first focusable child; Tab/Shift+Tab cycle within the modal; Escape calls `onClose`.
- `aria-modal="true"`, `role="dialog"`, `aria-labelledby` pointing at title element.

#### `Avatar.jsx`

Circular avatar — image or initials fallback. Size 32px by default. Used in: TaskCard, Navbar, TaskDetailsDrawer.

```jsx
Avatar.propTypes = {
  src:       PropTypes.string,   // image URL; if null/undefined, show initials
  name:      PropTypes.string.isRequired, // used to derive initials and alt text
  size:      PropTypes.oneOf(['sm', 'md', 'lg']), // sm=24px, md=32px, lg=40px
  className: PropTypes.string,
}
```

**Initials derivation:** Split `name` by spaces, take the first character of the first and last word (up to 2 characters). Background color is deterministically derived from the name's char code sum modulo a palette of 6 brand-safe colors.

#### `Badge.jsx`

Priority/label badge with variant colors. Used in: TaskCard, CreateTaskModal, TaskDetailsDrawer.

```jsx
Badge.propTypes = {
  label:     PropTypes.string.isRequired,
  variant:   PropTypes.oneOf(['urgent', 'high', 'medium', 'low', 'default']),
  removable: PropTypes.bool,     // shows × button; used in CreateTaskModal chip list
  onRemove:  PropTypes.func,     // called when × is clicked
}
```

**Variant color map:**
- `urgent`: `bg-error-container text-on-error-container`
- `high`: `bg-tertiary-container text-on-tertiary-container`
- `medium`: `bg-secondary-fixed text-on-secondary-fixed-variant`
- `low`: `bg-surface-container text-on-surface-variant`
- `default`: `bg-surface-container text-on-surface-variant`

---

### Layout Components (`src/components/layout/`)

#### `Navbar.jsx`

Fixed top bar, 64px tall. Consumes `ThemeContext`, `AuthContext`. Used in: `Layout`.

```jsx
// No external props — reads contexts internally
// Internal responsibilities:
// - ZenFlow logo/brand text (primary color, headline-md)
// - Search input (visible ≥ sm breakpoint) — local state for search string
// - Notifications icon button with red badge dot
// - Avatar (AuthContext user)
// - Theme toggle button (calls toggleTheme)
// - Mobile hamburger menu button (visible < md breakpoint, calls onMenuToggle)

Navbar.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,  // called when hamburger is clicked
}
```

#### `Sidebar.jsx`

Fixed left nav, 260px wide. Consumes `AuthContext`, reads `TaskContext` to pass `addTask` pre-set to modal. Uses `NavLink` from React Router for active link detection.

```jsx
Sidebar.propTypes = {
  isOpen:   PropTypes.bool.isRequired,   // controls mobile overlay visibility
  onClose:  PropTypes.func.isRequired,   // called when mobile backdrop is clicked
  onCreateTask: PropTypes.func.isRequired, // opens CreateTaskModal
}
```

**Nav links:**
```js
const NAV_LINKS = [
  { label: 'Dashboard',  icon: 'dashboard',    path: '/' },
  { label: 'Boards',     icon: 'view_kanban',  path: '/boards' },
  { label: 'Analytics',  icon: 'analytics',    path: '/analytics' },
  { label: 'Activity',   icon: 'history',      path: '/activity' },
  { label: 'Settings',   icon: 'settings',     path: '/settings' },
]
```

Active link style: `border-l-4 border-primary bg-surface-container-high text-primary`.

**Mobile behavior:** On `< md`, renders as a full-height overlay drawer (`fixed inset-y-0 left-0 z-50 w-[260px]`) with a semi-transparent backdrop. On `≥ md`, renders as a sticky column in normal flow.

#### `Layout.jsx`

Shell component composing Sidebar + Navbar + `<Outlet />`. Manages `sidebarOpen` local state for mobile.

```jsx
// No external props
// Internal state: sidebarOpen (boolean)
// Renders:
//   <div class="flex h-screen overflow-hidden">
//     <Sidebar isOpen={sidebarOpen} onClose={...} onCreateTask={...} />
//     <div class="flex flex-col flex-1 overflow-hidden">
//       <Navbar onMenuToggle={...} />
//       <main class="flex-1 overflow-auto bg-background">
//         <Outlet />
//       </main>
//     </div>
//   </div>
```

`CreateTaskModal` is rendered at the Layout level so both the Sidebar "Create Task" button and the Board "New Issue" button can open it — `isModalOpen` and `presetStatus` are local state lifted here.

---

### Kanban Components (`src/components/kanban/`)

#### `KanbanBoard.jsx`

Top-level board component. Consumes `TaskContext`. Manages DnD context, active drag id, and drawer state.

```jsx
// No external props
// Local state:
//   activeId: string | null           — id of card being dragged
//   drawerTaskId: string | null       — id of task open in drawer
//   isCreateModalOpen: boolean
//   presetStatus: string              — status to pre-fill in CreateTaskModal

// Renders:
//   Board header (title, badges, avatar stack, New Issue button)
//   DndContext
//     DragOverlay (TaskCard copy when activeId is set)
//     <div class="flex gap-4 overflow-x-auto kanban-scroll">
//       KanbanColumn × 4
//   TaskDetailsDrawer (when drawerTaskId is set)
//   CreateTaskModal (when isCreateModalOpen)
```

#### `KanbanColumn.jsx`

SortableContext droppable column. Receives its tasks slice and column metadata as props.

```jsx
KanbanColumn.propTypes = {
  columnId:    PropTypes.string.isRequired,  // 'todo' | 'in-progress' | 'review' | 'done'
  title:       PropTypes.string.isRequired,
  tasks:       PropTypes.arrayOf(taskShape).isRequired,
  onCardClick: PropTypes.func.isRequired,    // (taskId) => void — opens drawer
}
```

**DnD wiring:**
- `useDroppable({ id: columnId })` to register as a drop target.
- `SortableContext` with `items={tasks.map(t => t.id)}` and `verticalListSortingStrategy`.
- When `isOver` is true, renders a 2px primary-color insertion indicator.

**Column-specific visual rules:**
- `"in-progress"`: pulsing dot (`animate-pulse bg-primary rounded-full w-2 h-2`) in header.
- `"done"`: wrapper has `border-dashed opacity-80`.

#### `TaskCard.jsx`

Sortable draggable card. Uses `useSortable`.

```jsx
TaskCard.propTypes = {
  task:     taskShape.isRequired,
  isDone:   PropTypes.bool,       // true when rendered in "done" column
  onClick:  PropTypes.func.isRequired, // () => void — opens drawer
}
```

**`useSortable` setup:**
```jsx
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
const style = { transform: CSS.Transform.toString(transform), transition }
```

**Render structure:**
```
<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
  <div class="group relative bg-surface-container-lowest rounded-md border ...">
    [hover: edit icon button top-right]
    <span class="font-mono text-label-sm">{task.id}</span>
    [isDone: check_circle icon + line-through title + opacity-50]
    [!isDone: plain title]
    <div>[Badge per label]</div>
    [isInProgress && progress != null: progress bar]
    <footer>[due date OR comment count] [Avatar assignee]</footer>
  </div>
</div>
```

**Drag state:** when `isDragging`, set `opacity-0` on the original card (ghost slot) — the `DragOverlay` shows the floating copy.

#### `CreateTaskModal.jsx`

Uses `Modal` as its wrapper shell. Calls `TaskContext.addTask` on valid submit. Reuses `Input`, `Button`, `Badge`.

```jsx
CreateTaskModal.propTypes = {
  isOpen:       PropTypes.bool.isRequired,
  onClose:      PropTypes.func.isRequired,
  presetStatus: PropTypes.string,   // pre-populates status field; defaults to 'todo'
}
```

**Local state fields:** `title`, `status`, `priority`, `dueDate`, `assignee`, `description`, `labels[]`, `titleError`.

**Form layout:**
```
[Title input — headline-md style, underline-only focus]
[2-col grid: Status select | Priority select]
[2-col grid: Due Date input | Assignee input]
[Description textarea + formatting toolbar (Bold/Italic/Strike/UL/OL/Attach — visual only)]
[Labels section: Badge chips (removable) + add label input]
[Footer: Cancel button | Create Task button]
```

**Reset behavior:** all fields reset to defaults each time `isOpen` transitions from `false` to `true`. `presetStatus` is applied to the status field on reset.

#### `TaskDetailsDrawer.jsx`

Slide-in drawer from right edge, 400px wide. Reuses `Input`, `Badge`, `Avatar`.

```jsx
TaskDetailsDrawer.propTypes = {
  taskId:  PropTypes.string,       // null = closed
  onClose: PropTypes.func.isRequired,
}
```

**Animation:** CSS `transform: translateX(100%)` when closed → `translateX(0)` when open, `transition: transform 300ms ease-in-out`.

**Render regions:**
1. Header: task id `<span>` (non-editable) + close `×` button
2. Title `<input>` (editable, `headline-sm`)
3. Two-column metadata grid: Status `<select>` + Priority `<select>`
4. Read-only display: Due Date, Assignee (Avatar + name)
5. Description `<textarea>`
6. Labels section: `Badge[]`
7. Footer: "Delete Task" `<Button variant="outline">` in error color

**Backdrop:** `fixed inset-0 bg-black/40 z-40` rendered behind the drawer (`z-50`) when `taskId` is not null.

---

### Auth Components (`src/components/auth/`)

#### `LoginPage.jsx`

Two-panel layout. Reuses `Input`, `Button`. Consumes `AuthContext`, `ThemeContext`.

```jsx
// No external props — reads contexts internally
// Local state: email, password, emailError, passwordError
```

**Layout:**
```
<div class="flex h-screen">
  <div class="hidden lg:flex flex-1 bg-primary ..."> [Branded left panel] </div>
  <div class="flex flex-col flex-1 ...">
    [theme toggle button top-right]
    [Logo + "Welcome back" headline]
    [Google SSO button — placeholder]
    [divider "or continue with email"]
    [Input email]
    [Input password]
    [Forgot password link — placeholder]
    [Log In Button]
    [Sign up link]
  </div>
</div>
```

#### `SignupPage.jsx`

Same two-panel layout. Reuses `Input`, `Button`. Consumes `AuthContext`, `ThemeContext`.

```jsx
// No external props
// Local state: name, email, password, confirmPassword, errors{}
```

Fields: Full Name (icon: `person`), Email (icon: `email`), Password (icon: `lock`), Confirm Password (icon: `lock`).

---

### Pages (`src/pages/`)

#### `Dashboard.jsx`

```jsx
// No external props
// Consumes: AuthContext (user), TaskContext (tasks)
// Renders:
//   Greeting: "Good [morning/afternoon/evening], [user.name]"
//   3x stat cards: Total Tasks, In Progress count, Completed count
//   "Go to Board" Button (navigates to /boards)
```

**Time-of-day logic:**
```js
const hour = new Date().getHours()
const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
```

#### `Settings.jsx`

```jsx
// No external props
// Consumes: AuthContext (user), ThemeContext (theme, toggleTheme)
// Local state: activeTab ('profile' | 'appearance'), name, email, saveStatus ('', 'success', 'error')
```

---

## Data Models

### Task

```typescript
interface Task {
  id:          string;          // e.g. "APP-101" (mock) or crypto.randomUUID() (created)
  title:       string;
  status:      'todo' | 'in-progress' | 'review' | 'done';
  priority:    'low' | 'medium' | 'high' | 'urgent';
  labels:      string[];        // e.g. ["feature", "urgent"]
  description: string;          // empty string if not provided
  dueDate:     string | null;   // ISO 8601 YYYY-MM-DD, or null
  assignee:    Assignee;
  progress:    number | null;   // 0–100, only meaningful for in-progress tasks; null otherwise
  comments:    number;          // non-negative integer
}

interface Assignee {
  name:     string;
  initials: string;  // e.g. "AR" for "Alex Rivera"
}
```

### User (AuthContext)

```typescript
interface User {
  id:     string;
  name:   string;
  email:  string;
  avatar: string | null;  // URL or null → Avatar component shows initials
}

// MockUser constant (used for login):
const MOCK_USER: User = {
  id:     'u1',
  name:   'Alex Rivera',
  email:  'alex@acme.com',
  avatar: null,
}
```

### Column Metadata

```typescript
interface ColumnDef {
  id:    'todo' | 'in-progress' | 'review' | 'done';
  title: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'todo',        title: 'Todo' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review',      title: 'Review' },
  { id: 'done',        title: 'Done' },
]
```

### Mock Tasks Seed (`src/data/mockTasks.js`)

The file exports a default array of exactly 10 tasks covering all required distribution:
- ≥2 `todo`, ≥2 `in-progress` (at least one with non-null `progress`), ≥1 `review`, ≥2 `done`
- ≥1 `priority: "urgent"`, ≥1 task with `labels.length >= 2`
- Mix of `dueDate` and null values, mix of `comments > 0` and `0`

---

## State Management Design

### `ThemeContext` (`src/context/ThemeContext.jsx`)

```jsx
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} })

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'light' || stored === 'dark' ? stored : 'light'
  })

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  // Apply dark class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### `AuthContext` (`src/context/AuthContext.jsx`)

```jsx
const AuthContext = createContext({ user: null, login: () => {}, logout: () => {}, signup: () => {} })

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = useCallback((email, password) => {
    // Validates non-empty; if valid, sets MockUser
    if (email && password) setUser(MOCK_USER)
    // Returns error keys for form validation: { email?: string, password?: string }
  }, [])

  const signup = useCallback((name, email, password) => {
    setUser({ id: crypto.randomUUID(), name, email, avatar: null })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

Note: `login` returns validation errors to the caller (LoginPage) rather than storing them in context — form errors are local UI state, not shared state.

### `TaskContext` (`src/context/TaskContext.jsx`)

```jsx
const TaskContext = createContext({ tasks: [], addTask: () => {}, updateTask: () => {}, deleteTask: () => {}, moveTask: () => {} })

function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(mockTasks)

  const addTask = useCallback((taskData) => {
    const validStatuses = ['todo', 'in-progress', 'review', 'done']
    const status = validStatuses.includes(taskData.status) ? taskData.status : 'todo'
    setTasks(prev => [...prev, {
      description: '',
      labels: [],
      priority: 'low',
      dueDate: null,
      comments: 0,
      progress: null,
      ...taskData,
      status,
      id: crypto.randomUUID(),
    }])
  }, [])

  const updateTask = useCallback((id, changes) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...changes } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTask = useCallback((id, toStatus, toIndex) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === id)
      if (!task) return prev
      const updated = { ...task, status: toStatus }
      const rest = prev.filter(t => t.id !== id)
      const sameColumn = rest.filter(t => t.status === toStatus)
      const otherColumns = rest.filter(t => t.status !== toStatus)
      const clampedIndex = Math.min(toIndex, sameColumn.length)
      sameColumn.splice(clampedIndex, 0, updated)
      return [...otherColumns, ...sameColumn]
    })
  }, [])

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTask }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => useContext(TaskContext)
```

All setters use functional updates (`prev => ...`) and produce new array references — no mutations.

---

## Drag-and-Drop Architecture

### Library Setup

```
@dnd-kit/core      — DndContext, DragOverlay, useDraggable, useDroppable, sensors
@dnd-kit/sortable  — SortableContext, useSortable, verticalListSortingStrategy
@dnd-kit/utilities — CSS.Transform
```

### Sensor Configuration

```jsx
// In KanbanBoard.jsx
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 8 }, // prevents accidental drags on click
  }),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
)
```

The 8px `distance` activation constraint is critical — it ensures a `TaskCard` click (to open the drawer) is not misinterpreted as a drag start.

### DndContext Event Handlers

```jsx
<DndContext
  sensors={sensors}
  collisionDetection={closestCorners}
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDragEnd={handleDragEnd}
>
```

**`handleDragStart({ active })`:** Sets `activeId = active.id`.

**`handleDragOver({ active, over })`:** Updates a local `overId` state for column highlight — does not mutate tasks yet.

**`handleDragEnd({ active, over })`:**
1. Clear `activeId`.
2. If `over` is null, do nothing (dropped outside).
3. Determine `toStatus` from the droppable `over.id` (column id) or the task that `over.id` belongs to.
4. Calculate `toIndex` based on the position of `over.id` in the target column.
5. Call `moveTask(active.id, toStatus, toIndex)`.

### Column Droppable Setup

Each `KanbanColumn` registers itself:
```jsx
// In KanbanColumn.jsx
const { setNodeRef, isOver } = useDroppable({ id: columnId })
```

And wraps cards in a `SortableContext`:
```jsx
<SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
  <div ref={setNodeRef} ...>
    {tasks.map(task => <TaskCard key={task.id} task={task} ... />)}
    {/* Empty drop zone placeholder when column has no tasks */}
    {tasks.length === 0 && <EmptyDropZone isOver={isOver} />}
  </div>
</SortableContext>
```

### DragOverlay

```jsx
// In KanbanBoard.jsx
const activeTask = activeId ? tasks.find(t => t.id === activeId) : null

<DragOverlay>
  {activeTask ? (
    <div style={{ transform: 'scale(1.04)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
      <TaskCard task={activeTask} onClick={() => {}} />
    </div>
  ) : null}
</DragOverlay>
```

The overlay renders a non-interactive clone (click does nothing) since the drag gesture owns the pointer.

### Cross-Column Drag Logic

The key challenge: `over.id` during `onDragEnd` may be either a column id or a task id (when dropped onto another card). Resolution:

```js
function getColumnId(overId, tasks) {
  // If overId matches a column key, return it directly
  if (COLUMN_IDS.includes(overId)) return overId
  // Otherwise find the task with that id and return its status
  return tasks.find(t => t.id === overId)?.status ?? null
}
```

### Keyboard Accessibility

With `KeyboardSensor` + `sortableKeyboardCoordinates`:
- Space/Enter activates drag mode on focused card.
- Arrow keys move the dragged item.
- Space/Enter confirms drop; Escape cancels.
- An `aria-live="assertive"` region in `KanbanBoard` announces position changes:
  ```jsx
  <div aria-live="assertive" aria-atomic="true" className="sr-only">
    {announcement}
  </div>
  ```

---

## Routing Structure

### Route Definitions (`src/App.jsx`)

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/login"  element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
    <Route path="/signup" element={<RedirectIfAuth><SignupPage /></RedirectIfAuth>} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route index         element={<Dashboard />} />
        <Route path="/boards"    element={<KanbanBoard />} />
        <Route path="/analytics" element={<div>Analytics — coming soon</div>} />
        <Route path="/activity"  element={<div>Activity — coming soon</div>} />
        <Route path="/settings"  element={<Settings />} />
      </Route>
    </Route>
  </Routes>
</BrowserRouter>
```

### `ProtectedRoute` Component

```jsx
// src/components/auth/ProtectedRoute.jsx
function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
```

Uses `<Outlet />` so it can wrap the entire `<Layout>` tree cleanly.

### `RedirectIfAuth` Component

```jsx
// Prevents authenticated users from accessing /login or /signup
function RedirectIfAuth({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : children
}
```

### Route Guard Diagram

```
Request URL
    │
    ├─ /login or /signup
    │       └─ RedirectIfAuth: user? → redirect /  : render page
    │
    └─ all other routes
            └─ ProtectedRoute: user? → render Layout+page : redirect /login
```

---

## Design System Implementation

### Tailwind v4 `@theme {}` Block (`src/styles/index.css`)

Tailwind v4 uses CSS custom properties defined inside `@theme {}` instead of a `tailwind.config.js`. The plugin reads these at build time and generates utilities.

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@theme {
  /* ── Fonts ───────────────────────────────────── */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* ── Base spacing scale ─────────────────────── */
  --spacing-xs:                 4px;
  --spacing-sm:                 8px;
  --spacing-md:                 16px;
  --spacing-lg:                 24px;
  --spacing-xl:                 32px;
  --spacing-2xl:                48px;
  --spacing-sidebar-width:      260px;
  --spacing-kanban-column-width: 300px;

  /* ── Border radius ──────────────────────────── */
  --radius-sm:   0.25rem;
  --radius-DEFAULT: 0.5rem;
  --radius-md:   0.75rem;
  --radius-lg:   1rem;
  --radius-xl:   1.5rem;
  --radius-full: 9999px;

  /* ── Light mode color tokens ────────────────── */
  --color-primary:                  #0058be;
  --color-on-primary:               #ffffff;
  --color-primary-container:        #2170e4;
  --color-on-primary-container:     #fefcff;
  --color-inverse-primary:          #adc6ff;

  --color-secondary:                #712ae2;
  --color-on-secondary:             #ffffff;
  --color-secondary-container:      #8a4cfc;
  --color-on-secondary-container:   #fffbff;
  --color-secondary-fixed:          #eaddff;
  --color-secondary-fixed-dim:      #d2bbff;
  --color-on-secondary-fixed:       #25005a;
  --color-on-secondary-fixed-variant: #5a00c6;

  --color-tertiary:                 #924700;
  --color-on-tertiary:              #ffffff;
  --color-tertiary-container:       #b75b00;
  --color-on-tertiary-container:    #fffbff;
  --color-tertiary-fixed:           #ffdcc6;
  --color-tertiary-fixed-dim:       #ffb786;
  --color-on-tertiary-fixed:        #311400;
  --color-on-tertiary-fixed-variant: #723600;

  --color-error:                    #ba1a1a;
  --color-on-error:                 #ffffff;
  --color-error-container:          #ffdad6;
  --color-on-error-container:       #93000a;

  --color-background:               #f9f9ff;
  --color-on-background:            #151c27;

  --color-surface:                  #f9f9ff;
  --color-surface-dim:              #d3daea;
  --color-surface-bright:           #f9f9ff;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low:    #f0f3ff;
  --color-surface-container:        #e7eefe;
  --color-surface-container-high:   #e2e8f8;
  --color-surface-container-highest:#dce2f3;
  --color-surface-variant:          #dce2f3;
  --color-surface-tint:             #005ac2;

  --color-on-surface:               #151c27;
  --color-on-surface-variant:       #424754;
  --color-inverse-surface:          #2a313d;
  --color-inverse-on-surface:       #ebf1ff;

  --color-outline:                  #727785;
  --color-outline-variant:          #c2c6d6;

  --color-primary-fixed:            #d8e2ff;
  --color-primary-fixed-dim:        #adc6ff;
  --color-on-primary-fixed:         #001a42;
  --color-on-primary-fixed-variant: #004395;

  /* ── Typography scale ───────────────────────── */
  --text-display-lg:         36px;
  --text-display-lg--line-height: 44px;
  --text-display-lg--font-weight: 700;
  --text-display-lg--letter-spacing: -0.02em;

  --text-display-lg-mobile:  28px;
  --text-display-lg-mobile--line-height: 36px;
  --text-display-lg-mobile--font-weight: 700;
  --text-display-lg-mobile--letter-spacing: -0.01em;

  --text-headline-md:        24px;
  --text-headline-md--line-height: 32px;
  --text-headline-md--font-weight: 600;
  --text-headline-md--letter-spacing: -0.01em;

  --text-headline-sm:        18px;
  --text-headline-sm--line-height: 28px;
  --text-headline-sm--font-weight: 600;

  --text-body-lg:            16px;
  --text-body-lg--line-height: 24px;
  --text-body-lg--font-weight: 400;

  --text-body-md:            14px;
  --text-body-md--line-height: 20px;
  --text-body-md--font-weight: 400;

  --text-label-md:           13px;
  --text-label-md--line-height: 18px;
  --text-label-md--font-weight: 500;

  --text-label-sm:           12px;
  --text-label-sm--line-height: 16px;
  --text-label-sm--font-weight: 600;
  --text-label-sm--letter-spacing: 0.05em;
}

/* ── Base styles ─────────────────────────────────── */
:root {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  background-color: var(--color-background);
  color: var(--color-on-surface);
}

/* ── Material Symbols icon font ─────────────────── */
/* Loaded via <link> in index.html */

/* ── Kanban scrollbar ───────────────────────────── */
.kanban-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--color-outline-variant) transparent;
}
.kanban-scroll::-webkit-scrollbar {
  height: 6px;
}
.kanban-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.kanban-scroll::-webkit-scrollbar-thumb {
  background-color: var(--color-outline-variant);
  border-radius: 9999px;
}
```

### Usage in Components

With Tailwind v4, custom tokens become utility classes automatically:

```jsx
// Color tokens → bg-primary, text-on-surface, border-outline-variant, etc.
<button className="bg-primary text-on-primary hover:bg-primary-container">

// Spacing → p-md, gap-lg, w-sidebar-width, w-kanban-column-width
<div className="w-sidebar-width h-screen">

// Typography — use inline styles or @apply for composite type tokens
// Because font-size + line-height + weight are bundled, apply with @layer or CSS-in-JS
<h2 style={{ fontSize: 'var(--text-headline-md)', lineHeight: 'var(--text-headline-md--line-height)' }}>
```

For frequently used type combinations, define `@layer utilities` helpers:

```css
@layer utilities {
  .text-style-display-lg  { font-size: var(--text-display-lg); line-height: var(--text-display-lg--line-height); font-weight: var(--text-display-lg--font-weight); letter-spacing: var(--text-display-lg--letter-spacing); }
  .text-style-headline-md { font-size: var(--text-headline-md); line-height: var(--text-headline-md--line-height); font-weight: var(--text-headline-md--font-weight); letter-spacing: var(--text-headline-md--letter-spacing); }
  .text-style-headline-sm { font-size: var(--text-headline-sm); line-height: var(--text-headline-sm--line-height); font-weight: var(--text-headline-sm--font-weight); }
  .text-style-body-lg     { font-size: var(--text-body-lg); line-height: var(--text-body-lg--line-height); font-weight: var(--text-body-lg--font-weight); }
  .text-style-body-md     { font-size: var(--text-body-md); line-height: var(--text-body-md--line-height); font-weight: var(--text-body-md--font-weight); }
  .text-style-label-md    { font-size: var(--text-label-md); line-height: var(--text-label-md--line-height); font-weight: var(--text-label-md--font-weight); }
  .text-style-label-sm    { font-size: var(--text-label-sm); line-height: var(--text-label-sm--line-height); font-weight: var(--text-label-sm--font-weight); letter-spacing: var(--text-label-sm--letter-spacing); }
}
```

---

## Dark Mode Strategy

### Mechanism: `class` strategy on `<html>`

Tailwind v4 with the `@tailwindcss/vite` plugin uses the `dark:` variant when `class="dark"` is present on `<html>`. `ThemeContext` manages this class toggle via `useEffect`.

There is no `tailwind.config.js`, so dark mode is configured inline in `vite.config.js` via the plugin options if needed — but the default Tailwind v4 behavior already supports `class`-based dark mode without additional config.

### Dark Mode Token Overrides

Inside `index.css`, override the light mode tokens for dark mode using the `.dark` selector:

```css
.dark {
  --color-background:               #0b0e14;
  --color-on-background:            #e3e8f4;

  --color-surface:                  #131820;
  --color-surface-dim:              #0b0e14;
  --color-surface-bright:           #1e2530;
  --color-surface-container-lowest: #090c12;
  --color-surface-container-low:    #131820;
  --color-surface-container:        #181f2c;
  --color-surface-container-high:   #1e2530;
  --color-surface-container-highest:#232b38;

  --color-on-surface:               #e3e8f4;
  --color-on-surface-variant:       #a8b0c4;
  --color-inverse-surface:          #e3e8f4;
  --color-inverse-on-surface:       #2a313d;

  --color-outline:                  #6b7385;
  --color-outline-variant:          #3a414f;

  --color-primary:                  #adc6ff;
  --color-on-primary:               #001a42;
  --color-primary-container:        #004395;
  --color-on-primary-container:     #d8e2ff;

  --color-secondary:                #d2bbff;
  --color-on-secondary:             #25005a;
  --color-secondary-container:      #5a00c6;
  --color-on-secondary-container:   #eaddff;

  --color-tertiary:                 #ffb786;
  --color-on-tertiary:              #4f2400;
  --color-tertiary-container:       #723600;
  --color-on-tertiary-container:    #ffdcc6;

  --color-error:                    #ffb4ab;
  --color-on-error:                 #690005;
  --color-error-container:          #93000a;
  --color-on-error-container:       #ffdad6;
}
```

### Dark Mode Component Guidelines

- **No hardcoded colors** in component class lists — always use token-based utilities (`bg-surface`, `text-on-surface`, `border-outline-variant`, etc.) so that the `.dark` override automatically applies.
- **Shadows:** In dark mode, shadows are nearly invisible. Card depth is conveyed via border contrast (`border-outline-variant` on cards) rather than box shadows.
- **DragOverlay shadow** uses `rgba(0,0,0,0.15)` in light mode. In dark mode, use `border border-outline` instead — no special case needed if a `dark:` utility overrides the shadow.
- **Kanban columns** in dark mode use `bg-surface-container` (slightly lighter than background), with cards at `bg-surface-container-low`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

This feature involves business logic (task CRUD, theme persistence, auth validation, stat derivation, drag-and-drop reordering) that is well-suited to property-based testing. The following properties are derived from the acceptance criteria prework analysis.

**Property Reflection:** After reviewing all testable criteria, the following consolidations were made:
- Requirements 1.9 and 2.6 both test the `dark` class on `<html>` — consolidated into Property 1.
- Requirements 2.2 and 2.3 together cover full theme localStorage round-trip behavior — kept separate as they test initialization vs. mutation.
- Requirements 11.3–11.7 each test distinct TaskContext operations — kept separate.
- Requirements 7.3, 7.4, 7.7, 7.8 each test different TaskCard rendering rules — kept separate as they verify independent conditions.

---

### Property 1: Theme class reflects theme state

*For any* sequence of `toggleTheme` calls starting from any initial theme value, the `dark` class on `<html>` should be present if and only if the current theme value is `"dark"`.

**Validates: Requirements 1.9, 2.6**

---

### Property 2: Theme initialization from localStorage

*For any* string value stored in `localStorage` under the key `"theme"`, the initialized theme should be exactly that value if it is `"light"` or `"dark"`, and `"light"` otherwise.

**Validates: Requirements 2.2**

---

### Property 3: Theme toggle round-trip

*For any* initial theme value, calling `toggleTheme` twice should return the theme to its original value, and `localStorage.getItem("theme")` should reflect the current theme after each toggle.

**Validates: Requirements 2.3**

---

### Property 4: Protected routes redirect unauthenticated users

*For any* route path that is a protected route (i.e., not `/login` or `/signup`), when the `AuthContext` user is `null`, rendering the route should result in a redirect to `/login`.

**Validates: Requirements 1.7**

---

### Property 5: Signup creates user with submitted data

*For any* non-empty name string, valid email string, and password string of length ≥ 8, submitting the signup form should result in an authenticated user whose `name` equals the submitted name, `email` equals the submitted email, and `id` is a non-empty string.

**Validates: Requirements 4.3**

---

### Property 6: Active nav link matches current route

*For any* route in the navigation links list, when the current router path matches that link's route, exactly that link should have the active styles applied (primary text color, `surface-container-high` background, `border-l-4 border-primary`), and no other link should have active styles.

**Validates: Requirements 5.4**

---

### Property 7: Avatar initials derived from name

*For any* user name string of one or more words, the `Avatar` component's rendered initials should consist of the first character of the first word and (if present) the first character of the last word, converted to uppercase.

**Validates: Requirements 5.12**

---

### Property 8: Column task count badge is accurate

*For any* tasks array, the count badge displayed in each column header should equal exactly the number of tasks in `tasks` whose `status` field matches that column's id.

**Validates: Requirements 6.3**

---

### Property 9: TaskCard badge color matches priority

*For any* task with a `priority` field, the rendered `Badge` component should use the color classes corresponding to that priority level: `urgent` → `bg-error-container text-on-error-container`, `high` → `bg-tertiary-container text-on-tertiary-container`, other → `bg-surface-container text-on-surface-variant`.

**Validates: Requirements 7.3**

---

### Property 10: TaskCard footer content rule

*For any* task, the card footer should display the due date (with `calendar_today` icon) if `dueDate` is non-null, and display the comment count (with `comment` icon) only when `dueDate` is null AND `comments > 0`.

**Validates: Requirements 7.4**

---

### Property 11: Done column card styling

*For any* task rendered in the "done" column, the TaskCard should display the title with `line-through` text decoration, a `check_circle` icon before the title, and the card should render at 50% opacity.

**Validates: Requirements 7.7**

---

### Property 12: In-progress progress bar width

*For any* task with `status: "in-progress"` and a non-null numeric `progress` value between 0 and 100, the rendered progress bar's width should equal `progress`% of the container width.

**Validates: Requirements 7.8**

---

### Property 13: moveTask updates status and position

*For any* existing task id, any valid target column status, and any non-negative integer `toIndex`, calling `moveTask(id, toStatus, toIndex)` should result in: (a) the task's `status` field being `toStatus`, (b) the task appearing at position `min(toIndex, columnLength)` within the ordered list of tasks with `toStatus`.

**Validates: Requirements 11.6**

---

### Property 14: addTask preserves submitted fields and validates status

*For any* `taskData` object, calling `addTask(taskData)` should produce a new task where: (a) `id` is a non-empty string not present in the previous `tasks` array, (b) all provided fields from `taskData` are present in the new task, (c) if `taskData.status` is not one of the four valid values, the task's `status` is `"todo"`.

**Validates: Requirements 11.3**

---

### Property 15: updateTask shallow merge leaves other fields unchanged

*For any* existing task id and any `changes` object containing a subset of task fields, calling `updateTask(id, changes)` should produce a tasks array where the matching task has all fields from `changes` updated to their new values, and all fields NOT in `changes` are identical to their previous values. If no task with the given id exists, the tasks array is unchanged.

**Validates: Requirements 11.4**

---

### Property 16: deleteTask removes exactly the target task

*For any* task id in the `tasks` array, calling `deleteTask(id)` should produce a tasks array that does not contain any task with that id, and all other tasks are present and unchanged. If the id does not exist, the array is unchanged.

**Validates: Requirements 11.5**

---

### Property 17: TaskContext actions produce new array references

*For any* call to `addTask`, `updateTask`, `deleteTask`, or `moveTask`, the resulting `tasks` reference should be a new array instance (not the same reference as before the call), regardless of whether any task data actually changed.

**Validates: Requirements 11.7**

---

### Property 18: Mock task objects have the required shape

*For any* task object in the `mockTasks` default export, it should contain exactly the fields: `id` (string), `title` (string), `status` (one of the four valid values), `priority` (one of the four valid values), `labels` (array of strings), `description` (string), `dueDate` (string or null), `assignee` (object with `name` and `initials` string fields), `progress` (number 0–100 or null), `comments` (non-negative integer).

**Validates: Requirements 12.2**

---

### Property 19: Dashboard stat counts match tasks array

*For any* `tasks` array, the Dashboard's "Total Tasks" stat should equal `tasks.length`, the "In Progress" stat should equal the count of tasks with `status: "in-progress"`, and the "Completed" stat should equal the count of tasks with `status: "done"`.

**Validates: Requirements 14.3**

---

### Property 20: Dashboard greeting uses correct time-of-day period

*For any* user name and any hour of the day (0–23), the greeting rendered by Dashboard should use `"morning"` for hours 0–11, `"afternoon"` for hours 12–17, and `"evening"` for hours 18–23, and should include the user's `name` field.

**Validates: Requirements 14.2**

---

### Property 21: Settings profile inputs pre-populated from user

*For any* authenticated user object, the Settings page's Profile tab should render the Full Name input pre-populated with `user.name` and the Email input pre-populated with `user.email`.

**Validates: Requirements 13.3**

---

### Property 22: Settings email validation rejects strings without @

*For any* string that does not contain the `@` character, clicking "Save Changes" in the Profile tab should show the error message "Enter a valid email address" rather than the success message.

**Validates: Requirements 13.7**

---

## Error Handling

### Authentication Errors

- **Login:** Form-local validation (empty email → "Email is required", empty password → "Password is required"). Errors are set in local component state, not context. The `login` function in `AuthContext` accepts any non-empty credentials (mock — no real auth).
- **Signup:** Local validation for empty fields, password length < 8, and password mismatch. Each field has an independent error message slot.

### Task Validation

- `addTask` with empty title: prevented at the UI layer (CreateTaskModal shows "Title is required"). The context itself does not throw — it accepts whatever it is given.
- `updateTask` / `deleteTask` with unknown id: silently no-ops (tasks array unchanged). Callers should not depend on error signaling from these functions.
- `moveTask` with unknown id: silently no-ops.
- `moveTask` with `toIndex` > column length: clamps to the end (no error).

### Drag-and-Drop Errors

- Drop outside any column: `onDragEnd` receives `over: null` → no-op, task stays in place.
- Drop on same position: `moveTask` is still called but produces an equivalent array. Acceptable — the extra render is negligible.

### Settings Errors

- Invalid email on save: inline error message shown beneath the Email input, no success message.
- Empty name on save: accepted (requirement does not mandate name validation — the save button shows "Changes saved").

### TaskDetailsDrawer Title Revert

- If the editable title input is cleared and loses focus, the displayed value reverts to the last saved title. `updateTask` is NOT called in this case.

---

## Testing Strategy

### Testing Approach

This app is a React SPA with business logic concentrated in three areas:
1. **Context functions** (`addTask`, `updateTask`, `deleteTask`, `moveTask`, theme toggle, auth) — pure or near-pure functions suited to property-based testing.
2. **Component rendering rules** (badge colors, task card states, stat derivation, greeting) — also property-testable with rendered output assertions.
3. **User interaction flows** (form submission, routing, drag events) — better suited to example-based integration tests.

**Recommended PBT library:** [fast-check](https://fast-check.io/) — excellent TypeScript/JavaScript support, integrates with Vitest, zero config.

```
npm install -D fast-check vitest @testing-library/react @testing-library/user-event jsdom
```

Add to `vite.config.js`:
```js
test: { environment: 'jsdom', globals: true, setupFiles: './src/test/setup.js' }
```

### Unit Tests (Example-Based)

Focus: routing guards, specific UI states, integration points.

| Test | What it covers |
|---|---|
| `ProtectedRoute` redirects when user is null | Req 1.7 |
| `RedirectIfAuth` redirects authenticated users away from /login | Req 1.8 |
| Navbar renders `light_mode` icon when theme is `dark` | Req 2.4 |
| LoginPage shows "Email is required" on empty email submit | Req 3.4 |
| LoginPage shows "Password is required" on empty password submit | Req 3.5 |
| CreateTaskModal shows "Title is required" on empty title submit | Req 9.9 |
| TaskDetailsDrawer title reverts on blur with empty value | Req 10.4 |
| Settings "Save Changes" shows success message | Req 13.5 |
| Dashboard renders "Go to Board" button linking to /boards | Req 14.4 |
| Logout clears user and redirects to /login | Req 5.8 |

### Property-Based Tests

Each test uses `fc.assert(fc.property(...), { numRuns: 100 })`.

**Tag format:** `// Feature: kanban-board-app, Property N: <property title>`

| Test (maps to Correctness Property #) | fast-check Arbitraries |
|---|---|
| P1 — Theme class on html | `fc.array(fc.boolean())` — sequence of toggle calls |
| P2 — Theme init from localStorage | `fc.string()` — any stored value |
| P3 — Theme toggle round-trip | `fc.constantFrom('light', 'dark')` |
| P4 — Protected routes redirect | `fc.constantFrom('/boards', '/analytics', '/activity', '/settings', '/')` |
| P5 — Signup creates correct user | `fc.string({minLength:1})`, `fc.emailAddress()`, `fc.string({minLength:8})` |
| P6 — Active nav link | `fc.constantFrom(...NAV_PATHS)` |
| P7 — Avatar initials | `fc.array(fc.string({minLength:1}), {minLength:1})` joined as name |
| P8 — Column task count | `fc.array(taskArbitrary)` |
| P9 — Badge color by priority | `fc.record({ priority: fc.constantFrom('low','medium','high','urgent'), labels: fc.array(fc.string()) })` |
| P10 — Footer content rule | `taskArbitrary` |
| P11 — Done card styling | `taskArbitrary` with status forced to 'done' |
| P12 — Progress bar width | `fc.record({ status: fc.constant('in-progress'), progress: fc.integer({min:0,max:100}) })` |
| P13 — moveTask status and position | `fc.array(taskArbitrary,{minLength:1})`, `fc.constantFrom(...COLUMN_IDS)`, `fc.nat()` |
| P14 — addTask preserves fields | `fc.record({...taskFields})` |
| P15 — updateTask shallow merge | `fc.array(taskArbitrary,{minLength:1})`, `fc.record({title:fc.string()})` |
| P16 — deleteTask removes target | `fc.array(taskArbitrary,{minLength:1})` |
| P17 — Immutable updates | any action call |
| P18 — Mock task shape | static array — iterate all entries |
| P19 — Dashboard stat counts | `fc.array(taskArbitrary)` |
| P20 — Greeting time period | `fc.integer({min:0,max:23})`, `fc.string({minLength:1})` |
| P21 — Settings pre-population | `fc.record({name:fc.string({minLength:1}), email:fc.emailAddress()})` |
| P22 — Email validation rejects missing @ | `fc.string().filter(s => !s.includes('@'))` |

### Integration Tests

| Scenario | Tool |
|---|---|
| Full login flow: enter credentials → redirect to `/` | React Testing Library + user-event |
| Create task via modal: fill form → task appears on board | React Testing Library |
| Drag card between columns (simulated pointer events) | @dnd-kit test utilities |
| Keyboard navigation: Tab through modal, Escape closes | user-event |

### Smoke Tests / Static Checks

- `index.html` contains `<link>` for Inter and Material Symbols.
- `vite.config.js` includes `tailwindcss()` plugin.
- All 22 `@theme` color tokens are present in `index.css`.
- `mockTasks` exports an array of exactly 10 items covering all four statuses.
