import express from "express";
import OrderRoutes from "./src/routes/OrderRoutes";
import ReportRoutes from "./src/routes/ReportRoutes";
import MenuRoutes from "./src/routes/MenuRoutes";
import cors from "cors";

const app = express();

// Allow frontend origin from environment variable or localhost for dev
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, "http://localhost:5173"]
  : ["http://localhost:5173"];

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));

app.use(express.json());

// Removed the classy approach because it felt like an overkill
app.use("/orders", OrderRoutes);
app.use("/reports", ReportRoutes);
app.use("/menu", MenuRoutes);

// For Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("Server is running on port " + PORT));
}




