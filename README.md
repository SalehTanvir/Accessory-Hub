# AccessoryHub

AccessoryHub is a full-stack e-commerce platform for managing accessories, vendors, carts, orders, and payments. It includes separate user, vendor, and admin experiences, plus features like authentication, password reset, product browsing, checkout, order tracking, reviews, and SSLCommerz payment handling.

## What problem this project solves

This project solves the problem of building a single online storefront where customers can browse and purchase accessories while vendors and administrators can manage the product catalog and order flow from their own dashboards.

It brings the core parts of a marketplace into one application:

- Customers can register, log in, add items to cart, checkout, and view their orders.
- Vendors can manage their products from a dedicated dashboard.
- Admins can monitor and manage the platform through an admin dashboard.
- The backend handles authentication, payments, reviews, and database-driven order management.

## How to run this project

The app is split into two parts: a React client and an Express/MongoDB server. Run them in two terminals.

### Prerequisites

- Node.js and npm
- MongoDB connection string
- Environment variables for the server

### 1. Start the backend

Open a terminal in the `server` folder and install dependencies:

```bash
npm install
```

Create a `.env` file in `server` and add the required values such as:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `SERVER_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `SSLCOMMERZ_STORE_ID`
- `SSLCOMMERZ_STORE_PASSWORD`
- `SSLCOMMERZ_IS_SANDBOX`

Then start the server:

```bash
npm run dev
```

If you do not want nodemon, you can use:

```bash
npm start
```

The server runs on `http://localhost:5000` by default.

### 2. Start the frontend

Open a second terminal in the `client` folder and install dependencies:

```bash
npm install
```

Start the React app:

```bash
npm start
```

The client runs on `http://localhost:3000` by default.

### 3. Open the app

Visit the frontend in your browser:

```bash
http://localhost:3000
```

## Available scripts

### Client

- `npm start` - run the React development server
- `npm run build` - create a production build
- `npm test` - run the test suite

### Server

- `npm start` - start the API server
- `npm run dev` - start the API server with nodemon

## Notes

- The client talks to the server API for authentication, products, cart, orders, reviews, and payments.
- Make sure the backend `.env` values are configured before testing login, checkout, email reset, or payment features.
