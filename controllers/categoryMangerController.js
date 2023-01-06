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

exports.categoryManagerAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
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
    let checkManager =
      "SELECT * FROM users WHERE email='" +
      req.body.email +
      "' AND userType='CategoryManager'";
    let checkManagerResult = await mysqlQuery(checkManager);
    if (checkManagerResult.length > 0) {
      res.send({
        status: false,
        message: "Email alredy exists",
        data: {},
      });
      return false;
    }
    let query =
      "INSERT INTO users (name,email,categoryId,mobile_no,password,userType,orderManagment,venderOrder) VALUES ('" +
      req.body.name +
      "','" +
      req.body.email +
      "','" +
      req.body.categoryId +
      "','" +
      req.body.number +
      "','" +
      MD5(req.body.password) +
      "','CategoryManager','1','1')";
    let queryRun = await mysqlQuery(query);
    let insetId = queryRun.insertId;
    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Category Manager Added successfully ",
          data: {},
        })
      );
    }
  }
};


exports.categorySingle = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.id) {
    return res.send({
      status: false,
      message: "Id required",
      data: {},
    });
  }
  let sql =
    "SELECT users.*,categories.name cName FROM users LEFT JOIN categories ON categories.id = users.categoryId WHERE users.id= '" +
    req.body.id +
    "'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun.length > 0) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Category data ",
        data: {
          sqlRun,
        },
      })
    );
  }
};

exports.categoryData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sql =
    "SELECT users.*,categories.name cName FROM users LEFT JOIN categories ON categories.id = users.categoryId WHERE userType='CategoryManager'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Category data ",
        data: sqlRun,
      })
    );
  }
};

exports.categoryDelete = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let query = "DELETE FROM users WHERE id = '" + req.body.id + "'";
  queryDun = await mysqlQuery(query);
  if (queryDun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Category deleted successfully ",
        data: {},
      })
    );
  }
};

exports.categoryEdit = async (req, res) => {
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
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let updateQuerry =
      "UPDATE users SET name = '" +
      req.body.name +
      "',email='" +
      req.body.email +
      "',categoryId='" +
      req.body.categoryId +
      "',mobile_no='" +
      req.body.number +
      "',password='" +
      MD5(req.body.password) +
      "' WHERE id='" +
      req.body.id +
      "'";
    let queryRun = await mysqlQuery(updateQuerry);
    let insetId = queryRun.insertId;
    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Category updated successfully",
          data: insetId,
        })
      );
    }
  }
};
