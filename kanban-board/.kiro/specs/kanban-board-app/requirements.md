# Requirements Document

## Introduction

ZenFlow is a full-featured Kanban Board SaaS application built with Vite + React 19 + Tailwind CSS. It provides teams with a focused, high-performance workspace for managing tasks across visual workflow stages. The application includes mock-data-backed authentication, a drag-and-drop Kanban board, a task detail drawer, a settings page, and a persistent light/dark theme — all styled using the "Kinetic Enterprise" design system.

The app runs entirely client-side with no backend: all state is held in React Context and seeded from static mock data.

## Glossary

- **App**: The ZenFlow single-page application as a whole.
- **Router**: React Router v6 managing client-side navigation between pages.
- **AuthContext**: React Context that holds the current mock authenticated user and exposes login/logout/signup actions.
- **ThemeContext**: React Context that holds the active color scheme (`light` | `dark`) and exposes a toggle action.
- **TaskContext**: React Context that holds the full list of tasks and exposes CRUD and drag-and-drop reorder actions.
- **Board**: The Kanban board page displaying all four workflow columns.
- **Column**: A single vertical swim-lane on the Board (Todo, In Progress, Review, Done).
- **Task**: A unit of work represented as a card on the Board.
- **TaskCard**: The visual card component rendering a Task inside a Column.
- **TaskDetailsDrawer**: A slide-in panel that displays and allows editing of a single Task's full details.
- **CreateTaskModal**: A modal dialog for creating a new Task.
- **Sidebar**: The fixed left navigation panel (260 px wide) present on all authenticated pages.
- **Navbar**: The fixed top header bar (64 px tall) present on all authenticated pages.
- **Layout**: The shell component that composes Sidebar + Navbar + page content for authenticated routes.
- **DesignSystem**: The "Kinetic Enterprise" Tailwind CSS design system: primary `#0058be`, background `#f9f9ff`, Inter font, Material Symbols Outlined icons.
- **DndKit**: The `@dnd-kit/core` and `@dnd-kit/sortable` libraries used for drag-and-drop.
- **MockUser**: A hardcoded user object used in place of real authentication (e.g., `{ id: "u1", name: "Alex Rivera", email: "alex@acme.com", avatar: null }`).

---

## Requirements

### Requirement 1: Application Bootstrap and Routing

**User Story:** As a developer, I want the application to initialize correctly with routing and global providers, so that all pages render in their proper context.

#### Acceptance Criteria

1. THE App SHALL render a `<BrowserRouter>` wrapping all routes at the application root.
2. THE App SHALL nest providers in the following order (outermost to innermost): `ThemeContext.Provider`, `AuthContext.Provider`, `TaskContext.Provider`, then the Router and routes.
3. THE Router SHALL define a route for `/login` that renders the LoginPage component.
4. THE Router SHALL define a route for `/signup` that renders the SignupPage component.
5. THE Router SHALL define a protected route at `/` that renders the Layout component with Dashboard as the default child page.
6. THE Router SHALL define protected routes at `/boards`, `/analytics`, `/activity`, and `/settings` rendered as children of the Layout component.
7. A protected route SHALL be implemented as a wrapper component that reads `AuthContext`: WHEN the current user is `null`, THE wrapper SHALL render `<Navigate to="/login" replace />` instead of the route's children.
8. WHEN an authenticated user navigates to `/login` or `/signup`, THE Router SHALL redirect the user to `/`.
9. THE App SHALL apply the CSS class `"dark"` to the `<html>` element WHILE `theme === "dark"`, and remove the `"dark"` class WHILE `theme === "light"`.
10. THE `index.html` `<head>` SHALL contain a `<link rel="stylesheet">` tag for the Inter Google Font and a `<link rel="stylesheet">` tag for the Material Symbols Outlined icon font.

---

### Requirement 2: Theme System

**User Story:** As a user, I want to switch between light and dark themes that persist across sessions, so that I can work comfortably in any lighting environment.

