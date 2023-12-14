//
import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./model/index.js";

const app = express();

//parse url encoded bodies
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

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
