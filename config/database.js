const { Pool } = require('pg');
require('dotenv').config();
const Sequelize = require('sequelize');

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
});

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  sequelize: sequelize,
  sq: sequelize
};