const multer = require("multer");
const path = require("path");
const dbConfig = require("../config/db.config.js");
// mysql Connection START

const mysql = require("mysql");
const util = require("util");
const MD5 = require("md5");

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

// mysql Connection END

exports.productData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);

  if (req.body.categoryId) {
    let sql =
      "SELECT p.*,GROUP_CONCAT(DISTINCT(pi.image)) as image FROM products p LEFT JOIN productImages pi on pi.product_id=p.id WHERE p.category_id = '" +
      req.body.categoryId +
      "' group by pi.product_id ";
    let sqlRun = await mysqlQuery(sql);
    if (sqlRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Products data ",
          data: sqlRun,
        })
      );
    }
  }

  let sql1 =
    "SELECT p.*,GROUP_CONCAT(DISTINCT(pi.image)) as image,sub_categories.short_name as subShortName FROM products p LEFT JOIN productImages pi on pi.product_id=p.id LEFT JOIN sub_categories ON sub_categories.id = p.sub_categories_id  group by pi.product_id ";
  let sqlRun1 = await mysqlQuery(sql1);
  if (sqlRun1) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Products data ",
        data: sqlRun1,
      })
    );
  }
};

exports.productAdd = async (req, res) => {
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploadProductImage/");
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });
  const upload = multer({
    storage: storage,
  }).fields([{ name: "imgCollection" }]);
  upload(req, res, async (err) => {
    if (!req.body.productName) {
      return res.send({
        status: false,
        message: "Product Name required",
        data: {},
      });
    }
    if (!req.body.description) {
      return res.send({
        status: false,
        message: "Description required",
        data: {},
      });
    }
    if (!req.body.price) {
      return res.send({
        status: false,
        message: "Price required",
        data: {},
      });
    }
    if (!req.body.hsnCode) {
      return res.send({
        status: false,
        message: "HSN Code required",
        data: {},
      });
    }
    if (!req.body.tax) {
      return res.send({
        status: false,
        message: "TAX required",
        data: {},
      });
    }
    if (!req.body.atribute) {
      return res.send({
        status: false,
        message: "Atribute required",
        data: {},
      });
    }
    if (!req.body.avaliableQty) {
      return res.send({
        status: false,
        message: "Quantity required",
        data: {},
      });
    }
    if (req.body.productName) {
      let checkProduct =
        "SELECT * FROM products WHERE name='" + req.body.productName + "'";
      let checkResult = await mysqlQuery(checkProduct);
      if (checkResult.length > 0) {
        res.send({
          status: false,
          message: "Product Alredy Exist",
          data: [],
        });
        return false;
      }

      var desc = req.body.description;
      desc = desc
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
      let query =
        'INSERT INTO products (name,description,price,hsnCode,searchHDN,tax,status,category_id,avaliable_qty,sub_categories_id) VALUES ("' +
        req.body.productName +
        '","' +
        desc +
        '","' +
        req.body.price +
        '","' +
        req.body.hsnCode +
        '","' +
        req.body.searchHDN +
        '","' +
        req.body.tax +
        '",1,"' +
        req.body.categoryId +
        '","' +
        req.body.avaliableQty +
        '","' +
        req.body.subCategoryId +
        '")';
      let queryRun = await mysqlQuery(query);
      let insetId = queryRun.insertId;
      let countAname = req.body.atribute.length;
      let arrData = JSON.parse(req.body.atribute);
      let matData = JSON.parse(req.body.materials);

      if (req.body.atribute) {
        for (i = 0; i < arrData.length; i++) {
          let attributeSql =
            "INSERT INTO productAttribute SET product_id = '" +
            insetId +
            "', name = '" +
            arrData[i].aName +
            "',value = '" +
            arrData[i].aValue +
            "'";
          runAttributeSql = await mysqlQuery(attributeSql);
        }
      }
      if (req.body.materials) {
        for (i = 0; i < matData.length; i++) {
          let materialSql =
            "INSERT INTO productMaterials SET product_id = '" +
            insetId +
            "', material_type = '" +
            matData[i].itemType +
            "',material_name = '" +
            matData[i].itemName +
            "',material_quantity = '" +
            matData[i].itemQuantity +
            "'";
          var materialsResult = await mysqlQuery(materialSql);
        }
      }

      if (!req.files) {
        return res.send({
          status: false,
          message: "Product Image required",
          data: {},
        });
      } else {
        for (i = 0; i < req.files.imgCollection.length; i++) {
          var fileName =
            "/uploadProductImage/" + req.files.imgCollection[i].filename;
          let attributeSql =
            "INSERT INTO productImages SET product_id = '" +
            insetId +
            "', image = '" +
            fileName +
            "'";
          runAttributeSql = await mysqlQuery(attributeSql);
        }

        if (queryRun) {
          return res.send(
            JSON.stringify({
              status: true,
              message: "Product Added successfully ",
              data: {},
            })
          );
        }
      }
    }
  });
};


