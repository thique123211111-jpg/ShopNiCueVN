# Frontend Documentation - NiCueVN

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.jsx           # Home page
│   ├── layout.jsx         # Root layout
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── account/           # User account dashboard
│   ├── cart/              # Shopping cart
│   ├── admin/             # Admin dashboard
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── Header.jsx         # Navigation header
│   ├── Footer.jsx         # Footer
│   ├── Sidebar.jsx        # Product filters sidebar
│   └── ProductCard.jsx    # Product card component
├── lib/                    # Utility functions
│   ├── api.js             # Axios API instance
│   └── auth.js            # Authentication helpers
├── styles/                 # CSS stylesheets
│   └── globals.css        # Global styles
├── public/                 # Static assets
├── package.json           # Dependencies
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
└── .env.example           # Environment variables template
```

## 🛠️ Installation

### 1. Setup

```bash
cd frontend
cp .env.example .env.local
npm install
```

### 2. Environment Variables

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📦 Key Dependencies

- **Next.js 14**: React framework for production
- **TailwindCSS 3**: Utility-first CSS framework
- **Axios**: HTTP client
- **js-cookie**: Cookie management
- **JWT**: Authentication

## 🎨 Design System

### Colors

- **Pink**: `#ff4fa3` - Primary color, CTAs
- **Blue**: `#4facfe` - Secondary color, accents
- **Background**: `#f5f5f5` - Light background

### Component Architecture

All components are client components (`'use client'`) to handle interactivity.

#### Header Component
- Logo and branding
- Search functionality
- Cart icon with count
- User authentication (login/register/profile)
- Balance display

#### ProductCard Component
- Product image with discount badge
- Account ID
- Rank/Level info
- Price with discount
- Buy button with stock status
- Sales count

#### Sidebar Component
- Game categories
- Services list
- Price filters
- Rank filters
- Sort options

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Validates form data
3. Calls `/api/auth/register`
4. Receives JWT token
5. Stores token in cookies
6. Redirects to home

### Login
1. User enters email & password
2. Calls `/api/auth/login`
3. Receives JWT token
4. Stores token in cookies
5. Displays user profile in header

### Token Management
- Token stored in cookies with 7-day expiry
- Automatically attached to API requests
- Auto-logout on 401 response

## 🛒 Shopping Cart

### Local Storage
Cart stored in browser's localStorage as JSON:
```json
[
  {
    "id": 1,
    "accountId": "player_001",
    "originalPrice": 500000,
    "discountedPrice": 450000,
    "quantity": 1
  }
]
```

### Cart Operations
- Add item: Adds to localStorage or increments quantity
- Remove item: Deletes from localStorage
- Update quantity: Modifies quantity in localStorage
- Clear cart: Resets localStorage

## 📱 Responsive Design

- Mobile: 1 column layout
- Tablet (768px): 2 columns
- Desktop (1024px): 3 columns

## 🚀 Building for Production

```bash
npm run build
npm run start
```

## 🐛 Debugging

Enable debug logs:
```javascript
// In lib/api.js
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) console.log('API call:', config);
```

## 📖 Pages Overview

### Home `/`
- Banner with promotions
- Top payment methods
- Featured products
- Lucky spin minigame
- Mystery boxes
- All products grid

### Login `/login`
- Email & password form
- OAuth options (Google, Facebook)
- Link to register

### Register `/register`
- Username, email, password form
- Terms acceptance checkbox
- Link to login

### Account `/account`
- User profile section
- Wallet/balance display
- Order history
- Transaction history
- Security settings

### Cart `/cart`
- Products in cart with images
- Quantity selector
- Price calculation
- Order summary
- Checkout button

### Admin `/admin`
- Dashboard with stats
- Product management
- User management
- Order management
- Payment tracking

## 🔄 API Integration

All API calls go through `lib/api.js`:

```javascript
import api from '@/lib/api';

// GET request
const response = await api.get('/products');

// POST request
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});
```

## 🎯 Performance Tips

1. Use Next.js Image component for images
2. Implement lazy loading for product lists
3. Cache API responses where possible
4. Use React.memo for ProductCard
5. Implement pagination for product lists

## 🔗 Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Axios Docs](https://axios-http.com/)
