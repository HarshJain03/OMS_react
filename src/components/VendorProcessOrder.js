import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import moment from "moment";
import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

function VendorProcessOrder(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    productData();
  }, []);

  const productData = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };
    let requestData = { status: 1, orderType: "vendor" };
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
      data.map((value, i) => {
        html.push(
          <tr>
            <td>{i + 1}</td>
            <td>{value.id}</td>
            <td>{value.name}</td>
            <td>{moment(value.createdAt).format("DD/MM/YYYY")}</td>
            <td>{value.assignName == "Admin" ? "Self" : value.assignName}</td>
            <td>
              <Link to={"/vendor-order-details/" + value.id}>
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
            <h5>No Orders InProcess</h5>
          </td>
        </tr>
      );
    }

    return html;
  };

  const VendorDataHtml = () => {
    const html = [];
    if (data.length > 0) {
      data.map((value, i) => {
        return html.push(
          <tr>
            <td>{i + 1}</td>
            <td>{value.order_id}</td>
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
                  {/* {!value.product_file.match(/\.(jpg|jpeg|png|gif)$/) ? (
                    "View File"
                  ) : (
                    <img
                      src={
                        baseUrl + "/static/customizeImage/" + value.product_file
                      }
                      alt=""
                      className="img-fluid"
                    />
                  )} */}
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
                onChange={(e) =>
                  changeStatusProduct(e, value.id, value.against_order_id)
                }
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

  const changeStatusProduct = (e, item) => {
    let data = {
      orderId: item.id,
      status: e.target.value,
      aOrderId: item.against_order_id,
      quantity: item.quantity,
      productId: item.product_id,
    };
    axios
      .post(baseUrl + "/frontapi/change-vendororder-status", data)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          productData();
        }
      });
  };

  return (
    <>
      <div id="layout-wrapper">
        <Header />
        <Navbar />
        <div class="main-content">
          <div class="page-content">
            <div class="container-fluid">
              <div class="section-heading">
                <h2 class="text-black">
                  <b>VENDOR INPROCESS ORDERS</b>
                </h2>
              </div>
              <div class="row">
                <div class="col-xxl-5">
                  <div class="product-list-outer customer-list-outer">
                    <table class="w-100 border">
                      <tr>
                        <th>S.No.</th>
                        <th>Order Id</th>
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

                    {/* {localStorage.getItem("userType") === "Vendor" ? (
                      <table class="w-100 border">
                        <tr>
                          <th>S.No.</th>
                          <th>Order Id</th>
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
                          <th>Date of Order</th>
                          <th>Assigned</th>
                          <th>Action</th>
                        </tr>
                        {dataHtml()}
                      </table>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer class="footer">
            <div class="container-fluid">
              <div class="row">
                <div class="col-sm-6">
                  <div>{new Date().getFullYear()} © Procur.</div>
                </div>
                <div class="col-sm-6">
                  <div class="text-sm-end d-none d-sm-block">
                    Design & Develop by Procur.it.
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
export default VendorProcessOrder;