exports.productEdit = async (req, res) => {
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploadProductImage/");
    },

    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const upload = multer({
    storage: storage,
  }).fields([{ name: "imgCollection" }]);

  upload(req, res, async (err) => {
    if (!req.body.productName) {
      return res.send({
        status: false,
        message: "Product Name required",
        data: {},
      });
    }
    if (!req.body.description) {
      return res.send({
        status: false,
        message: "Description required",
        data: {},
      });
    }
    if (!req.body.price) {
      return res.send({
        status: false,
        message: "Price required",
        data: {},
      });
    }
    if (!req.body.hsnCode) {
      return res.send({
        status: false,
        message: "HSN Code required",
        data: {},
      });
    }
    if (!req.body.searchHDN) {
      return res.send({
        status: false,
        message: "Search HDN required",
        data: {},
      });
    }
    if (!req.body.tax) {
      return res.send({
        status: false,
        message: "TAX required",
        data: {},
      });
    }

    if (!req.body.atribute) {
      return res.send({
        status: false,
        message: "Atribute required",
        data: {},
      });
    }
    if (req.body.productName) {
      let updateQuerry =
        'UPDATE products SET name = "' +
        req.body.productName +
        '", description= "' +
        req.body.description +
        '",price= "' +
        req.body.price +
        '",hsnCode="' +
        req.body.hsnCode +
        '",searchHDN="' +
        req.body.searchHDN +
        '",tax="' +
        req.body.tax +
        '",status="1" WHERE id="' +
        req.body.id +
        '"';
      let queryRun = await mysqlQuery(updateQuerry);

      let insetId = req.body.id;
      let countAname = req.body.atribute.length;
      let arrData = JSON.parse(req.body.atribute);

      if (req.body.atribute) {
        let deleteQr =
          "DELETE FROM productAttribute WHERE product_id = '" +
          req.body.id +
          "'";
        let deleteRun = await mysqlQuery(deleteQr);

        if (deleteRun) {
          let arrData = JSON.parse(req.body.atribute);
          for (i = 0; i < arrData.length; i++) {
            let attributeSql =
              "INSERT INTO productAttribute SET product_id = '" +
              insetId +
              "', name = '" +
              arrData[i].name +
              "',value = '" +
              arrData[i].value +
              "'";
            runAttributeSql = await mysqlQuery(attributeSql);
          }
        }
      }

      if (!req.files) {
      } else {
        if (req.files.imgCollection) {
          for (i = 0; i < req.files.imgCollection.length; i++) {
            var fileName =
              "/public/uploadProductImage/" +
              req.files.imgCollection[i].filename;
            let attributeSql =
              "INSERT INTO productImages SET product_id = '" +
              insetId +
              "', image = '" +
              fileName +
              "'";
            runAttributeSql = await mysqlQuery(attributeSql);
          }
        }
        if (queryRun) {
          return res.send(
            JSON.stringify({
              status: true,
              message: "Product Added successfully ",
              data: {},
            })
          );
        }
      }
    }
  });
};

exports.productSingle = async (req, res) => {
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
    "SELECT p.*,GROUP_CONCAT(DISTINCT(pi.image)) as image FROM products p LEFT JOIN productImages pi on pi.product_id=p.id WHERE p.id= '" +
    req.body.id +
    "' group by pi.product_id";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun.length > 0) {
    let sql2 =
      "SELECT productAttribute.*,attributes.name as valueName FROM productAttribute  LEFT JOIN attributes ON attributes.id = productAttribute.name WHERE productAttribute.product_id= '" + sqlRun[0].id + "'";
    let sqlRun2 = await mysqlQuery(sql2);
    if (sqlRun2) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Product data ",
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
        message: "Product data ",
        data: sqlRun,
      })
    );
  }
};


exports.addCart = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let checkCart =
    "SELECT * FROM cart WHERE user_Id='" +
    userId +
    "' AND product_Id='" +
    req.body.productId +
    "'";
  let checkCartResult = await mysqlQuery(checkCart);
  let checkOrderSummary =
    "SELECT * FROM orderSummary WHERE customer_id='" +
    userId +
    "' AND product_Id='" +
    req.body.productId +
    "'";
  let checkOrderSummaryResult = await mysqlQuery(checkOrderSummary);
  if (checkCartResult.length == 0) {
    let sql =
      "INSERT INTO cart (user_Id,product_Id,quantity) VALUES ('" +
      userId +
      "','" +
      req.body.productId +
      "','" +
      req.body.qty +
      "')";
    let runSql = await mysqlQuery(sql);
    var cartId = runSql.insertId;
    var getProductDetails =
      "SELECT products.*,productAttribute.name as attName,productAttribute.value as attValue,productImages.image as productImage FROM products LEFT JOIN productAttribute ON productAttribute.product_id = products.id LEFT JOIN productImages ON productImages.product_id = products.id WHERE products.id='" +
      req.body.productId +
      "' GROUP BY products.id";
    var getProductResult = await mysqlQuery(getProductDetails);
    if (getProductResult.length > 0) {
      let sql2 =
        "INSERT INTO orderSummary (customer_id,cart_id,product_Id,product_name,product_attrbitute_name,product_attrbitute_value,product_image,product_qty,product_gst_percent,product_amount,product_avaliable_qty) VALUES ('" +
        userId +
        "','" +
        cartId +
        "','" +
        req.body.productId +
        "','" +
        getProductResult[0].name +
        "','" +
        getProductResult[0].attName +
        "','" +
        getProductResult[0].attValue +
        "','" +
        getProductResult[0].productImage +
        "','" +
        req.body.qty +
        "','" +
        getProductResult[0].tax +
        "','" +
        getProductResult[0].price +
        "','" +
        getProductResult[0].avaliable_qty +
        "')";
      let runSql2 = await mysqlQuery(sql2);
    }
    if (runSql) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Product Added to Cart successfully ",
          data: runSql,
        })
      );
    }
  }
  if (checkCartResult.length > 0) {
    let cartUpdateId = checkCartResult[0].id;
    let cartCurrentQty = checkCartResult[0].quantity;
    let updateQty = cartCurrentQty + req.body.qty;
    let updateOrder =
      "UPDATE cart SET quantity='" +
      updateQty +
      "' WHERE id='" +
      cartUpdateId +
      "'";
    let runSql2 = await mysqlQuery(updateOrder);
    if (checkOrderSummaryResult.length > 0) {
      let orderSummaryId = checkOrderSummaryResult[0].id;
      let orderSummaryQty = checkOrderSummaryResult[0].product_qty;
      let updateQty = orderSummaryQty + req.body.qty;
      let updateOrder =
        "UPDATE orderSummary SET product_qty='" +
        updateQty +
        "' WHERE id='" +
        orderSummaryId +
        "'";
      let runSql2 = await mysqlQuery(updateOrder);
    }
    if (runSql2) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Product Added to Cart successfully ",
          data: runSql2,
        })
      );
    }
  }
};
exports.updateCart = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  var qty = req.body.qty;
  let checkCart =
    "SELECT * FROM cart WHERE user_Id='" +
    userId +
    "' AND product_Id='" +
    req.body.productId +
    "'";
  let checkCartResult = await mysqlQuery(checkCart);
  let checkOrderSummary =
    "SELECT * FROM orderSummary WHERE customer_id='" +
    userId +
    "' AND product_Id='" +
    req.body.productId +
    "' AND cart_id='" +
    req.body.cartId +
    "'";
  let checkOrderSummaryResult = await mysqlQuery(checkOrderSummary);
  if (checkCartResult.length > 0) {
    let cartUpdateId = checkCartResult[0].id;
    let cartCurrentQty = checkCartResult[0].quantity;
    let updateQty = cartCurrentQty + qty;
    let updateOrder =
      "UPDATE cart SET quantity='" +
      updateQty +
      "' WHERE id='" +
      cartUpdateId +
      "'";
    let runSql2 = await mysqlQuery(updateOrder);
    if (checkOrderSummaryResult.length > 0) {
      let orderSummaryId = checkOrderSummaryResult[0].id;
      let orderSummaryQty = checkOrderSummaryResult[0].product_qty;
      let updateQty = orderSummaryQty + qty;
      let updateOrder =
        "UPDATE orderSummary SET product_qty='" +
        updateQty +
        "' WHERE cart_id='" +
        req.body.cartId +
        "'";
      let runSql2 = await mysqlQuery(updateOrder);
    }
    if (runSql2) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "cart success ",
          data: runSql2,
        })
      );
    }
  } else {
    res.send({
      status: false,
      message: "Some error occure",
      data: {},
    });
    return false
  }
};
exports.deleteCartANDCheck = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let checkRecords =
    "SELECT * From cart WHERE product_Id='" +
    req.body.productId +
    "' AND user_Id ='" +
    userId +
    "'";
  let checkRecordsRun = await mysqlQuery(checkRecords);
  if (checkRecordsRun[0].quantity <= 1) {
    let sql = "DELETE from cart WHERE id='" + req.body.cartId + "'";
    let checkRecordsRun = await mysqlQuery(sql);
  }
  if (checkRecordsRun.length > 0) {
    var getRecord = checkRecordsRun[0];
    if (checkRecordsRun.length > 1) {
      if (getRecord.quantity > 1) {
        var newQty = getRecord.quantity - 1;
        let sql =
          "UPDATE cart SET quantity ='" +
          newQty +
          "' WHERE id='" +
          getRecord.id +
          "'";
        let checkRecordsRun = await mysqlQuery(sql);
      } else {
        let sql = "DELETE from cart WHERE id='" + getRecord.id + "'";
        let checkRecordsRun = await mysqlQuery(sql);
      }
    } else {
      var newQty = getRecord.quantity - 1;
      let sql =
        "UPDATE cart SET quantity ='" +
        newQty +
        "' WHERE id='" +
        getRecord.id +
        "'";
      let checkRecordsRun = await mysqlQuery(sql);
    }
    let checkRecordsSummary =
      "SELECT * From orderSummary WHERE product_Id='" +
      req.body.productId +
      "' AND customer_id ='" +
      userId +
      "' AND cart_id='" +
      req.body.cartId +
      "'";
    let checkRecordsRunSummary = await mysqlQuery(checkRecordsSummary);
    if (checkRecordsRunSummary.length > 0) {
      if (checkRecordsRunSummary[0].product_qty <= 1) {
        let deleteOrderSummary =
          "DELETE FROM orderSummary WHERE cart_id='" + req.body.cartId + "'";
        let resultDelete = await mysqlQuery(deleteOrderSummary);
      } else {
        let newQty = checkRecordsRunSummary[0].product_qty - 1;
        let sql =
          "UPDATE orderSummary SET product_qty ='" +
          newQty +
          "' WHERE id='" +
          checkRecordsRunSummary[0].id +
          "'";
        let checkRecordsRun = await mysqlQuery(sql);
      }
    }

    if (checkRecordsRun) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "cart success ",
          data: checkRecordsRun,
        })
      );
    }
  }
  return;
};

