const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
var jwt = require("jsonwebtoken");
var configFile = require("../config.js");
const { Router } = require("express");
const dbConfig = require("../config/db.config.js");
//var mysqlQuery = require("../dbConnection.js");
const MD5 = require("md5");
const validator = require("validator");
const { identity } = require("underscore");
var QRCode = require("qrcode");
var speakeasy = require("speakeasy");
var bcrypt = require("bcryptjs");

const referralCodeGenerator = require("referral-code-generator");
const axios = require("axios");
const fetch = require("node-fetch");
var unirest = require("unirest");
const md5 = require("md5");
var crypto = require("crypto");
var assert = require("assert");
var algorithm = "aes-256-cbc"; // or any other algorithm supported by OpenSSL
var key = ""; //For PrinceExchange
var Moment = require("moment");
const Securitykey = crypto.randomBytes(32);
const initVector = crypto.randomBytes(16);
var ReverseMd5 = require("reverse-md5");

// mysql Connection START

const mysql = require("mysql");
const util = require("util");

const createTcpPool = async (config) => {
  // Extract host and port from socket address
  // Establish a connection to the database
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
    // [START cloud_sql_mysql_mysql_limit]
    // 'connectionLimit' is the maximum number of connections the pool is allowed
    // to keep at once.
    connectionLimit: 10,
    // [END cloud_sql_mysql_mysql_limit]

    // [START cloud_sql_mysql_mysql_timeout]
    // 'connectTimeout' is the maximum number of milliseconds before a timeout
    // occurs during the initial connection to the database.
    connectTimeout: 100, // 10 seconds
    // 'acquireTimeout' is the maximum number of milliseconds to wait when
    // checking out a connection from the pool before a timeout error occurs.
    acquireTimeout: 10000, // 10 seconds
    // 'waitForConnections' determines the pool's action when no connections are
    // free. If true, the request will queued and a connection will be presented
    // when ready. If false, the pool will call back with an error.
    waitForConnections: true, // Default: true
    // 'queueLimit' is the maximum number of requests for connections the pool
    // will queue at once before returning an error. If 0, there is no limit.
    queueLimit: 0, // Default: 0
    // [END cloud_sql_mysql_mysql_timeout]

    // [START cloud_sql_mysql_mysql_backoff]
    // The mysql module automatically uses exponential delays between failed
    // connection attempts.
    // [END cloud_sql_mysql_mysql_backoff]
  };
  return await createTcpPool(config);
};
const createPoolAndEnsureSchema = async () =>
  await createPool()
    .then(async (pool) => {
      return pool;
    })
    .catch((err) => {
      logger.error(err);
      throw err;
    });
let mysqlConnect;
connectFirst = async () => {
  mysqlConnect = await createPoolAndEnsureSchema();
};
connectFirst();
// mysql Connection END
exports.loginAdmin = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var msg = "Logged In ";
  if (!req.body.email) {
    res.send({
      status: false,
      message: "Email is required!",
      data: {},
    });
    return false;
  }
  if (!validator.isEmail(req.body.email)) {
    res.send({
      status: false,
      message: "Invalid email address",
      data: {},
    });
    return false;
  }
  if (!req.body.password) {
    res.send({
      status: false,
      message: "Password is required!",
      data: {},
    });
    return false;
  }
  var password = MD5(req.body.password);
  let sql1 =
    "SELECT id,password as p1,userType FROM users WHERE  email='" +
    req.body.email +
    "' AND password = '" +
    MD5(req.body.password) +
    "' ";
  // "' AND userType = 'ADMIN'";
  let findData2 = await mysqlQuery(sql1);

  if (findData2.length === 0) {
    res.send({
      status: false,
      message: "Invalid credentials",
      data: {},
    });
    return false;
  }
  if (findData2 === "undefined") {
    res.send({
      status: false,
      message: "Email doesn't Exist",
      data: {},
    });
    return false;
  }
  const token = jwt.sign(
    { loginUserId: findData2[0]["id"] },
    configFile.secret,
    {
      expiresIn: 86400,
    }
  );
  res.send(
    JSON.stringify({
      status: true,
      message: "Login successfully ",
      data: findData2,
      token: token,
    })
  );
  return;
};

