import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRouter from "./router/authRoutes.js";
import userRoutes from "./router/userRoutes.js";
import postRouter from "./router/postRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev")); 
app.use(cors({ origin: '*',credentials:true }));


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

app.use("/api/auth", authRouter);
app.use('/api/user',userRoutes)
app.use('/api/post',postRouter)

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