exports.productCount = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let sql =
    "SELECT * FROM cart WHERE user_Id ='" + userId + "' group by product_id";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Product count buy userid ",
        data: runSql,
      })
    );
  }
};

exports.getCartDataByUserId = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let sql =
    "SELECT sum(cart.quantity) as qty, cart.id as cartId,a.*,b.image FROM products a LEFT JOIN cart on cart.product_Id=a.id INNER JOIN ( SELECT product_id,image FROM productImages group by product_id ) b ON a.id = b.product_id WHERE cart.user_Id = '" +
    userId +
    "' group by cart.product_Id";
  let runSql = await mysqlQuery(sql);
  for (var i in runSql) {
    let sql2 =
      "SELECT * FROM `productAttribute` where product_id = '" +
      runSql[i].id +
      "'";
    let runSql2 = await mysqlQuery(sql2);
    if (runSql2.length > 0) {
      runSql[i]["att"] = runSql2;
    }
  }
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Product list by cart ",
        data: runSql,
      })
    );
  }
  // }
};

exports.getCartDataByUserIdForCheckout = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;

  let sql =
    "SELECT cart.quantity, cart.id as cartId,a.*,b.image FROM products a LEFT JOIN cart on cart.product_Id=a.id INNER JOIN ( SELECT product_id,image FROM productImages group by product_id ) b ON a.id = b.product_id WHERE cart.user_Id = '" +
    userId +
    "'";
  let runSql = await mysqlQuery(sql);
  var checkValues =
    "SELECT * FROM orderSummary where customer_id='" +
    userId +
    "' and product_status='0'";
  var result = await mysqlQuery(checkValues);

  if (result.length > 0) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Checkout page data ",
        data: result,
      })
    );
  }
};

exports.deleteCartProduts = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  var productId = req.body.productId;
  let sql =
    "DELETE FROM cart WHERE user_Id = '" +
    userId +
    "' AND product_Id ='" +
    productId +
    "'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "delete success ",
        data: runSql,
      })
    );
  }
};

exports.deleteCartByUserid = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  var productId = req.body.productId;
  let sql = "DELETE FROM cart WHERE user_Id = '" + userId + "'";
  let runSql = await mysqlQuery(sql);
    let sql1 = "DELETE FROM orderSummary WHERE customer_id = '" + userId + "'";
  let runSql1 = await mysqlQuery(sql1);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "delete success ",
        data: runSql,
      })
    );
  }
};

exports.getProductAttribute = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  var productId = req.body.productId;
  let sql =
    " SELECT * FROM `productAttribute` WHERE product_id ='" + productId + "'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Product attribute list ",
        data: runSql,
      })
    );
  }
};

