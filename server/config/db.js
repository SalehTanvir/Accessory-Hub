const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
    console.warn("MongoDB connection failed. The server will keep running, but database-backed features will not work until the connection is fixed.");
  }
};

module.exports = connectDB;