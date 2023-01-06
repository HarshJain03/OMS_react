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

exports.attributeAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.name) {
    return res.send({
      status: false,
      message: "Name required",
      data: {},
    });
  }

  if (req.body.name) {
    let checkAtt =
      "SELECT * FROM attributes WHERE name='" + req.body.name + "'";
    let resultAtt = await mysqlQuery(checkAtt);
    if (resultAtt.length > 0) {
      res.send({
        status: false,
        message: "Attributes alredy exists",
        data: {},
      });
      return false;
    }
    let query =
      "INSERT INTO attributes (name) VALUES ('" + req.body.name + "')";

    let queryRun = await mysqlQuery(query);
    let insetId = queryRun.insertId;

    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Attribute Added successfully ",
          data: {},
        })
      );
    }
  }
};


exports.attributeSingle = async (req, res) => {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    if (!req.body.id) {
        return res.send({
            status: false,
            message: "Id required",
            data: {},
        });
    }
    let sql = "SELECT * FROM attributes WHERE id= '" + req.body.id + "'";
    let sqlRun = await mysqlQuery(sql);
    if (sqlRun.length > 0) {
        return res.send(
            JSON.stringify({
                status: true,
                message: "Attribute data ",
                data: {
                    sqlRun
                },
            })
        );
        
    }
};

exports.attributeData = async (req, res) => {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let sql = "SELECT * FROM attributes";
    let sqlRun = await mysqlQuery(sql);
    if (sqlRun) {
        return res.send(
            JSON.stringify({
                status: true,
                message: "Attribute data ",
                data: sqlRun,
            })
        );
    }
};

exports.attributeDelete = async (req, res) => {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let query = "DELETE FROM attributes WHERE id = '" + req.body.id + "'";
    queryDun = await mysqlQuery(query);
    if (queryDun) {
        return res.send(
            JSON.stringify({
                status: true,
                message: "Attribute deleted successfully ",
                data: {},
            })
        );
    }
};

exports.attributeEdit = async (req, res) => {
    if (!req.body.name) {
        return res.send({
            status: false,
            message: "Name required",
            data: {},
        });
    }
   
    if (req.body.name) {
        mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
        var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
        let updateQuerry =
            "UPDATE attributes SET name = '" +
            req.body.name +
            "' WHERE id='" +
            req.body.id +
            "'";
        let queryRun = await mysqlQuery(updateQuerry);
        let insetId = queryRun.insertId;

        if (queryRun) {
            return res.send(
                JSON.stringify({
                    status: true,
                    message: "Attribute updated successfully",
                    data: {},
                })
            );
        }
    }
};
