import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "./BaseUrl";

function Sidebar(props) {
  useEffect(() => {
    getUserDetails();
  }, []);
  const [userType, setUserType] = useState("");
  const [customerManagment, setCustomerManagment] = useState("");
  const [vendorManagment, setVendorManagment] = useState("");
  const [productManagment, setProductManagment] = useState("");
  const [catogryManagment, setCatogryManagment] = useState("");
  const [catogryPersonManager, setCatogryPersonManager] = useState("");
  const [salseManagment, setSalseManagment] = useState("");
  const [operationManagment, setOperationManagment] = useState("");
  const [gstManagment, setGstManagment] = useState("");
  const [attributeManagment, setAttributeManagment] = useState("");
  const [orderManagment, setOrderManagment] = useState("");
  const [venderOrder, setVenderOrder] = useState("");

  const getUserDetails = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };
    axios.post(baseUrl + "/frontapi/get-rightes", {}, config).then((res) => {
      var resp = res.data;
      var data = resp.data[0];
      setCustomerManagment(data.customerManagment);
      setVendorManagment(data.vendorManagment);
      setProductManagment(data.productManagment);
      setCatogryManagment(data.catogryManagment);
      setCatogryPersonManager(data.catogryPersonManager);
      setSalseManagment(data.salseManagment);
      setOperationManagment(data.operationManagment);
      setGstManagment(data.gstManagment);
      setAttributeManagment(data.attributeManagment);
      setOrderManagment(data.orderManagment);
      setVenderOrder(data.venderOrder);
      setUserType(data.userType);
    });
  };

  return (
    <div id="scrollbar">
      <div className="simplebar-content" style={{ padding: "0px" }}>
        <div className="container-fluid p-0">
          <ul className="navbar-nav" id="navbar-nav">
            <li className="menu-title">
              <span data-key="t-menu">Menu</span>
            </li>
            <li className="nav-item">
              <Link
                to={"/dashboard"}
                className={
                  window.location.pathname === "/dashboard"
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                <i className="mdi mdi-speedometer" />{" "}
                <span data-key="t-dashboards">Dashboards</span>
              </Link>
            </li>
            {customerManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/customer"}
                  className={
                    window.location.pathname === "/customer"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon2.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Customers</span>
                </Link>
              </li>
            )}
            {vendorManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/vendor"}
                  className={
                    window.location.pathname === "/vendor"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon3.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Vendors</span>
                </Link>
              </li>
            )}
            {productManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/products"}
                  className={
                    window.location.pathname === "/products"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Products</span>
                </Link>
              </li>
            )}
            {catogryManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/categories"}
                  className={
                    window.location.pathname === "/categories"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Categories</span>
                </Link>
              </li>
            )}
            {catogryManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/sub-categories"}
                  className={
                    window.location.pathname === "/sub-categories"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Sub Category</span>
                </Link>
              </li>
            )}
            {catogryPersonManager === 1 && (
              <li className="nav-item">
                <Link
                  to={"/category-manager"}
                  className={
                    window.location.pathname === "/category-manager"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Category Manager</span>
                </Link>
              </li>
            )}
            {salseManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/sales-person"}
                  className={
                    window.location.pathname === "/sales-person"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Sales Person</span>
                </Link>
              </li>
            )}
            {operationManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/operation-executive"}
                  className={
                    window.location.pathname === "/operation-executive"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Operation Executive</span>
                </Link>
              </li>
            )}
            {gstManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/gst"}
                  className={
                    window.location.pathname === "/gst"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">GST</span>
                </Link>
              </li>
            )}
            {attributeManagment === 1 && (
              <li className="nav-item">
                <Link
                  to={"/attributes"}
                  className={
                    window.location.pathname === "/attributes"
                      ? "nav-link active"
                      : "nav-link"
                  }
                >
                  <img
                    src="/assets/images/menu-icon1.png"
                    alt=""
                    className="img-fluid"
                  />{" "}
                  <span data-key="t-dashboards">Attributes</span>
                </Link>
              </li>
            )}
            <>
              {orderManagment === 1 && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/assets/images/menu-icon4.png"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    <span data-key="t-dashboards">Orders</span>
                  </a>
                  <ul
                    className={
                      window.location.pathname === "/pending-orders" ||
                      window.location.pathname === "/inprocess-orders" ||
                      window.location.pathname === "/order-completed" ||
                      window.location.pathname === "/total-orders"
                        ? "dropdown-menu position-static show"
                        : "dropdown-menu position-static"
                    }
                    aria-labelledby="navbarDropdown"
                  >
                    {userType === "Vendor" ? (
                      <>
                        <li>
                          <Link
                            to={"/vendor-pending-orders"}
                            className={
                              window.location.pathname ===
                              "/vendor-pending-orders"
                                ? "dropdown-item active"
                                : "dropdown-item"
                            }
                          >
                            <img
                              src="/assets/images/menu-icon4.png"
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Pending Orders
                          </Link>
                        </li>

                        <li>
                          <Link
                            className={
                              window.location.pathname === "/process-order"
                                ? "dropdown-item active"
                                : "dropdown-item"
                            }
                            to={"/process-order"}
                          >
                            <img
                              src="/assets/images/menu-icon4.png"
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Order Inprocess
                          </Link>
                        </li>

                        <li>
                          <Link
                            className={
                              window.location.pathname ===
                              "/vendor-order-completed"
                                ? "dropdown-item active"
                                : "dropdown-item"
                            }
                            to={"/vendor-order-completed"}
                          >
                            <img
                              src="/assets/images/menu-icon4.png"
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Order Completed
                          </Link>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link
                            to={"/pending-orders"}
                            className={
                              window.location.pathname === "/pending-orders"
                                ? "dropdown-item active"
                                : "dropdown-item"
                            }
                          >
                            <img
                              src="/assets/images/menu-icon4.png"
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Pending Orders
                          </Link>
                        </li>

                        <li>
                          <Link
                            className={
                              window.location.pathname === "/inprocess-orders"
                                ? "dropdown-item active"
                                : "dropdown-item"
                            }
                            to={"/inprocess-orders"}
                          >
                            <img
                              src="/assets/images/menu-icon4.png"
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Order Inprocess
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              window.location.pathname === "/order-completed"
                                ? "dropdown-item active"
                                : "dropdown-item"
                            }
                            to={"/order-completed"}
                          >
                            <img
                              src="/assets/images/menu-icon4.png"
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Order Completed
                          </Link>
                        </li>
                        <li>
                          <Link
                            className={
                              window.location.pathname === "/total-orders"
                                ? "dropdown-item active"
                                : "dropdown-item"
                            }
                            to={"/total-orders"}
                          >
                            <img
                              src="/assets/images/menu-icon4.png"
                              alt=""
                              className="img-fluid"
                            />{" "}
                            Total Orders
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
              )}

              {venderOrder === 1 && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src="/assets/images/menu-icon4.png"
                      alt=""
                      className="img-fluid"
                    />{" "}
                    <span data-key="t-dashboards">Vendor Order</span>
                  </a>
                  <ul
                    className={
                      window.location.pathname === "/add-orders" ||
                      window.location.pathname === "/vendor-pending-orders" ||
                      window.location.pathname === "/process-order" ||
                      window.location.pathname === "/vendor-order-completed"
                        ? "dropdown-menu position-static show"
                        : "dropdown-menu position-static"
                    }
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link
                        className={
                          window.location.pathname === "/add-orders"
                            ? "dropdown-item active"
                            : "dropdown-item"
                        }
                        to={"/add-orders"}
                      >
                        <img
                          src="/assets/images/menu-icon4.png"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        Add Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          window.location.pathname === "/vendor-pending-orders"
                            ? "dropdown-item active"
                            : "dropdown-item"
                        }
                        to={"/vendor-pending-orders"}
                      >
                        <img
                          src="/assets/images/menu-icon4.png"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        Pending Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          window.location.pathname === "/process-order"
                            ? "dropdown-item active"
                            : "dropdown-item"
                        }
                        to={"/process-order"}
                      >
                        <img
                          src="/assets/images/menu-icon4.png"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        Order Inprocess
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={
                          window.location.pathname === "/vendor-order-completed"
                            ? "dropdown-item active"
                            : "dropdown-item"
                        }
                        to={"/vendor-order-completed"}
                      >
                        <img
                          src="/assets/images/menu-icon4.png"
                          alt=""
                          className="img-fluid"
                        />{" "}
                        Order Completed
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