exports.placeOrder = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let product_Id = req.body.product_Id;
  // return
  let runSql = "";
  let sql1 =
    "INSERT INTO orders (userId,amount,status) VALUES ('" +
    userId +
    "','" +
    req.body.total +
    "','0')";
  let runSql1 = await mysqlQuery(sql1);

  let lastInsertId = runSql1.insertId;
  var getOrderDetails =
    "SELECT * FROM orderSummary WHERE customer_id='" + userId + "'";
  var resultData = await mysqlQuery(getOrderDetails);
  if (resultData.length > 0) {
    resultData.forEach(async (item) => {
      let price = item.product_amount * item.product_qty;
      let taxPrice = (price / 100) * item.product_gst_percent;
      let subtotal = taxPrice + price;
      let product_id = item.product_id;

      let insertEntry =
        "INSERT INTO orderItems (orderId,userId,product_Id,price,quantity,gst,gstAmount,subTotal,isCustomize,avaliable_qty) VALUES('" +
        lastInsertId +
        "','" +
        userId +
        "','" +
        product_id +
        "','" +
        item.product_amount +
        "','" +
        item.product_qty +
        "','" +
        item.product_gst_percent +
        "','" +
        taxPrice +
        "','" +
        subtotal +
        "','N','" +
        item.product_avaliable_qty +
        "')";
      let insertResult = await mysqlQuery(insertEntry);
      if (insertResult) {
        let sqldeleteCard = "DELETE FROM cart WHERE user_Id = '" + userId + "'";
        let sqldeleteCardRun = await mysqlQuery(sqldeleteCard);
        let updateOrderSummary =
          "UPDATE orderSummary SET product_status='1' WHERE customer_id='" +
          userId +
          "'";
        let resultUpdate = await mysqlQuery(updateOrderSummary);
      }
    });
    return res.send({
      status: true,
      message: "Order placed succesasfully",
    });
  }
};

exports.orders = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let sql =
    "SELECT orderItems.*,products.name,productImages.image FROM orderItems LEFT JOIN products ON products.id = orderItems.product_Id LEFT JOIN productImages ON productImages.product_id = orderItems.product_Id WHERE orderItems.userId="+userId+" GROUP BY orderItems.id";
  runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order data ",
        data: runSql,
      })
    );
  }
};

exports.activeOrder = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let sql =
    "SELECT * FROM orders WHERE userId='"+userId+"'";
  runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order data ",
        data: runSql,
      })
    );
  }
};

exports.orderData = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  var status = req.body.status;
  let checkUser = "SELECT * FROM users WHERE id='" + userId + "'";
  let result = await mysqlQuery(checkUser);
  if (result.length > 0) {
    let userType = result[0].userType;
    if (userType === "Vendor") {
      if (status == 1) {
      let sql =
          "SELECT * FROM assignVendorDetails WHERE vendor_id='" +
          userId +
          "' AND status='" +
          status +
          "'";
        let sqlRun = await mysqlQuery(sql);
        if (sqlRun) {
          return res.send(
            JSON.stringify({
              status: true,
              message: "Orders data ",
              data: sqlRun,
            })
          );
        }
      } else {
        let sql =
          "SELECT * FROM assignVendorDetails WHERE vendor_id='" +
          userId +
          "' AND status='" +
          status +
          "'";
        let sqlRun = await mysqlQuery(sql);
        if (sqlRun) {
          return res.send(
            JSON.stringify({
              status: true,
              message: "Orders data ",
              data: sqlRun,
            })
          );
        }
      }
    } else {
      if (status == 1) {
        let sql =
          "SELECT orders.*,customer.id as user_id,customer.name,users.name as assignName from orders LEFT JOIN customer on customer.id = orders.userId LEFT JOIN users ON users.id = orders.assigned_to where status='" +
          status +
          "'OR status='2' OR status='3' OR status='4'";
        let sqlRun = await mysqlQuery(sql);
        if (sqlRun) {
          return res.send(
            JSON.stringify({
              status: true,
              message: "Orders data ",
              data: sqlRun,
            })
          );
        }
      } else {
        let sql =
          "SELECT orders.*,customer.id as user_id,customer.name from orders LEFT JOIN customer on customer.id = orders.userId where status='" +
          status +
          "'";
        let sqlRun = await mysqlQuery(sql);
        if (sqlRun) {
          return res.send(
            JSON.stringify({
              status: true,
              message: "Orders data ",
              data: sqlRun,
            })
          );
        }
      }
    }
  }
};




exports.orderDetail = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.id;
  let sql =
    "SELECT orders.*,customer.name as salsePersonName FROM orders LEFT JOIN customer ON customer.id = orders.userId WHERE orders.id ='" +
    orderId +
    "' ORDER BY id DESC";
  runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order data ",
        data: runSql,
      })
    );
  }
};

exports.getOrderDetailsAdmin = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.id;
  let message;
  let sql =
    "SELECT orderItems.*,products.name as productName,customer.name as customerName FROM orderItems LEFT JOIN products ON products.id = orderItems.product_Id LEFT JOIN customer ON customer.id = orderItems.customer_id WHERE orderItems.orderId='" +
    orderId +
    "'";
  runSql = await mysqlQuery(sql);
  var checkStatus =
    "SELECT * FROM orderItems WHERE order_status='6' AND orderId='" +
    req.body.id +
    "'";
  var getResult = await mysqlQuery(checkStatus);

  if (getResult.length == runSql.length) {
    var updateOrder =
      "UPDATE orders SET status='6' WHERE id='" + req.body.id + "'";
    var updateResult = await mysqlQuery(updateOrder);
    if (updateResult) {
      update = "updated";
    }
    message = "Refreshed"
  }else{
    message = "Order data..."
  }
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: message,
        data: runSql,
      })
    );
  }
};

