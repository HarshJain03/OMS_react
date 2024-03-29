const mysql = require("mysql");
const dbConfig = require("./config/db.config.js");
const util = require('util');
// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});
var mysqlQuery = util.promisify(connection.query).bind(connection);
module.exports = mysqlQuery;