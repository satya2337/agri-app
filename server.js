require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const checkoutRoutes = require("./routes/checkout");

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
//   FIXED: SIMPLE DB TEST (NO release())
// ==========================================
db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ MySQL Connection Failed:", err.message);
  } else {
    console.log("✅ MySQL Connected Successfully!");
    connection.release();
  }
});

// ==========================================
//   STATIC FILE ROUTING
// ==========================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "Frontend")));

// ==========================================
//   API ROUTE HANDLERS
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);

// ==========================================
//   FRONTEND CATCH-ALL
// ==========================================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

// ==========================================
//   START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