#### Acceptance Criteria

1. THE ThemeContext SHALL expose a `theme` value of `"light"` or `"dark"` and a `toggleTheme` function.
2. WHEN the App initializes, THE ThemeContext SHALL read `localStorage.getItem("theme")`; IF the stored value is exactly `"light"` or `"dark"`, THEN that value SHALL be used as the initial theme; OTHERWISE THE ThemeContext SHALL default to `"light"`.
3. WHEN `toggleTheme` is called, THE ThemeContext SHALL flip the current theme value and persist the new value via `localStorage.setItem("theme", newTheme)`.
4. THE Navbar SHALL render a theme-toggle button: WHILE `theme === "dark"`, THE button SHALL display the `light_mode` Material Symbol icon; WHILE `theme === "light"`, THE button SHALL display the `dark_mode` Material Symbol icon.
5. WHEN the theme-toggle button is clicked, THE Navbar SHALL call `toggleTheme`.
6. THE App SHALL apply the CSS class `"dark"` to the `<html>` element WHILE `theme === "dark"`, and remove it WHILE `theme === "light"`.
7. THE DesignSystem SHALL define dark-mode overrides for all surface, on-surface, outline, and primary color tokens using the Tailwind `dark:` variant.

---

### Requirement 3: Authentication — Login

**User Story:** As a visitor, I want to log in with an email and password, so that I can access my workspace.

#### Acceptance Criteria

1. THE LoginPage SHALL render a two-panel layout: a branded left panel (hidden on mobile, visible at the `lg` breakpoint and above) and a right-panel form.
2. THE LoginPage SHALL display an email input with the `email` Material Symbol icon prefix and a password input with the `lock` Material Symbol icon prefix.
3. WHEN the "Log In" button is clicked with a non-empty email and a non-empty password, THE AuthContext SHALL set the authenticated user to the MockUser and THE Router SHALL redirect to `/`.
4. IF the "Log In" button is clicked with an empty email field, THEN THE LoginPage SHALL display the error message "Email is required" beneath the email input.
5. IF the "Log In" button is clicked with an empty password field, THEN THE LoginPage SHALL display the error message "Password is required" beneath the password input.
6. THE LoginPage SHALL render a "Sign up" link that navigates to `/signup`.
7. THE LoginPage SHALL render a "Forgot password?" link (non-functional placeholder, no route required).
8. THE LoginPage SHALL render a "Continue with Google" button (non-functional placeholder).
9. THE LoginPage SHALL render a theme-toggle button in the top-right corner of the form panel that calls `toggleTheme` when clicked.
10. WHEN the screen width is narrower than the `lg` breakpoint, THE left branded panel SHALL be hidden and only the right-panel form SHALL be visible.

---

### Requirement 4: Authentication — Signup

**User Story:** As a new visitor, I want to create an account with my name, email, and password, so that I can start using ZenFlow.

#### Acceptance Criteria

1. THE SignupPage SHALL render the same two-panel layout as the LoginPage (branded left panel hidden below `lg` breakpoint, right-panel form always visible).
2. THE SignupPage SHALL display a full-name input with a `person` Material Symbol icon prefix, an email input with an `email` icon prefix, a password input with a `lock` icon prefix, and a confirm-password input with a `lock` icon prefix.
3. WHEN the signup form is submitted with all fields non-empty, password and confirm-password matching, and password at least 8 characters long, THE AuthContext SHALL set the authenticated user to `{ id: crypto.randomUUID(), name: <submitted name>, email: <submitted email>, avatar: null }` and THE Router SHALL redirect to `/`.
4. IF the signup form is submitted with any required field empty, THEN THE SignupPage SHALL display the error message "This field is required" beneath each empty field.
5. IF the signup form is submitted with a password that does not match confirm-password, THEN THE SignupPage SHALL display the inline error message "Passwords do not match" beneath the confirm-password field.
6. THE SignupPage SHALL render a "Sign in" link that navigates to `/login`.
7. THE SignupPage SHALL render a theme-toggle button in the top-right corner of the form panel that calls `toggleTheme` when clicked.