exports.loginUser = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var msg = "Logged In ";
  if (!req.body.email) {
    res.send({
      status: false,
      message: "Email is required!",
      data: {},
    });
    return false;
  }
  if (!validator.isEmail(req.body.email)) {
    res.send({
      status: false,
      message: "Invalid email address",
      data: {},
    });
    return false;
  }
  if (!req.body.password) {
    res.send({
      status: false,
      message: "Password is required!",
      data: {},
    });
    return false;
  }
  var password = MD5(req.body.password);
  let sql1 =
    "SELECT password as p1,id as id,userType FROM customer WHERE  email='" +
    req.body.email +
    "' AND password = '" +
    MD5(req.body.password) +
    "' ";
  let findData2 = await mysqlQuery(sql1);

  if (findData2.length === 0) {
    res.send({
      status: false,
      message: "Invalid credentials",
      data: {},
    });
    return false;
  }
  if (findData2 === "undefined") {
    res.send({
      status: false,
      message: "Email doesn't Exist",
      data: {},
    });
    return false;
  }
  const token = jwt.sign(
    { loginUserId: findData2[0]["id"] },
    configFile.secret,
    {
      expiresIn: 86400,
    }
  );
  res.send(
    JSON.stringify({
      status: true,
      message: "Login successfully ",
      data: findData2,
      token: token,
    })
  );
  return;
};

exports.getUserData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  if (!userId) {
    res.send({
      status: false,
      message: "userId is required!",
      data: {},
    });
    return false;
  }
  let sql =
    "SELECT customer.*,users.name as categoryManagerName,users.categoryId as categoryId FROM customer LEFT JOIN users on users.id = customer.categoryManagerId WHERE customer.id = '" +
    userId +
    "'";
  let sqlResult = await mysqlQuery(sql);
  if (sqlResult.length > 0) {
    return res.send({
      status: true,
      message: "User Data",
      data: sqlResult,
    });
  }
};

exports.getAdminDetails = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  if (!userId) {
    res.send({
      status: false,
      message: "userId is required!",
      data: {},
    });
    return false;
  }
  let sql = "SELECT * FROM users WHERE id='" + userId + "'";
  let sqlResult = await mysqlQuery(sql);
  if (sqlResult.length > 0) {
    return res.send({
      status: true,
      message: "User Data",
      data: sqlResult,
    });
  }
};

exports.loginVendor = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var msg = "Logged In ";
  if (!req.body.email) {
    res.send({
      status: false,
      message: "Email is required!",
      data: {},
    });
    return false;
  }
  if (!validator.isEmail(req.body.email)) {
    res.send({
      status: false,
      message: "Invalid email address",
      data: {},
    });
    return false;
  }
  if (!req.body.password) {
    res.send({
      status: false,
      message: "Password is required!",
      data: {},
    });
    return false;
  }
  var password = MD5(req.body.password);
  let sql1 =
    "SELECT password as p1,id as id FROM vendor WHERE  email='" +
    req.body.email +
    "' AND password = '" +
    MD5(req.body.password) +
    "' ";
  let findData2 = await mysqlQuery(sql1);
  return;
  if (findData2.length === 0) {
    res.send({
      status: false,
      message: "Invalid credentials",
      data: {},
    });
    return false;
  }
  if (findData2 === "undefined") {
    res.send({
      status: false,
      message: "Email doesn't Exist",
      data: {},
    });
    return false;
  }
  const token = jwt.sign(
    { loginUserId: findData2[0]["id"] },
    configFile.secret,
    {
      expiresIn: 86400,
    }
  );
  res.send(
    JSON.stringify({
      status: true,
      message: "Login successfully ",
      data: findData2,
      token: token,
    })
  );
  return;
};