exports.orderStatusUpdate = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sqlQuery = "";
  var orderId = req.body.orderId.id;
  var status = req.body.status;
  var vendorId = req.body.vendorId;
  var userId = req.loginUserId;
  var description = req.body.description;

  if (description) {
    sqlQuery =
      "Update orders set status = '" +
      status +
      "',orderNote='" +
      description +
      "' where id='" +
      orderId +
      "'";
    runSql = await mysqlQuery(sqlQuery);
    if (runSql) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Order Status Updated Succesfullly",
          data: runSql,
        })
      );
    }
  }

  if (vendorId == "self") {
    sqlQuery =
      "Update orders set status = '" +
      status +
      "',assigned_to='" +
      userId +
      "' where id='" +
      orderId +
      "'";
    runSql = await mysqlQuery(sqlQuery);
    if (runSql) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Order Status Updated Succesfullly",
          data: runSql,
        })
      );
    }
  } else {
    sqlQuery =
      "Update orders set status = '" +
      status +
      "',assigned_to='" +
      vendorId +
      "' where id='" +
      orderId +
      "'";

    runSql = await mysqlQuery(sqlQuery);
    if (runSql) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Order Status Updated Succesfullly",
          data: runSql,
        })
      );
    }
  }
};
exports.updateOrderPrice = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/customizeImage/");
    },

    filename: function (req, file, cb) {
      var imageName =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      cb(null, imageName);
    },
  });
  let upload = multer({ storage: storage }).fields([
    { name: "customizeImage" },
  ]);

  upload(req, res, async function (err) {
    var product_id = req.body.product_id;
    var amount = req.body.amount;
    var userId = req.loginUserId;
    if (req.files.customizeImage != undefined) {
      cImage = req.files.customizeImage[0].filename;
      var size = req.files.customizeImage[0].size;
      let insertQuery =
        "UPDATE orderSummary SET customize_image ='" +
        cImage +
        "',product_amount= '" +
        amount +
        "',isCustomize='Y' where id='" +
        product_id +
        "'AND customer_id='" +
        userId +
        "'";
      result = await mysqlQuery(insertQuery);
    }
    if (req.files.customizeImage == undefined) {
      let insertQuery =
        "UPDATE orderSummary SET product_amount= '" +
        amount +
        "',isCustomize='N' where id='" +
        product_id +
        "'AND customer_id='" +
        userId +
        "'";
      result = await mysqlQuery(insertQuery);
    }
    if (result) {
      return res.send(
        JSON.stringify({
          status: true,
          message: "Order updated successfully",
        })
      );
    }
  });
};


exports.getCustomerDetails = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sql = "SELECT * FROM customer WHERE userType='customer'";
  let result = await mysqlQuery(sql);
  if (result.length > 0) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Data found",
        data: result,
      })
    );
  }
};

exports.getCustomerDetailsById = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var user_Id = req.loginUserId;
  var customerId = req.body.customerId;
  var addId = req.body.addId;
  let sql =
    "SELECT * FROM customer WHERE userType='customer' AND id='" +
    customerId +
    "'";
  let result = await mysqlQuery(sql);
  for (var i in result) {
  let sql2 = "SELECT * FROM `customeAttribute` where id = '" + addId + "'";
  let runSql2 = await mysqlQuery(sql2);
  if (runSql2.length > 0) {
    result[0]["att"] = runSql2;
  }
};
if (result.length > 0) {
  return res.send(
    JSON.stringify({
      status: true,
      message: "Data found",
      data: result,
    })
  );
  }
}


exports.getCustomerDetailsAdmin = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.id;
  var orderSql =
    "SELECT userId,customer_id FROM orderItems WHERE orderId='" + orderId + "'";
  var resultSql = await mysqlQuery(orderSql);
  if (resultSql.length > 0) {
    var customerId = resultSql[0].userId;
    var newId = resultSql[0].customer_id;
    if (newId == null) {
      let sql =
        "SELECT * FROM customer WHERE userType='customer' AND id='" +
        customerId +
        "'";
      let result = await mysqlQuery(sql);
      for (var i in result) {
        let sql2 =
          "SELECT * FROM `customeAttribute` where customerId = '" +
          result[i].id +
          "'";
        let runSql2 = await mysqlQuery(sql2);
        if (runSql2.length > 0) {
          result[i]["att"] = runSql2;
        }
      }
      if (result.length > 0) {
        return res.send(
          JSON.stringify({
            status: true,
            message: "Data found",
            data: result,
          })
        );
      }
    } else {
      let sql =
        "SELECT * FROM customer WHERE userType='customer' AND id='" +
        newId +
        "'";
      let result = await mysqlQuery(sql);
      for (var i in result) {
        let sql2 =
          "SELECT * FROM `customeAttribute` where customerId = '" +
          result[i].id +
          "'";
        let runSql2 = await mysqlQuery(sql2);
        if (runSql2.length > 0) {
          result[i]["att"] = runSql2;
        }
      }
      if (result.length > 0) {
        return res.send(
          JSON.stringify({
            status: true,
            message: "Data found",
            data: result,
          })
        );
      }
    }
  }
};

exports.getAddressDetails = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  let sql =
    "SELECT * FROM customeAttribute WHERE customerId='" +
    req.body.customerId +
    "'";
  let result = await mysqlQuery(sql);
  if (result.length > 0) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Data found",
        data: result,
      })
    );
  } else {
    res.send(
      JSON.stringify({
        status: true,
        message: "No address avaliable",
        data: [],
      })
    );
    return false;
  }
};

exports.addUserService = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  var password = "Test@123";
  var insertNewUser =
    "INSERT INTO customer (name,companyName,email,password,phoneNumber,website,gst,panNumber,billingAddress,shippingAddress,userType) VALUES('" +
    req.body.customerName +
    "','" +
    req.body.compneyName +
    "','" +
    req.body.email +
    "','" +
    MD5(password) +
    "','" +
    req.body.phoneNo +
    "','" +
    req.body.website +
    "','" +
    req.body.gst +
    "','" +
    req.body.pancard +
    "','" +
    req.body.billingAddress +
    "','" +
    req.body.shippingAddressCust +
    "','customer')";
  var resultAdd = await mysqlQuery(insertNewUser);
  return res.send({
    status: true,
    message: "User added successfully",
  });
};

exports.addAddressService = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let countAname = req.body.atribute.length;
  dataArray = Array.from(req.body.atribute);
  for (i = 0; i < countAname; i++) {
    let attributeSql =
      "INSERT INTO customeAttribute SET customerId = '" +
      req.body.customerId +
      "', aName = '" +
      dataArray[i].aName +
      "',aPhoneNo = '" +
      dataArray[i].aPhoneNo +
      "',aEmail = '" +
      dataArray[i].aEmail +
      "',ashippingAddress=' " +
      dataArray[i].ashippingAddress +
      "'";
    runAttributeSql = await mysqlQuery(attributeSql);
  }
  return res.send({
    status: true,
    message: "Address added successfully",
  });
};

