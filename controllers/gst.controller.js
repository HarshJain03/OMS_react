const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
var jwt = require("jsonwebtoken");
var configFile = require("../config.js");
const { Router } = require("express");
const dbConfig = require("../config/db.config.js");

const mysql = require("mysql");
const util = require("util");

const createTcpPool = async (config) => {
  return await mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    port: 3306, // e.g. '3306'
    // ... Specify additional properties here.
    ...config,
  });
};

const createPool = async () => {
  const config = {
    connectionLimit: 10,
    connectTimeout: 100, // 100 seconds
    acquireTimeout: 10000, // 10 seconds
    waitForConnections: true, // Default: true
    queueLimit: 0, // Default: 0
  };
  return await createTcpPool(config);
};

const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(async (pool) => {
      return pool;
    })
    .catch((err) => {
      throw err;
    });

let mysqlConnect;
connectFirst = async () => {
  mysqlConnect = await createPoolAndEnsureSchema();
};

connectFirst();

exports.gstAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.gst) {
    return res.send({
      status: false,
      message: "GST required",
      data: {},
    });
  }
  if (req.body.gst) {
    let checkGst = "SELECT * FROM gst WHERE gst='" + req.body.gst + "'";
    let resultGst = await mysqlQuery(checkGst);
    if (resultGst.length > 0) {
      res.send({
        status: false,
        message: "Gst alredy exists",
        data: {},
      });
      return false;
    }
    let query = "INSERT INTO gst (gst) VALUES ('" + req.body.gst + "')";

    let queryRun = await mysqlQuery(query);
    let insetId = queryRun.insertId;

    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "GST Added successfully ",
          data: {},
        })
      );
    }
  }
};


exports.gstData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sql = "SELECT * FROM gst WHERE status='1'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "GST data ",
        data: sqlRun,
      })
    );
  }
};

exports.gstDelete = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let query = "DELETE FROM gst WHERE id = '" + req.body.id + "'";
  queryDun = await mysqlQuery(query);
  if (queryDun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "GST deleted successfully ",
        data: {},
      })
    );
  }
};

exports.gstSingle = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.id) {
    return res.send({
      status: false,
      message: "Id required",
      data: {},
    });
  }
  let sql = "SELECT * FROM gst WHERE id= '" + req.body.id + "'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun.length > 0) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "GST data ",
        data: {
          sqlRun,
        },
      })
    );
  }
};

exports.gstEdit = async (req, res) => {
  if (!req.body.gst) {
    return res.send({
      status: false,
      message: "GST required",
      data: {},
    });
  }

  if (req.body.gst) {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let updateQuerry =
      "UPDATE gst SET gst = '" +
      req.body.gst +
      "' WHERE id='" +
      req.body.id +
      "'";
    let queryRun = await mysqlQuery(updateQuerry);
    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "GST updated successfully",
          data: {},
        })
      );
    }
  }
};