---

### Requirement 5: Navigation Shell — Layout, Sidebar, and Navbar

**User Story:** As an authenticated user, I want a consistent navigation shell on every page, so that I can move between sections of the app without losing context.

#### Acceptance Criteria

1. THE Layout SHALL render the Sidebar on the left and the Navbar at the top, with the page content filling the remaining space in a flex container.
2. THE Sidebar SHALL be 260 px wide, positioned as a sticky left column, and visible on screens wider than `md`; on smaller screens it SHALL be hidden by default and toggled via the mobile menu.
3. THE Sidebar SHALL render navigation links for: Dashboard (icon `dashboard`, route `/`), Boards (icon `view_kanban`, route `/boards`), Analytics (icon `analytics`, route `/analytics`), Activity (icon `history`, route `/activity`), and Settings (icon `settings`, route `/settings`).
4. WHEN the current route matches a Sidebar link's route, THE Sidebar SHALL apply the active state to that link: a 4 px left border in the primary color (`border-l-4 border-primary`), primary text color, and a `surface-container-high` background.
5. THE Sidebar SHALL render a "Create Task" primary action button (using the `add` Material Symbol icon) above the footer links.
6. WHEN the "Create Task" button in the Sidebar is clicked, THE Sidebar SHALL open the CreateTaskModal.
7. THE Sidebar footer SHALL render a Help link (icon `help`) and a Logout link (icon `logout`).
8. WHEN the Logout link is clicked, THE AuthContext SHALL set the current user to `null` and THE Router SHALL redirect to `/login`.
9. THE Navbar SHALL render the text "ZenFlow" in the primary color using the `headline-md` typography token.
10. THE Navbar SHALL render a search input field (placeholder "Search tasks…") with a `search` icon, visible on screens wider than `sm`.
11. THE Navbar SHALL render a `notifications` icon button with a red badge dot indicator.
12. THE Navbar SHALL render the authenticated user's avatar: IF the user has an image URL THEN render an `<img>` element; OTHERWISE render a circle with the user's initials derived from the `name` field.
13. THE Navbar SHALL render a `menu` icon button visible only on screens narrower than `md`.
14. WHEN the `menu` icon button is clicked, THE Sidebar SHALL render as a full-height overlay drawer from the left with a semi-transparent backdrop covering the rest of the viewport; WHEN the backdrop is clicked, THE drawer SHALL close.

---

### Requirement 6: Kanban Board — Columns and Layout

**User Story:** As a user, I want to see my tasks organized in four workflow columns, so that I can understand the status of work at a glance.

#### Acceptance Criteria

1. THE Board SHALL render exactly four Columns in left-to-right order: "Todo", "In Progress", "Review", and "Done".
2. THE Board SHALL be a horizontally scrollable container (`overflow-x: auto`), with each Column being 300 px wide and `flex-shrink: 0` (non-shrinkable).
3. EACH Column SHALL display a header with the column name (uppercase, `label-md` weight), a task-count badge showing the number of tasks in that column, and a column-menu button (`more_horiz` icon) that is a visual placeholder requiring no action in this scope.
4. THE "In Progress" Column header SHALL display an animated pulsing dot indicator (CSS `animate-pulse`) in the primary color.
5. THE "Done" Column SHALL render with a dashed border style and 80% opacity (`opacity-80`) to visually distinguish completed work.
6. EACH Column SHALL fill the available Board viewport height (viewport height minus the Board header and Navbar heights) and scroll vertically when its task list overflows.
7. THE Board header SHALL display: the board title "Q3 Product Launch", a "Public" visibility badge, a member avatar stack (at least 3 mock avatars), a hardcoded "14 days left" counter with a `schedule` icon, a Filter button, a Group button, and a "New Issue" primary button.
8. WHEN the "New Issue" button in the Board header is clicked, THE Board SHALL open the CreateTaskModal with the status field pre-set to "todo".

