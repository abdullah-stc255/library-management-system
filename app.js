import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/bookRoute.js";
import memberRoutes from "./routes/memberRoute.js";
import borrowRoute from "./routes/borrowRoute.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
connectDB();

app.use("/books", bookRoutes);
app.use("/members", memberRoutes);
app.use("/books", borrowRoute);

app.get("/healthcheck", (req, res) => {
  try {
    console.log("==============================");
    console.log("Healthcheck is fine");
    console.log("==============================");
    res.status(200).json({
      success: true,
      message: "Healthchec - Ok!!",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "App breaks on healthcheck",
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
  console.log("listening on port 3000");
});
