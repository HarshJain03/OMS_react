var verifytoken = require("../verifytoken");
const UserCtrl = require("../controllers/user.controller.js");
const ProductCtrl = require("../controllers/product.controller.js");
const CategoryCtrl = require("../controllers/category.controller.js");
const GstCtrl = require("../controllers/gst.controller.js");
const AttributeCtrl = require("../controllers/attribute.controller.js");
const categoryMngrCtrl = require("../controllers/categoryMangerController.js");
const salesPersonCtrl = require("../controllers/salesPersonController.js");
const oprationExeCtrl = require("../controllers/oprationExecutive.controller.js");


var router = require("express").Router();

module.exports = (app) => { 
  // all post routes
  router.post("/register", UserCtrl.register);
  router.post("/login-admin", UserCtrl.loginAdmin);
  router.post("/login-user", UserCtrl.loginUser);
  router.post("/getcode", UserCtrl.getcode);
  router.post("/get-user-data", verifytoken,UserCtrl.getUserData);
  
  router.post("/customer-add", UserCtrl.customerAdd);
  router.post("/customer-data", UserCtrl.customerData);
  router.post("/customer-edit", UserCtrl.customerEdit);

  router.post("/vendor-add", UserCtrl.vendorAdd);
  router.post("/vendor-data", UserCtrl.vendorData);
  router.post("/vendor-single", UserCtrl.vendorSingle);
  router.post("/vendor-single-attribute", UserCtrl.vendorSingleAttribute);
  router.post("/vendor-edit", UserCtrl.vendorEdit);
  router.post("/login-vendor", UserCtrl.loginVendor);
  router.post("/vendor-delete", UserCtrl.vendorDelete);
  
  router.post("/get-rightes",verifytoken,UserCtrl.getAdminDetails)

  router.post("/product-data", ProductCtrl.productData);  
  router.post("/product-add", ProductCtrl.productAdd); 
  router.post("/product-single", ProductCtrl.productSingle);
  router.post("/product-edit", ProductCtrl.productEdit);
  router.post("/add-cart", verifytoken,ProductCtrl.addCart);
  router.post("/change-product-status",ProductCtrl.changeProductStatus)
  router.post("/updateOrderPrice", verifytoken,ProductCtrl.updateOrderPrice);
  router.get("/get-customer",ProductCtrl.getCustomerDetails);
  router.post("/get-address-byid",verifytoken,ProductCtrl.getAddressDetails)
  router.post("/get-customer-byid",verifytoken,ProductCtrl.getCustomerDetailsById)
  router.post("/get-customer-admin",ProductCtrl.getCustomerDetailsAdmin)
  router.post("/add-user-service",verifytoken,ProductCtrl.addUserService)
  router.post("/add-address-service",verifytoken,ProductCtrl.addAddressService)
  router.post("/update-cart", verifytoken,ProductCtrl.updateCart);
  router.post("/get-cart-by-userid", verifytoken,ProductCtrl.getCartDataByUserId);
  router.post("/product-count", verifytoken,ProductCtrl.productCount);
  router.post("/deleteCartANDCheck", verifytoken,ProductCtrl.deleteCartANDCheck);
  router.post("/getCartDataByUserId", verifytoken,ProductCtrl.getCartDataByUserIdForCheckout);
  router.post("/placeOrder", verifytoken,ProductCtrl.placeOrder);
  router.post("/placeOrderSalcePerson", verifytoken,ProductCtrl.placeOrderSalcePerson);
  router.post("/orders", verifytoken,ProductCtrl.orders);
  router.post("/getProductAttribute", verifytoken,ProductCtrl.getProductAttribute);
  router.post("/deleteCartProduts", verifytoken,ProductCtrl.deleteCartProduts);
  router.post("/deleteCartByUserid", verifytoken,ProductCtrl.deleteCartByUserid);
  router.post("/get-orderdetails-admin",ProductCtrl.getOrderDetailsAdmin)
  router.get("/get-vendor-list",ProductCtrl.getVendorList)
  router.post("/assign-vendor",ProductCtrl.assignVendor)
  router.post("/get-vendor-order",ProductCtrl.getVendorOrder)
  router.post("/order-single-vendor",ProductCtrl.orderSingleDetails)

  router.post("/order-data", ProductCtrl.orderData);
  router.post("/order-single", ProductCtrl.orderDetail);
  router.post("/order-status-update",verifytoken, ProductCtrl.orderStatusUpdate);
  
  router.post("/customer-single", UserCtrl.customerSingle);
  router.post("/customer-single-attribute", UserCtrl.customerSingleAttribute);

  router.post("/customer-delete", UserCtrl.customerDelete);
 
  router.post("/category-add", CategoryCtrl.categoryAdd);
  router.post("/category-data", CategoryCtrl.categoryData);
  router.post("/category-delete", CategoryCtrl.categoryDelete);
  router.post("/category-edit", CategoryCtrl.categoryEdit);
  router.post("/category-single", CategoryCtrl.categorySingle);

  router.post("/gst-add", GstCtrl.gstAdd);
  router.post("/gst-data", GstCtrl.gstData);
  router.post("/gst-delete", GstCtrl.gstDelete);
  router.post("/gst-edit", GstCtrl.gstEdit);
  router.post("/gst-single", GstCtrl.gstSingle);

  router.post("/attribute-add", AttributeCtrl.attributeAdd);
  router.post("/attribute-data", AttributeCtrl.attributeData);
  router.post("/attribute-delete", AttributeCtrl.attributeDelete);
  router.post("/attribute-edit", AttributeCtrl.attributeEdit);
  router.post("/attribute-single", AttributeCtrl.attributeSingle);

  router.post("/category-manager-add", categoryMngrCtrl.categoryManagerAdd);
  router.post("/category-manager-data", categoryMngrCtrl.categoryData);
  router.post("/category-manager-single", categoryMngrCtrl.categorySingle);
  router.post("/category-manager-update", categoryMngrCtrl.categoryEdit);
  router.post("/category-manager-delete", categoryMngrCtrl.categoryDelete);

  router.post("/sales-person-add", salesPersonCtrl.salesPersonAdd);
  router.post("/sales-person-data", salesPersonCtrl.salesPersonData);
  router.post("/sales-person-edit", salesPersonCtrl.salesPersonEdit);
  router.post("/sales-person-single", salesPersonCtrl.salesPersonSingle);
  router.post("/sales-person-update", salesPersonCtrl.salesPersonEdit);
  router.post("/sales-person-delete", salesPersonCtrl.salesPersonDelete);

  router.post("/opration-executive-add", oprationExeCtrl.oprationExecutiveAdd);
  router.post("/opration-executive-data", oprationExeCtrl.oprationExecutiveData);
  router.post("/opration-executive-update", oprationExeCtrl.oprationExecutiveEdit);
  router.post("/opration-executive-single", oprationExeCtrl.oprationExecutiveSingle); 
  router.post("/opration-executive-delete", oprationExeCtrl.oprationExecutiveDelete);


  
  // oprationExecutiveAdd
  
  // all get routes
  router.get("/", function (req, res) {
    return res.send("Api Working");
  });
  // add all routes to api
  app.use("/frontapi/", router);
};