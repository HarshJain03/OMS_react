import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Customer from "./components/Customer";
import Products from "./components/Products";
import ProductAdd from "./components/ProductAdd";
import CustomerAdd from "./components/CustomerAdd";
import Vendor from "./components/Vendor";
import VendorAdd from "./components/VendorAdd";
import CustomerDetails from "./components/CustomerDetails";
import VendorDetails from "./components/VendorDetails";
import CustomerEdit from "./components/CustomerEdit";
import VendorEdit from "./components/VendorEdit";
import PendingOrders from "./components/PendingOrders";
import VendorProcessOrder from "./components/VendorProcessOrder";
import OrderCompleted from "./components/OrderCompleted";
import AddOrders from "./components/AddOrders";
import PendingOrderDetails from "./components/PendingOrderDetails";
import ProcessOrderDetails from "./components/ProcessOrderDetails";
import CustomerProcessOrderDetails from "./components/CustomerProcessOrderDetails";
import ProductDetails from "./components/ProductDetails";
import ProductEdit from "./components/ProductEdit";
import InprocessOrders from "./components/InprocessOrders";
import Category from "./components/Category";
import CategoryAdd from "./components/CategoryAdd";
import CategoryEdit from "./components/CategoryEdit";
import Gst from "./components/Gst";
import GstAdd from "./components/GstAdd";
import GstEdit from "./components/GstEdit";
import Attribute from "./components/Attribute";
import AttributeAdd from "./components/AttributeAdd";
import AttributeEdit from "./components/AttributeEdit";

import CategoryManager from "./components/CategoryManager";
import AddCategoryManager from "./components/AddCategoryManager";
import CategoryManagerEdit from "./components/CategoryManagerEdit";

import SalesPerson from "./components/SalesPerson";
import AddSalesPerson from "./components/AddSalesPerson";
import SalesPersonEdit from "./components/SalesPersonEdit";

import OprationExecutive from "./components/OprationExecutive";
import AddOprationExecutive from "./components/AddOprationExecutive";
import OprationExecutiveEdit from "./components/OprationExecutiveEdit";
import Manufacture from "./components/Manufacture";
import SubCategory from "./components/SubCategory";
import SubCategoryAdd from "./components/SubCategoryAdd";
import SubCategoryEdit from "./components/SubCategoryEdit";
import VendorPendingOrders from "./components/VendorPendingOrders";
import VendorOrderCompleted from "./components/VendorOrderCompleted";
import TotalOrders from "./components/TotalOrders";
import VendorOrderDetail from "./components/VendorOrderDetail";

function App(props) {
  useEffect(() => {
    myFunction();
  }, []);

  const myFunction = () => {
    var element = document.getElementById("as-react-datatable-table-foot");
    if (element) {
      element.classList.add("align-items-center");
    }
  };

  return (
    <Router>
      {/* <div className="app-container"> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer-add" element={<CustomerAdd />} />
        <Route path="/customer-edit/:id" element={<CustomerEdit />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/vendor-add" element={<VendorAdd />} />
        <Route
          path="/vendor-order-completed"
          element={<VendorOrderCompleted />}
        />
        <Route path="/customer-details" element={<CustomerDetails />} />
        <Route exact path="/products" element={<Products {...props} />} />
        <Route exact path="/product-add" element={<ProductAdd {...props} />} />
        <Route path="/customer-details/:id" element={<CustomerDetails />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/product-edit/:id" element={<ProductEdit />} />
        <Route path="/vendor-details/:id" element={<VendorDetails />} />
        <Route path="/vendor-edit/:id" element={<VendorEdit />} />
        <Route path="/pending-orders" element={<PendingOrders />} />
        <Route
          path="/vendor-pending-orders"
          element={<VendorPendingOrders />}
        />
        <Route path="/process-order" element={<VendorProcessOrder />} />
        <Route path="/order-completed" element={<OrderCompleted />} />
        <Route path="/total-orders" element={<TotalOrders />} />
        <Route
          path="/vendor-order-details/:id"
          element={<VendorOrderDetail />}
        />

        <Route path="/add-orders" element={<AddOrders />} />
        <Route
          path="/pending-order-details/:id"
          element={<PendingOrderDetails />}
        />
        <Route
          path="/process-order-details/:id"
          element={<ProcessOrderDetails />}
        />
        <Route
          path="/customer-process-order-details"
          element={<CustomerProcessOrderDetails />}
        />
        <Route path="/inprocess-orders" element={<InprocessOrders />} />
        <Route
          path="/inprocess-order-details/:id"
          element={<CustomerProcessOrderDetails />}
        />
        <Route path="/manufacture/:id" element={<Manufacture />} />

        <Route path="/categories" element={<Category />} />
        <Route path="/category-add" element={<CategoryAdd />} />
        <Route path="/category-edit/:id" element={<CategoryEdit />} />

        <Route path="/gst" element={<Gst />} />
        <Route path="/gst-add" element={<GstAdd />} />
        <Route path="/gst-edit/:id" element={<GstEdit />} />

        <Route path="/attributes" element={<Attribute />} />
        <Route path="/attribute-add" element={<AttributeAdd />} />
        <Route path="/attribute-edit/:id" element={<AttributeEdit />} />

        <Route path="/category-manager" element={<CategoryManager />} />
        <Route path="/add-category-manager" element={<AddCategoryManager />} />
        <Route
          path="/category-manager-edit/:id"
          element={<CategoryManagerEdit />}
        />

        <Route path="/sub-categories" element={<SubCategory />} />
        <Route path="/sub-category-add" element={<SubCategoryAdd />} />
        <Route path="/sub-category-edit/:id" element={<SubCategoryEdit />} />

        <Route path="/sales-person" element={<SalesPerson />} />
        <Route path="/add-sales-person" element={<AddSalesPerson />} />
        <Route path="/sales-person-edit/:id" element={<SalesPersonEdit />} />

        <Route path="/operation-executive" element={<OprationExecutive />} />
        <Route
          path="/add-operation-executive"
          element={<AddOprationExecutive />}
        />
        <Route
          path="/opration-executive-edit/:id"
          element={<OprationExecutiveEdit />}
        />
      </Routes>
      {/* </div>   */}
    </Router>
  );
}
export default App;
