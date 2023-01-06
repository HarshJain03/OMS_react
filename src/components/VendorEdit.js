import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
import { useParams } from "react-router-dom";
import MD5 from "md5";
const baseUrl = myConstList.baseUrl;

function VendorEdit(props) {
  const [id, setId] = useState(useParams().id);
  const [newPass, setNewPass] = useState("");
  const [prodData, setProdData] = useState([]);
  const [confirmPass, setConfirmPass] = useState("");
  const [name, setName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
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
    { aName: "", aEmail: "", aPhoneNo: "", designation: "" },
  ]);

  const [formValuesManufacturer, setFormValuesManufacturer] = useState([
    { prodName: "", mCapacity: "", mLocation: "", mSPrice: "" },
  ]);
  const [formValuesTrader, setFormValuesTrader] = useState([
    { prodName: "", tCapacity: "", tLocation: "", tSPrice: "" },
  ]);

  const Params = useParams();

  useEffect(() => {
    getProductData();
  }, []);

  const getProductData = () => {
    axios.post(baseUrl + "/frontapi/product-data").then((res) => {
      const resp = res.data;
      setProdData(resp.data);
    });
  };

  const handleChangeCustomerName = async (event) => {
    let eventValue = event.target.value;
    setName(eventValue);
  };
  const handleChangeCompanyName = async (event) => {
    let eventValue = event.target.value;
    setCompanyName(eventValue);
  };
  const handleChangeEmail = async (event) => {
    let eventValue = event.target.value;
    setEmail(eventValue);
  };
  const handleChangePassword = async (event) => {
    let eventValue = event.target.value;
    setPassword(eventValue);
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
  const handleOnBlurCustomerName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Customer Name required");
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

  const handleChangeBillingAddress = async (event) => {
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
  const handleOnBlurPassword = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Password required");
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

  const handleOnBlurBillingAddress = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Billing Address required");
      return false;
    }
  };

  useEffect(() => {
    customerData();
  }, []);
  const customerData = async () => {
    await axios
      .post(baseUrl + "/frontapi/vendor-single", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          if (resp.data.sqlRun2.length > 0) {
            setFormValues(resp.data.sqlRun2);
          }
          if (resp.data.sqlRun3.length > 0) {
            setFormValuesManufacturer(resp.data.sqlRun3);
          }
          if (resp.data.sqlRun3.length > 0) {
            setFormValuesTrader(resp.data.sqlRun3);
          }
          setId(resp.data.sqlRun[0].id);
          setName(resp.data.sqlRun[0].name);
          setCompanyName(resp.data.sqlRun[0].companyName);
          setEmail(resp.data.sqlRun[0].email);
          setPhoneNum(resp.data.sqlRun[0].mobile_no);
          setWebsite(resp.data.sqlRun[0].website);
          setGst(resp.data.sqlRun[0].gst);
          setPanNum(resp.data.sqlRun[0].panNumber);
          setAddress(resp.data.sqlRun[0].address);
          setPassword(resp.data.sqlRun[0].password);
          setSelectedItem(resp.data.sqlRun[0].vendorType);

          if (
            resp.data.sqlRun[0].vendorType === "Raw Material Manufacturer" ||
            resp.data.sqlRun[0].vendorType === "Goods Manufacturer"
          ) {
            setManufactureListOpen(true);
            setTradingListOpen(false);
          }
          if (
            resp.data.sqlRun[0].vendorType === "Raw Material Trader" ||
            resp.data.sqlRun[0].vendorType === "Goods Trader" ||
            resp.data.sqlRun[0].vendorType === "Goods Importer"
          ) {
            setTradingListOpen(true);
            setManufactureListOpen(false);
          }
        }
      });
  };
  const handleSubmit = async (event) => {
    if (event.key === "Enter") {
    }
    event.preventDefault();
    let customerData = {
      id: id,
      name: name,
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
    axios.post(baseUrl + "/frontapi/vendor-edit", customerData).then((resp) => {
      var resp = resp.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status == true) {
        toast.success("Vendor updated successfully");
        setTimeout(
          function () {
            window.location = "/vendor";
          }.bind(this),
          3000
        );
        return false;
      }
    });
  };

  const handleChangePass = (e) => {
    let { name, value } = e.target;
    if (name === "newPass") {
      setNewPass(value);
    }

    if (name === "confirmPass") {
      setConfirmPass(value);
    }
  };
  const submit = () => {
    const config = {
      headers: {
        "x-access-token": localStorage.getItem("jwtToken"),
      },
    };
    const data = {
      userId: id,
      newPass: newPass,
      confirmPass: confirmPass,
    };

    axios.post(baseUrl + "/frontapi/changePass", data, config).then((res) => {
      const resp = res.data;
      toast.dismiss();

      if (resp.status === true) {
        toast.dismiss();
        toast.success(resp.message);
        setTimeout(() => {
          window.location.href = "/vendor";
        }, 2000);
        return false;
      } else {
        toast.dismiss();
        toast.error(resp.message);
      }
    });
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
    console.log("first", newFormValuesManufacturer);

    setFormValuesManufacturer(newFormValuesManufacturer);
  };

  let addFormFieldsManufacturer = () => {
    setFormValuesManufacturer([
      ...formValuesManufacturer,
      { prodName: "", mCapacity: "", mLocation: "", mSPrice: "" },
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
    console.log("first", newFormValuesTrader);
    setFormValuesTrader(newFormValuesTrader);
  };

  let addFormFieldsTrader = () => {
    setFormValuesTrader([
      ...formValuesTrader,
      { prodName: "", tCapacity: "", tLocation: "", tSPrice: "" },
    ]);
  };

  let removeFormFieldsTrader = (i) => {
    let newFormValuesTrader = [...formValuesTrader];
    newFormValuesTrader.splice(i, 1);
    setFormValuesTrader(newFormValuesTrader);
  };

  const clearForm = () => {
    window.location.href = "/vendor";
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
            <Modal show={modalIsOpen} onHide={closeModal}>
              <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>
                  {" "}
                  Change Password
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row align-items-center">
                  <div className="col-sm-6 col-12">
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        className="form-control fs12"
                        placeholder="Enter New Password"
                        type="password"
                        name="newPass"
                        onChange={handleChangePass}
                        value={newPass}
                      />
                    </div>
                  </div>
                  <div className="col-sm-6 col-12">
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input
                        className="form-control fs12"
                        placeholder="Enter Confirm Password"
                        type="password"
                        name="confirmPass"
                        onChange={handleChangePass}
                        value={confirmPass}
                      />
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer className="d-block">
                <div className="submit-btn-outer">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    onClick={submit}
                  >
                    Submit
                  </button>
                </div>
              </Modal.Footer>
            </Modal>
            <div className="section-heading">
              <h2 className="text-black">
                <b>Edit Vendor</b>
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
                            name="name"
                            value={name}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeCustomerName}
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
                            value={companyName}
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
                            value={email}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeEmail}
                            onBlur={handleOnBlurEmail}
                          />
                        </div>
                      </div>
                      {/* <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Password</label>
                          <input
                            type="password"
                            name="password"
                            value={password}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangePassword}
                            onBlur={handleOnBlurPassword}
                          />
                        </div>
                      </div> */}
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            type="number"
                            name="pNumber"
                            value={phoneNum}
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
                            value={website}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeWebsite}
                            onBlur={handleOnBlurWebsite}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>GST</label>
                          <input
                            type="gst"
                            name=""
                            placeholder=""
                            value={gst}
                            className="form-control"
                            onChange={handleChangeGst}
                            onBlur={handleOnBlurGst}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>PAN Number</label>
                          <input
                            type="text"
                            name="panNum"
                            value={panNum}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangePanNum}
                            onBlur={handleOnBlurPanNum}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label> Address</label>
                          <input
                            type="text"
                            name="address"
                            value={address}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeBillingAddress}
                            onBlur={handleOnBlurBillingAddress}
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
                                    name="prodName"
                                    value={element.prodName || ""}
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
                                    name="prodName"
                                    value={element.prodName || ""}
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

                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <button
                            type="button"
                            // onClick={buyPopUp}
                            class="btn btn-primary"
                            data-toggle="modal"
                            data-target="#add-user-modal"
                            onClick={() => setModalIsOpen(true)}
                          >
                            Change Password
                          </button>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="contact-person-heading">
                          <h5>Contact Person</h5>
                        </div>
                      </div>

                      {/* {buyPopUp} */}
                      {formValues.map((element, index) => (
                        <>
                          <div class="col-md-4 col-sm-6 col-12 order-1">
                            <div class="form-group">
                              <label>Name</label>
                              <input
                                type="text"
                                name="aName"
                                placeholder=""
                                class="form-control"
                                value={element.aName || ""}
                                onChange={(e) => handleChange(index, e)}
                              />
                            </div>
                          </div>
                          <div class="col-md-4 col-sm-6 col-12 order-1">
                            <div class="form-group">
                              <label>Phone No.</label>
                              <input
                                type="text"
                                name="aPhoneNo"
                                placeholder=""
                                class="form-control"
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
                                <label>Email.</label>
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
export default VendorEdit;
