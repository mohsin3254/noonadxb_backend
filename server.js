const express = require("express");
const app = express();
const mongoose = require("./db");
const serviceRoute = require("./routes/serviceRoute");
const userRoute = require("./routes/userRoute");
const bookingRoute = require("./routes/bookingRoute");
const cors = require("cors");
const dotenv = require("dotenv");
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Other middlewares and routes

dotenv.config(); // Load environment variables

const port = process.env.PORT || 6500;
app.use(cors());

app.use(express.json());
app.use("/api/services", serviceRoute);
app.use("/api/users", userRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/auth", authRouter);
app.get("/", (req, res) => res.send("Noonadxd Server Connection Successful"));

app.listen(port, () => console.log(`Server is running on port ${port}`));
