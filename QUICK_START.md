# 🚀 AgroConnect - Quick Start Guide

## Prerequisites

- Node.js v18+ installed
- Backend API running on http://localhost:5000

## Setup Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Setup

The `.env` file is already created with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

Application will open at: **http://localhost:5173**

## 🎯 Test the Application

### Register a Farmer Account

1. Go to http://localhost:5173/register
2. Fill in the form:
   - Name: John Farmer
   - Email: farmer@test.com
   - Password: password123
   - Role: **Farmer**
   - Location: Your area/city
3. Click "Create Account"
4. You'll be redirected to the Farmer Dashboard

### Register a Buyer Account

1. Open incognito/private window
2. Go to http://localhost:5173/register
3. Fill in the form:
   - Name: Jane Buyer
   - Email: buyer@test.com
   - Password: password123
   - Role: **Buyer**
   - Location: Your area/city
4. Click "Create Account"
5. You'll be redirected to the Marketplace

## 🌱 Farmer Workflow

1. **Login** → Redirected to Dashboard
2. **View Stats** → Products, Orders, Revenue
3. **Add Product** → Click "Add Product" button
   - Name: Fresh Tomatoes
   - Category: Vegetable
   - Price: 60
   - Unit: kg
   - Quantity: 100
   - Quality: Organic
   - Description: Fresh organic tomatoes
4. **Manage Products** → Edit or delete products
5. **View Orders** → See pending orders
6. **Update Order Status** → Change status from pending to confirmed

## 🛒 Buyer Workflow

1. **Login** → Redirected to Marketplace
2. **Browse Products** → See all available products
3. **Search/Filter** → Use search or category filter
4. **Add to Cart** → Click "Add to Cart" on any product
5. **View Cart** → Click cart icon in navbar
6. **Place Order** → (Not yet implemented in this version)

## 🎨 Theme

The entire application uses the **green (#2bbe65)** theme:

- Primary buttons
- Icons and accents
- Success messages
- Navigation highlights

## 📱 Responsive Design

Test on different screen sizes:

- **Desktop**: Full sidebar navigation
- **Tablet**: Collapsible sidebar
- **Mobile**: Hamburger menu

## 🔔 Features to Explore

### Navbar

- Logo (AgroConnect)
- Cart icon (for buyers)
- Notifications bell
- User menu

### Sidebar

- Role-specific navigation
- Active route highlighting
- Smooth transitions

### Dashboard (Farmer)

- Statistics cards
- Recent orders
- Product overview

### Marketplace (Buyer)

- Product cards
- Search functionality
- Category filtering
- Add to cart

## 🐛 Common Issues

### Backend Not Running

**Error**: Failed to fetch **Solution**: Start the backend server first

```bash
cd backend
npm start
```

### Port Already in Use

**Error**: Port 5173 is already in use **Solution**:

```bash
# Kill the process or use a different port
npm run dev -- --port 3000
```

### CORS Errors

**Solution**: Ensure backend has CORS enabled for http://localhost:5173

## 📚 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎯 What's Implemented

✅ Authentication (Login/Register) ✅ Farmer Dashboard with stats ✅ Product Management (CRUD) ✅
Buyer Marketplace with search ✅ Shopping Cart ✅ Real-time Notifications (UI ready) ✅ Responsive
Navigation ✅ Protected Routes ✅ Role-based Access

## 🔜 Next Steps (If you want to extend)

- Complete checkout flow
- Add order tracking page
- Implement admin panel
- Add user profile page
- Create order history
- Add payment integration
- Enhance notifications

## 💡 Tips

1. Use Chrome DevTools to inspect components
2. Check Console for any errors
3. Use React DevTools extension
4. Test on different browsers
5. Check mobile responsiveness

## 🆘 Need Help?

Check the documentation:

- `FRONTEND_README.md` - Detailed documentation
- `IMPLEMENTATION_SUMMARY.md` - What's been implemented
- Backend `API_DOCUMENTATION.md` - API reference

## 🎉 Enjoy!

Your AgroConnect frontend is ready to use! The application features:

- Beautiful green agricultural theme
- Smooth user experience
- Responsive design
- Clean code architecture

Happy farming! 🌾
