# AccessoryHub - MERN Folder Structure

## Project Structure

```
AccessoryHub/
├── client/                          # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/                   # Page components
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── MyOrders.js
│   │   │   ├── Register.js
│   │   │   └── VendorDashboard.js
│   │   ├── context/                 # React Context (state management)
│   │   │   └── AuthContext.js
│   │   ├── services/                # API services
│   │   │   └── api.js
│   │   ├── App.js                   # Root component
│   │   ├── index.js                 # Entry point
│   │   ├── index.css                # Global styles (all CSS consolidated here)
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   ├── package.json
│   └── README.md
│
└── server/                          # Express backend
    ├── config/                      # Configuration
    │   └── db.js
    ├── controllers/                 # Route controllers
    │   ├── authController.js
    │   ├── cartController.js
    │   ├── orderController.js
    │   ├── productController.js
    │   ├── reviewController.js
    │   └── userController.js
    ├── middleware/                  # Custom middleware
    │   ├── adminMiddleware.js
    │   ├── authMiddleware.js
    │   └── roleMiddleware.js
    ├── models/                      # Mongoose models
    │   ├── Cart.js
    │   ├── Order.js
    │   ├── Product.js
    │   ├── Review.js
    │   └── User.js
    ├── routes/                      # API routes
    │   ├── adminRoutes.js
    │   ├── authRoutes.js
    │   ├── cartRoutes.js
    │   ├── orderRoutes.js
    │   └── productRoutes.js
    ├── server.js                    # Main server entry point
    └── package.json
```
