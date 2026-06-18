# Framio - Premium Home Décor Frames eCommerce Platform

A production-ready single-vendor eCommerce platform built with Next.js, Mantine UI, and a custom PHP backend.

## Project Structure

```
Framio/
├── framio-backend/          # Custom PHP REST API Backend
│   ├── app/
│   │   ├── Helpers/         # Database and Auth helpers
│   │   ├── Http/Controllers/ # API Controllers
│   │   └── Models/          # Data Models
│   ├── config/              # Configuration files
│   ├── database/migrations/ # Database migrations
│   ├── public/              # Public entry point
│   └── routes/              # API routes
└── framio-frontend/         # Next.js Frontend
    ├── src/
    │   ├── app/            # Next.js App Router pages
    │   ├── atoms/          # Jotai state management
    │   ├── components/     # Reusable components
    │   ├── services/       # API service layer
    │   └── utils/          # Utility functions
    └── public/             # Static assets
```

## Technology Stack

### Backend
- PHP 8.0+
- MySQL/PostgreSQL
- Custom REST API architecture
- JWT Authentication
- PDO for database interactions

### Frontend
- Next.js 14
- React 18
- Mantine UI 7
- Tailwind CSS
- Jotai (state management)
- Axios (HTTP client)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd framio-backend
```

2. Configure environment variables in `.env`:
```env
APP_NAME=Framio
DB_HOST=localhost
DB_PORT=3306
DB_NAME=framio
DB_USER=root
DB_PASS=
```

3. Run database migrations:
```bash
php database/migrate.php
```

4. Start the PHP development server:
```bash
php -S localhost:8000 -t public
```

The backend API will be available at `http://localhost:8000/api/v1`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd framio-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Products
- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Categories
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get category details
- `POST /api/v1/categories` - Create category (admin)
- `PUT /api/v1/categories/:id` - Update category (admin)
- `DELETE /api/v1/categories/:id` - Delete category (admin)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/add` - Add item to cart
- `POST /api/v1/cart/update` - Update cart item
- `POST /api/v1/cart/remove` - Remove item from cart
- `POST /api/v1/cart/clear` - Clear cart

### Wishlist
- `GET /api/v1/wishlist` - Get user wishlist
- `POST /api/v1/wishlist/add` - Add item to wishlist
- `POST /api/v1/wishlist/remove` - Remove item from wishlist
- `POST /api/v1/wishlist/clear` - Clear wishlist

### Orders
- `GET /api/v1/orders` - Get user orders
- `GET /api/v1/orders/:id` - Get order details
- `POST /api/v1/orders` - Create order
- `PUT /api/v1/orders/:id/status` - Update order status (admin)

### Admin Dashboard
- `GET /api/v1/admin/dashboard` - Dashboard statistics
- `GET /api/v1/admin/orders` - All orders
- `GET /api/v1/admin/customers` - All customers
- `GET /api/v1/admin/reports/sales` - Sales report
- `GET /api/v1/admin/reports/products` - Product report
- `GET /api/v1/admin/reports/customers` - Customer report

## Features

### Customer Website
- Homepage with hero section and featured products
- Product listing with search, sorting, and filtering
- Product details page with image gallery and reviews
- Shopping cart management
- Checkout process
- Customer dashboard (profile, orders, wishlist)
- User authentication (login/register)

### Admin Dashboard
- Dashboard with sales statistics
- Product management (CRUD operations)
- Category management (CRUD operations)
- Order management and status updates
- Customer management
- Sales, product, and customer reports

## Database Schema

### Tables
- `users` - User accounts
- `categories` - Product categories
- `products` - Product information
- `product_images` - Product images
- `carts` - Shopping carts
- `cart_items` - Cart items
- `orders` - Customer orders
- `order_items` - Order items
- `payments` - Payment information
- `reviews` - Product reviews
- `wishlists` - User wishlists

## Authentication

The platform uses JWT (JSON Web Tokens) for authentication:
- Tokens are generated on login/registration
- Tokens are stored in localStorage
- Tokens are sent in the Authorization header for protected routes
- Tokens expire after a configurable time

## Admin Access

To access the admin dashboard:
1. Register a user account
2. Update the user's role to 'admin' in the database
3. Login with the admin account
4. Navigate to `/admin`

## Development Notes

- The backend uses a custom PHP implementation instead of full Laravel due to environment constraints
- JWT authentication is implemented manually using a helper class
- Database migrations are PHP scripts that execute SQL directly
- The frontend uses Next.js App Router for routing
- State management is handled by Jotai atoms
- All API calls go through a centralized Axios instance with interceptors

## Future Enhancements

- File upload functionality for product images
- Payment gateway integration (Stripe, PayPal)
- Enhanced error handling and validation
- Email notifications
- Order tracking
- Product recommendations
- Advanced search and filtering
- Multi-language support
- Mobile app

## License

This project is for demonstration purposes.
