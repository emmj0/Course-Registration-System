// Import required modules
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/auth", authRoutes); // Handles Student & Admin login
app.use("/students", studentRoutes);
app.use("/admin", adminRoutes);

// Render EJS Login Page
app.get("/login", (req, res) => {
  res.render("auth/login"); // Use login.ejs instead of static login.html
});

// Dashboard Routes
app.get("/student-dashboard", (req, res) => res.render("student/student-dashboard"));
app.get("/admin-dashboard", (req, res) => res.render("admin/admin-dashboard"));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
