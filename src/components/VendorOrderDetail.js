import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as myConstList from "./BaseUrl";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import moment from "moment";

const baseUrl = myConstList.baseUrl;
function VendorOrderDetail(props) {
  const [orderId, setOrderId] = useState("");
  const [dateOfOrder, setDateOfOrder] = useState("");
  const [againstOrderId, setAgainstOrderId] = useState(null);
  const [category, setCategory] = useState("");
  const [tableData, setTableData] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const Params = useParams();
  useEffect(() => {
    orderData();
    getOrderDetails();
    setOrderId(Params.id);
  }, []);

  const getCatData = (id) => {
    const data = {
      catId: id,
    };

    axios.post(baseUrl + "/frontapi/order-single-product", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setCategory(resp.data.catData[0].name);
      }
    });
  };

  const orderData = async () => {
    const data = {
      id: Params,
      userType: "yes",
    };
    await axios.post(baseUrl + "/frontapi/order-single", data).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        setTableData(resp.data);
        setAgainstOrderId(resp.data[0].against_order_id);
        setDateOfOrder(resp.data[0].createdAt);
        getCatData(resp.data[0].category_id);
        getVendorName(resp.data[0].vendor_id);
        setOrderStatus(resp.data[0].status);
      }
    });
  };

  let getVendorName = async (id) => {
    let requestData = { id: id };
    await axios
      .post(baseUrl + "/frontapi/vendor-single", requestData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          return;
        }
        if (resp.status === true) {
          setVendorName(resp.data.sqlRun[0].name);
        }
      });
  };

  const getOrderDetails = () => {
    axios
      .post(baseUrl + "/frontapi/get-orderdetails-admin", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
        }
      });
  };

  const totalSumHtml = () => {
    let sum = 0;
    tableData.map((value) => {
      return (sum += value.total);
    });
    return sum;
  };

  const tableHtml = () => {
    const html = [];
    tableData.map((value, i) => {
      return html.push(
        <tr key={i}>
          <th>{i + 1}</th>
          <th>{value.name}</th>
          <th>{value.quantity}</th>
          <th>{value.price}</th>
          <th>{value.tax}%</th>
          <th>{(value.total / 100) * value.tax}</th>
          <th>{value.total}</th>
        </tr>
      );
    });
    return html;
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="vertical-overlay" />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="manager-heading-outer section-heading">
              <h2 className="text-black">
                <b>
                  {" "}
                  {orderStatus === "0" ? "PENDING" : ""}
                  {orderStatus === "1" ? "INPROCESS" : ""}
                  {orderStatus === "2" ? "COMPLETED" : ""} ORDERS DETAIL
                </b>
              </h2>
            </div>
            <div className="order-detail-outer-top">
              <div className="row">
                <div className="col-md-3 col-12">
                  <div className="detail-inner">
                    <p>
                      Order Id : <b>{orderId}</b>
                    </p>
                  </div>
                </div>
                <div className="col-md-3 col-12">
                  <div className="detail-inner">
                    <p>
                      Date of Order :{" "}
                      <b>{moment(dateOfOrder).format("DD/MM/YYYY")}</b>
                    </p>
                  </div>
                </div>
                <div className="col-md-3 col-12">
                  <div className="detail-inner">
                    <p>
                      Vendor Name : <b>{vendorName}</b>
                    </p>
                  </div>
                </div>
                {againstOrderId != null ? (
                  <div className="col-md-3 col-12">
                    <div className="detail-inner">
                      <p>
                        Against Order ID : <b>{againstOrderId}</b>
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="order-detail-outer-middle pending-list-outer">
              <h3 className="text-black">Order Details</h3>
              <table className="w-100 table-responsive">
                <tr>
                  <th>S.No</th>
                  <th>Products Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Gst</th>
                  <th>Gst Amount</th>
                  <th>Total Amount</th>
                </tr>
                {tableHtml()}
                <tr align="right">
                  <td colSpan="8">
                    <b>TOTAL PRICE INR {totalSumHtml()}</b>
                  </td>
                </tr>
              </table>
            </div>
            <div className="order-detail-outer-top order-detail-outer-last">
              <div className="row">
                <div className="col-md-3 col-12">
                  <div className="detail-last-inner detail-inner">
                    <h5 className="text-black m-0">
                      <small>Total Price : </small>
                      <b>INR {totalSumHtml()}-/-</b>
                    </h5>
                  </div>
                </div>
                <div className="col-md-3 col-12">
                  <div className="detail-last-inner detail-inner">
                    <h5 className="text-black m-0">
                      <small>Category : </small>
                      <b>{category === null ? "N/A" : category}</b>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer limit={1} />
        <Footer />
      </div>
    </>
  );
}
export default VendorOrderDetail;