exports.customerAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.customerName) {
    return res.send({
      status: false,
      message: "Customer Name required",
      data: {},
    });
  }
  if (!req.body.companyName) {
    return res.send({
      status: false,
      message: "Company Name required",
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
  if (!req.body.password) {
    return res.send({
      status: false,
      message: "Password required",
      data: {},
    });
  }
  if (!req.body.phoneNum) {
    return res.send({
      status: false,
      message: "Phone Number required",
      data: {},
    });
  }
  if (!req.body.billingAddress) {
    return res.send({
      status: false,
      message: "Billing Address required",
      data: {},
    });
  }
  if (!req.body.shippingAddress) {
    return res.send({
      status: false,
      message: "Shipping Address required",
      data: {},
    });
  }

  if (req.body.customerName) {
    let uniqueEmailSql =
      "SELECT * FROM customer WHERE email='" + req.body.email + "'";
    let uniqueEmailResult = await mysqlQuery(uniqueEmailSql);
    if (uniqueEmailResult.length > 0) {
      return res.send({
        status: false,
        message: "Email is already exists",
        data: {},
      });
    }
    // return
    let query =
      "INSERT INTO customer (name,companyName,email,password,phoneNumber,website,gst,panNumber,billingAddress,shippingAddress,userType) VALUES ('" +
      req.body.customerName +
      "','" +
      req.body.companyName +
      "','" +
      req.body.email +
      "','" +
      MD5(req.body.password) +
      "','" +
      req.body.phoneNum +
      "','" +
      req.body.website +
      "','" +
      req.body.gst +
      "','" +
      req.body.panNum +
      "','" +
      req.body.billingAddress +
      "','" +
      req.body.shippingAddress +
      "','customer')";
    let queryRun = await mysqlQuery(query);
    let insetId = queryRun.insertId;

    if (req.body.atribute) {
      let countAname = req.body.atribute.length;
      dataArray = Array.from(req.body.atribute);
      for (i = 0; i < countAname; i++) {
        let attributeSql =
          "INSERT INTO customeAttribute SET customerId = '" +
          insetId +
          "', aName = '" +
          dataArray[i].aName +
          "',aPhoneNo = '" +
          dataArray[i].aPhoneNo +
          "',aEmail = '" +
          dataArray[i].aEmail +
          "', ashippingAddress='" +
          dataArray[i].ashippingAddress +
          "'";
        runAttributeSql = await mysqlQuery(attributeSql);
      }
    }
    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Customer Add successfully ",
          data: {},
        })
      );
    }
  }
};


exports.customerEdit = async (req, res) => {
  if (!req.body.customerName) {
    return res.send({
      status: false,
      message: "Customer Name required",
      data: {},
    });
  }
  if (!req.body.companyName) {
    return res.send({
      status: false,
      message: "Company Name required",
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
  if (!req.body.password) {
    return res.send({
      status: false,
      message: "Password required",
      data: {},
    });
  }
  if (!req.body.phoneNum) {
    return res.send({
      status: false,
      message: "Phone Number required",
      data: {},
    });
  }
  if (!req.body.billingAddress) {
    return res.send({
      status: false,
      message: "Billing Address required",
      data: {},
    });
  }
  if (!req.body.shippingAddress) {
    return res.send({
      status: false,
      message: "Shipping Address required",
      data: {},
    });
  }

  if (req.body.customerName) {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let updateQuerry =
      "UPDATE customer SET name = '" +
      req.body.customerName +
      "', companyName= '" +
      req.body.companyName +
      "',email= '" +
      req.body.email +
      "',phoneNumber='" +
      req.body.phoneNum +
      "',password='" +
      MD5(req.body.password) +
      "', website='" +
      req.body.website +
      "',gst='" +
      req.body.gst +
      "',panNumber='" +
      req.body.panNum +
      "',billingAddress='" +
      req.body.billingAddress +
      "',shippingAddress= '" +
      req.body.shippingAddress +
      "' WHERE id='" +
      req.body.id +
      "'";
    let queryRun = await mysqlQuery(updateQuerry);
    let insetId = queryRun.insertId;
    let deleteQr =
      "DELETE FROM customeAttribute WHERE customerId = '" + req.body.id + "'";
    let deleteRun = await mysqlQuery(deleteQr);
    if (deleteRun) {
      let countAname = req.body.atribute.length;
      dataArray = Array.from(req.body.atribute);
      for (i = 0; i < countAname; i++) {
        let attributeSql =
          "INSERT INTO customeAttribute SET customerId = '" +
          req.body.id +
          "', aName = '" +
          dataArray[i].aName +
          "',aPhoneNo = '" +
          dataArray[i].aPhoneNo +
          "',aEmail = '" +
          dataArray[i].aEmail +
          "' ";
        runAttributeSql = await mysqlQuery(attributeSql);
      }
    }
    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Customer Edit successfully ",
          data: {},
        })
      );
    }
  }
};

