import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import "react-toastify/dist/ReactToastify.css";
import * as myConstList from "./BaseUrl";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";

const baseUrl = myConstList.baseUrl;
function ProcessOrderDetails(props) {
  const [status, setStatus] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [dateOfOrder, setDateOfOrder] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [salsePersonName, setSalsePersonName] = useState("");
  const [customerDataById, setCustomerDataById] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Pending");
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [vendorListData, setVendorListData] = useState([]);
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [total, setTotal] = useState(0);
  const [vendorStatus, setVendorStatus] = useState("Pending");
  const [vendorId, setVendorId] = useState("");
  const [productId, setProductId] = useState("");
  const [catManager, setCatManager] = useState("");
  const [category, setCategory] = useState("");
  const [isAssigned, setIsAssigned] = useState("");
  const [productImage, setProductImage] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [showBuyModel, setShowBuyModel] = useState(false);
  const [materialPrice, setMaterialPrice] = useState("");
  const [materialQuantity, setMaterialQuantity] = useState("");
  const [singleOrderId, setSingleOrderId] = useState("");
  const [singleProductId, setSingleProductId] = useState("");
  const [singleOrderStatus, setSingleOrderStatus] = useState("Pending");
  const [showBuyViewModel, setShowBuyViewModel] = useState(false);
  const [showManufactureViewModal, setShowManufactureViewModal] =
    useState(false);
  const [materialData, setMaterialData] = useState([]);

  const Params = useParams();
  useEffect(() => {
    orderData();
    getOrderDetails();
    setOrderId(Params.id);
    getCustomerDetailsAdmin();
    getVensdorList();
  }, []);

  const getVensdorList = () => {
    axios.get(baseUrl + "/frontapi/get-vendor-list").then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setVendorListData(resp.data);
      }
    });
  };

  const getOrderDetails = () => {
    axios
      .post(baseUrl + "/frontapi/get-orderdetails-admin", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status == true) {
          setTableData(resp.data);
          setCustomerName(resp.data[0].customerName);
          getCatData(resp.data[0].category_id);
        }
      });
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

  const getCustomerDetailsAdmin = () => {
    axios.post(baseUrl + "/frontapi/get-customer-admin", Params).then((res) => {
      var resp = res.data;
      if (resp.status == true) {
        setCustomerDataById(resp.data);
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
        setStatus(resp.data[0].status);
        setDateOfOrder(resp.data[0].createdAt);
        setSalsePersonName(resp.data[0].salsePersonName);
        if (resp.data[0].status == "2" || resp.data[0].status == 2) {
          setStatusMessage("Packing Started");
        }
        if (resp.data[0].status == 3) {
          setStatusMessage("Out For Delivery");
        }
        if (resp.data[0].status == 4) {
          setStatusMessage("Delivered");
        }
      }
    });
  };

  const updateVendor = () => {
    let data = {
      productId: productId,
      vendorId: vendorId,
      total: total,
      price: productPrice,
      quantity: productQuantity,
      productFile: productImage,
    };
    axios.post(baseUrl + "/frontapi/assign-vendor", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setShowVendorModal(false);
        setProductId("");
        setProductPrice("");
        setProductQuantity("");
        setVendorId("");
        getOrderDetails();
      } else {
        toast.error(resp.message);
      }
    });
  };

  const handleChange = async (event, editor) => {
    let fieldValue = event.target.value;
    let fieldName = event.target.name;
    if (fieldName === "vendorId") {
      setVendorId(fieldValue);
    }
    let total;
    if (fieldName === "product_price") {
      setProductPrice(fieldValue);
      total = fieldValue * productQuantity;
      setTotal(total);
    }
    if (fieldName === "product_quantity") {
      setProductQuantity(fieldValue);
      total = productPrice * fieldValue;
      setTotal(total);
    }
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
          <th>{value.gst + "%"}</th>
          <th>{value.gstAmount}</th>
          <th>{value.subTotal}</th>
          {value.manufactureOrBuy != null ? (
            <th>
              {" "}
              <button
                className="btn btn-primary"
                onClick={() => getNewValues(value)}
              >
                View Request
              </button>
            </th>
          ) : (
            <th>
              {value.avaliable_qty > value.quantity ? (
                "N/A"
              ) : (
                <select
                  className="form-control"
                  onChange={(e) => getSelectValue(value, e)}
                  name="selectedValue"
                  value={selectedValue}
                >
                  <option>Select</option>
                  <option value="buy">Buy</option>
                  <option value="manufacture">Manufacture</option>
                </select>
              )}
            </th>
          )}
          <th>{value.isCustomize == "Y" ? "Yes" : "No"}</th>
          <th>
            {value.isCustomize == "Y" ? (
              <a
                href={
                  baseUrl + "/static/customizeImage/" + value.customize_image
                }
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
              >
                {!value.customize_image.match(/\.(jpg|jpeg|png|gif)$/) ? (
                  "View File"
                ) : (
                  <img
                    src={
                      baseUrl +
                      "/static/customizeImage/" +
                      value.customize_image
                    }
                    alt=""
                    className="img-fluid"
                  />
                )}
              </a>
            ) : (
              "N/A"
            )}
          </th>
          <th>
            {value.isCustomize == "Y" ? (
              <>
                {value.is_assigned == "N" ? (
                  "N/A"
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => viewAssignValues(value)}
                  >
                    View
                  </button>
                )}
              </>
            ) : (
              "N/A"
            )}
          </th>
          <th>{value.order_status === "6" && "Completed"}</th>
        </tr>
      );
    });
    return html;
  };

  const getNewValues = (item) => {
    if (item.manufactureOrBuy === "buy") {
      setShowBuyViewModel(true);
      getBuyOrderDetails(item.id);
    }
    if (item.manufactureOrBuy === "manufacture") {
      setShowManufactureViewModal(true);
      getManufactureDetails(item.id);
      getMaterials(item.product_Id);
    }
  };

  const getManufactureDetails = (id) => {
    let data = {
      orderId: id,
    };
    axios
      .post(baseUrl + "/frontapi/vendor-manufacture-request", data)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          setVendorId(resp.data.vendor_id);
          setVendorStatus(resp.data.status);
        }
      });
  };

  const getBuyOrderDetails = (id) => {
    let data = {
      orderId: id,
    };
    axios.post(baseUrl + "/frontapi/vendeo-buy-request", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setMaterialPrice(resp.data.price);
        setMaterialQuantity(resp.data.quantity);
        setTotal(resp.data.total);
        setVendorId(resp.data.vendor_id);
        setVendorStatus(resp.data.status);
      }
    });
  };

  const getSelectValue = (item, e) => {
    if (e.target.value === "manufacture") {
      setTimeout(() => {
        window.location = "/manufacture/" + item.id;
      }, 1000);
    }
    if (e.target.value === "buy") {
      setShowBuyModel(true);
      setSingleOrderId(item.id);
      setSingleProductId(item.product_Id);
    }
  };

  const viewAssignValues = (item) => {
    setShowVendorModal(true);
    let data = {
      vendorId: item.vendor_id,
      orderId: item.id,
    };
    axios.post(baseUrl + "/frontapi/get-vendor-order", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setProductPrice(resp.data[0].price);
        setTotal(resp.data[0].total);
        setProductQuantity(resp.data[0].quantity);
        setVendorId(resp.data[0].vendor_id);
        if (resp.data[0].status == "0") {
          setVendorStatus("Pending");
        }
        if (resp.data[0].status == "1") {
          setVendorStatus("Completed");
        }
        if (resp.data[0].status == "2") {
          setVendorStatus("Rejected");
        }
      }
    });
  };

  const materialListHtml = () => {
    const html = [];
    materialData.map((item, i) => {
      return html.push(
        <li key={i}>
          <div className="product-quantity d-flex flex-wrap align-items-center justify-content-between">
            <p>
              {item.material_type} : <b>{item.material_name}</b>
            </p>
            <p>
              Quantity : <b>{item.material_quantity}</b>
            </p>
          </div>
          <div className="price-buy d-flex flex-wrap">
            <div className="form-group"></div>
          </div>
        </li>
      );
    });
    return html;
  };

  const getMaterials = (id) => {
    let productData = {
      productId: id,
    };
    axios.post(baseUrl + "/frontapi/get-materials", productData).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setMaterialData(resp.data);
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

  const vendorListHtml = () => {
    const html = [];
    html.push(<option>Select Vendor</option>);
    vendorListData.map((item) => {
      return html.push(<option value={item.id}>{item.name}</option>);
    });
    return html;
  };

  const customerDetailsHtml = () => {
    const html = [];
    customerDataById.map((value, i) => {
      return html.push(
        <div className="customer-detail-outer">
          <ul className="nav" key={i}>
            <li>
              Customer Name : <b>{value.name}</b>
            </li>
            <li>
              Company Name : <b>{value.companyName}</b>
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

  const closeShowEditModel = () => {
    setShowVendorModal(false);
    setShowBuyViewModel(false);
    setShowBuyModel(false);
    setShowManufactureViewModal(false);
    setProductPrice("");
    setProductQuantity("");
  };

  const handleChangeInput = (e) => {
    let { name, value } = e.target;
    let total;
    if (name === "materialPrice") {
      setMaterialPrice(value);
      total = value * materialQuantity;
      setTotal(total);
    }
    if (name === "materialQuantity") {
      setMaterialQuantity(value);
      total = materialPrice * value;
      setTotal(total);
    }
  };

  const handleSubmitMaterial = () => {
    let data = {
      vendorId: vendorId,
      singleOrderId: singleOrderId,
      singleProductId: singleProductId,
      materialPrice: materialPrice,
      materialQuantity: materialQuantity,
      materialTotal: total,
      type: "buy",
    };
    axios.post(baseUrl + "/frontapi/add-buy-product", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setShowBuyModel(false);
        toast.success(resp.message);
        setVendorId("");
        setSingleOrderId("");
        setSingleProductId("");
        setMaterialPrice("");
        setMaterialQuantity("");
        setTotal("");
      } else {
        toast.error(resp.message);
      }
    });
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
                <b>COMPLETED ORDERS DETAIL</b>
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
            <div className="order-details-status">
              <div className="row">
                <div className="col-12">
                  <div className="order-detail-outer-middle pending-list-outer">
                    <h3 className="text-black">Order Details</h3>
                    <table className="w-100 table-responsive">
                      <tr>
                        <th>S.No</th>
                        <th>Products Name</th>
                        <th>Avaliable Quantity</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Gst</th>
                        <th>Gst Amount</th>
                        <th>Total Amount</th>
                        <th>Buy/Manufacture</th>
                        <th>Customized</th>
                        <th>Customized Image</th>
                        <th>Assigned Vendor</th>
                        <th>Status</th>
                      </tr>
                      {tableHtml()}
                      <tr align="right">
                        <td colSpan="13">
                          <b>TOTAL PRICE INR {totalSumHtml()}</b>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-detail-outer-middle pending-list-outer">
              <h3 className="text-black">Customer Details</h3>
              {customerDetailsHtml()}
            </div>
            <div className="order-detail-outer-top order-detail-outer-last">
              <div className="row">
                <div className="col-md-4 col-12">
                  <div className="detail-last-inner detail-inner">
                    <h5 className="text-black m-0">
                      <small>Sales Executive : </small>
                      <b>{customerName == null ? "N/A" : salsePersonName}</b>
                    </h5>
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="detail-last-inner detail-inner">
                    <h5 className="text-black m-0">
                      <small>Category Manager : </small>
                      <b>{catManager === null ? "N/A" : catManager}</b>
                    </h5>
                  </div>
                </div>
                <div className="col-md-4 col-12">
                  <div className="detail-last-inner detail-inner">
                    <h5 className="text-black m-0">
                      <small>Total Price : </small>
                      <b>INR {totalSumHtml()}-/-</b>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              className="modal-update"
              show={showVendorModal}
              onHide={closeShowEditModel}
            >
              <Modal.Header closeButton>
                <Modal.Title className="m-0">Assign Vendor</Modal.Title>
              </Modal.Header>
              <Modal.Body className="assign-vendor">
                <div className="row align-items-center">
                  <div className="col-md-6 col-12">
                    <div className="product-price">
                      <label>Vendor :</label>
                      <select
                        className="form-control"
                        name="vendorId"
                        onChange={handleChange}
                        value={vendorId}
                      >
                        {vendorListHtml()}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="product-price">
                      <label>Status :</label>
                      <h5 className="m-0 text-black">{vendorStatus}</h5>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="product-price">
                      <label>Price :</label>
                      <input
                        type={"number"}
                        name="product_price"
                        value={productPrice}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Price"
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="product-price">
                      <label>Quantity :</label>
                      <input
                        type={"number"}
                        className="form-control"
                        name="product_quantity"
                        placeholder="Quantity"
                        value={productQuantity}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {isAssigned != "N" && (
                    <div className="col-md-6 col-12">
                      <div className="product-price">
                        <label>Vendor Sample :</label>
                        <div>
                          <h5 className="m-0 text-black">
                            {vendorStatus == "Pending"
                              ? "Wating for Uploading.."
                              : ""}
                          </h5>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="col-md-6 col-12">
                    <div className="product-price">
                      <label>Total Price :</label>
                      <h5 className="m-0 text-black">
                        <b>${total}</b>
                      </h5>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="product-price d-flex flex-wrap align-items-center form-group"></div>
                  </div>
                  {isAssigned == "N" && (
                    <div className="col-12">
                      <div className="submit-btn">
                        <button
                          className="btn btn-primary laga do"
                          onClick={updateVendor}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Modal.Body>
            </Modal>
            {/* Buy Edit Modal */}
            <Modal
              className="modal-update place-order-vendor-popup buy-vendor"
              show={showBuyModel}
              onHide={closeShowEditModel}
            >
              <Modal.Header closeButton>
                <Modal.Title className="m-0">Buy Product</Modal.Title>
              </Modal.Header>
              <Modal.Body className="assign-vendor">
                <div className="row align-items-center">
                  <div className="col-6">
                    <div className="form-group place-vendor-inner">
                      <label>Vendor :</label>
                      <select
                        className="form-control"
                        value={vendorId}
                        name="vendorId"
                        onChange={handleChange}
                      >
                        {vendorListHtml()}
                      </select>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group place-vendor-inner">
                      <label>
                        Status : <b>{singleOrderStatus}</b>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group place-vendor-inner">
                      <label>Price :</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="100"
                        name="materialPrice"
                        value={materialPrice}
                        onChange={handleChangeInput}
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group place-vendor-inner">
                      <label>Quantity :</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="100"
                        name="materialQuantity"
                        value={materialQuantity}
                        onChange={handleChangeInput}
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="product-total-price">
                      <p className="m-0">
                        Total Price : <b>{total}</b>
                      </p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="placeorder-btn">
                      <button
                        className="btn btn-primary laga do"
                        onClick={handleSubmitMaterial}
                      >
                        Placeorder
                      </button>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            {/* Buy Edit Modal */}
            {/* Buy View Modal */}
            <Modal
              className="modal-update place-order-vendor-popup buy-vendor"
              show={showBuyViewModel}
              onHide={closeShowEditModel}
            >
              <Modal.Header closeButton>
                <Modal.Title className="m-0">Assign Vendor</Modal.Title>
              </Modal.Header>
              <Modal.Body className="assign-vendor">
                <div className="row align-items-center">
                  <div className="col-6">
                    <div className="form-group place-vendor-inner">
                      <label>Vendor :</label>
                      <select
                        className="form-control"
                        value={vendorId}
                        name="vendorId"
                        onChange={handleChange}
                        disabled
                      >
                        {vendorListHtml()}
                      </select>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group place-vendor-inner">
                      <label>
                        Status : <b>{singleOrderStatus}</b>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group place-vendor-inner">
                      <label>Price :</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="100"
                        name="materialPrice"
                        value={materialPrice}
                        onChange={handleChangeInput}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-6 col-12">
                    <div className="form-group place-vendor-inner">
                      <label>Quantity :</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="100"
                        name="materialQuantity"
                        value={materialQuantity}
                        onChange={handleChangeInput}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="product-total-price">
                      <p className="m-0">
                        Total Price : <b>{total}</b>
                      </p>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
            {/* Buy View Modal */}
            {/* Manufacture View Modal */}
            <Modal
              className="modal-update place-order-vendor-popup buy-vendor"
              show={showManufactureViewModal}
              onHide={closeShowEditModel}
            >
              <Modal.Header closeButton>
                <Modal.Title className="m-0">Manufacture Request</Modal.Title>
              </Modal.Header>
              <Modal.Body className="assign-vendor">
                <div className="row align-items-center">
                  <div className="col-6">
                    <div className="form-group place-vendor-inner">
                      <label>Vendor :</label>
                      <select
                        className="form-control"
                        value={vendorId}
                        name="vendorId"
                        onChange={handleChange}
                        disabled
                      >
                        {vendorListHtml()}
                      </select>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group place-vendor-inner">
                      <label>
                        Status : <b>{singleOrderStatus}</b>
                      </label>
                    </div>
                  </div>

                  <div className="manufacture-main-outer">
                    <div className="add-product-outer customer-detail-outer manufacture-right">
                      <div className="product-full-detail">
                        <ul className="nav">{materialListHtml()}</ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="product-total-price">
                      <p className="m-0">
                        Total Price : <b>{total}</b>
                      </p>
                    </div>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <ToastContainer limit={1} />
        <Footer />
      </div>
    </>
  );
}
export default ProcessOrderDetails;
