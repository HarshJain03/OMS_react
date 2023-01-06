import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as myConstList from "./BaseUrl";
import Header from "./Header";
import Navbar from "./Navbar";

const baseUrl = myConstList.baseUrl;

function AddOrders(props) {
  const [produtData, setProductData] = useState([]);
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [tax, setTax] = useState("");
  const [orderId, setOrderId] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [vendorDataList, setVendorDataList] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [image, setImage] = useState([]);
  const [pData, setPData] = useState([]);
  const [vendorType, setVendorType] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [formValues, setFormValues] = useState([
    {
      price: "",
      tax: "",
      hsnCode: "",
      quantity: "",
      totalPrice: "",
      vendorId: "",
      productId: "",
      orderId: "",
      image: [],
    },
  ]);

  useEffect(() => {
    productData();
    vendorData();
  }, [props]);

  const productData = () => {
    const config = {
      headers: {
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    };
    axios.post(baseUrl + "/frontapi/product-data", {}, config).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        return;
      }
      if (resp.status === true) {
        setProductData(resp.data);
      }
    });
  };

  const submitData = (e) => {
    e.preventDefault();
    const config = {
      headers: {
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    };
    const data = {
      attributes: JSON.stringify(formValues),
      // productName: productId,
      // quantity: quantity,
      // price: price,
      // tax: tax,
      // hsnCode: hsnCode,
      // totalPrice: totalPrice,
      // vendorName: vendorId,
      // orderId: orderId,
    };

    axios
      .post(baseUrl + "/frontapi/add-order-vendor", data, config)
      .then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          toast.dismiss();
          toast.success(resp.message);

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2500);

          return false;
        }
        toast.dismiss();
        toast.error(resp.message);
      });
  };
  const vendorData = () => {
    const config = {
      headers: {
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    };
    axios.post(baseUrl + "/frontapi/vendor-data", {}, config).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        return;
      }
      if (resp.status === true) {
        setVendorDataList(resp.data);
      }
    });
  };
  const productSingle = (value, i) => {
    let newFormValues = [...formValues];
    const config = {
      headers: {
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    };
    let pramas = {
      id: value,
    };
    axios
      .post(baseUrl + "/frontapi/product-single", pramas, config)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          return;
        }
        if (resp.status === true) {
          newFormValues[i].price = resp.data.sqlRun[0]
            ? resp.data.sqlRun[0].price
            : "";
          newFormValues[i].tax = resp.data.sqlRun[0]
            ? resp.data.sqlRun[0].tax
            : "";
          newFormValues[i].hsnCode = resp.data.sqlRun[0]
            ? resp.data.sqlRun[0].hsnCode
            : "";
          newFormValues[i].image = resp.data.sqlRun[0]
            ? resp.data.sqlRun[0].image.split(",")
            : "";
        }
      });
  };

  const htmlVendorDropdown = () => {
    return vendorDataList.map((element, index) => {
      return <option value={element.id}> {element.name} </option>;
    });
  };
  // const htmlProductDropdown = () => {
  //   return produtData.map((element, index) => {
  //     return <option value={element.id}> {element.name} </option>;
  //   });
  // };

  // const handleChangeProduct = (e) => {
  //   var val = e.target.value;
  //   if (e.target.name === "productId") {
  //     setQuantity("");
  //     setTotalPrice("");
  //     productSingle(val);
  //     setProductId(val);
  //   }
  // };

  // const handleChange = (e) => {
  //   if (e.target.name === "quantity") {
  //     toast.dismiss();
  //     setQuantity(e.target.value);
  //     if (!productId) {
  //       toast.dismiss();
  //       toast.error("Please select product first");
  //       return false;
  //     }
  //     setQuantity(e.target.value);
  //     let amount = price * e.target.value;
  //     let getGstAmnout = (amount / 100) * tax;
  //     let totalAmount = amount + getGstAmnout;
  //     setTotalPrice(totalAmount);
  //     return false;
  //   }
  //   if (e.target.name === "vendorId") {
  //     if (e.target.value) {
  //       const data = {
  //         id: e.target.value,
  //       };
  //       axios.post(baseUrl + "/frontapi/vendor-single", data).then((res) => {
  //         var resp = res.data;
  //         if (resp.status === true) {
  //           setIsShow(true);
  //           setPData(resp.data.sqlRun3);
  //           setVendorType(resp.data.sqlRun[0].vendorType);
  //         }
  //       });
  //     }

  //     setVendorId(e.target.value);
  //   }
  //   if (e.target.name === "orderId") {
  //     setOrderId(e.target.value);
  //   }
  // };

  let handleChangeAttr = (i, e) => {
    let newFormValues = [...formValues];
    const valv = newFormValues[i];
    console.log("first", newFormValues, newFormValues[i].vendorId);
    valv[e.target.name] = e.target.value;
    if (!valv.vendorId) {
      toast.error("Select vendor first");
    }
    if (valv.vendorId !== undefined) {
      const data = {
        id: valv.vendorId,
      };
      axios.post(baseUrl + "/frontapi/vendor-single", data).then((res) => {
        var resp = res.data;
        if (resp.status === true) {
          setIsShow(true);
          setPData(resp.data.sqlRun3);
          setVendorType(resp.data.sqlRun[0].vendorType);
        }
      });
    }

    if (valv.productId !== undefined) {
      // productSingle(valv.productId, i);
      setProductId(valv.productId);
      const config = {
        headers: {
          "x-access-token": localStorage.getItem("jwtToken"),
        },
      };
      let pramas = {
        id: valv.productId,
      };
      axios
        .post(baseUrl + "/frontapi/product-single", pramas, config)
        .then((res) => {
          var resp = res.data;
          if (resp.status === false) {
            // toast.dismiss();
            return;
          }
          if (resp.status === true) {
            valv.price = resp.data.sqlRun[0] ? resp.data.sqlRun[0].price : "";
            valv.tax = resp.data.sqlRun[0] ? resp.data.sqlRun[0].tax : "";
            valv.hsnCode = resp.data.sqlRun[0]
              ? resp.data.sqlRun[0].hsnCode
              : "";
            valv.image = resp.data.sqlRun[0]
              ? resp.data.sqlRun[0].image.split(",")
              : "";
          }
        });
    } else {
      valv.quantity = "";
      valv.totalPrice = "";
    }

    if (valv.quantity !== undefined) {
      let amount = valv.price * valv.quantity;
      let getGstAmnout = (amount / 100) * valv.tax;
      let totalAmount = amount + getGstAmnout;
      valv.totalPrice = totalAmount;
    }

    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        // image: "",
        // price: "",
        // tax: "",
        // hsnCode: "",
        // quantity: "",
        // totalPrice: "",
        // vendorId: "",
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let html = [];
  const imagesHtml = (index) => {
    console.log("first", [...formValues][index].image);
    if ([...formValues][index].image != "undefined") {
      [...formValues][index].image.map((value, i) => {
        return html.push(
          <div className="product-img-left order-image">
            <img
              src={baseUrl + "/static/" + value[i]}
              alt=""
              className="img-fluid"
            />
          </div>
        );
      });
      return html;
    }
  };

  const prodHtml = () => {
    const html = [];

    pData.map(function (value, i) {
      return html.push(
        <div className="row">
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Product Name : <b>{value.name}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                {vendorType === "Raw Material Manufacturer" ||
                "Goods Manufacturer"
                  ? "Production"
                  : "Delivery"}{" "}
                Capacity : <b>{value.mCapacity}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                {vendorType === "Raw Material Manufacturer" ||
                "Goods Manufacturer"
                  ? "Manufacturing"
                  : "Warehouse"}{" "}
                Location : <b>{value.mLocation}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding">
            <div className="person-detail">
              <p>
                SellingPrice : <b>{value.mSPrice}</b>
              </p>
            </div>
          </div>
        </div>
      );
    });
    return html;
  };

  return (
    <>
      <div id="layout-wrapper">
        <Header />
        <Navbar />
        <div className="vertical-overlay" />
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="section-heading">
                <h2 className="text-black">
                  <b>ADD ORDER</b>
                </h2>
              </div>
              <div className="row">
                <div className="col-xxl-5">
                  {formValues.map((element, index) => (
                    <div className="add-product-outer">
                      <form>
                        <div className="row">
                          <div className="col-12">
                            <div className="form-group mb-0">
                              <label>Product Image</label>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="products-images-outer d-flex">
                              {/* {imagesHtml(index)} */}
                              <div className="product-img-left order-image">
                                <img
                                  src={baseUrl + "/static/" + element.image}
                                  alt=""
                                  className="img-fluid"
                                />
                              </div>
                            </div>
                          </div>
                          <>
                            <div className="col-md-4 col-sm-6 col-12">
                              <div className="form-group">
                                <label>Vendor Name</label>
                                <select
                                  className="form-control"
                                  name="vendorId"
                                  value={element.vendorId || ""}
                                  onChange={(e) => handleChangeAttr(index, e)}
                                >
                                  <option value=""> Select Vendor </option>
                                  {htmlVendorDropdown()}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-12">
                              <div className="form-group">
                                <label>Product Name</label>
                                <select
                                  className="form-control"
                                  name="productId"
                                  value={element.productId || ""}
                                  onChange={(e) => handleChangeAttr(index, e)}
                                >
                                  <option value=""> Select Product </option>
                                  {produtData.map((value, index) => {
                                    return (
                                      <option value={value.id}>
                                        {value.name}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                              <div className="form-group">
                                <label>QUANTITY</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="quantity"
                                  value={element.quantity || ""}
                                  onChange={(e) => handleChangeAttr(index, e)}
                                />
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                              <div className="form-group position-relative">
                                <label>Price</label>
                                <input
                                  type="number"
                                  name="price"
                                  value={element.price || ""}
                                  className="form-control price-input"
                                  onChange={(e) => handleChangeAttr(index, e)}
                                  disabled="true"
                                />
                                <label className="inr-label position-absolute">
                                  INR
                                </label>
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                              <div className="form-group">
                                <label>TAX</label>
                                <input
                                  type="number"
                                  name="tax"
                                  value={element.tax || ""}
                                  className="form-control"
                                  onChange={(e) => handleChangeAttr(index, e)}
                                  disabled="true"
                                />
                              </div>
                            </div>
                            <div className="col-md-3 col-sm-6 col-12">
                              <div className="form-group">
                                <label>HSN Code</label>
                                <input
                                  type="text"
                                  name="hsnCode"
                                  className="form-control"
                                  disabled="true"
                                  value={element.hsnCode || ""}
                                  onChange={(e) => handleChangeAttr(index, e)}
                                />
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-12">
                              <div className="add-row-group d-flex align-items-center justify-content-between">
                                <div className="form-group position-relative">
                                  <label>Total Price</label>
                                  <input
                                    type="number"
                                    className="form-control price-input"
                                    disabled="true"
                                    name="totalPrice"
                                    value={element.totalPrice || ""}
                                    onChange={(e) => handleChangeAttr(index, e)}
                                  />
                                  <label className="inr-label position-absolute">
                                    INR
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-4 col-sm-6 col-12">
                              <div className="add-row-group d-flex align-items-center justify-content-between">
                                <div className="form-group position-relative">
                                  <label>Order ID-------------Optional</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Order Id"
                                    name="orderId"
                                    value={element.orderId || ""}
                                    onChange={(e) => handleChangeAttr(index, e)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="add-row">
                              {index ? (
                                <a
                                  href="#!"
                                  className="add-btn add"
                                  onClick={() => removeFormFields(index)}
                                >
                                  -
                                </a>
                              ) : null}
                              <a href="#!" onClick={() => addFormFields()}>
                                +
                              </a>
                            </div>
                          </>
                        </div>
                      </form>
                    </div>
                  ))}
                  <div className="btn-group">
                    <button
                      type="button"
                      onClick={submitData}
                      class="btn btn-primary"
                    >
                      {" "}
                      Save{" "}
                    </button>
                  </div>
                  {isShow === true ? (
                    <div className="col-12">
                      <div className="person-contact customer-detail">
                        <h5>
                          <b>Product Reference</b>
                        </h5>
                        {prodHtml()}
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-6">© Procur.</div>
                <div className="col-sm-6">
                  <div className="text-sm-end d-none d-sm-block">
                    Design &amp; Develop by Procur.it.
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer limit={1} />
          </footer>
        </div>
      </div>
    </>
  );
}
export default AddOrders;
