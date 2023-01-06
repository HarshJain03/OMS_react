import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

function VendorAdd(props) {
  const [prodData, setProdData] = useState("");
  const [venderName, setVenderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [website, setWebsite] = useState("");
  const [gst, setGst] = useState("");
  const [panNum, setPanNum] = useState("");
  const [address, setAddress] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [manufactureListOpen, setManufactureListOpen] = useState(false);
  const [tradingListOpen, setTradingListOpen] = useState(false);
  const [formValues, setFormValues] = useState([
    {
      aName: "",
      aEmail: "",
      aPhoneNo: "",
      designation: "",
    },
  ]);
  const [formValuesManufacturer, setFormValuesManufacturer] = useState([
    { mName: "", mCapacity: "", mLocation: "", mSPrice: "" },
  ]);
  const [formValuesTrader, setFormValuesTrader] = useState([
    { tName: "", tCapacity: "", tLocation: "", tSPrice: "" },
  ]);

  // const [productName, setProductName] = useState("");
  // const [productCapacity, setproductCapacity] = useState("");
  // const [manufactureLocation, setManufactureLocation] = useState("  ");
  // const [sellingPrice, setSellingPrice] = useState("");
  // const [deliveryCapacity, setDeliveryCapacity] = useState("");
  // const [wareHouseLocation, setWareHouseLocation] = useState("");

  useEffect(() => {
    getProductData();
  }, []);

  const getProductData = () => {
    axios.post(baseUrl + "/frontapi/product-data").then((res) => {
      const resp = res.data;
      setProdData(resp.data);
    });
  };

  const handleChangeVendorName = async (event) => {
    let eventValue = event.target.value;
    setVenderName(eventValue);
  };
  const handleChangeCompanyName = async (event) => {
    let eventValue = event.target.value;
    setCompanyName(eventValue);
  };
  const handleChangeEmail = async (event) => {
    let eventValue = event.target.value;
    setEmail(eventValue);
  };
  const handleOnBlurCustomerName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Vendor Name required");
      return false;
    }
  };
  const handleOnBlurCompanyName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Company Name required");
      return false;
    }
  };
  const handleChangePhoneNum = async (event) => {
    let eventValue = event.target.value;
    setPhoneNum(eventValue);
  };

  const handleChangeWebsite = async (event) => {
    let eventValue = event.target.value;
    setWebsite(eventValue);
  };
  const handleChangeGst = async (event) => {
    let eventValue = event.target.value;
    setGst(eventValue);
  };
  const handleChangePanNum = async (event) => {
    let eventValue = event.target.value;
    setPanNum(eventValue);
  };

  const handleChangeSelect = (e) => {
    let { name, value } = e.target;
    if (name === "items") {
      if (value === "Select") {
        setFormValuesManufacturer([
          { mName: "", mCapacity: "", mLocation: "", mSPrice: "" },
        ]);
        setFormValuesTrader([
          { tName: "", tCapacity: "", tLocation: "", tSPrice: "" },
        ]);
        setManufactureListOpen(false);
        setTradingListOpen(false);
        setSelectedItem(value);
        return false;
      }
      if (
        value === "Raw Material Manufacturer" ||
        value === "Goods Manufacturer"
      ) {
        setManufactureListOpen(true);
        setTradingListOpen(false);
        setSelectedItem(value);
      }
      if (
        value === "Raw Material Trader" ||
        value === "Goods Trader" ||
        value === "Goods Importer"
      ) {
        setTradingListOpen(true);
        setManufactureListOpen(false);
        setSelectedItem(value);
      }

      setSelectedItem(value);
    }
  };

  const handleChangeAddress = async (event) => {
    let eventValue = event.target.value;
    setAddress(eventValue);
  };
  const handleOnBlurEmail = async (event) => {
    var eventValue = await event.target.value;
    var Email1Reg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
      email
    );
    if (!eventValue) {
      toast.dismiss();
      toast.error("Enter Email Address");
      return false;
    }
    if (!Email1Reg) {
      toast.dismiss();
      toast.error("Enter valid Email Address");
      return false;
    }
  };
  const handleOnBlurPhoneNum = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Phone Number required");
      return false;
    }
  };
  const handleOnBlurWebsite = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Website required");
      return false;
    }
  };
  const handleOnBlurGst = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Gst required");
      return false;
    }
  };
  const handleOnBlurPanNum = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Pan Number required");
      return false;
    }
  };

  const handleOnBlurAddress = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Address required");
      return false;
    }
  };
  const handleChangePassword = async (event) => {
    let eventValue = event.target.value;
    setPassword(eventValue);
  };
  const handleOnBlurPassword = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Password required");
      return false;
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let index = 0; index < formValues.length; index++) {
      const element = formValues[index];

      if (!element.aName) {
        toast.dismiss();
        toast.error("Contact name required");
        return false;
      }

      if (!element.aEmail) {
        toast.dismiss();
        toast.error("Email required");
        return false;
      }

      if (!element.aPhoneNo) {
        toast.dismiss();
        toast.error("Phone number required");
        return false;
      }

      if (!element.designation) {
        toast.dismiss();
        toast.error("Designation required");
        return false;
      }
    }
    if (!selectedItem || selectedItem === "Select") {
      toast.dismiss();
      toast.error("Vendor type required");
      return false;
    }

    if (
      selectedItem === "Raw Material Trader" ||
      selectedItem === "Goods Trader" ||
      selectedItem === "Goods Importer"
    ) {
      for (let index = 0; index < formValuesTrader.length; index++) {
        const element = formValuesTrader[index];

        if (!element.tName) {
          toast.dismiss();
          toast.error("Product name required");
          return false;
        }

        if (!element.tCapacity) {
          toast.dismiss();
          toast.error("Delivery capacity required");
          return false;
        }

        if (!element.tLocation) {
          toast.dismiss();
          toast.error("Warehouse location required");
          return false;
        }

        if (!element.tSPrice) {
          toast.dismiss();
          toast.error("Selling price required");
          return false;
        }
      }
    }
    if (
      selectedItem === "Raw Material Manufacturer" ||
      selectedItem === "Goods Manufacturer"
    ) {
      for (let index = 0; index < formValuesManufacturer.length; index++) {
        const element = formValuesManufacturer[index];

        if (!element.mName) {
          toast.dismiss();
          toast.error("Product name required");
          return false;
        }

        if (!element.mCapacity) {
          toast.dismiss();
          toast.error("Production capacity required");
          return false;
        }

        if (!element.mLocation) {
          toast.dismiss();
          toast.error("Manufacturing location required");
          return false;
        }

        if (!element.mSPrice) {
          toast.dismiss();
          toast.error("Selling price required");
          return false;
        }
      }
    }

    let customerData = {
      venderName: venderName,
      companyName: companyName,
      email: email,
      password: password,
      phoneNum: phoneNum,
      website: website,
      gst: gst,
      panNum: panNum,
      address: address,
      atribute: formValues,
      manufacturerAttribute: formValuesManufacturer,
      traderAttribute: formValuesTrader,
      vendorType: selectedItem,
    };

    axios.post(baseUrl + "/frontapi/vendor-add", customerData).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        toast.success("Vendor Add Successfully");
        setTimeout(function () {
          window.location = "/vendor";
        }, 3000);
        return false;
      }
    });
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      { name: "", email: "", aPhoneNo: "", designation: "" },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  // For MANUFACTURER

  let handleChangeManufacturer = (i, e) => {
    let newFormValuesManufacturer = [...formValuesManufacturer];
    newFormValuesManufacturer[i][e.target.name] = e.target.value;
    setFormValuesManufacturer(newFormValuesManufacturer);
  };

  let addFormFieldsManufacturer = () => {
    setFormValuesManufacturer([
      ...formValuesManufacturer,
      { mName: "", mCapacity: "", mLocation: "", mSPrice: "" },
    ]);
  };

  let removeFormFieldsManufacturer = (i) => {
    let newFormValuesManufacturer = [...formValuesManufacturer];
    newFormValuesManufacturer.splice(i, 1);
    setFormValuesManufacturer(newFormValuesManufacturer);
  };

  // For TRADER

  let handleChangeTrader = (i, e) => {
    let newFormValuesTrader = [...formValuesTrader];
    newFormValuesTrader[i][e.target.name] = e.target.value;
    setFormValuesTrader(newFormValuesTrader);
  };

  let addFormFieldsTrader = () => {
    setFormValuesTrader([
      ...formValuesTrader,
      { tName: "", tCapacity: "", tLocation: "", tSPrice: "" },
    ]);
  };

  let removeFormFieldsTrader = (i) => {
    let newFormValuesTrader = [...formValuesTrader];
    newFormValuesTrader.splice(i, 1);
    setFormValuesTrader(newFormValuesTrader);
  };

  const clearForm = () => {
    setTimeout(() => {
      window.location.href = "/vendor";
    }, 1000);
  };

  const categoryHtml = () => {
    const categoryhtml = [];

    prodData.map((value, i) => {
      return categoryhtml.push(<option value={value.id}>{value.name}</option>);
    });
    return categoryhtml;
  };

  return (
    <div id="layout-wrapper">
      <Header />
      <Navbar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="section-heading">
              <h2 className="text-black">
                <b>ADD Vendor</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer">
                  <form>
                    <div className="row">
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Vendor Name</label>
                          <input
                            type="text"
                            name="venderName"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeVendorName}
                            onBlur={handleOnBlurCustomerName}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Company Name</label>
                          <input
                            type="text"
                            name="companyName"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeCompanyName}
                            onBlur={handleOnBlurCompanyName}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeEmail}
                            onBlur={handleOnBlurEmail}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Password</label>
                          <input
                            type="password"
                            name="password"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangePassword}
                            onBlur={handleOnBlurPassword}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="number"
                            name="pNumber"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangePhoneNum}
                            onBlur={handleOnBlurPhoneNum}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Website</label>
                          <input
                            type="text"
                            name="website"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeWebsite}
                            onBlur={handleOnBlurWebsite}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 col-12">
                        <div className="form-group">
                          <label>GST</label>
                          <input
                            type="gst"
                            name=""
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeGst}
                            onBlur={handleOnBlurGst}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 col-12">
                        <div className="form-group">
                          <label>PAN Number</label>
                          <input
                            type="text"
                            name="panNum"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangePanNum}
                            onBlur={handleOnBlurPanNum}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Address</label>
                          <input
                            type="text"
                            name="billingAddress"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeAddress}
                            onBlur={handleOnBlurAddress}
                          />
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Vendor Type</label>
                          <select
                            className="form-control"
                            onChange={handleChangeSelect}
                            value={selectedItem}
                            name="items"
                          >
                            <option>Select</option>
                            <option>Raw Material Manufacturer</option>
                            <option>Raw Material Trader</option>
                            <option>Goods Trader</option>
                            <option>Goods Manufacturer</option>
                            <option>Goods Importer</option>
                          </select>
                        </div>
                      </div>

                      {manufactureListOpen === true && (
                        <>
                          {formValuesManufacturer.map((element, index) => (
                            <>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="form-group">
                                  <label>Product Name</label>
                                  <select
                                    className="form-control"
                                    name="mName"
                                    value={element.mName || ""}
                                    onChange={(e) =>
                                      handleChangeManufacturer(index, e)
                                    }
                                  >
                                    <option value="">Please select</option>
                                    {categoryHtml()}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="form-group">
                                  <label>Production Capacity</label>
                                  <input
                                    type="text"
                                    name="mCapacity"
                                    placeholder=""
                                    className="form-control"
                                    value={element.mCapacity || ""}
                                    onChange={(e) =>
                                      handleChangeManufacturer(index, e)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="form-group">
                                  <label>Manufacturing Location</label>
                                  <input
                                    type="text"
                                    name="mLocation"
                                    placeholder=""
                                    className="form-control"
                                    value={element.mLocation || ""}
                                    onChange={(e) =>
                                      handleChangeManufacturer(index, e)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="add-row-group d-flex align-items-center justify-content-between">
                                  <div className="form-group">
                                    <label>Selling Price</label>
                                    <input
                                      type="number"
                                      name="mSPrice"
                                      placeholder=""
                                      className="form-control"
                                      value={element.mSPrice || ""}
                                      onChange={(e) =>
                                        handleChangeManufacturer(index, e)
                                      }
                                    />
                                  </div>
                                </div>
                                {index ? (
                                  <button
                                    type="button"
                                    className="button remove"
                                    onClick={() =>
                                      removeFormFieldsManufacturer(index)
                                    }
                                  >
                                    -
                                  </button>
                                ) : null}
                                <div className="add-row">
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() => addFormFieldsManufacturer()}
                                  >
                                    +
                                  </a>
                                </div>
                              </div>
                            </>
                          ))}
                        </>
                      )}
                      {tradingListOpen === true && (
                        <>
                          {formValuesTrader.map((element, index) => (
                            <>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="form-group">
                                  <label>Product Name</label>
                                  <select
                                    className="form-control"
                                    name="tName"
                                    value={element.tName || ""}
                                    onChange={(e) =>
                                      handleChangeTrader(index, e)
                                    }
                                  >
                                    <option value="">Please select</option>
                                    {categoryHtml()}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="form-group">
                                  <label>Delivery Capacity</label>
                                  <input
                                    type="text"
                                    name="tCapacity"
                                    placeholder=""
                                    className="form-control"
                                    value={element.tCapacity || ""}
                                    onChange={(e) =>
                                      handleChangeTrader(index, e)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="form-group">
                                  <label>Warehouse Location</label>
                                  <input
                                    type="text"
                                    name="tLocation"
                                    placeholder=""
                                    className="form-control"
                                    value={element.tLocation || ""}
                                    onChange={(e) =>
                                      handleChangeTrader(index, e)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-6 col-12">
                                <div className="add-row-group d-flex align-items-center justify-content-between">
                                  <div className="form-group">
                                    <label>Selling Price</label>
                                    <input
                                      type="number"
                                      name="tSPrice"
                                      placeholder=""
                                      className="form-control"
                                      value={element.tSPrice || ""}
                                      onChange={(e) =>
                                        handleChangeTrader(index, e)
                                      }
                                    />
                                  </div>
                                </div>

                                {index ? (
                                  <button
                                    type="button"
                                    className="button remove"
                                    onClick={() =>
                                      removeFormFieldsTrader(index)
                                    }
                                  >
                                    -
                                  </button>
                                ) : null}
                                <div className="add-row">
                                  <a
                                    href="javascript:void(0)"
                                    onClick={() => addFormFieldsTrader()}
                                  >
                                    +
                                  </a>
                                </div>
                              </div>
                            </>
                          ))}
                        </>
                      )}
                      <div className="col-12">
                        <div className="contact-person-heading">
                          <h5>Contact Person</h5>
                        </div>
                      </div>
                      {formValues.map((element, index) => (
                        <>
                          <div className="col-md-4 col-sm-6 col-12 order-1">
                            <div className="form-group">
                              <label>Name</label>
                              <input
                                type="text"
                                name="aName"
                                placeholder=""
                                className="form-control"
                                value={element.aName || ""}
                                onChange={(e) => handleChange(index, e)}
                              />
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-6 col-12 order-1">
                            <div className="form-group">
                              <label>Phone No.</label>
                              <input
                                type="text"
                                name="aPhoneNo"
                                placeholder=""
                                className="form-control"
                                value={element.aPhoneNo || ""}
                                onChange={(e) => handleChange(index, e)}
                              />
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-6 col-12 order-1">
                            <div className="form-group">
                              <label>Designation</label>
                              <select
                                className="form-control"
                                name="designation"
                                value={element.designation || ""}
                                onChange={(e) => handleChange(index, e)}
                              >
                                <option value="">Select</option>
                                <option>Proprietor</option>
                                <option>Partner</option>
                                <option>Director</option>
                                <option>Store Manager</option>
                                <option>Accounts Manager</option>
                                <option>Factory Manager</option>
                                <option>Machine Man</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-6 col-12 order-1">
                            <div className="add-row-group d-flex align-items-center justify-content-between">
                              <div className="form-group">
                                <label>Email</label>
                                <input
                                  type="text"
                                  name="aEmail"
                                  placeholder=""
                                  className="form-control"
                                  value={element.aEmail || ""}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                              {index ? (
                                <button
                                  type="button"
                                  className="button remove"
                                  onClick={() => removeFormFields(index)}
                                >
                                  -
                                </button>
                              ) : null}
                              <div className="add-row">
                                <a
                                  href="javascript:void(0)"
                                  onClick={() => addFormFields()}
                                >
                                  +
                                </a>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </form>
                  <div className="btn-group">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      class="btn btn-primary"
                    >
                      {" "}
                      Save{" "}
                    </button>
                    <br />
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={clearForm}
                    >
                      {" "}
                      Cancel{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer limit={1} />
    </div>
  );
}
export default VendorAdd;