---

### Requirement 7: Kanban Board — Task Cards

**User Story:** As a user, I want task cards to display key information at a glance, so that I can quickly assess work without opening each task.

#### Acceptance Criteria

1. EACH TaskCard SHALL display the task's `id` field in monospace `label-sm` font style (e.g., "APP-102").
2. EACH TaskCard SHALL display the task's `title` field in `label-md` font weight.
3. EACH TaskCard SHALL display each entry in the task's `labels` array as a badge: the "urgent" priority badge uses `bg-error-container text-on-error-container`, the "high" priority badge uses `bg-tertiary-container text-on-tertiary-container`, and all other label badges use `bg-surface-container text-on-surface-variant`.
4. EACH TaskCard SHALL display in the card footer: IF the task has a non-null `dueDate`, THEN display the due date with a `calendar_today` icon; OTHERWISE IF the task has a `comments` count greater than 0, THEN display the comment count with a `comment` icon.
5. EACH TaskCard SHALL display the assignee's initials in a circular avatar in the card footer.
6. WHEN a TaskCard is hovered, THE TaskCard SHALL transition its border color to the primary color (`border-primary`) and apply the box shadow `0 2px 8px rgba(33, 112, 228, 0.15)`.
7. WHEN a TaskCard is rendered inside the "Done" Column, THE TaskCard SHALL display the title with a `line-through` text decoration, a `check_circle` Material Symbol icon before the title, and render at 50% opacity (`opacity-50`).
8. IF a TaskCard is in the "In Progress" Column AND the task's `progress` field is a number between 0 and 100, THEN THE TaskCard SHALL display a progress bar below the title with a primary-color fill width equal to `progress`%.
9. WHEN a TaskCard is clicked, THE Board SHALL open the TaskDetailsDrawer for that task.
10. WHEN a TaskCard is hovered, THE TaskCard SHALL display an `edit` Material Symbol icon button in the top-right corner of the card.

---

### Requirement 8: Kanban Board — Drag-and-Drop

**User Story:** As a user, I want to drag tasks between columns and reorder them within a column, so that I can visually manage my workflow.

#### Acceptance Criteria

1. THE Board SHALL wrap its drag context using DndKit's `DndContext` with `PointerSensor` and `KeyboardSensor` configured.
2. EACH TaskCard SHALL be a DndKit `useSortable` item identified by the task's unique `id`.
3. EACH Column SHALL be a DndKit droppable container identified by the column's status key (e.g., `"todo"`, `"in-progress"`, `"review"`, `"done"`).
4. WHEN a drag operation begins, THE Board SHALL render a `DragOverlay` containing a copy of the TaskCard scaled to `1.04` with box shadow `0 8px 24px rgba(0,0,0,0.15)`; WHEN the drag operation ends (drop or cancel), THE `DragOverlay` SHALL be removed.
5. WHEN a TaskCard is dragged over a Column, THE Column SHALL display a 2 px horizontal line in the primary color at the projected insertion point.
6. WHEN a drag operation ends over a valid Column, THE TaskContext's `moveTask` SHALL be called with the task's `id`, the target Column's status key, and the drop index (position in the target column at the point of release); the task's `status` and position SHALL be updated accordingly.
7. WHEN a drag operation ends outside any valid Column, THE TaskContext SHALL not be updated and the task SHALL remain in its original Column and position.
8. WHEN a TaskCard is focused and the Space or Enter key is pressed, THE Board SHALL activate keyboard drag mode for that card; WHEN in keyboard drag mode, pressing Escape SHALL cancel the drag; WHEN in keyboard drag mode, THE Board SHALL announce the drag state change via an `aria-live` region.

---

### Requirement 9: Create Task Modal

**User Story:** As a user, I want to create a new task through a form modal, so that I can add work items to the board without leaving my current view.