exports.placeOrderSalcePerson = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let customerId = req.body.customerId;
  var getTotalAmounts =
    "SELECT * FROM orderSummary WHERE product_status='0' AND customer_id='" +
    userId +
    "'";
  var getResult = await mysqlQuery(getTotalAmounts);
  let finalTotal = 0;
  if (getResult.length > 0) {
    for (let i = 0; i < getResult.length; i++) {
      const element = getResult[i];
      var price = element.product_amount * element.product_qty;
      let taxPrice = (price / 100) * element.product_gst_percent;
      let subTotal = parseFloat(taxPrice) + parseFloat(price);
      finalTotal += subTotal;
    }
    let sql1 =
      "INSERT INTO orders (userId,amount,status) VALUES ('" +
      userId +
      "','" +
      finalTotal +
      "','0')";
    let runSql1 = await mysqlQuery(sql1);
    let orderId = runSql1.insertId;

    var getOrderDetails =
      "SELECT * FROM orderSummary WHERE customer_id='" +
      userId +
      "' AND product_status='0'";
    var resultData = await mysqlQuery(getOrderDetails);
    if (resultData.length > 0) {
      resultData.forEach(async (item) => {
        let price = item.product_amount * item.product_qty;
        let taxPrice = (price / 100) * item.product_gst_percent;
        let subtotal = taxPrice + price;
        let product_id = item.product_id;
        let customized;
        let customizedImage;
        if (item.isCustomize == "Y") {
          customized = "Y";
          customizedImage = item.customize_image;
        } else {
          customized = "N";
          customizedImage = "NULL";
        }
        let insertEntry =
          "INSERT INTO orderItems (orderId,customer_id,userId,product_Id,price,quantity,gst,gstAmount,subTotal,isCustomize,customize_image,avaliable_qty) VALUES('" +
          orderId +
          "','" +
          customerId +
          "','" +
          userId +
          "','" +
          product_id +
          "','" +
          item.product_amount +
          "','" +
          item.product_qty +
          "','" +
          item.product_gst_percent +
          "','" +
          taxPrice +
          "','" +
          subtotal +
          "','" +
          customized +
          "','" +
          customizedImage +
          "','" +
          item.product_avaliable_qty +
          "')";
        let insertResult = await mysqlQuery(insertEntry);
        if (insertResult) {
          let sqldeleteCard =
            "DELETE FROM cart WHERE user_Id = '" + userId + "'";
          let sqldeleteCardRun = await mysqlQuery(sqldeleteCard);
          let updateOrderSummary =
            "UPDATE orderSummary SET product_status='1' WHERE customer_id='" +
            userId +
            "'";
          let resultUpdate = await mysqlQuery(updateOrderSummary);
        }
      });
      return res.send({
        status: true,
        message: "Order placed succesasfully",
      });
    }
  }
};



exports.getVendorList = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var userId = req.loginUserId;
  let sql = "SELECT * FROM users WHERE userType ='Vendor'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Product count buy userid ",
        data: runSql,
      })
    );
  }
};

exports.changeProductStatus = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var product_id = req.body.productId;
  var productStatus = req.body.productStatus;
  let sql =
    "UPDATE orderItems SET order_status='" +
    productStatus +
    "' WHERE id='" +
    product_id +
    "'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Product updated successfully ",
        data: runSql,
      })
    );
  }
};

exports.assignVendor = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var vendor_id = req.body.vendorId;
  var product_price = req.body.price;
  var product_quantity = req.body.quantity;
  var product_total = req.body.total;
  var product_id = req.body.productId;
  var productFile = req.body.productFile;

  var checkVendorItem =
    "SELECT * FROM assignVendorDetails WHERE vendor_id='" +
    vendor_id +
    "' AND order_id='" +
    product_id +
    "'";
  var resultCheck = await mysqlQuery(checkVendorItem);
  if (resultCheck.length > 0) {
    if (resultCheck[0].orderType === "manufacture") {
      if (resultCheck[0].status === "0") {
        res.send({
          status: false,
          message: "Can not assign vendor manufacture requets is pending",
          data: {},
        });
        return false;
      }
    }
    if (resultCheck[0].orderType === "buy") {
      if (resultCheck[0].status === "0") {
        res.send({
          status: false,
          message: "Can not assign vendor buy requets is pending",
          data: {},
        });
        return false;
      }
    }
  }

  let sql =
    "UPDATE orderItems SET is_assigned='Y', vendor_id='" +
    vendor_id +
    "' WHERE id='" +
    product_id +
    "'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    var vendorData =
      "INSERT INTO assignVendorDetails (vendor_id,order_id,price,quantity,total,product_file,status,orderType) VALUES('" +
      vendor_id +
      "','" +
      product_id +
      "','" +
      product_price +
      "','" +
      product_quantity +
      "','" +
      product_total +
      "','" +
      productFile +
      "','0','Customize')";
    var insertResult = await mysqlQuery(vendorData);
    return res.send(
      JSON.stringify({
        status: true,
        message: "Product updated successfully ",
        data: runSql,
      })
    );
  }
};



exports.getVendorOrder = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var vendor_id = req.body.vendorId;
  var product_id = req.body.orderId;
  let sql =
    "SELECT * FROM assignVendorDetails WHERE vendor_id='" +
    vendor_id +
    "' AND order_id='" +
    product_id +
    "'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Vendor Data ",
        data: runSql,
      })
    );
  }
};

exports.orderSingleDetails = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.orderId.id;
  let sql = "SELECT orderItems.*,cu.name as userName,customer.name as salseName,products.name as productName  FROM orderItems LEFT JOIN customer cu ON cu.id = orderItems.userId LEFT JOIN customer ON customer.id = orderItems.customer_id LEFT JOIN products ON products.id = orderItems.product_Id WHERE orderItems.id='" + orderId + "'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order Data ",
        data: runSql,
      })
    );
  }
};

exports.getMaterials = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var productId = req.body.productId;
  let sql = "SELECT * FROM productMaterials WHERE product_id='"+productId+"'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order Data ",
        data: runSql,
      })
    );
  }
};

exports.addVendorMaterial = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var vendorId = req.body.vendorId;
  var materialId = req.body.materialId;
  var productId = req.body.productId;
  var orderId = req.body.orderId.id;
  var materialPrice = req.body.materialPrice;
  var materialQuantity = req.body.materialQuantity;
  var materialTotal = req.body.materialTotal;
  let sql = "INSERT INTO vendorMaterialList (order_id,product_id,material_id,quantity,price,total,vendor_id) VALUES('"+
  orderId+
  "','"+
  productId+
  "','"+
  materialId+
  "','"+
  materialQuantity+
  "','"+
  materialPrice+
  "','"+
  materialTotal+
  "','"+
  vendorId+
  "')"
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order Places Successfully",
        data: runSql,
      })
    );
  }
};

