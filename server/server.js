import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbconnect.js";
import initRoutes from "./router/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const port = process.env.PORT || 8888;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();
initRoutes(app);

app.use("/", (req, res) => {
  res.send("SERVER ON");
});

app.listen(port, () => {
  console.log("Server running on: " + port);
});