exports.customerDelete = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let query = "DELETE FROM customer WHERE id = '" + req.body.id + "'";
  queryDun = await mysqlQuery(query);
  if (queryDun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Customer delete successfully ",
        data: {},
      })
    );
  }
};

exports.vendorDelete = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let query = "DELETE FROM users WHERE id = '" + req.body.id + "'";
  queryDun = await mysqlQuery(query);
  if (queryDun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Vendor delete successfully ",
        data: {},
      })
    );
  }
};

exports.vendorEdit = async (req, res) => {
  if (!req.body.name) {
    return res.send({
      status: false,
      message: "Vendor Name required",
      data: {},
    });
  }
  if (!req.body.companyName) {
    return res.send({
      status: false,
      message: "Company Name required",
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
  // if (!req.body.password) {
  //   return res.send({
  //     status: false,
  //     message: "Password required",
  //     data: {},
  //   });
  // }
  if (!req.body.phoneNum) {
    return res.send({
      status: false,
      message: "Phone Number required",
      data: {},
    });
  }
  if (!req.body.address) {
    return res.send({
      status: false,
      message: "Address Address required",
      data: {},
    });
  }

  if (req.body.name) {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    // return
    let updateQuerry =
      "UPDATE users SET name = '" +
      req.body.name +
      "', companyName= '" +
      req.body.companyName +
      "',email= '" +
      req.body.email +
      "',password='" +
      MD5(req.body.password) +
      "', mobile_no='" +
      req.body.phoneNum +
      "',website='" +
      req.body.website +
      "',gst='" +
      req.body.gst +
      "',panNumber='" +
      req.body.panNum +
      "',address= '" +
      req.body.address +
      "' WHERE id='" +
      req.body.id +
      "'";
    let queryRun = await mysqlQuery(updateQuerry);
    let insetId = queryRun.insertId;

    let deleteQr =
      "DELETE FROM vendorAttribute WHERE vendorId = '" + req.body.id + "'";
    let deleteRun = await mysqlQuery(deleteQr);
    if (deleteRun) {
      let countAname = req.body.atribute.length;
      dataArray = Array.from(req.body.atribute);
      for (i = 0; i < countAname; i++) {
        let attributeSql =
          "INSERT INTO vendorAttribute SET vendorId = '" +
          req.body.id +
          "', aName = '" +
          dataArray[i].aName +
          "',aPhoneNo = '" +
          dataArray[i].aPhoneNo +
          "',aEmail = '" +
          dataArray[i].aEmail +
          "' ";
        runAttributeSql = await mysqlQuery(attributeSql);
      }
    }
    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Vendor updated successfully",
          data: {},
        })
      );
    }
  }
};

exports.customerData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sql = "SELECT * FROM customer";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Customers data ",
        data: sqlRun,
      })
    );
  }
};

exports.customerSingle = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.id) {
    return res.send({
      status: false,
      message: "Id required",
      data: {},
    });
  }
  let sql = "SELECT * FROM customer WHERE id= '" + req.body.id + "'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun.length > 0) {
    let sql2 =
      "SELECT * FROM customeAttribute WHERE customerId= '" + sqlRun[0].id + "'";
    let sqlRun2 = await mysqlQuery(sql2);
    if (sqlRun2) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Vendor data ",
          data: {
            sqlRun,
            sqlRun2,
          },
        })
      );
    }
  }
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Customers data ",
        data: sqlRun,
      })
    );
  }
};

exports.customerSingleAttribute = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.attributeId) {
    return res.send({
      status: false,
      message: "Attribute Id required",
      data: {},
    });
  }
  let sql =
    "SELECT * FROM customeAttribute WHERE customerId= '" +
    req.body.attributeId +
    "'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Customers data ",
        data: sqlRun,
      })
    );
  }
};

exports.vendorSingle = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.id) {
    return res.send({
      status: false,
      message: "Id required",
      data: {},
    });
  }
  let sql = "SELECT * FROM users WHERE id= '" + req.body.id + "'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun.length > 0) {
    let sql2 =
      "SELECT * FROM vendorAttribute WHERE vendorId= '" + sqlRun[0].id + "'";
    let sqlRun2 = await mysqlQuery(sql2);
    if (sqlRun2) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Vendor data ",
          data: {
            sqlRun,
            sqlRun2,
          },
        })
      );
    }
  }
};

