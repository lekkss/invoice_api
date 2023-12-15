import mysql from "mysql2";
import { dbConfig } from "../config/db-config.js";
import Sequelize from "sequelize";
const { DATABASE, DIALECT, HOST, PASSWORD, USER } = dbConfig;
import User from "./user.js";
import Client from "./client.js";
import Invoice from "./invoice.js";

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
  Client: Client(sequelize, Sequelize.DataTypes),
  Invoice: Invoice(sequelize, Sequelize.DataTypes),
};

db.models.User.hasMany(db.models.Client, {
  foreignKey: "user_id",
});
db.models.Client.belongsTo(db.models.User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});

db.models.User.hasMany(db.models.Invoice, {
  foreignKey: "user_id",
});

db.models.Client.hasMany(db.models.Invoice, {
  foreignKey: "client_id",
});

db.models.Invoice.belongsTo(db.models.User, {
  foreignKey: "user_id",
  targetKey: "uuid",
  onDelete: "CASCADE",
});
db.models.Invoice.belongsTo(db.models.Client, {
  foreignKey: "client_id",
  targetKey: "uuid",
  onDelete: "CASCADE",
});

export { db };