#### Acceptance Criteria

1. THE CreateTaskModal SHALL render as a centered modal overlay with a `backdrop-blur` backdrop over the full viewport.
2. THE CreateTaskModal SHALL contain a Title input rendered in `headline-md` style with an underline-only focus indicator (no box border on focus).
3. THE CreateTaskModal SHALL contain a Status selector, a Priority selector, a Due Date date input, and an Assignee text field, arranged in a 2-column grid below the Title.
4. THE Status selector SHALL offer the options: "Todo", "In Progress", "In Review", "Done".
5. THE Priority selector SHALL offer the options: "Low", "Medium", "High", "Urgent".
6. THE CreateTaskModal SHALL contain a Description textarea with a formatting toolbar displaying icon buttons for: Bold, Italic, Strikethrough, Bulleted List, Numbered List, and Attach File (all toolbar buttons are visual placeholders requiring no text-transformation behavior in this scope).
7. THE CreateTaskModal SHALL contain a Labels section displaying added labels as removable chip badges; WHEN the `×` on a chip is clicked, THE chip SHALL be removed from the local form state only.
8. WHEN the "Create Task" button is clicked with a non-empty title, THE TaskContext `addTask` SHALL be called with the form values (unset optional fields default to `null` for dueDate, `""` for description, `[]` for labels, `"low"` for priority, and `"todo"` for status if no pre-set was provided); THE CreateTaskModal SHALL then close.
9. IF the "Create Task" button is clicked with an empty title field, THEN THE CreateTaskModal SHALL display the error message "Title is required" beneath the title input without closing.
10. WHEN the "Cancel" button or the `close` icon button is clicked, THE CreateTaskModal SHALL close without calling any TaskContext action.
11. WHEN the CreateTaskModal is open and the Escape key is pressed, THE CreateTaskModal SHALL close without calling any TaskContext action.
12. WHEN the CreateTaskModal is open, keyboard focus SHALL be trapped within the modal (Tab and Shift+Tab cycle through modal focusable elements only).
13. WHEN the CreateTaskModal is opened, all form fields SHALL be reset to their default/empty values (or the pre-set status value if provided).

---

### Requirement 10: Task Details Drawer

**User Story:** As a user, I want to open a detailed view of a task in a side drawer, so that I can read and edit all task fields without navigating away from the board.

#### Acceptance Criteria

1. WHEN a TaskCard is clicked, THE TaskDetailsDrawer SHALL slide in from the right edge of the viewport over 300 ms; THE drawer SHALL be 400 px wide.
2. THE TaskDetailsDrawer SHALL display the task's title, status, priority, due date (display-only), assignee (display-only), description, and labels.
3. WHEN the TaskDetailsDrawer is open, a backdrop at 40% opacity (`bg-black/40`) SHALL cover the Board content; THE backdrop SHALL block pointer events to the Board content beneath it.
4. THE TaskDetailsDrawer SHALL render an editable title `<input>` pre-populated with the task's `title`; WHEN the input loses focus or Enter is pressed AND the input value is non-empty, THE TaskContext `updateTask` SHALL be called with the new title; IF the input value is empty on blur or Enter, THE title SHALL revert to the last saved value without calling `updateTask`.
5. THE TaskDetailsDrawer SHALL render a Status `<select>` and a Priority `<select>` pre-populated with the task's current values; WHEN either value is changed, THE TaskContext `updateTask` SHALL be called immediately with the new value.
6. THE TaskDetailsDrawer SHALL render a "Delete Task" button; WHEN clicked, THE TaskContext `deleteTask` SHALL be called with the task's `id` and THE TaskDetailsDrawer SHALL close.
7. WHEN the `close` icon button is clicked or the Escape key is pressed, THE TaskDetailsDrawer SHALL close (slide out) without additional state changes.
8. THE TaskDetailsDrawer SHALL render the task's `id` (e.g., "APP-102") as a non-editable `<span>` reference label.
9. THE TaskDetailsDrawer SHALL render the `dueDate` and `assignee` fields as read-only display elements (not inputs or selects).