exports.vendorSingleAttribute = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.attributeId) {
    return res.send({
      status: false,
      message: "Attribute Id required",
      data: {},
    });
  }
  let sql =
    "SELECT * FROM vendorAttribute WHERE vendorId= '" +
    req.body.attributeId +
    "'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Vendor data ",
        data: sqlRun,
      })
    );
  }
};

exports.vendorData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sql = "SELECT * FROM users WHERE userType ='Vendor'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Vendor data ",
        data: sqlRun,
      })
    );
  }
};

exports.vendorAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.venderName) {
    return res.send({
      status: false,
      message: "Vender Name required",
      data: {},
    });
  }
  if (!req.body.companyName) {
    return res.send({
      status: false,
      message: "Company Name required",
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
  if (!req.body.password) {
    return res.send({
      status: false,
      message: "Password required",
      data: {},
    });
  }
  if (!req.body.phoneNum) {
    return res.send({
      status: false,
      message: "Phone Number required",
      data: {},
    });
  }
  if (!req.body.address) {
    return res.send({
      status: false,
      message: "address required",
      data: {},
    });
  }
  // return
  if (req.body.venderName) {
    let uniqueEmailSql =
      "SELECT * FROM users WHERE email='" + req.body.email + "'";
    let uniqueEmailResult = await mysqlQuery(uniqueEmailSql);
    if (uniqueEmailResult.length > 0) {
      return res.send({
        status: false,
        message: "Email is already exists",
        data: {},
      });
    }
    let query =
      "INSERT INTO users (name,companyName,email,password,mobile_no,website,gst,panNumber,address,userType,orderManagment) VALUES ('" +
      req.body.venderName +
      "','" +
      req.body.companyName +
      "','" +
      req.body.email +
      "','" +
      MD5(req.body.password) +
      "','" +
      req.body.phoneNum +
      "','" +
      req.body.website +
      "','" +
      req.body.gst +
      "','" +
      req.body.panNum +
      "','" +
      req.body.address +
      "','Vendor','1')";
    let queryRun = await mysqlQuery(query);
    let insetId = queryRun.insertId;
    if (req.body.atribute) {
      let countAname = req.body.atribute.length;
      dataArray = Array.from(req.body.atribute);
      for (i = 0; i < countAname; i++) {
        let attributeSql =
          "INSERT INTO vendorAttribute SET vendorId = '" +
          insetId +
          "', aName = '" +
          dataArray[i].aName +
          "',aPhoneNo = '" +
          dataArray[i].aPhoneNo +
          "',aEmail = '" +
          dataArray[i].aEmail +
          "' ";
        runAttributeSql = await mysqlQuery(attributeSql);
      }
    }
    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Vendor Add successfully ",
          data: {},
        })
      );
    }
  }
};

exports.getcode = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var randNum = Math.floor(Math.random() * 100000 + 1).toString();
  if (!req.body.email) {
    res.send({
      status: false,
      message: "Email field is required",
      data: {},
    });
    return false;
  }

  if (req.body.email) {
    let sql = "SELECT * FROM users where email = '" + req.body.email + "'";
    let findData = await mysqlQuery(sql);
    if (findData.length > 0) {
      res.status(200).send({
        status: false,
        message: "Email is already registered",
        data: {},
      });
      return false;
    }
  }
  if (!validator.isEmail(req.body.email)) {
    res.send({
      status: false,
      message: "Invalid email address",
      data: {},
    });
    return false;
  }
  var Emailcode = sendEmail(req.body.email, "Password reset", randNum);
  if (Emailcode) {
    return res.send({
      status: true,
      message:
        "Verification code is successfully sent on your mail, please check the mail",
      code: randNum,
    });
  }
};

