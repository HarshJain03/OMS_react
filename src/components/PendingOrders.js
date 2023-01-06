import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

function PendingOrders(props) {
  const [data, setData] = useState([]);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    productData();
  }, [refreshed]);

  const productData = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };
    let requestData = { status: 0 };
    axios
      .post(baseUrl + "/frontapi/order-data", requestData, config)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          // axios
          // .post(baseUrl + "/frontapi/product-single", Params)
          // .then((ress) => {
          //   var respp = ress.data;
          //   if (respp.status === true){

          //   }
          // })

          setData(resp.data);
        }
      });
  };

  const VendorDataHtml = () => {
    const html = [];
    if (data.length > 0) {
      data.map((value, i) => {
        return html.push(
          <tr>
            <td>{i + 1}</td>
            <td>{value.name === null ? "N/A" : value.name}</td>
            <td>{value.price === null ? "N/A" : value.price}</td>
            <td>{value.quantity === null ? "N/A" : value.quantity}</td>
            <td>{value.total === null ? "N/A" : value.total}</td>
            <td>{value.orderType}</td>
            <td className="product-img">
              {value.product_file === null ? (
                "N/A"
              ) : (
                <a
                  href={
                    baseUrl + "/static/customizeImage/" + value.product_file
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                >
                  {!value.product_file.match(/\.(jpg|jpeg|png|gif)$/) ? (
                    "View File"
                  ) : (
                    <img
                      src={
                        baseUrl + "/static/customizeImage/" + value.product_file
                      }
                      alt=""
                      className="img-fluid"
                    />
                  )}
                </a>
              )}
            </td>
            {value.product_file === null ? (
              <td>N/A</td>
            ) : (
              <td>
                {value.sample_file == null ? (
                  <input type={"file"} className="form-control" />
                ) : (
                  <img alt="" />
                )}
              </td>
            )}
            <td>
              <select
                className="form-control"
                value={value.status}
                onChange={(e) => changeStatusProduct(e, value.id)}
              >
                <option>Select</option>
                <option value="1">In Progress</option>
                <option value="2">Completed</option>
                <option value="3">Rejected</option>
              </select>
            </td>
          </tr>
        );
      });
    } else {
      html.push(
        <tr>
          <td colSpan="6">
            <h5>No Pending Orders</h5>
          </td>
        </tr>
      );
    }

    return html;
  };

  const updateStatus = (record) => {
    axios
      .post(baseUrl + "/frontapi/change-vendororder-status", record)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          productData();
        }
      });
  };

  const checkCall = () => {
    return false;
  };

  const Conn = (data) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => updateStatus(data),
        },
        {
          label: "No",
          onClick: () => checkCall(),
        },
      ],
    });
  };

  const changeStatusProduct = (e, id) => {
    let data = {
      orderId: id,
      status: e.target.value,
    };
    if (e.target.value) {
      Conn(data);
      return false;
    }
  };

  const dataHtml = () => {
    const html = [];
    if (data.length > 0) {
      data.map(function (value, i) {
        html.push(
          <tr>
            <td>{i + 1}</td>
            <td>{value.id}</td>
            <td>{value.name}</td>
            <td>INR {value.amount}</td>
            <td>
              <Link to={"/pending-order-details/" + value.id}>
                <img
                  src="assets/images/view-icon.png"
                  alt=""
                  class="img-fluid"
                />
              </Link>
            </td>
          </tr>
        );
      });
    } else {
      html.push(
        <tr>
          <td colSpan="6">
            <h5>No Pending Orders</h5>
          </td>
        </tr>
      );
    }

    return html;
  };

  return (
    <div id="layout-wrapper">
      <Header />
      <Navbar />
      <div class="main-content">
        <div class="page-content">
          <div class="container-fluid">
            <div class="section-heading">
              <h2 class="text-black">
                <b>PENDING ORDERS</b>
              </h2>
            </div>
            <div class="row">
              <div class="col-xxl-5">
                <div class="product-list-outer customer-list-outer">
                  {localStorage.getItem("userType") === "Vendor" ? (
                    <table class="w-100 border">
                      <tr>
                        <th>S.No.</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Order Type</th>
                        <th>Customize File</th>
                        <th>Upload Sample File</th>
                        <th>Status</th>
                      </tr>
                      {VendorDataHtml()}
                    </table>
                  ) : (
                    <table class="w-100 border">
                      <tr>
                        <th>S.No.</th>
                        <th>Order Id</th>
                        <th>Customer Name</th>
                        <th>Amount</th>
                        <th>Detail</th>
                      </tr>
                      {dataHtml()}
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer limit={1} />
        <Footer refreshed={refreshed} setRefreshed={setRefreshed} />
      </div>
    </div>
  );
}
export default PendingOrders;
