import dotenv from "dotenv";
dotenv.config();
export const dbConfig = {
  HOST: process.env.MYSQL_HOST,
  PORT: process.env.MYSQL_PORT,
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DATABASE: process.env.MYSQL_DATABASE,
  DIALECT: process.env.MYSQL_DIALECT,
};
