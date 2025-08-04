const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Life Bridge API");
});

app.use("/api/auth", authRoutes);

// Import routes
const requestRoutes = require("./routes/requests");
const pickupRoutes = require("./routes/pickup");
const bloodRequestRoutes = require("./routes/bloodRequestRoutes");
const profileRoutes = require("./routes/profile");
const communityRoutes = require("./routes/community");
const analyticsRoutes = require("./routes/analytics");

// Register routes
app.use("/api/requests", requestRoutes);
app.use("/api/pickups", pickupRoutes);
app.use("/api/blood-requests", bloodRequestRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
