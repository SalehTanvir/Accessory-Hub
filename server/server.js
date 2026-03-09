const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");// import database connection
const authRoutes = require("./routes/authRoutes");   
const productRoutes = require("./routes/productRoutes");

const app = express();

// connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});