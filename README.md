# Modern React Frontend Template

A feature-rich, production-ready React template built with TypeScript, featuring modern UI components, authentication, authorization, and real-time capabilities.

## 🚀 Features

- ⚡️ **[Vite](https://vitejs.dev/)** - Lightning fast build tool
- 🎨 **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components
- 🔒 **Authentication** - Complete auth system with mock service
- 🛡️ **[CASL](https://casl.js.org/)** - Simple, powerful permissions
- 🌙 **Dark Mode** - Elegant theme switching
- 🔄 **Real-time** - WebSocket integration
- 📊 **Analytics** - Modern dashboard with charts
- 🎯 **Type Safety** - Full TypeScript support

## 📦 Quick Start

   ```bash
# Clone the repository
git clone https://github.com/yourusername/frontend-template.git

# Install dependencies
   npm install

# Start development server
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── app/                # App-specific components
│   ├── pages/         # Page components
│   └── routes/        # Route definitions
│
├── components/        # Shared components
│   ├── ui/           # UI components (shadcn)
│   └── form/         # Form components
│
├── features/         # Feature modules
│   ├── auth/        # Authentication
│   ├── authorization/# Permissions (CASL)
│   ├── layout/      # Layout components
│   └── realtime/    # WebSocket integration
│
├── lib/             # Utilities & configurations
└── contexts/        # React contexts
```

## 🎨 Components

### UI Components

1. **Tabs**
```tsx
<TabsContainer 
  tabs={[
    {
      key: 'tab1',
      label: 'Details',
      icon: <Icon />,
      content: <Content />
    }
  ]}
  variant="modern"  // 'modern' | 'pills' | 'underline'
  orientation="horizontal"  // 'horizontal' | 'vertical'
/>
```

2. **Loading States**
```tsx
<LoadingSkeleton 
  variant="card"  // 'card' | 'table' | 'form' | 'list'
  count={3}
/>
```

3. **Toast Notifications**
```tsx
const toast = useToast();

toast.success({
  title: 'Success',
  description: 'Operation completed',
  action: {
    label: 'Undo',
    onClick: () => handleUndo()
  }
});
```

4. **Dialogs**
```tsx
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Confirm Action"
  loading={loading}
  onConfirm={handleConfirm}
/>
```

## 🔒 Authentication & Authorization

### Authentication

```tsx
// Login
const { login } = useAuthStore();
await login({ email, password });

// Protected Route
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Authorization (CASL)

```tsx
// Check permissions
const { can } = usePermissions();
if (can('create', 'User')) {
  // ...
}

// Protect UI elements
<Can I="update" a="User">
  <EditButton />
</Can>

// Protect routes
<PermissionGuard subject="Dashboard">
  <DashboardPage />
</PermissionGuard>
```

## 🎯 Type Safety

```typescript
// Action & Subject types
type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';
type Subjects = 'Dashboard' | 'User' | 'Settings' | 'all';

// Permission type
interface Permission {
  action: Actions;
  subject: Subjects;
}
```

## 🌈 Theme Support

```tsx
// Theme Provider
<ThemeProvider defaultTheme="system" storageKey="app-theme">
  <App />
</ThemeProvider>

// Use theme
const { theme, setTheme } = useTheme();
```

## 📊 Dashboard Features

- Modern analytics charts
- Real-time data updates
- Interactive data visualization
- Responsive layout
- Loading states
- Error handling

## 🔄 Real-time Features

```tsx
// Socket Provider
<SocketProvider>
  <App />
</SocketProvider>

// Use WebSocket
const socket = useSocket();
socket.emit('event', data);
```

## 🧪 Test Users

```typescript
// Admin (full access)
email: admin@example.com
password: admin123

// Manager
email: manager@example.com
password: manager123

// Regular User
email: user@example.com
password: user123

// Guest
email: guest@example.com
password: guest123
```

## 📱 Responsive Design

- Mobile-first approach
- Responsive navigation
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🛠️ Development Tools

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Vite for fast development
- shadcn/ui for components

## 🔧 Configuration

```typescript
// Theme configuration
// src/index.css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  // ...
}

// Vite configuration
// vite.config.ts
export default defineConfig({
  // ...
});
```

## 📚 Documentation

Detailed documentation for each feature:
- [Authentication Guide](./docs/features/AUTHENTICATION.md)
- [Authorization Guide](./docs/features/AUTHORIZATION.md)
- [Developer Guide](./docs/DEVELOPER_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT

---

Built with ❤️ for modern web development