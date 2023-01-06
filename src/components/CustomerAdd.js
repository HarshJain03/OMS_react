import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
import { Country, State, City } from "country-state-city";
const baseUrl = myConstList.baseUrl;

function CustomerAdd(props) {
  const [customerName, setCutomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [website, setWebsite] = useState("");
  const [gst, setGst] = useState("");
  const [panNum, setPanNum] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phone_no, setPhone_no] = useState("");
  const [selectedOptions, setSelectedOptions] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [pincode, setPincode] = useState("");
  const [formValues, setFormValues] = useState([
    {
      aName: "",
      aEmail: "",
      aPhoneNo: "",
      designation: "",
      selected: "",
    },
  ]);
  const [formValuesAddress, setFormValuesAddress] = useState([
    {
      address: "",
      country: "",
      phone_no: "",
      city: "",
      zipcode: "",
      state: "",
    },
  ]);

  const handleChangeCustomerName = async (event) => {
    let eventValue = event.target.value;
    setCutomerName(eventValue);
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
  // const handleChangeShipingAddress = async (event) => {
  //   let eventValue = event.target.value;
  //   setShippingAddress(eventValue);
  // };

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
  // const handleOnBlurShippingAddress = async (event) => {
  //   var Value = await event.target.value;
  //   if (!Value) {
  //     toast.dismiss();
  //     toast.error("Shipping Address required");
  //     return false;
  //   }
  // };
  // const handleOnBlurBillingAddress = async (event) => {
  //   var Value = await event.target.value;
  //   if (!Value) {
  //     toast.dismiss();
  //     toast.error("Billing Address required");
  //     return false;
  //   }
  // };

  const handleSubmit = async (event) => {
    if (event.key === "Enter") {
    }
    event.preventDefault();
    let customerData = {
      customerType: selectedOptions,
      customerName: customerName,
      companyName: companyName,
      email: email,
      password: password,
      phoneNum: phoneNum,
      website: website,
      gst: gst,
      panNum: panNum,
      // shippingAddress: shippingAddress,

      country: country,
      billingAddress: billingAddress,
      state: stateValue,
      city: city,
      pincode: pincode,
      phone_no: phone_no,

      atribute: formValues,
      address: formValuesAddress,
    };

    axios.post(baseUrl + "/frontapi/customer-add", customerData).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        toast.success("Customer Add Successfully");
        setTimeout(() => {
          window.location = "/customer";
        }, 3000);
        return false;
      }
    });
  };

  const handleChangeBillingAddress = (event) => {
    let { name, value } = event.target;

    if (name === "country") {
      setCountry(value);
      return false;
    }
    if (name === "billingAddress") {
      setBillingAddress(value);
      return false;
    }
    if (name === "state") {
      setStateValue(value);
      return false;
    }
    if (name === "city") {
      setCity(value);
      return false;
    }
    if (name === "zipcode") {
      setPincode(value);
      return false;
    }
    if (name === "phone_no") {
      setPhone_no(value);
      return false;
    }
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };
  let addFormFields = () => {
    setFormValues([...formValues, { name: "", email: "" }]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  let handleChangeAddress = (i, e) => {
    let newFormValues = [...formValuesAddress];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValuesAddress(newFormValues);
  };
  let addFormFieldsAddress = () => {
    setFormValuesAddress([...formValuesAddress, {}]);
  };

  let removeFormFieldsAddress = (i) => {
    let newFormValues = [...formValuesAddress];
    newFormValues.splice(i, 1);
    setFormValuesAddress(newFormValues);
  };

  const handleChangeOptions = (e) => {
    let { name } = e.target;
    if (name === "buisness") {
      setSelectedOptions(name);
    }
    if (name === "manufacturer") {
      setSelectedOptions(name);
    }
    if (name === "individual") {
      setSelectedOptions(name);
    }
  };

  const generatePassword = (e) => {
    e.preventDefault();
    var chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    setPassword(password);
  };

  const countryDropDownHtml = () => {
    const html = [];
    const country = Country.getAllCountries();
    country.map((country) => {
      return html.push(
        <option key={country.name} value={country.isoCode}>
          {country.name}
        </option>
      );
    });
    return html;
  };
  const stateDropDownHtml = () => {
    const html = [];
    const states = State.getStatesOfCountry(country);
    states.map((state) => {
      return html.push(
        <option key={state.name} value={state.name}>
          {state.name}
        </option>
      );
    });
    return html;
  };

  const countryShippingDropDownHtml = () => {
    const html = [];
    const country = Country.getAllCountries();
    country.map((country) => {
      return html.push(
        <option key={country.name} value={country.isoCode}>
          {country.name}
        </option>
      );
    });
    return html;
  };

  const stateShippingDropDownHtml = (i) => {
    const html = [];
    const states = State.getStatesOfCountry(formValuesAddress[i].country);
    states.map((state) => {
      return html.push(
        <option key={state.name} value={state.name}>
          {state.name}
        </option>
      );
    });
    return html;
  };
  // const handleChangeState = (e) => {
  //   let { name, value } = e.target;
  //   if (name === "state") {
  //     setStateValue(value);
  //   }
  //   if (name === "pincode") {
  //     setPincode(value);
  //   }
  // };

  const getBack = () => {
    window.location.href = "/customer";
  };

  return (
    <div id="layout-wrapper">
      <Header />
      <Navbar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="section-heading">
              <h2>
                <b>ADD CUSTOMER</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer">
                  <form>
                    <div className="row">
                      <div className="col-4">
                        <div className="form-group">
                          <input
                            type="radio"
                            name="buisness"
                            value={selectedOptions}
                            checked={selectedOptions === "buisness" && true}
                            id="buisness"
                            onChange={handleChangeOptions}
                          />
                          <label className="radio-label" htmlFor="buisness">
                            Business
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <input
                            type="radio"
                            value={selectedOptions}
                            name="manufacturer"
                            checked={selectedOptions === "manufacturer" && true}
                            id="manufacturer"
                            onChange={handleChangeOptions}
                          />
                          <label className="radio-label" htmlFor="manufacturer">
                            Manufacturer
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-group">
                          <input
                            type="radio"
                            name="individual"
                            value={selectedOptions}
                            checked={selectedOptions === "individual" && true}
                            id="individual"
                            onChange={handleChangeOptions}
                          />
                          <label className="radio-label" htmlFor="individual">
                            Individual
                          </label>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Customer Name</label>
                          <input
                            type="text"
                            name="customerName"
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
                            type="text"
                            name="password"
                            placeholder=""
                            disabled
                            value={password}
                            className="form-control"
                            onChange={handleChangePassword}
                            onBlur={handleOnBlurPassword}
                          />
                          <div className="generate-pass-btn">
                            <button
                              className="btn btn-primary"
                              onClick={generatePassword}
                            >
                              Generate Password
                            </button>
                          </div>
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
                      <div className="col-md-6 col-sm-6 col-12">
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
                      <div className="col-md-6 col-sm-6 col-12">
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
                      <div className="billing-shipping d-flex flex-wrap">
                        <div className="col-md-6 col-12 padding-left">
                          <h4> Billing Address</h4>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Country</label>
                              <select
                                type="text"
                                name="country"
                                value={country}
                                placeholder=""
                                className="form-control"
                                onChange={handleChangeBillingAddress}
                              >
                                <option>Select Country</option>
                                {countryDropDownHtml()}
                              </select>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Address</label>
                              <input
                                type="text"
                                name="billingAddress"
                                value={billingAddress}
                                placeholder=""
                                className="form-control"
                                onChange={handleChangeBillingAddress}
                                // onBlur={handleOnBlurBillingAddress}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>State</label>
                              <select
                                type="text"
                                name="state"
                                value={stateValue}
                                placeholder=""
                                className="form-control"
                                onChange={handleChangeBillingAddress}
                              >
                                <option>Select State</option>
                                {stateDropDownHtml()}
                              </select>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>City</label>
                              <input
                                type="text"
                                name="city"
                                value={city}
                                placeholder=""
                                className="form-control"
                                onChange={handleChangeBillingAddress}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Pincode</label>
                              <input
                                type="number"
                                name="zipcode"
                                value={pincode}
                                placeholder=""
                                className="form-control"
                                onChange={handleChangeBillingAddress}
                              />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>Phone No.</label>
                              <input
                                type="number"
                                name="phone_no"
                                value={phone_no}
                                placeholder=""
                                className="form-control"
                                onChange={handleChangeBillingAddress}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 col-12 padding-right">
                          <h4> Shipping Address</h4>

                          {formValuesAddress.map((element, index) => (
                            <>
                              <div className="col-12">
                                <div className="form-group">
                                  <label>Country</label>
                                  <select
                                    className="form-control"
                                    name="country"
                                    onChange={(e) =>
                                      handleChangeAddress(index, e)
                                    }
                                  >
                                    <option>Select Country</option>
                                    {countryShippingDropDownHtml()}
                                  </select>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label>Address</label>
                                  <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    value={element.address || ""}
                                    onChange={(e) =>
                                      handleChangeAddress(index, e)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label>State</label>
                                  <select
                                    className="form-control"
                                    name="state"
                                    onChange={(e) =>
                                      handleChangeAddress(index, e)
                                    }
                                  >
                                    <option>Select State</option>
                                    {stateShippingDropDownHtml(index)}
                                  </select>
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label>City</label>
                                  <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    value={element.city || ""}
                                    onChange={(e) =>
                                      handleChangeAddress(index, e)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="form-group">
                                  <label>Pincode</label>
                                  <input
                                    className="form-control"
                                    type="number"
                                    name="zipcode"
                                    onChange={(e) =>
                                      handleChangeAddress(index, e)
                                    }
                                    value={element.zipcode || ""}
                                  />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="add-row-group d-flex align-items-center justify-content-between">
                                  <div className="form-group">
                                    <label>Phone No.</label>
                                    <input
                                      type="number"
                                      name="phone_no"
                                      className="form-control"
                                      value={element.phone_no || ""}
                                      onChange={(e) =>
                                        handleChangeAddress(index, e)
                                      }
                                    />
                                  </div>
                                  {index ? (
                                    <button
                                      type="button"
                                      className="button remove"
                                      onClick={() =>
                                        removeFormFieldsAddress(index)
                                      }
                                    >
                                      -
                                    </button>
                                  ) : null}
                                  <div className="add-row">
                                    <a
                                      href="#!"
                                      onClick={() => addFormFieldsAddress()}
                                    >
                                      +
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="contact-person-heading">
                          <h5>Contact Person</h5>
                        </div>
                      </div>
                      {formValues.map((element, index) => (
                        <>
                          <div className="col-md-3 col-sm-6 col-12 order-1">
                            <div className="form-group">
                              <label>Name</label>
                              <input
                                type="text"
                                name="aName"
                                className="form-control"
                                value={element.aName || ""}
                                onChange={(e) => handleChange(index, e)}
                              />
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-6 col-12 order-1">
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
                          <div className="col-md-3 col-sm-6 col-12 order-1">
                            <div className="form-group">
                              <label>Designation</label>
                              <select
                                className="form-control"
                                value={element.selected || ""}
                                onChange={(e) => handleChange(index, e)}
                                name="selected"
                              >
                                <option>Select</option>
                                <option>HR/Admin Manager</option>
                                <option>Procurement Manager</option>
                                <option>General Manager</option>
                                <option>Owner/Partner/Director</option>
                                <option>Store Manager</option>
                                <option>Marketing Manager</option>
                                <option>Other</option>
                              </select>
                              {element.selected === "Other" && (
                                <input
                                  type="text"
                                  name="designation"
                                  placeholder=""
                                  className="form-control"
                                  value={element.designation || ""}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-md-3 col-sm-6 col-12 order-1">
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
                                <a href="#!" onClick={() => addFormFields()}>
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
                      className="btn btn-primary"
                    >
                      {" "}
                      Save{" "}
                    </button>
                    <br />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={getBack}
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
export default CustomerAdd;