---

### Requirement 11: Task State Management

**User Story:** As a developer, I want all task state managed through a central context, so that any component can read or modify tasks without prop-drilling.

#### Acceptance Criteria

1. THE TaskContext SHALL initialize its `tasks` array from the default export of `mockTasks.js`, which seeds at least 8 tasks across all four column statuses.
2. THE TaskContext SHALL expose `{ tasks, addTask, updateTask, deleteTask, moveTask }` as its context value.
3. WHEN `addTask(taskData)` is called, THE TaskContext SHALL merge `taskData` with `{ id: crypto.randomUUID() }` and append the resulting task object to the `tasks` array; IF `taskData.status` is not one of `"todo"`, `"in-progress"`, `"review"`, or `"done"`, THEN `"todo"` SHALL be used as the status.
4. WHEN `updateTask(id, changes)` is called AND a task with the given `id` exists, THE TaskContext SHALL produce a new task object by merging `changes` into the existing task (shallow merge), leaving all unspecified fields unchanged; IF no task with the given `id` exists, THEN the `tasks` array SHALL remain unchanged.
5. WHEN `deleteTask(id)` is called, THE TaskContext SHALL remove the task with the matching `id` from the `tasks` array; IF no task with the given `id` exists, the array SHALL remain unchanged.
6. WHEN `moveTask(id, toStatus, toIndex)` is called, THE TaskContext SHALL update the task's `status` to `toStatus` and insert it at position `toIndex` within the ordered list of tasks sharing `toStatus`; IF `toIndex` is greater than the length of that column's task list, THE task SHALL be appended at the end.
7. THE TaskContext SHALL use immutable state updates: every action SHALL produce a new `tasks` array reference rather than mutating the existing array.

---

### Requirement 12: Mock Data

**User Story:** As a developer, I want realistic seed data, so that the board looks populated and representative during development and demos.

#### Acceptance Criteria

1. THE `mockTasks.js` file SHALL export a default array of at least 8 task objects.
2. EACH mock task object SHALL include exactly these fields: `id` (string), `title` (string), `status` (one of `"todo"` | `"in-progress"` | `"review"` | `"done"`), `priority` (one of `"low"` | `"medium"` | `"high"` | `"urgent"`), `labels` (string array), `description` (string), `dueDate` (ISO 8601 date string in `YYYY-MM-DD` format, or `null`), `assignee` (object with `name` string and `initials` string), `progress` (number 0–100 or `null`), and `comments` (non-negative integer).
3. THE mock data SHALL contain at least 2 tasks with `status: "todo"`, at least 2 tasks with `status: "in-progress"`, at least 1 task with `status: "review"`, and at least 2 tasks with `status: "done"`.
4. THE mock data SHALL contain at least one task with a non-null `progress` value (to exercise the progress bar), at least one task with `priority: "urgent"`, and at least one task with 2 or more entries in `labels`.

---

### Requirement 13: Settings Page

**User Story:** As a user, I want a Settings page with profile and appearance tabs, so that I can customize my account and visual preferences in one place.

#### Acceptance Criteria

1. THE Settings page SHALL render within the Layout shell (Sidebar and Navbar visible).
2. THE Settings page SHALL display two tab buttons: "Profile" and "Appearance"; THE "Profile" tab SHALL be active by default on first render.
3. WHEN the "Profile" tab is active, THE Settings page SHALL display a Full Name text input and an Email text input, each pre-populated with the corresponding fields from the current `AuthContext` user.
4. WHEN the "Appearance" tab is active, THE Settings page SHALL display a theme toggle control labeled "Dark Mode" that is ON WHILE `theme === "dark"` and OFF WHILE `theme === "light"`; WHEN the toggle is changed, THE Settings page SHALL call `toggleTheme`.
5. THE "Profile" tab panel SHALL render a "Save Changes" button; WHEN clicked, THE Settings page SHALL display the inline success message "Changes saved" beneath the button; this message SHALL persist until the user switches tabs or clicks "Save Changes" again.
6. WHEN a tab button is clicked, THE Settings page SHALL display the corresponding panel and hide the other panel without a page reload; the active tab button SHALL receive a visually distinct active style (primary color underline and text).
7. IF the Email input in the Profile tab does not contain an `@` character WHEN "Save Changes" is clicked, THEN THE Settings page SHALL display an inline error message "Enter a valid email address" beneath the Email input instead of the success message.

