import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbconnect.js";
import initRoutes from "./router/index.js";
import cookieParser from "cookie-parser";
import cors from "cors"; // Import cors

dotenv.config();


const app = express();

const port = process.env.PORT || 8888;

// Sử dụng middleware 
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
); // Kích hoạt CORS cho tất cả các route
console.log("đee",process.env.CLIENT_URL);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu
dbConnect();

// Khởi tạo route
initRoutes(app);

// Route mặc định
app.use("/", (req, res) => {
  res.send("SERVER ON");
});

// Lắng nghe cổng
app.listen(port, () => {
  console.log("Server running on: " + port);
});
