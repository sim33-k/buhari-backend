import express from "express";
import OrderRoutes from "./src/routes/OrderRoutes";
import ReportRoutes from "./src/routes/ReportRoutes";
import MenuRoutes from "./src/routes/MenuRoutes";
import cors from "cors";

const app = express();

// Allow frontend origin from environment variable or localhost for dev
const allowedOrigins = [
  "https://buhari-frontend.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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