---

### Requirement 14: Dashboard Page

**User Story:** As a user, I want a Dashboard home page, so that I have a landing surface after logging in.

#### Acceptance Criteria

1. THE Dashboard page SHALL render within the Layout shell (Sidebar and Navbar visible).
2. THE Dashboard page SHALL display a greeting headline in the format "Good [morning/afternoon/evening], [user.name]" using the authenticated user's `name` from `AuthContext`.
3. THE Dashboard page SHALL display exactly three stat cards with the following data derived from `TaskContext.tasks`: a "Total Tasks" card showing the total task count, an "In Progress" card showing the count of tasks with `status: "in-progress"`, and a "Completed" card showing the count of tasks with `status: "done"`; each card SHALL display a labeled title and its numeric count.
4. THE Dashboard page SHALL display a "Go to Board" button that navigates to `/boards` when clicked.

---

### Requirement 15: Design System Implementation

**User Story:** As a developer, I want the Tailwind configuration to implement the Kinetic Enterprise design system tokens, so that all components can use consistent color, typography, and spacing values.

#### Acceptance Criteria

1. THE `index.css` SHALL define all Kinetic Enterprise color tokens inside a `@theme` block (Tailwind v4 syntax), including: `--color-primary: #0058be`, `--color-on-primary: #ffffff`, `--color-background: #f9f9ff`, all `--color-surface-*` variants, `--color-on-surface`, `--color-on-surface-variant`, `--color-outline`, `--color-outline-variant`, `--color-error`, `--color-error-container`, `--color-on-error-container`, and all remaining Kinetic Enterprise tokens.
2. THE `index.css` `@theme` block SHALL define spacing tokens: `--spacing-xs: 4px`, `--spacing-sm: 8px`, `--spacing-md: 16px`, `--spacing-lg: 24px`, `--spacing-xl: 32px`, `--spacing-2xl: 48px`, `--spacing-sidebar-width: 260px`, `--spacing-kanban-column-width: 300px`.
3. THE `index.css` `@theme` block SHALL define fontSize tokens: `--text-body-md` (14px / line-height 20px / weight 400), `--text-body-lg` (16px / 24px / 400), `--text-label-md` (13px / 18px / 500), `--text-label-sm` (12px / 16px / 600 / letter-spacing 0.05em), `--text-headline-sm` (18px / 28px / 600), `--text-headline-md` (24px / 32px / 600 / letter-spacing -0.01em), `--text-display-lg` (36px / 44px / 700 / letter-spacing -0.02em), `--text-display-lg-mobile` (28px / 36px / 700 / letter-spacing -0.01em).
4. THE `vite.config.js` (or `tailwind.config.js` if present) SHALL set `darkMode: "class"` to enable class-based dark mode toggling.
5. THE `index.css` SHALL include `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')` and apply `font-family: 'Inter', sans-serif` to the `:root` or `body` selector.
6. THE `index.css` SHALL define a `.kanban-scroll` class with custom scrollbar styles: `scrollbar-width: thin` and `::-webkit-scrollbar` rules setting a 6 px thumb, transparent track, and `var(--color-outline-variant)` thumb color.
7. EACH interactive element (buttons, links, inputs) SHALL use color combinations that achieve a minimum 4.5:1 contrast ratio (WCAG 2.1 AA) for text against its background color in both light and dark themes.
