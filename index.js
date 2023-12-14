//
import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./model/index.js";

// Error handlers
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

//routes
import authRoute from "./route/auth.js";
const app = express();

//parse url encoded bodies
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

//route
app.use("/auth", authRoute);

// initializing express middlewares
app.use(notFound);
app.use(errorHandler);

//SERVER
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () => {
      db.sequelize.sync();
      console.log(`Server is listenning on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