exports.changePassword = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  if (!req.body.NewPassword) {
    res.send({
      status: false,
      message: "New password is required",
      data: {},
    });
    return false;
  }
  if (!req.body.CPassword) {
    res.send({
      status: false,
      message: "Confirm password is required",
      data: {},
    });
    return false;
  }

  if (req.body.NewPassword != req.body.CPassword) {
    res.send({
      status: false,
      message: "Password miss-matched",
      data: {},
    });
    return false;
  }
  if (!req.body.OldPassword) {
    res.send({
      status: false,
      message: "Current password is required",
      data: {},
    });
    return false;
  }

  var regex = "^[a-zA-Z0-9_]*$";
  if (req.body.NewPassword.match(regex)) {
    res.send({
      status: false,
      message:
        "Password must be at least 8 characters long, contains a letter, a number, and a symbol",
      data: {},
    });
    return;
  }

  let sql1 = "SELECT password as p1 FROM users WHERE  id='" + userId + "'";
  let findData2 = await mysqlQuery(sql1);

  var p1 = findData2[0].p1;

  if (p1 !== MD5(req.body.OldPassword)) {
    res.send({
      status: false,
      message: "Old password mis-matched",
      data: {},
    });
    return false;
  }

  if (p1 === MD5(req.body.NewPassword)) {
    res.send({
      status: false,
        message: "Old and new passwords must be different",
      data: {},
    });
    return false;
  }

  var sql =
    "UPDATE users SET password= '" +
    MD5(req.body.NewPassword) +
    "',c_password= '" +
    MD5(req.body.CPassword) +
    "' WHERE password='" +
    MD5(req.body.OldPassword) +
    "' AND id='" +
    userId +
    "'";

  let findData = await mysqlQuery(sql);

  return res.send({
    status: true,
    message: "New password updated successfully",
    findData,
  });
};

exports.register = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var email = req.body.email;
  var VerificationCode = req.body.VerificationCode;
  var Password = req.body.Password;
  var CPassword = req.body.CPassword;
  var ReferId = req.body.ReferId;
  var terms = req.body.terms;
  if (!email) {
    res.send({
      status: false,
      message: "Email is required!",
      data: {},
    });
    return false;
  }
  if (!req.body.VerificationCode) {
    res.send({
      status: false,
      message: "Verification code is required!",
      data: {},
    });
    return false;
  }
  if (!Password) {
    res.send({
      status: false,
      message: "Password is required!",
      data: {},
    });
    return false;
  }

  var checkQury = "SELECT * FROM users WHERE email='" + email + "'";
  var checkQuryresult = await mysqlQuery(checkQury);
  if (checkQuryresult.length > 0) {
    return res.send({
      status: false,
      message: "Email is already registered",
      data: {},
    });
  }
  var regex = "^[a-zA-Z0-9_]*$";
  if (req.body.Password.match(regex)) {
    res.send({
      status: false,
      message:
        "Password must be at least 8 characters long, contains a letter, a number, and a symbol",
      data: {},
    });
    return;
  }

  if (!req.body.CPassword) {
    res.send({
      status: false,
      message: "Confirm password is required",
      data: {},
    });
    return false;
  }

  if (req.body.CPassword.match(regex)) {
    res.send({
      status: false,
      message:
        "Password must be at least 8 characters long, contains a letter, a number, and a symbol",
      data: {},
    });
    return;
  }

  if (!VerificationCode) {
    res.send({
      status: false,
      message: "Verification code is required",
      data: {},
    });
    return false;
  }

  if (!req.body.terms) {
    res.send({
      status: false,
      message: "Please check terms & conditions",
      data: {},
    });
    return false;
  }
  if (req.body.terms == true) {
    var terms = 1;
  }
  if (req.body.terms == false) {
    var terms = 0;
  }
  let RegisterData =
    "INSERT INTO users (email, verification_code, password, c_password, refer_id, terms,userType) VALUES ('" +
    email +
    "','" +
    VerificationCode +
    "','" +
    MD5(Password) +
    "','" +
    MD5(CPassword) +
    "', '" +
    ReferId +
    "', '" +
    terms +
    "','USER')";
  let findData = await mysqlQuery(RegisterData);

  return res.send({
    status: true,
    message: "Congrats, you have been registered successfully",
    findData,
  });
};

exports.changeVendorProductStatus = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var order_id = req.body.orderId;
  var status = req.body.status
  let sql =
    "UPDATE assignVendorDetails SET status='"+status+"' WHERE id='"+order_id+"'";
  let sqlResult = await mysqlQuery(sql);
  if (sqlResult) {
    return res.send({
      status: true,
      message: "Status Updated",
      data: sqlResult,
    });
  }
};