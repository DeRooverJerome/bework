const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const {
  requireAuth,
  checkUser,
  checkJob,
} = require("./middleware/authMiddleware");
const path = require("path");
const methodOverride = require("method-override");

// Middleware

// Static Files for styles and images
app.use(express.static("public"));
app.use(express.static(__dirname + "/public/"));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Listener
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) =>
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
  )
  .catch((err) => console.log(err));

// Routes

app.get("*", checkUser, checkJob);
app.get("/", (req, res) => res.render("home"));
app.get("/dashboard", requireAuth, (req, res) => res.render("home"));
app.use(authRoutes);

module.exports = app;
