# 🌌 Kanban Project - Command Your Workflow

A premium, state-of-the-art Kanban task management application built with **React**, **Vite**, and **Tailwind CSS**. Designed for teams who value speed, aesthetics, and a seamless mobile-first experience.

![Kanban Project Preview](https://github.com/user-attachments/assets/kanban-preview-placeholder.png)

## ✨ Key Features

- **🚀 Advanced Drag-and-Drop**: Built on top of `@dnd-kit/core`, providing ultra-smooth, hardware-accelerated card sorting across columns.
- **📱 True Mobile-First Design**:
  - **Dynamic 2x2 Grid**: Intelligent board layout on small screens prevents horizontal scrolling.
  - **Dnd Optimization**: Specialized `TouchSensor` with adaptive activation delay and `touch-action: none` for reliable mobile usage.
  - **Dynamic Viewport (`dvh`)**: Precise height management that eliminates gaps from mobile browser bars.
- **🎨 Premium UI/UX**:
  - **Material Design 3 Tokens**: A robust design system using HSL-tailored colors and glassmorphic surfaces.
  - **Dark Mode Native**: First-class support for light and dark themes with smooth fading transitions.
  - **Sleek Typography**: Powered by the 'Inter' typeface for maximum readability.
- **🔐 Secure Auth Experience**: Polished, branded Login and Signup pages featuring fluid input validation and responsive layouts.
- **⚙️ Comprehensive Settings**: Unified dashboard for managing profile information and interface preferences.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Navigation**: [React Router 6](https://reactrouter.com/)
- **DND Engine**: [@dnd-kit](https://dndkit.com/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/kanban-project.git
   cd kanban-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch dev server**:
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

## 📂 Project Structure

```text
src/
├── components/
│   ├── auth/       # Login, Signup, ProtectedRoutes
│   ├── kanban/     # Board, Columns, TaskCards, Modals
│   ├── layout/     # Sidebar, Navbar, PageShells
│   └── common/     # Atomic UI elements
├── context/        # Auth, Theme, and Task state management
├── pages/          # Top-level route components
└── index.css       # Global design system & theme tokens
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Crafted with precision for modern development workflows.*
