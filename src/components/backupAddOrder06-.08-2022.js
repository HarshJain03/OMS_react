import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as myConstList from "./BaseUrl";
import Header from "./Header";
import Navbar from "./Navbar";

const baseUrl = myConstList.baseUrl;

function AddOrders(props) {
  const [produtData, setProductData] = useState([]);
  const [price, setPrice] = useState("");
  const [productList, setProductList] = useState("");
  const [tax, setTax] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [vendorDataList, setVendorDataList] = useState([]);
  const [totalPrice, setTotalPrice] = useState("");
  const [image, setImage] = useState([]);

  const [formValues, setFormValues] = useState([
    {
      price: "",
      tax: "",
      hsnCode: "",
      quantity: "",
      totalPrice: "",
      vendorId: "",
      images: "",
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
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        setProductData(resp.data);
      }
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
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        setVendorDataList(resp.data);
      }
    });
  };
  //
  const productSingle = (value) => {
    let productListdata = [];
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
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          productListdata.push(resp.data);
          setProductList(resp.data);
          setPrice(resp.data.sqlRun[0] ? resp.data.sqlRun[0].price : "");
          setTax(resp.data.sqlRun[0] ? resp.data.sqlRun[0].tax : "");
          setHsnCode(resp.data.sqlRun[0] ? resp.data.sqlRun[0].hsnCode : "");
          setImage(
            resp.data.sqlRun[0] ? resp.data.sqlRun[0].image.split(",") : ""
          );
        }
      });
  };
  const htmlProductDropdown = () => {
    return produtData.map((element, index) => {
      return <option value={element.id}> {element.name} </option>;
    });
  };
  const htmlVendorDropdown = () => {
    return vendorDataList.map((element, index) => {
      return <option value={element.id}> {element.vendorName} </option>;
    });
  };
  const handleChange = (e, value) => {
    if (value === "productId") {
      productSingle(e.target.value);
    }
    return false;
  };

  let addFormFields = (item) => {
    formValues.push(item);
    _renderProductList(formValues);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let html = [];
  const imagesHtml = (item, index) => {
    image.map(function (value, i) {
      return html.push(
        <div className="product-img-left order-image">
          <img
            src={baseUrl + "/static/" + value}
            alt=""
            className="img-fluid"
          />
        </div>
      );
    });
    return html;
  };
  const _renderProductList = (productList) => {
    return productList.map((item, index) => {
      return (
        <div className="row">
          <div className="col-xxl-5">
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
                      {imagesHtml(item.images)}
                      <div className="product-img-left order-image">
                        <img
                          src={baseUrl + "/static/" + image}
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>

                  <>
                    <div className="col-md-2 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Product Name</label>
                        <select
                          className="form-control"
                          name="productId"
                          // onChange={handleChange}
                          onChange={(e) => handleChange(e, "productId")}
                        >
                          <option value=""> Product List </option>
                          {htmlProductDropdown()}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-6 col-12">
                      <div className="form-group">
                        <label>QUANTITY</label>
                        <input
                          type="text"
                          className="form-control"
                          name="quantity"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-6 col-12">
                      <div className="form-group position-relative">
                        <label>Price</label>
                        <input
                          type="number"
                          name=""
                          className="form-control price-input"
                          value={price}
                        />
                        <label className="inr-label position-absolute">
                          INR
                        </label>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-6 col-12">
                      <div className="form-group">
                        <label>TAX</label>
                        <input
                          type="number"
                          name=""
                          value={tax}
                          className="form-control"
                          disabled=""
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-6 col-12">
                      <div className="form-group">
                        <label>HSN Code</label>
                        <input
                          type="text"
                          name=""
                          className="form-control"
                          disabled=""
                          value={hsnCode}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-6 col-12">
                      <div className="add-row-group d-flex align-items-center justify-content-between">
                        <div className="form-group position-relative">
                          <label>Total Price</label>
                          <input
                            type="number"
                            className="form-control price-input"
                            disabled=""
                            name="totalPrice"
                            value={totalPrice}
                          />
                          <label className="inr-label position-absolute">
                            INR
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-6 col-12">
                      <div className="form-group">
                        <label>Vendor Name</label>
                        <select
                          className="form-control"
                          name="vendorId"
                          onChange={handleChange}
                        >
                          <option value=""> Vendor List</option>
                          {htmlVendorDropdown()}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="button remove"
                      onClick={() => removeFormFields()}
                    >
                      -
                    </button>

                    <div className="add-row">
                      <a
                        href="javascript:void(0)"
                        onClick={() => addFormFields(item)}
                      >
                        +
                      </a>
                    </div>
                  </>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
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
            <div className="section-heading">
              <h2 className="text-black">
                <b>ADD ORDER</b>
              </h2>
            </div>
            {formValues.length > 0 && _renderProductList(formValues || "")}
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
        </footer>
      </div>
    </>
  );
}
export default AddOrders;
