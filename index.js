import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/dbConnect.js";
import cors from "cors";

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors());

config({
  path: "./.env",
});


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 9000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODb connection failed !!! ", err);
  });

app.get("/", (req, res) => {
  res.send("server is working");
});

import authRouter from "./routes/Auth.routes.js";
app.use("/api/v1/users", authRouter);

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users1", userRouter);

import listingRouter from "./routes/listing.routes.js";
app.use("/api/v1/listings", listingRouter);