exports.getMaterialList = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.orderId;
  let sql = "SELECT * FROM vendorMaterialList WHERE material_id='"+orderId+"'";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order Data ",
        data: runSql,
      })
    );
  }else{
    return res.send(
      JSON.stringify({
        status: false,
        message: "",
        data: {},
      })
    );
  }
};

exports.addManufactureRequest = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.orderId;
  var vendorId = req.body.vendorId;
  var productId = req.body.productId;
  var type = req.body.type;

  let checkSql =
    "SELECT * FROM assignVendorDetails WHERE order_id='" + orderId + "'";
  let resultSql = await mysqlQuery(checkSql);
  if (resultSql.length > 0) {
    res.send(
      JSON.stringify({
        status: false,
        message: "Order alredy placed.",
        data: {},
      })
    );
    return false;
  }

  let checkStatus =
    "SELECT status FROM assignVendorDetails WHERE order_id='" + orderId + "'";
  let resultStatus = await mysqlQuery(checkStatus);
  if (resultStatus.length > 0) {
    var status = resultStatus[0].status;
    if (status == 0) {
      res.send(
        JSON.stringify({
          status: false,
          message: "Vendor request is pending.",
          data: {},
        })
      );
      return false;
    }
  }
  let updateOrder =
    "UPDATE orderItems SET manufactureOrBuy='" +
    type +
    "',vendor_id=" +
    vendorId +
    " WHERE id='" +
    orderId +
    "'";
  let updateResult = await mysqlQuery(updateOrder);

  let sql =
    "INSERT INTO assignVendorDetails (order_id,product_id,vendor_id,orderType) VALUES('" +
    orderId +
    "','" +
    productId +
    "','" +
    vendorId +
    "','" +
    type +
    "')";
  let runSql = await mysqlQuery(sql);
  if (runSql) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Order placed successfully",
        data: runSql,
      })
    );
  } else {
    return res.send(
      JSON.stringify({
        status: false,
        message: "",
        data: {},
      })
    );
  }
};


exports.addMaterials = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var productId = req.body.productId;
  var matData = JSON.parse(req.body.materialValues);
  if (req.body.materialValues) {
    for (i = 0; i < matData.length; i++) {
      let materialSql =
        "INSERT INTO productMaterials SET product_id = '" +
        productId +
        "', material_type = '" +
        matData[i].itemType +
        "',material_name = '" +
        matData[i].itemName +
        "',material_quantity = '" +
        matData[i].itemQuantity +
        "'";
      var materialsResult = await mysqlQuery(materialSql);
    }
    if (materialsResult) {
      return res.send({
        message: "Material added successfully",
        status: true,
      });
    }
  } else {
    res.send({
      message: "Some error occure",
      status: false,
    });
    return false;
  }
};

exports.addBuyVendorRequest = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var vendorId = req.body.vendorId;
  var singleOrderId = req.body.singleOrderId;
  var singleProductId = req.body.singleProductId;
  var materialPrice = req.body.materialPrice;
  var materialQuantity = req.body.materialQuantity;
  var materialTotal = req.body.materialTotal;
  var type = req.body.type;
  let checkSql =
    "SELECT * FROM assignVendorDetails WHERE product_id='" +
    singleProductId +
    "'";
  let runSql = await mysqlQuery(checkSql);
  if (runSql.length > 0) {
    let status = runSql[0].status;
    if (status === "0") {
      res.send({
        message: "Order request is alredy pending for this product",
        status: false,
      });
      return false;
    } else {
      let updateOrder =
        "UPDATE orderItems SET manufactureOrBuy='" +
        type +
        "' WHERE id='" +
        singleOrderId +
        "'";
      let updateResult = await mysqlQuery(updateOrder);
      let materialSql =
        "INSERT INTO assignVendorDetails SET vendor_id = '" +
        vendorId +
        "', order_id = '" +
        singleOrderId +
        "',product_id = '" +
        singleProductId +
        "',price = '" +
        materialPrice +
        "',quantity = '" +
        materialQuantity +
        "',total = '" +
        materialTotal +
        "'orderType='" +
        type +
        "'";
      var materialsResult = await mysqlQuery(materialSql);
      if (materialsResult) {
        return res.send({
          message: "Buy request added successfully",
          status: true,
        });
      } else {
        res.send({
          message: "Some error occure",
          status: false,
        });
        return false;
      }
    }
  } else {
    let updateOrder =
      "UPDATE orderItems SET manufactureOrBuy='" +
      type +
      "' WHERE id='" +
      singleOrderId +
      "'";
    let updateResult = await mysqlQuery(updateOrder);
    let materialSql =
      "INSERT INTO assignVendorDetails SET vendor_id = '" +
      vendorId +
      "', order_id = '" +
      singleOrderId +
      "',product_id = '" +
      singleProductId +
      "',price = '" +
      materialPrice +
      "',quantity = '" +
      materialQuantity +
      "',total = '" +
      materialTotal +
      "', orderType='" +
      type +
      "'";
    var materialsResult = await mysqlQuery(materialSql);
    if (materialsResult) {
      return res.send({
        message: "Buy request added successfully",
        status: true,
      });
    } else {
      res.send({
        message: "Some error occure",
        status: false,
      });
      return false;
    }
  }
};




