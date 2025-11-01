# AgroConnect Frontend

A modern, responsive React application for connecting farmers directly with buyers. Built with
React, TypeScript, TailwindCSS, and Zustand for state management.

## 🌱 Theme

- **Primary Color**: #2bbe65 (Green)
- **Secondary Color**: White (#ffffff)
- **Theme**: Agricultural/Nature-inspired design

## 🚀 Features

### For Farmers

- 📦 Product Management (Create, Read, Update, Delete)
- 📊 Dashboard with sales statistics
- 📋 Order management with status updates
- 🔔 Real-time order notifications

### For Buyers

- 🛒 Browse and search products
- 🛍️ Shopping cart functionality
- 📦 Order tracking
- 🔔 Real-time notifications

### For Admins

- 👥 User management
- 📊 Platform analytics
- 📢 Broadcast notifications
- 🔍 Order monitoring

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (default: http://localhost:5000)

## 🛠️ Installation

1. **Clone the repository**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. **Start development server**

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── layout/                # Layout components (Navbar, Sidebar, Footer)
│   ├── farmer/                # Farmer-specific components
│   ├── buyer/                 # Buyer-specific components
│   ├── admin/                 # Admin-specific components
│   └── shared/                # Shared components (ProtectedRoute, etc.)
├── pages/
│   ├── auth/                  # Authentication pages
│   ├── farmer/                # Farmer dashboard & pages
│   ├── buyer/                 # Buyer marketplace & pages
│   └── admin/                 # Admin panel
├── services/                  # API service modules
├── store/                     # Zustand state management
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript type definitions
├── constants/                 # App constants & theme
└── lib/                       # Utility functions
```

## 🎨 Key Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time updates
- **React Hook Form** - Form management
- **React Toastify** - Notifications
- **Shadcn UI** - Component library
- **Lucide React** - Icons
- **date-fns** - Date utilities

## 🔐 Authentication

The app uses JWT-based authentication:

- Token stored in localStorage
- Auto-redirect on unauthorized access
- Role-based route protection

## 🌐 API Integration

All API calls are handled through service modules:

- `authService` - Authentication
- `farmerService` - Farmer operations
- `buyerService` - Buyer operations
- `adminService` - Admin operations
- `notificationService` - Notifications

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔔 Real-time Features

Socket.io integration for:

- Live order notifications
- Real-time status updates
- Instant messaging (if implemented)

## 🛣️ Routes

### Public Routes

- `/` - Home page
- `/about` - About page
- `/login` - Login page
- `/register` - Registration page

### Farmer Routes (Protected)

- `/farmer/dashboard` - Farmer dashboard
- `/farmer/products` - Product management
- `/farmer/orders` - Order management

### Buyer Routes (Protected)

- `/buyer/marketplace` - Browse products
- `/buyer/cart` - Shopping cart
- `/buyer/orders` - Order history
- `/buyer/checkout` - Checkout page

### Admin Routes (Protected)

- `/admin/panel` - Admin dashboard
- `/admin/users` - User management
- `/admin/orders` - Order monitoring
- `/admin/broadcast` - Send broadcasts

## 🎯 State Management

### Auth Store (Zustand)

```typescript
- user: Current user data
- token: JWT token
- isAuthenticated: Auth status
- login(): Login user
- logout(): Logout user
```

### Cart Store (Zustand)

```typescript
- items: Cart items
- addItem(): Add to cart
- removeItem(): Remove from cart
- updateQuantity(): Update quantity
- clearCart(): Clear cart
- getTotalAmount(): Calculate total
```

## 🎨 Theming

The app uses a consistent green theme (#2bbe65) throughout:

- Primary buttons and accents
- Icons and highlights
- Success messages
- Brand elements

## 🔧 Development

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint code

```bash
npm run lint
```

## 📝 Environment Variables

| Variable            | Description          | Default                     |
| ------------------- | -------------------- | --------------------------- |
| `VITE_API_BASE_URL` | Backend API URL      | `http://localhost:5000/api` |
| `VITE_SOCKET_URL`   | Socket.io server URL | `http://localhost:5000`     |

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow the DRY principle
4. Keep components modular and reusable
5. Use the green theme color (#2bbe65) consistently
6. Write meaningful commit messages

## 🐛 Known Issues

- Check the GitHub issues page for current bugs
- Report new issues with detailed descriptions

## 📄 License

MIT License

## 👥 Team

AgroConnect Development Team

## 🙏 Acknowledgments

- Shadcn UI for component library
- Lucide React for icons
- TailwindCSS for styling utilities

---

**Happy Coding! 🌱**
