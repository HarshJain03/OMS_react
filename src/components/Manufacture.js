import moment from "moment";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { baseUrl } from "./BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import { data } from "jquery";

const Manufacture = () => {
  const orderId = useParams();
  const [customerName, setCustomerName] = useState("");
  const [salsePersonName, setSalsePersonName] = useState("");
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [theOrderId, setTheOrderId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [tax, setTax] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [productName, setProductName] = useState("");
  const [dateOfOrder, setDateOfOrder] = useState("");
  const [materialData, setMaterialData] = useState([]);
  const [vendorListData, setVendorListData] = useState([]);
  const [materialPrice, setMaterialPrice] = useState("");
  const [showBuyBtn, setShowBuyBtn] = useState(false);
  const [materialQuantity, setMaterialQuantity] = useState("");
  const [showLockModal, setShowLockModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [materialStatus, setMaterialStatus] = useState("Pending");

  const [lockQty, setLockQty] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [requiredQty, setRequiredQty] = useState("");
  const [msgGreen, setMsgGreen] = useState("");
  const [msgRed, setMsgRed] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [productId, setProductId] = useState("");
  const [materialValues, setMaterialValues] = useState([
    { itemType: "", itemName: "", itemQuantity: "" },
  ]);

  const [materialAdd, setMaterialAdd] = useState(false);

  // Error States
  const [show, setShow] = useState(false);

  // temp states for buy and lock

  const [buyBtn, setBuyBtn] = useState(false);
  const [lockBtn, setlockBtn] = useState(true);
  const [userId, setUserId] = useState("");
  const [productAvailableQty, setProductAvailableQty] = useState("");
  const [productMaterials_id, setProductMaterials_id] = useState("");
  const [statusData, setStatusData] = useState("");
  const [rawMaterialData, setRawMaterialData] = useState([]);
  const [inventoryValues, setInventoryValues] = useState([
    {
      material_type: "",
      material_quantity: "",
      material_id: "",
      material_available_quantity: "",
    },
  ]);

  const [unlockBtn, setUnlockBtn] = useState("");

  useEffect(() => {
    orderData();
    getMaterialDetails();
    getVensdorList();
    getMaterialData();
  }, []);

  const getVensdorList = () => {
    axios.get(baseUrl + "/frontapi/get-vendor-list").then((resp) => {
      var resp = resp.data;
      if (resp.status == true) {
        setVendorListData(resp.data);
      }
    });
  };

  const getMaterialData = (prodId) => {
    const data = {
      productId: prodId,
    };
    axios
      .post(baseUrl + "/frontapi/getMaterialsForManufacture", data)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          // toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setRawMaterialData(resp.data);
        }
      });
  };

  const vendorListHtml = () => {
    const html = [];
    html.push(<option>Select Vendor</option>);
    vendorListData.map((item, i) => {
      html.push(
        <option key={i} value={item.id}>
          {item.name}
        </option>
      );
    });
    return html;
  };

  const orderData = async () => {
    let data = {
      orderId: orderId,
    };
    await axios
      .post(baseUrl + "/frontapi/order-single-vendor", data)
      .then((resp) => {
        var resp = resp.data;
        if (resp.status == true) {
          setStatus(resp.data[0].order_status);
          setDateOfOrder(resp.data[0].createAt);
          setSalsePersonName(resp.data[0].userName);
          setCustomerName(resp.data[0].salseName);
          setProductName(resp.data[0].productName);
          setProductId(resp.data[0].product_Id);
          materialDataApi(resp.data[0].product_Id);
          setTheOrderId(resp.data[0].orderId);
          setUserId(resp.data[0].customer_id);
          setProductAvailableQty(resp.data[0].avaliable_qty);
          getMaterialData(resp.data[0].product_Id);
        }
      });
  };

  const getMaterialDetails = async (id) => {
    let data = {
      orderId: id,
      runThis: "yes",
    };
    await axios
      .post(baseUrl + "/frontapi/get-material-list", data)
      .then((res) => {
        var resp = res.data;
        if (resp.status == true) {
          setMaterialPrice(resp.data[0].price);
          setTax(resp.data[0].tax);
          setHsnCode(resp.data[0].hsnCode);

          // if (resp.data[0].status == "0") {
          //   setMaterialStatus("Pending");
          // }
          // if (resp.data[0].status == "1") {
          //   setMaterialStatus("Completed");
          // }
          // if (resp.data[0].status == "2") {
          //   setMaterialStatus("Rejected");
          // }
        }
      });
  };

  const materialDataApi = async (item) => {
    let data = {
      productId: item,
      // check: "check",
    };
    await axios.post(baseUrl + "/frontapi/get-materials", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setMaterialData(resp.data);
      }
    });
  };

  const handleChangeLock = async (e) => {
    let value = e.target.value;

    var result = value - availableQty;

    var diff = Math.abs(result);

    if (!value || value == "0") {
      setMsgRed("");
      setMsgGreen("");
      setLockQty(value);
      return false;
    }

    if (availableQty > value) {
      setMsgRed("");
      setMsgGreen("Hold your quantity");
      setLockQty(value);
      return false;
    }

    if (value > availableQty) {
      setMsgGreen("");
      setMsgRed("You need to buy " + diff + " no of quantity more");
      setLockQty(value);
      return false;
    }
    setLockQty(value);
  };

  const unholdQty = (item) => {
    data = {
      orderId: theOrderId,
      material_id: item.material_id,
      avaliable_qty: item.material_available_quantity,
    };

    axios.post(baseUrl + "/frontapi/unlockQty", data).then((res) => {
      var resp = res.data;

      if (resp.status === true) {
        toast.dismiss();
        toast.success(resp.message);
        materialDataApi(item.product_id);
        return;
      } else {
        toast.dismiss();
        toast.error(resp.message);
      }
    });
  };
  const materialListHtml = () => {
    const html = [];
    materialData.map((item, i) => {
      html.push(
        <li key={i}>
          <div className="product-quantity d-flex flex-wrap align-items-center justify-content-between">
            <p>
              Type : <b>{item.material_type}</b>
            </p>
            <p>
              Available Quantity : <b>{item.material_available_quantity}</b>
            </p>{" "}
            <p>
              Per Unit Quantity : <b>{item.material_quantity}</b>
            </p>
          </div>
          <div className="price-buy d-flex flex-wrap">
            <div className="col-md-6">
              <button
                className="btn btn-primary"
                onClick={() => {
                  openShowLockModel(item);
                }}
              >
                Hold
              </button>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-primary"
                onClick={() => {
                  unholdQty(item);
                }}
              >
                Un Hold
              </button>
            </div>
            <br />
          </div>
          <div className="col-md-6">
            <button
              className="btn btn-primary"
              onClick={() => {
                // unholdQty(item);
                checkStatus(item);
              }}
            >
              Status
            </button>
          </div>
        </li>
      );
    });
    return html;
  };

  const checkStatus = (item) => {
    const data = { orderId: theOrderId, material_id: item.material_id };

    axios.post(baseUrl + "/frontapi/checkLockOrderStatus", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        toast.dismiss();
        if (resp.data[0].status === "0") {
          toast.error("Your order is Pending");
          return false;
        }
        if (resp.data[0].status === "1") {
          toast.error("Your order is in Inprocess");
          return false;
        }
        if (resp.data[0].status === "2") {
          toast.error("Your order is Completed");
          return false;
        }
      } else {
        toast.dismiss();
        toast.error(resp.message);
      }
    });
  };

  const submitLock = (e) => {
    e.preventDefault();

    if (!lockQty || lockQty == 0) {
      toast.dismiss();
      toast.error("Required Quantity is required");
      return false;
    }
    setMsgGreen("");
    setMsgRed("");
    var availableQuantity = availableQty;
    var actualLockedQty = availableQuantity - lockQty;
    var total = materialPrice * Math.abs(actualLockedQty);
    var taxValue = (total * tax) / 100;
    var theValue = taxValue + total;
    setMaterialQuantity(Math.abs(actualLockedQty));
    setTotal(theValue);

    if (availableQty >= lockQty) {
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      };

      const data = {
        orderId: theOrderId,
        lockQty: lockQty,
        userId: userId,
        avaliableQty: productAvailableQty,
        productId: productId,
        materialId: materialId,
        material_available_quantity: availableQty,
        productMaterials_id: productMaterials_id,
      };

      axios.post(baseUrl + "/frontapi/lockqty", data, config).then((res) => {
        var resp = res.data;

        if (resp.status === true) {
          setShowBuyBtn(false);
          toast.success(resp.message);
          materialDataApi(productId);
          setShowLockModal(false);
          return false;
        }
      });

      return false;
    } else {
      setlockBtn(false);
      setBuyBtn(true);
    }
  };

  let addFormFieldsMaturials = () => {
    setInventoryValues([...inventoryValues, {}]);
  };

  const materialHtml = () => {
    const materialHtml = [];
    rawMaterialData.map(function (value, i) {
      return materialHtml.push(
        <option value={value.name}>{value.name}</option>
      );
    });
    return materialHtml;
  };

  let removeFormFieldsMaturial = (i) => {
    let newFormValues = [...inventoryValues];
    newFormValues.splice(i, 1);
    setInventoryValues(newFormValues);
  };
  let handleChangeMaturial = (i, e) => {
    let newFormValues = [...inventoryValues];
    const valv = newFormValues[i];
    valv[e.target.name] = e.target.value;

    if (valv.material_type != undefined) {
      const data = {
        byName: "yes",
        materialName: valv.material_type,
      };
      axios.post(baseUrl + "/frontapi/material-data-raw", data).then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          valv.material_available_quantity = resp.data[0].avaliable_qty;
          valv.material_id = resp.data[0].id;
        }
      });
    }
    setInventoryValues(newFormValues);
  };

  const handleChange = (e, i) => {
    const value = e.target.value;
    if (e.target.name == "vendorId") {
      setVendorId(value);
    }
    if (e.target.name == "materialButton") {
      setMaterialAdd(!materialAdd);
    }
  };

  const handleSubmitMaterial = (e) => {
    e.preventDefault();
    if (!vendorId) {
      toast.dismiss();
      toast.error("Please select vendor");
      return false;
    }

    const config = {
      headers: {
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    };

    var lockedQty = lockQty - materialQuantity;

    let data = {
      vendorId: vendorId,
      materialId: materialId,
      productId: productId,
      orderId: theOrderId,
      materialPrice: materialPrice,
      materialQuantity: materialQuantity,
      materialTotal: total,
      tax: tax,
      hsnCode: hsnCode,
      material_available_quantity: availableQty,
      lockQty: lockedQty,
      userId: userId,
    };
    axios
      .post(baseUrl + "/frontapi/addVendorMaterial", data, config)
      .then((resp) => {
        var resp = resp.data;
        if (resp.status == true) {
          setShowLockModal(false);
          getMaterialDetails(materialId);
          toast.success(resp.message);
        } else {
          toast.error(resp.error);
        }
      });
  };

  const getLockStatus = (item) => {
    const data = {
      orderId: theOrderId,
      material_id: item.material_id,
    };
    axios.post(baseUrl + "/frontapi/getLockStatus", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setStatusData(resp.data[0].lock_status);
        toast.success(resp.message);
        setShowLockModal(false);
        return false;
      } else {
        setShowLockModal(true);
      }
    });
  };

  const openShowLockModel = (item) => {
    setMaterialId(item.material_id);
    getMaterialDetails(item.material_id);
    getLockStatus(item);
    setAvailableQty(item.material_available_quantity);
    setProductMaterials_id(item.id);
  };

  const closeShowLockModel = () => {
    setShowLockModal(false);
    setLockQty("");
    setAvailableQty("");
    setBuyBtn(false);
    setlockBtn(true);
    setMsgGreen("");
    setMsgRed("");
  };

  const handleChangeInput = (e) => {
    let { name, value } = e.target;
    let total;
    if (name == "materialPrice") {
      setMaterialPrice(value);
      total = value * materialQuantity;
      var taxValue = (total * tax) / 100;
      var theValue = taxValue + total;
      setTotal(theValue);
    }
    if (name == "materialQuantity") {
      setMaterialQuantity(value);
      total = materialPrice * value;
      var taxValue = (total * tax) / 100;
      var theValue = taxValue + total;
      setTotal(theValue);
    }
  };

  const finalSubmt = () => {
    let data = {
      orderId: orderId.id,
      vendorId: vendorId,
      productId: productId,
      type: "manufacture",
    };
    axios
      .post(baseUrl + "/frontapi/add-manufacture-request", data)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          toast.success(resp.message);
          setTimeout(() => {
            window.location = "/inprocess-orders";
          }, 2000);
        } else {
          toast.error(resp.message);
        }
      });
  };

  const handeSubmitMaterial = (e) => {
    e.preventDefault();
    let data = {
      productId: productId,
      materialValues: JSON.stringify(inventoryValues),
    };

    axios.post(baseUrl + "/frontapi/add-material", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        toast.success(resp.message);
        materialDataApi(productId);
        getMaterialData(productId);
        setMaterialAdd(false);
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
                <b>Manufacturer</b>
              </h2>
            </div>
            <div className="order-detail-outer-top">
              <div className="row">
                <div className="col-md-4 col-12">
                  <div className="detail-inner">
                    <p>
                      Order Id : <b>{theOrderId}</b>
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
            <div className="manufacture-main-outer">
              <div className="row">
                <div className="col-md-8 col-12">
                  <div className="add-product-outer customer-detail-outer manufacture-right">
                    <div className="product-full-detail">
                      <ul className="nav">{materialListHtml()}</ul>

                      <button
                        className="btn btn-primary"
                        onClick={handleChange}
                        name="materialButton"
                      >
                        Add Material
                      </button>
                      <div>
                        <button
                          className="btn btn-primary"
                          onClick={finalSubmt}
                          name=""
                        >
                          Submit
                        </button>
                      </div>

                      {materialAdd === true && (
                        <>
                          {inventoryValues.map((element, index) => (
                            <div className="row align-items-center" key={index}>
                              <div className="col-md-5 col-12 order-1">
                                <div className="form-group">
                                  <label>RAW MATERIAL REQUIRED</label>
                                  <select
                                    className="form-control"
                                    name="material_type"
                                    onChange={(e) =>
                                      handleChangeMaturial(index, e)
                                    }
                                    value={element.material_type || ""}
                                  >
                                    <option value="">Please select</option>
                                    {materialHtml()}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-5 col-12 order-1">
                                <div className="form-group">
                                  <label>RAW MATERIAL QUANTITY REQUIRED</label>
                                  <input
                                    className="form-control"
                                    name="material_quantity"
                                    onChange={(e) =>
                                      handleChangeMaturial(index, e)
                                    }
                                    value={element.material_quantity || ""}
                                  />
                                </div>
                              </div>
                              <div className="col-md-2 col-12 order-2 add-row">
                                <a
                                  className="add-btn add"
                                  href="#!"
                                  onClick={() => addFormFieldsMaturials()}
                                >
                                  +
                                </a>
                                {index ? (
                                  <a
                                    className="add-btn add"
                                    href="#!"
                                    onClick={() =>
                                      removeFormFieldsMaturial(index)
                                    }
                                  >
                                    -
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          ))}
                          <div className="col-md-2 col-12 order-2 add-row">
                            <button
                              className="btn btn-primary"
                              onClick={handeSubmitMaterial}
                            >
                              Add Materials
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Modal
              className="modal-update place-order-vendor-popup"
              show={showLockModal}
              onHide={closeShowLockModel}
            >
              <Modal.Header closeButton>
                <Modal.Title className="m-0" style={{ color: "#757575" }}>
                  Required Quantity
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="assign-vendor">
                <div className="row align-items-center">
                  <div className="col-md-6 col-12">
                    <div className="form-group place-vendor-inner">
                      <label>Required Quantity :</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder=""
                        name="lockqty"
                        value={lockQty}
                        onChange={handleChangeLock}
                      />
                    </div>
                    <span style={{ color: "red" }}> {msgRed}</span>
                    <span style={{ color: "green" }}> {msgGreen}</span>
                  </div>
                  {lockBtn && (
                    <>
                      <div className="col-md-6 col-12">
                        <div className="placeorder-btn">
                          <button
                            className="btn btn-primary"
                            type="submit"
                            onClick={submitLock}
                          >
                            Hold Quantity
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {buyBtn && (
                    <>
                      {" "}
                      <div className="col-12">
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
                            placeholder=""
                            name="materialQuantity"
                            disabled
                            value={materialQuantity}
                            onChange={handleChangeInput}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-group place-vendor-inner">
                          <label>Tax :</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder=""
                            disabled
                            name="tax"
                            value={tax}
                            onChange={handleChangeInput}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        <div className="form-group place-vendor-inner">
                          <label>HSN Code :</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            disabled
                            name="hsnCode"
                            value={hsnCode}
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
                    </>
                  )}
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <ToastContainer />
        <Footer />
      </div>
    </>
  );
};

export default Manufacture;
