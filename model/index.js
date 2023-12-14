import mysql from "mysql2";
import { dbConfig } from "../config/db-config.js";
import Sequelize from "sequelize";
const { DATABASE, DIALECT, HOST, PASSWORD, USER } = dbConfig;
import User from "./user.js";

//Create database if not exist
const createDatabaseConnection = async () => {
  const connection = mysql
    .createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
    })
    .promise();
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE}\`;`);
};

// Create the database before establishing the Sequelize connection
await createDatabaseConnection();
//Connect database
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: DIALECT,
  host: HOST,
});

//initiate connection
const db = {};
db.sequelize = sequelize;

db.models = {
  User: User(sequelize, Sequelize.DataTypes),
};

export { db };
