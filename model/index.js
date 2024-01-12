"use strict";
import Sequelize from "sequelize";
import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { dbConfig } from "../config/db-config.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const { DATABASE, DIALECT, HOST, PASSWORD, USER, PORT } = dbConfig;
const db = {};

//Create database if not exist
const createDatabaseConnection = async () => {
  const connection = mysql
    .createConnection({
      host: HOST,
      user: USER,
      password: PASSWORD,
      port: PORT,
    })
    .promise();
  // await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DATABASE}\`;`);
};

// Create the database before establishing the Sequelize connection
await createDatabaseConnection();
//Connect database
const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: DIALECT,
  host: HOST,
});

const modelPromises = fs
  .readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .map((file) => import(`file://${path.join(__dirname, file)}`));

// Wait for all model imports to resolve
const modelModules = await Promise.all(modelPromises);

// Iterate through the resolved modules and initialize models
modelModules.forEach((module) => {
  const model = module.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});

// Associate models
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//initiate connection
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
