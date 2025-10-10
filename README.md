# Frontend Template

A modern, production-ready React + TypeScript template with comprehensive authentication, authorization (ABAC), and UI components.

## 🚀 Features

### Core Features
- ⚛️ **React 19** with TypeScript
- 🎨 **Tailwind CSS 4** with custom design system
- 🔐 **Complete Authentication System** with JWT tokens
- 🛡️ **Attribute-Based Access Control (ABAC)** for granular permissions
- 🌓 **Dark Mode** with system preference detection
- 📱 **Fully Responsive** mobile-first design
- 🧭 **React Router 7** for client-side routing
- 📦 **Feature-Driven Architecture** for scalability
- 🎯 **Form Validation** with React Hook Form + Zod
- 🔄 **State Management** with Zustand
- 📡 **Axios Interceptors** for API requests

### UI Components
- Custom form components with validation
- Shadcn/ui component library integration
- Responsive navigation and layout
- Theme toggle with light/dark/system modes
- Beautiful authentication pages

### Developer Experience
- 🔧 **TypeScript** for type safety
- 📝 **Comprehensive Documentation**
- 🧪 **Mock Data** for development and testing
- 🎨 **ESLint** configuration
- ⚡ **Vite** for fast development and building
- 🔥 **Hot Module Replacement (HMR)**

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Features Documentation](#features-documentation)
- [Development Guide](#development-guide)
- [Architecture](#architecture)
- [Contributing](#contributing)

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend-template
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### First Time Setup

1. **Login with a mock user:**
   - Email: `admin@example.com`
   - Password: `Password123!`

2. **Use the Dev User Switcher:**
   - Located in the bottom-right corner
   - Switch between different users to test permissions

3. **Explore the features:**
   - Dashboard
   - Permissions Demo (ABAC showcase)
   - User Forms
   - Settings

## 📁 Project Structure

```
frontend-template/
├── src/
│   ├── app/                    # Application-level code
│   │   ├── pages/              # Page components
│   │   └── routes/             # Route configurations
│   ├── components/             # Reusable UI components
│   │   ├── form/               # Form components
│   │   └── ui/                 # Shadcn UI components
│   ├── contexts/               # React contexts
│   │   └── ThemeContext.tsx    # Theme management
│   ├── features/               # Feature modules
│   │   ├── auth/               # Authentication
│   │   ├── authorization/      # ABAC system
│   │   ├── layout/             # Layout components
│   │   └── user-form/          # User form feature
│   ├── lib/                    # Utilities and configs
│   │   ├── axios/              # Axios setup & interceptors
│   │   └── utils.ts            # Helper functions
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # Architecture overview
│   ├── DEVELOPER_GUIDE.md      # Developer guide
│   └── features/               # Feature-specific docs
│       ├── AUTHENTICATION.md
│       └── AUTHORIZATION.md
├── public/                     # Static assets
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## 📚 Features Documentation

### Authentication System
Complete authentication with login, signup, JWT tokens, and protected routes.

👉 [Read the Authentication Documentation](./docs/features/AUTHENTICATION.md)

### Authorization (ABAC)
Attribute-Based Access Control for fine-grained permissions based on user attributes, resource properties, and environmental context.

👉 [Read the Authorization Documentation](./docs/features/AUTHORIZATION.md)

### Layout System
Responsive layout with navbar, sidebar, and content area.

**Key Components:**
- `MainLayout` - Main application layout
- `Navbar` - Top navigation with user menu and theme toggle
- `Sidebar` - Side navigation with links

### Form Components
Custom form components built on React Hook Form with Zod validation.

**Components:**
- `TextInput` - Text input with validation
- Form validation schemas
- Error handling

### Theme System
Dark mode support with light, dark, and system themes.

**Features:**
- Persistent theme preference
- System preference detection
- Smooth transitions
- Context-based theme management

## 🛠️ Development Guide

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Adding New Features

1. **Create a feature folder** in `src/features/`
2. **Follow the feature structure:**
   ```
   feature-name/
   ├── components/
   ├── hooks/
   ├── types/
   ├── services/
   ├── index.ts
   └── README.md
   ```
3. **Export through index.ts** (barrel export)
4. **Document in README.md**

### Code Style

- Use **TypeScript** for type safety
- Follow **feature-driven architecture**
- Use **barrel exports** (`index.ts`) for clean imports
- Write **self-documenting code** with comments
- Use **const enums** for type-safe constants

### Mock Data for Development

Mock users are available in `src/features/auth/mocks/mock-users.ts`:

| Email | Password | Role | Department | Clearance |
|-------|----------|------|------------|-----------|
| admin@example.com | Password123! | ADMIN | ADMIN | 5 |
| john.doe@example.com | Password123! | USER | ENGINEERING | 2 |
| jane.smith@example.com | Password123! | MANAGER | HR | 3 |
| finance@example.com | Password123! | USER | FINANCE | 3 |

Use the **Dev User Switcher** (bottom-right) to quickly switch between users.

## 🏗️ Architecture

This application follows a **feature-driven architecture** where each feature is self-contained with its own components, hooks, types, and services.

👉 [Read the Architecture Documentation](./docs/ARCHITECTURE.md)

### Key Architectural Decisions

1. **Feature-Driven Structure** - Each feature is isolated and reusable
2. **Type Safety** - TypeScript throughout with strict types
3. **Separation of Concerns** - Clear boundaries between features
4. **Barrel Exports** - Clean import paths
5. **Context-Based State** - React Context for global state
6. **Zustand for Auth** - Lightweight state management for auth
7. **ABAC for Permissions** - Flexible and scalable authorization

## 🧪 Testing

### Mock Authentication
The app uses mock authentication for development. All API calls are intercepted and handled locally.

### Testing Permissions
1. Navigate to **Permissions Demo** page
2. Use **Dev User Switcher** to change users
3. Observe how permissions change based on:
   - User role (Admin, Manager, User)
   - Department (Engineering, HR, Finance)
   - Clearance level (1-5)
   - Resource ownership

## 📖 API Documentation

### Authentication API
Mock API endpoints for authentication:

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/logout` - Logout current user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Axios Interceptors
- **Request Interceptor** - Adds auth tokens
- **Response Interceptor** - Handles errors and token refresh
- **Error Transformation** - Consistent error format

## 🎨 Styling

### Tailwind CSS
- **Version 4** with custom configuration
- Dark mode support
- Custom design tokens
- Responsive utilities

### Design Tokens
Colors, spacing, typography, and more are defined in `src/index.css`.

### Adding Custom Styles
```css
/* In src/index.css */
@theme inline {
  --color-custom: #yourcolor;
}
```

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Happy Coding! 🚀**
