const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
var jwt = require("jsonwebtoken");
var configFile = require("../config.js");
const { Router } = require("express");
const dbConfig = require("../config/db.config.js");
const MD5 = require("md5");
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

exports.salesPersonAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  // return
  if (!req.body.name) {
    return res.send({
      status: false,
      message: "Name required",
      data: {},
    });
  }
  if (!req.body.email) {
    return res.send({
      status: false,
      message: "Email required",
      data: {},
    });
  }
  if (!req.body.categoryId) {
    return res.send({
      status: false,
      message: "Category required",
      data: {},
    });
  }
  if (!req.body.number) {
    return res.send({
      status: false,
      message: "Number required",
      data: {},
    });
  }
  if (!req.body.password) {
    return res.send({
      status: false,
      message: "Password required",
      data: {},
    });
  }
  if (req.body.name) {
    let checkEmail =
      "SELECT * FROM customer WHERE email='" + req.body.email + "'";
    let resultEmail = await mysqlQuery(checkEmail);
    if (resultEmail.length > 0) {
      res.send({
        status: false,
        message: "Email alredy exists",
        data: {},
      });
      return false;
    }
    let query =
      "INSERT INTO customer (name,email,categoryManagerId,phoneNumber,password,userType) VALUES ('" +
      req.body.name +
      "','" +
      req.body.email +
      "','" +
      req.body.categoryId +
      "','" +
      req.body.number +
      "','" +
      MD5(req.body.password) +
      "','SalesPerson')";

    let queryRun = await mysqlQuery(query);
    let insetId = queryRun.insertId;

    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Sales Person Added successfully ",
          data: {},
        })
      );
    }
  }
};


exports.salesPersonSingle = async (req, res) => {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    if (!req.body.id) {
        return res.send({
            status: false,
            message: "Id required",
            data: {},
        });
    }
    let sql = "SELECT customer.*,users.name as cName FROM customer LEFT JOIN users ON customer.categoryManagerId = users.id WHERE customer.userType='SalesPerson' AND customer.id = '" + req.body.id + "'";
    console.log('sqlsql',sql);
    let sqlRun = await mysqlQuery(sql);
    if (sqlRun.length > 0) {
        return res.send(
            JSON.stringify({
                status: true,
                message: "sales person data ",
                data: {
                    sqlRun
                },
            })
        );
        
    }
};

exports.salesPersonData = async (req, res) => {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let sql = "SELECT customer.*,users.name as cName FROM customer LEFT JOIN users ON customer.categoryManagerId = users.id WHERE customer.userType='SalesPerson'";
    // let sql = "SELECT m.*,e.name as cName From users as e INNER JOIN users as m ON m.categoryManagerId = e.id WHERE m.userType='SalesPerson' ";
    let sqlRun = await mysqlQuery(sql);
    if (sqlRun) {
        return res.send(
            JSON.stringify({
                status: true,
                message: "Sales Person data ",
                data: sqlRun,
            })
        );
    }
};

exports.salesPersonDelete = async (req, res) => {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let query = "DELETE FROM customer WHERE id = '" + req.body.id + "'";
    queryDun = await mysqlQuery(query);
    if (queryDun) {
        return res.send(
            JSON.stringify({
                status: true,
                message: "Sales Person deleted successfully ",
                data: {},
            })
        );
    }
};

// sales-person-edit
exports.salesPersonEdit = async (req, res) => {
    // console.log('req.body update',req.body);
    // return
    if (!req.body.name) {
        return res.send({
            status: false,
            message: "Name required",
            data: {},
        });
    }
    if (!req.body.email) {
        return res.send({
            status: false,
            message: "Email required",
            data: {},
        });
    }
    if (!req.body.categoryId) {
        return res.send({
            status: false,
            message: "Category Manager required",
            data: {},
        });
    }
    if (!req.body.number) {
        return res.send({
            status: false,
            message: "Number required",
            data: {},
        });
    }
    if (!req.body.password) {
        return res.send({
            status: false,
            message: "Password required",
            data: {},
        });
    }
    if (req.body.name) {
        mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
        var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
        let updateQuerry =
            "UPDATE customer SET name = '"+req.body.name+"',email='" +req.body.email+
            "',categoryManagerId='"+req.body.categoryId+"',phoneNumber='"+req.body.number+"', password='"+MD5(req.body.password)+"' WHERE id='" +
            req.body.id + "'";
        let queryRun = await mysqlQuery(updateQuerry);
        let insetId = queryRun.insertId;
        if (queryRun) {
            return res.send(
                JSON.stringify({
                    status: true,
                    message: "Sales Person updated successfully",
                    data: {},
                })
            );
        }
    }
};
