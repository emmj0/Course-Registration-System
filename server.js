const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/auth", authRoutes); 
app.use("/students", studentRoutes);
app.use("/admin", adminRoutes);

app.get("/login", (req, res) => {
  res.render("auth/login"); 
});

app.get("/student-dashboard", (req, res) => res.render("student/student-dashboard"));
app.get("/admin-dashboard", (req, res) => res.render("admin/admin-dashboard"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}`);
});
