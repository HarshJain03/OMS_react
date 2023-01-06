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
function PendingOrderDetails(props) {
  const [orderId, setOrderId] = useState("");
  const [dateOfOrder, setDateOfOrder] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [catManager, setCatManager] = useState("");
  const [category, setCategory] = useState("");
  const [tableData, setTableData] = useState([]);
  const [salsePersonName, setSalsePersonName] = useState("");
  const [customerDataById, setCustomerDataById] = useState([]);
  const [vendorListData, setVendorListData] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const Params = useParams();
  useEffect(() => {
    orderData();
    getOrderDetails();
    setOrderId(Params.id);
    getCustomerDetailsAdmin();
    // getVendorsList();
  }, []);

  const getVendorsList = (catId) => {
    const data = {
      catId: catId,
    };

    axios
      .post(baseUrl + "/frontapi/opration-executive-data", data)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          setVendorListData(resp.data);
        }
      });
  };

  const vendorListHtml = () => {
    const html = [];
    html.push(<option value={"self"}>Self</option>);
    vendorListData.map((item) => {
      return html.push(<option value={item.id}>{item.name}</option>);
    });
    return html;
  };

  const onChangeVendorList = (e) => {
    let { value } = e.target;
    setVendorId(value);
  };

  const getCatData = (id) => {
    const data = {
      catId: id,
    };

    axios.post(baseUrl + "/frontapi/order-single-product", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setCatManager(resp.data.catManData[0].name);
        setCategory(resp.data.catData[0].name);
      }
    });
  };

  const orderData = async () => {
    await axios.post(baseUrl + "/frontapi/order-single", Params).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        setDateOfOrder(resp.data[0].createdAt);
        setSalsePersonName(resp.data[0].salsePersonName);

        getVendorsList(resp.data[0].assigned_to);
      }
    });
  };

  let orderStatusUpdate = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };
    let requestData = { orderId: Params, status: 1, vendorId: vendorId };

    await axios
      .post(baseUrl + "/frontapi/order-status-update", requestData, config)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          toast.success(resp.message);
          setTimeout(() => {
            window.location = "/inprocess-orders";
          }, 2000);
        }
      });
  };

  const getOrderDetails = () => {
    axios
      .post(baseUrl + "/frontapi/get-orderdetails-admin", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          setTableData(resp.data);
          setCustomerName(resp.data[0].customerName);
          getCatData(resp.data[0].category_id);
        }
      });
  };

  const getCustomerDetailsAdmin = () => {
    axios.post(baseUrl + "/frontapi/get-customer-admin", Params).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setCustomerDataById(resp.data);
      }
    });
  };

  const totalSumHtml = () => {
    let sum = 0;
    tableData.map((value) => {
      return (sum += value.subTotal);
    });
    return sum;
  };

  const tableHtml = () => {
    const html = [];
    tableData.map((value, i) => {
      return html.push(
        <tr key={i}>
          <th>{i + 1}</th>
          <th>{value.productName}</th>
          <th>{value.avaliable_qty}</th>
          <th>{value.quantity}</th>
          <th>{value.price}</th>
          <th>{value.gst}%</th>
          <th>{value.gstAmount}</th>
          <th>{value.subTotal}</th>
        </tr>
      );
    });
    return html;
  };

  const customerDetailsHtml = () => {
    const html = [];
    customerDataById.map((value, i) => {
      return html.push(
        <div className="customer-detail-outer">
          <ul className="nav" key={value.name}>
            <li>
              Customer Name : <b>{value.name}</b>
            </li>
            <li>
              Compney Name : <b>{value.companyName}</b>
            </li>
            <li>
              Email : <b>{value.email}</b>
            </li>
            <li>
              Pan Number : <b>{value.panNumber}</b>
            </li>
            <li>
              Phone Number : <b>{value.phoneNumber}</b>
            </li>
            <li>
              Shipping Address : <b>{value.shippingAddress}</b>
            </li>
            <li>
              Website : <b>{value.website}</b>
            </li>
          </ul>
          {value.att && (
            <ul className="nav other-address">
              <h5 className="w-100">Other Address :</h5> {attributeCheck(value)}
            </ul>
          )}
        </div>
      );
    });
    return html;
  };
  const attributeCheck = (value) => {
    if (value.att) {
      return value.att.map((element, index) => {
        return (
          <>
            <li key={index}>
              Email: <b> {element.aEmail}</b>
            </li>
            <li>
              Name: <b> {element.aName}</b>
            </li>
            <li>
              Phone No: <b> {element.aPhoneNo}</b>
            </li>
            <li>
              Shipping Address: <b> {element.ashippingAddress}</b>
            </li>
          </>
        );
      });
    }
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
                <b>PENDING ORDERS DETAIL</b>
              </h2>
            </div>
            <div className="order-detail-outer-top">
              <div className="row">
                <div className="col-md-4 col-12">
                  <div className="detail-inner">
                    <p>
                      Order Id : <b>{orderId}</b>
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="detail-inner">
                    <p>
                      Date of Order :{" "}
                      <b>{moment(dateOfOrder).format("DD/MM/YYYY")}</b>
                    </p>
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="detail-inner">
                    <p>
                      Customer Name :{" "}
                      <b>
                        {customerName == null ? salsePersonName : customerName}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-detail-outer-middle pending-list-outer">
              <h3 className="text-black">Order Details</h3>
              <table className="w-100 table-responsive">
                <tr>
                  <th>S.No</th>
                  <th>Products Name</th>
                  <th>Product Avaliable Quantity</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Gst</th>
                  <th>Gst Amount</th>
                  <th>Total Amount</th>
                  {/* <th>Action</th> */}
                </tr>
                {tableHtml()}
                <tr align="right">
                  <td colSpan="8">
                    <b>TOTAL PRICE INR {totalSumHtml()}</b>
                  </td>
                </tr>
              </table>
            </div>
            <div className="order-detail-outer-middle pending-list-outer">
              <h3 className="text-black">Customer Details</h3>
              {customerDetailsHtml()}
            </div>
            <div className="order-detail-outer-top order-detail-outer-last">
              <div className="row">
                <div className="col-md-3 col-12">
                  <div className="detail-last-inner detail-inner">
                    <h5 className="text-black m-0">
                      <small>Sales Executive : </small>
                      <b>{salsePersonName}</b>
                    </h5>
                  </div>
                </div>
                <div className="col-md-3 col-12">
                  <div className="detail-last-inner detail-inner">
                    <h5 className="text-black m-0">
                      <small>Category Manager : </small>
                      <b>{catManager === null ? "N/A" : catManager}</b>
                    </h5>
                  </div>
                </div>
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
                <div className="col-12">
                  <div className="assigned-outer detail-last-inner detail-inner d-flex flex-wrap align-items-center justify-content-between">
                    <h5 className="text-black">
                      <b>Assigned :</b>
                    </h5>
                    <div className="form-group">
                      <select
                        className="form-control"
                        name="vendorId"
                        value={vendorId}
                        onChange={onChangeVendorList}
                      >
                        <option>Select</option>
                        {vendorListHtml()}
                      </select>
                    </div>
                    <div className="submit-btn-outer">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={orderStatusUpdate}
                      >
                        Submit
                      </button>
                    </div>
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
export default PendingOrderDetails;
