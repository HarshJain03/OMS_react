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

function TotalOrders(props) {
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
    let requestData = { isComplete: "completed" };
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
          setData(resp.data);
        }
      });
  };

  const dataHtml = () => {
    const html = [];
    if (data.length > 0) {
      data.map(function (value, i) {
        html.push(
          <tr>
            <td>{i + 1}</td>
            <td>{value.id}</td>
            <td>{value.name === null ? "N/A" : value.name}</td>
            <td>{value.prod_name === null ? "N/A" : value.prod_name}</td>
            <td>INR {value.amount}</td>
            <td>
              {value.status === "1" ? "Inprocess" : ""}{" "}
              {value.status === "0" ? "Pending" : ""}{" "}
              {value.status === "6" ? "Completed" : ""}{" "}
            </td>
            <td>
              {value.status === "1" ? (
                <Link to={"/inprocess-order-details/" + value.id}>
                  <img
                    src="assets/images/view-icon.png"
                    alt=""
                    class="img-fluid"
                  />
                </Link>
              ) : (
                ""
              )}{" "}
              {value.status === "0" ? (
                <Link to={"/pending-order-details/" + value.id}>
                  <img
                    src="assets/images/view-icon.png"
                    alt=""
                    class="img-fluid"
                  />
                </Link>
              ) : (
                ""
              )}{" "}
              {value.status === "6" ? (
                <Link to={"/process-order-details/" + value.id}>
                  <img
                    src="assets/images/view-icon.png"
                    alt=""
                    class="img-fluid"
                  />
                </Link>
              ) : (
                ""
              )}{" "}
            </td>
          </tr>
        );
      });
    } else {
      html.push(
        <tr>
          <td colSpan="6">
            <h5>No Orders</h5>
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
                <b>TOTAL ORDERS</b>
              </h2>
            </div>
            <div class="row">
              <div class="col-xxl-5">
                <div class="product-list-outer customer-list-outer">
                  <table class="w-100 border">
                    <tr>
                      <th>S.No.</th>
                      <th>Order Id</th>
                      <th>Customer Name</th>
                      <th>Product Name</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Detail</th>
                    </tr>
                    {dataHtml()}
                  </table>
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
export default TotalOrders;