exports.addNewOrderSalsePerson = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/customizeImage/");
    },

    filename: function (req, file, cb) {
      var imageName =
        file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      cb(null, imageName);
    },
  });
  let upload = multer({ storage: storage }).fields([
    { name: "customizeImage" },
  ]);
  upload(req, res, async function (err) {
    var productId = req.body.productId;
    var productGST = req.body.productGST;
    var productQuantity = req.body.productQuantity;
    var productPrice = req.body.productPrice;
    var avaliableQty = req.body.avaliableQty;
    var userId = req.loginUserId;

    if (!productId) {
      res.send({
        status: false,
        message: "Please select product",
        data: {},
      });
      return false;
    }
    if (!productQuantity) {
      res.send({
        status: false,
        message: "Please enter quantity",
        data: {},
      });
      return false;
    }

    let checkCart =
      "SELECT * FROM cart WHERE user_Id='" +
      userId +
      "' AND product_Id='" +
      productId +
      "'";
    let checkCartResult = await mysqlQuery(checkCart);

    let sql =
      "SELECT * FROM orderSummary WHERE product_id='" +
      productId +
      "' AND customer_id='" +
      userId +
      "'";
    let runSql = await mysqlQuery(sql);
    if (checkCartResult.length > 0) {
      let updateCart =
        "UPDATE cart SET quantity='" +
        productQuantity +
        "' WHERE user_Id='" +
        userId +
        "' AND product_Id='" +
        productId +
        "'";
      let runUpdate = await mysqlQuery(updateCart);
      if (req.files.customizeImage != undefined) {
        cImage = req.files.customizeImage[0].filename;
        let updateProduct =
          "UPDATE orderSummary SET product_qty='" +
          productQuantity +
          "',product_gst_percent='" +
          productGST +
          "',product_amount='" +
          productPrice +
          "',isCustomize='Y',customize_image='" +
          cImage +
          "',product_avaliable_qty='" +
          avaliableQty +
          "',product_attrbitute_name='" +
          runSql[0].product_attrbitute_name +
          "',product_attrbitute_value='" +
          runSql[0].product_attrbitute_value +
          "' WHERE product_id='" +
          productId +
          "'";
        result = await mysqlQuery(updateProduct);
        if (result) {
          return res.send({
            status: true,
            message: "Product Added",
            data: result,
          });
        }
      }
      if (req.files.customizeImage == undefined) {
        let updateProduct =
          "UPDATE orderSummary SET product_qty='" +
          productQuantity +
          "',product_gst_percent='" +
          productGST +
          "',product_amount='" +
          productPrice +
          "',isCustomize='N',product_avaliable_qty='" +
          avaliableQty +
          "',product_attrbitute_name='" +
          runSql[0].product_attrbitute_name +
          "',product_attrbitute_value='" +
          runSql[0].product_attrbitute_value +
          "' WHERE product_id='" +
          productId +
          "'";
        let updateResult = await mysqlQuery(updateProduct);
        if (updateResult) {
          return res.send({
            status: true,
            message: "Product Added",
            data: updateResult,
          });
        }
      }
    } else {
      let insertCart =
        "INSERT INTO cart SET quantity='" +
        productQuantity +
        "', user_Id='" +
        userId +
        "', product_Id='" +
        productId +
        "'";
      let runInsert = await mysqlQuery(insertCart);
      var cartId = runInsert.insertId;
      var getProductDetails =
        "SELECT products.*,productAttribute.name as attName,productAttribute.value as attValue,productImages.image as productImage FROM products LEFT JOIN productAttribute ON productAttribute.product_id = products.id LEFT JOIN productImages ON productImages.product_id = products.id WHERE products.id='" +
        productId +
        "' GROUP BY products.id";
      var getProductResult = await mysqlQuery(getProductDetails);
      if (getProductResult.length > 0) {
        console.log(req.files.customizeImage)
        if (req.files.customizeImage != undefined) {
          cImage = req.files.customizeImage[0].filename;
          let sql2 =
            "INSERT INTO orderSummary (customer_id,cart_id,product_Id,product_name,product_attrbitute_name,product_attrbitute_value,product_image,product_qty,product_gst_percent,product_amount,product_avaliable_qty,isCustomize,customize_image) VALUES ('" +
            userId +
            "','" +
            cartId +
            "','" +
            productId +
            "','" +
            getProductResult[0].name +
            "','" +
            getProductResult[0].attName +
            "','" +
            getProductResult[0].attValue +
            "','" +
            getProductResult[0].productImage +
            "','" +
            productQuantity +
            "','" +
            getProductResult[0].tax +
            "','" +
            productPrice +
            "','" +
            getProductResult[0].avaliable_qty +
            "','Y','" +
            cImage +
            "')";
          let runSql2 = await mysqlQuery(sql2);
          if (runSql2) {
            return res.send({
              status: true,
              message: "Product Added",
              data: runSql2,
            });
          }
        } else {
          let sql2 =
            "INSERT INTO orderSummary (customer_id,cart_id,product_Id,product_name,product_attrbitute_name,product_attrbitute_value,product_image,product_qty,product_gst_percent,product_amount,product_avaliable_qty,isCustomize) VALUES ('" +
            userId +
            "','" +
            cartId +
            "','" +
            productId +
            "','" +
            getProductResult[0].name +
            "','" +
            getProductResult[0].attName +
            "','" +
            getProductResult[0].attValue +
            "','" +
            getProductResult[0].productImage +
            "','" +
            productQuantity +
            "','" +
            getProductResult[0].tax +
            "','" +
            productPrice +
            "','" +
            getProductResult[0].avaliable_qty +
            "','N')";
          let runSql2 = await mysqlQuery(sql2);
          if (runSql2) {
            return res.send({
              status: true,
              message: "Product Added",
              data: runSql2,
            });
          }
        }
      }
    }
  });
};


exports.vendorBuyRequest = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.orderId;
  let getVendorSql = "SELECT * FROM assignVendorDetails WHERE order_id='"+orderId+"' AND orderType='buy'"
  let result = await mysqlQuery(getVendorSql)
  if(result.length > 0){
    return res.send({
      status:true,
      message:"Vendor Buy Data",
      data:result[0]
    })
  }else{
    res.send({
      status:false,
      message:"No data found",
      data:{}
    })
  }
};

exports.vendorManufactureRequest = async (req, res) => {
  mysqlConnect = mysqlConnect || (await createPoolAndEnsureSchema());
  var mysqlQuery = util.promisify(mysqlConnect.query).bind(mysqlConnect);
  var orderId = req.body.orderId;
  let getVendorSql = "SELECT * FROM assignVendorDetails WHERE order_id='"+orderId+"' AND orderType='manufacture'"
  let result = await mysqlQuery(getVendorSql)
  if(result.length > 0){
    return res.send({
      status:true,
      message:"Vendor Buy Data",
      data:result[0]
    })
  }else{
    res.send({
      status:false,
      message:"No data found",
      data:{}
    })
  }
};

exports.getActiveOrderDetails = async (req, res) => {
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
    "SELECT orderItems.*,products.name,products.price as pr  FROM orderItems LEFT JOIN products ON products.id = orderItems.product_Id  WHERE orderItems.orderId= '" +
    req.body.id +
    "' AND userId='"+req.loginUserId+"'";
  let sqlRun = await mysqlQuery(sql);
  if (sqlRun.length > 0) {
  }
  if (sqlRun) {
    return res.send(
      JSON.stringify({
        status: true,
        message: "Product data ",
        data: sqlRun,
      })
    );
  }
};
