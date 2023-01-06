import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import jwt_decode from "jwt-decode";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "./BaseUrl";

function Dashboard() {
  const [customer, setCustomer] = useState("");
  const [totalOrder, setTotalOrder] = useState("");
  const [totalOrderCat, setTotalOrderCat] = useState("");
  const [totalOrderOPS, setTotalOrderOPS] = useState("");
  const [products, setProducts] = useState("");
  const [completedOrder, setCompletedOrder] = useState("");
  const [pendingOrder, setPendingOrder] = useState("");
  const [vendorPendingOrder, setVendorPendingOrder] = useState("");

  const [inProcessOrder, setInProcessOrder] = useState("");
  const [vendor, setVendor] = useState("");
  const [vendorCompleted, setVendorCompleted] = useState("");
  const [vendorInprocess, setVendorInprocess] = useState("");
  const [categories, setCategories] = useState("");
  const [catManager, setCatManager] = useState("");
  const [subCategories, setSubCategories] = useState("");
  const [salesPerson, setSalesPerson] = useState("");
  const [OPSExecutive, setOPSExecutive] = useState("");
  const [userType, setUserType] = useState("");

  if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      window.location.href = "/";
      localStorage.clear();
    }
  }
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };

    axios
      .post(baseUrl + "/frontapi/getDashboardData", {}, config)
      .then((res) => {
        var resp = res.data;
        setUserType(resp.data.userData[0].userType);
        setVendorPendingOrder(resp.data.vendorPendingOrder[0]["COUNT(id)"]);
        setVendorCompleted(resp.data.vendorCompleted[0]["COUNT(id)"]);
        setVendorInprocess(resp.data.vendorInprocess[0]["COUNT(id)"]);
        setInProcessOrder(resp.data.inProcessOrder[0]["COUNT(id)"]);
        setPendingOrder(resp.data.pendingOrder[0]["COUNT(id)"]);
        setCompletedOrder(resp.data.completedOrder[0]["COUNT(id)"]);
        setTotalOrderCat(resp.data.totalOrder[0]["COUNT(id)"]);
        setTotalOrderOPS(resp.data.totalOrder[0]["COUNT(id)"]);

        setCustomer(resp.data.customers[0]["COUNT(id)"]);
        setTotalOrder(resp.data.totalOrder[0]["COUNT(id)"]);
        setProducts(resp.data.totalProducts[0]["COUNT(id)"]);
        setVendor(resp.data.vendors[0]["COUNT(id)"]);
        setCategories(resp.data.categories[0]["COUNT(id)"]);
        setSubCategories(resp.data.subCategories[0]["COUNT(id)"]);
        setCatManager(resp.data.catManager[0]["COUNT(id)"]);
        setOPSExecutive(resp.data.opsExecutive[0]["COUNT(id)"]);
        setSalesPerson(resp.data.salesPerson[0]["COUNT(id)"]);
      });
  };

  return (
    <>
      <div id="layout-wrapper">
        <Header />
        <Navbar />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid p-0">
              <div className="row">
                {userType === "Vendor" ? (
                  <>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor-pending-orders">
                          <div className="card-body card-danger">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Pending Order
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {vendorPendingOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-danger rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/process-order">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order Inprocess
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorInprocess}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor-order-completed">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order completed
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorCompleted}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {userType === "ADMIN" ? (
                  <>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/pending-orders">
                          <div className="card-body card-danger">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Pending Order</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {pendingOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-danger rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/inprocess-orders">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Order Inprocess
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {inProcessOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/order-completed">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Complete Order</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {completedOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/customer">
                          <div className="card-body card-primary">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Customers</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {customer}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-primary rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light2.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/total-orders">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Total Orders</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target="33.48"
                                  >
                                    {totalOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light5.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/products">
                          <div className="card-body card-secondary">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Products</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {products}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-secondary rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor">
                          <div className="card-body card-secondary">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Total Vendors</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendor}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-info rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor-pending-orders">
                          <div className="card-body card-danger">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Pending Order
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {vendorPendingOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-danger rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/process-order">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order Inprocess
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorInprocess}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor-order-completed">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order completed
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorCompleted}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/categories">
                          <div className="card-body card-secondary">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Categories</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {categories}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-secondary rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/category-manager">
                          <div className="card-body card-primary">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Category Manager
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {catManager}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-primary rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/sub-categories">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Sub Category Manager
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {subCategories}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/operation-executive">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Operation Executives
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {OPSExecutive}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/sales-person">
                          <div className="card-body card-secondary">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Sales Person</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {salesPerson}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-secondary rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {userType === "oprationExecutive" ? (
                  <>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/pending-orders">
                          <div className="card-body card-danger">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Pending Order</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {pendingOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-danger rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/inprocess-orders">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Order Inprocess
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {inProcessOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/order-completed">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Complete Order</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {completedOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/total-orders">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Total Orders</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target="33.48"
                                  >
                                    {totalOrderOPS}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light5.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/pending-orders">
                          <div className="card-body card-danger">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Pending Order
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {vendorPendingOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-danger rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/process-order">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order Inprocess
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorInprocess}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor-order-completed">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order completed
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorCompleted}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}

                {userType === "CategoryManager" ? (
                  <>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/pending-orders">
                          <div className="card-body card-danger">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Pending Order</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {pendingOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-danger rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/inprocess-orders">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Order Inprocess
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {inProcessOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/order-completed">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Complete Order</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {completedOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/total-orders">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">Total Orders</p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target="33.48"
                                  >
                                    {totalOrderCat}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light5.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor-pending-orders">
                          <div className="card-body card-danger">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Pending Order
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={100}
                                  >
                                    {vendorPendingOrder}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-danger rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light4.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/process-order">
                          <div className="card-body card-warning">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order Inprocess
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorInprocess}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-warning rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-12">
                      <div className="card card-animate">
                        <Link to="/vendor-order-completed">
                          <div className="card-body card-success">
                            <div className="d-flex justify-content-between">
                              <div>
                                <p className="fw-medium mb-0">
                                  Vendor Order completed
                                </p>
                                <h2 className="mt-4 ff-secondary fw-semibold">
                                  <span
                                    className="counter-value"
                                    data-target={10}
                                  >
                                    {vendorCompleted}
                                  </span>
                                </h2>
                              </div>
                              <div>
                                <div className="avatar-sm flex-shrink-0">
                                  <span className="avatar-title bg-success rounded-circle fs-2">
                                    <img
                                      src="assets/images/menu-icon-light1.png"
                                      alt=""
                                      className="img-fluid"
                                    />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
export default Dashboard;
