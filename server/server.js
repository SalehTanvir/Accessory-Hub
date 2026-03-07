const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");   // import database connection

const app = express();

// connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});