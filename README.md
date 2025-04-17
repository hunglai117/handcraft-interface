# HandcraftBK E-commerce Interface

This is a Next.js-based e-commerce interface for HandcraftBK, a platform connecting skilled artisans with customers who value handcrafted products.

## Project Overview

HandcraftBK showcases handmade products from artisans around the world, offering a rich shopping experience with detailed product information, user accounts, and a smart shopping assistant.

### Key Features

- **Product Catalog** - Browse and search through a collection of handcrafted products
- **Category Navigation** - Filter products by categories, tags, and price range
- **Product Details** - View comprehensive information about each product
- **Shopping Cart** - Add products and manage your shopping cart
- **User Authentication** - Create an account, log in, and manage your profile
- **Responsive Design** - Optimized for both desktop and mobile devices
- **AI Chat Assistant** - Get help and product recommendations through the chat interface
- **Search Functionality** - Quick access to products with keyboard shortcut (press '/')

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/pages` - Contains all the routes and API endpoints
  - `/product` - Product detail pages
  - `/categories` - Category-specific pages
  - `/account` - User account management
  - `/api` - Backend API endpoints
- `/components` - Reusable UI components
  - UI components (ProductCard, QuickViewModal, etc.)
  - Layout components (Navbar, Footer, etc.)
  - Chat interface components (ChatInput, ChatFooter, etc.)
- `/contexts` - React context providers (Auth, Cart, etc.)
- `/lib` - Type definitions and shared libraries
- `/services` - API service integrations
- `/styles` - CSS Modules and global styles
- `/utils` - Utility functions
- `/public` - Static assets like images, fonts, etc.

## Technologies Used

- **Next.js** - React framework for server-side rendering and static site generation
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
