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

exports.categoryAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.name) {
    return res.send({
      status: false,
      message: "Name required",
      data: {},
    });
  }
  if (!req.body.shortName) {
    return res.send({
      status: false,
      message: "Short Name required",
      data: {},
    });
  }
  if (req.body.name) {
    let checkCat =
      "SELECT * FROM categories WHERE name='" + req.body.name + "'";
    let resultCat = await mysqlQuery(checkCat);
    if (resultCat.length > 0) {
      res.send({
        status: false,
        message: "Category alredy exists",
        data: {},
      });
      return false;
    }
    let query =
      "INSERT INTO categories (name,short_name) VALUES ('" +
      req.body.name +
      "','" +
      req.body.shortName +
      "')";

    let queryRun = await mysqlQuery(query);
    let insetId = queryRun.insertId;

    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Category Added successfully ",
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
  let sql = "SELECT * FROM categories WHERE id= '" + req.body.id + "'";
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
  let sql = "SELECT * FROM categories";
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
  let query = "DELETE FROM categories WHERE id = '" + req.body.id + "'";
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
  if (!req.body.name) {
    return res.send({
      status: false,
      message: "Name required",
      data: {},
    });
  }
  if (!req.body.shortName) {
    return res.send({
      status: false,
      message: "Short Name required",
      data: {},
    });
  }

  if (req.body.name) {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let updateQuerry =
      "UPDATE categories SET name = '" +
      req.body.name +
      "', short_name= '" +
      req.body.shortName +
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
          data: {},
        })
      );
    }
  }
};

exports.subCategoryData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sql = "SELECT sub_categories.*,categories.name as cat_name FROM sub_categories LEFT JOIN categories ON categories.id = sub_categories.category_id";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Sub Category data ",
        data: sqlRun,
      })
    );
  }
};

exports.subCategoryAdd = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.subCatName) {
    return res.send({
      status: false,
      message: "Name required",
      data: {},
    });
  }
  if (!req.body.subShortName) {
    return res.send({
      status: false,
      message: "Short Name required",
      data: {},
    });
  }
  if (!req.body.categoryId) {
    return res.send({
      status: false,
      message: "Please select category",
      data: {},
    });
  }
  if (req.body.subCatName) {
    let checkCat =
      "SELECT * FROM sub_categories WHERE name='" + req.body.categoryId + "'";
    let resultCheck = await mysqlQuery(checkCat);
    if (resultCheck.length > 0) {
      res.send({
        status: false,
        message: "Sub ccategory alredy exists",
        data: {},
      });
      return false;
    }
    let query =
      "INSERT INTO sub_categories (name,short_name,category_id) VALUES ('" +
      req.body.subCatName +
      "','" +
      req.body.subShortName +
      "','" +
      req.body.categoryId +
      "')";

    let queryRun = await mysqlQuery(query);

    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Sub Category Added successfully ",
          data: {},
        })
      );
    }
  }
};

exports.SubCategorySingle = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  if (!req.body.id) {
    return res.send({
      status: false,
      message: "Id required",
      data: {},
    });
  }
  let sql = "SELECT * FROM sub_categories WHERE id= '" + req.body.id + "'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun.length > 0) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Category data ",
        data:sqlRun[0],
      })
    );
  }
};

exports.RemoveSubCategory = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let id = req.body.id
  let sql = "DELETE FROM sub_categories WHERE id='"+id+"'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Sub category deleted successfully",
        data: sqlRun,
      })
    );
  }
};

exports.subCategoryEdit = async (req, res) => {
  if (!req.body.subCatName) {
    return res.send({
      status: false,
      message: "Name required",
      data: {},
    });
  }
  if (!req.body.subShortName) {
    return res.send({
      status: false,
      message: "Short Name required",
      data: {},
    });
  }

  if (req.body.subCatName) {
    mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
    var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
    let updateQuerry =
      "UPDATE sub_categories SET name = '" +
      req.body.subCatName +
      "', short_name= '" +
      req.body.subShortName +
      "' WHERE id='" +
      req.body.id +
      "'";
    let queryRun = await mysqlQuery(updateQuerry);
    let insetId = queryRun.insertId;

    if (queryRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Sub Category updated successfully",
          data: {},
        })
      );
    }
  }
};