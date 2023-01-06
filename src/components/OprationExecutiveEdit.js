import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import moment from "moment";

const baseUrl = myConstList.baseUrl;

function OprationExecutiveEdit(props) {
  const [data, setData] = useState([]);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [catData, setCatData] = useState([]);
  const [id, setId] = useState(useParams().id);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [inventory, setInventory] = useState("");
  const Params = useParams();

  useEffect(() => {
    categoryMangerSingle();
    categoryData();
  }, []);

  //   const handleChangeGst = async (event) => {
  //     let eventValue = event.target.value;
  //     setGst(eventValue);
  //   };

  const handleChangeCategory = async (event) => {
    let eventValue = event.target.value;
    setCategoryId(eventValue);
  };

  const handleChangeName = async (event) => {
    if (event.target.name == "name") {
      let eventValue = event.target.value;
      setName(eventValue);
    }
    if (event.target.name == "email") {
      let eventValue = event.target.value;
      setEmail(eventValue);
    }
    if (event.target.name == "number") {
      let eventValue = event.target.value;
      setNumber(eventValue);
    }
    if (event.target.name == "password") {
      let eventValue = event.target.value;
      setPassword(eventValue);
    }
    if (event.target.name == "inventory") {
      let eventValue = event.target.value;
      setInventory(eventValue);
    }
  };

  const handleOnBlurName = async (event) => {
    if (event.target.name == "name") {
      var Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Name required");
        return false;
      }
    }
    if (event.target.name == "email") {
      var Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Email required");
        return false;
      }
    }
    if (event.target.name == "number") {
      var Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Number required");
        return false;
      }
    }
    if (event.target.name == "password") {
      var Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Password required");
        return false;
      }
    }
  };

  const categoryMangerSingle = async () => {
    await axios
      .post(baseUrl + "/frontapi/opration-executive-single", Params)
      .then((resp) => {
        var resp = resp.data;
        console.log("respresp", resp.data);
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status == true) {
          setData(resp.data.sqlRun);
          setId(resp.data.sqlRun[0].id);
          setName(resp.data.sqlRun[0].name);
          setCategoryId(resp.data.sqlRun[0].categoryManagerId);
          setEmail(resp.data.sqlRun[0].email);
          setNumber(resp.data.sqlRun[0].mobile_no);
          setInventory(resp.data.sqlRun[0].isInventory);
          setPassword(resp.data.sqlRun[0].password);
        }
      });
  };

  const categoryHtml = () => {
    const categoryhtml = [];

    catData.map(function (value, i) {
      categoryhtml.push(<option value={value.id}>{value.name}</option>);
    });
    return categoryhtml;
  };

  const categoryData = () => {
    axios
      .post(baseUrl + "/frontapi/category-manager-data", categoryData)
      .then((resp) => {
        var resp = resp.data;
        console.log("resppp", resp.data);
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status == true) {
          setCatData(resp.data);
        }
      });
  };

  const handleSubmit = async (event) => {
    if (event.key === "Enter") {
      console.log("do validate");
    }
    event.preventDefault();
    let customerData = {
      id: id,
      name: name,
      email: email,
      categoryId: categoryId,
      number: number,
      password: password,
      inventory: inventory,
    };
    axios
      .post(baseUrl + "/frontapi/opration-executive-update", customerData)
      .then((resp) => {
        var resp = resp.data;
        console.log("resp", resp.status);
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status == true) {
          toast.success("Operation Executive Updated Successfully");
          setTimeout(
            function () {
              window.location = "/operation-executive";
            }.bind(this),
            3000
          );
          return false;
        }
      });
  };

  const clearInputs = () => {
    window.location.href = "/operation-executive";
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
          window.location.href = "/operation-executive";
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
                        placeholder="Enter Confirm Password"
                        className="form-control fs12"
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
                <b>Operation Executive Update</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer">
                  <form>
                    <div className="row">
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Category Manager </label>
                          <select
                            className="form-control"
                            value={categoryId}
                            name="categoryId"
                            onChange={handleChangeCategory}
                          >
                            <option>Please select</option>
                            {categoryHtml()}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            name="name"
                            value={name}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeName}
                            onBlur={handleOnBlurName}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="text"
                            name="email"
                            value={email}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeName}
                            onBlur={handleOnBlurName}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Mobile Number</label>
                          <input
                            type="text"
                            name="number"
                            value={number}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeName}
                            onBlur={handleOnBlurName}
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
                            className="form-control"
                            onChange={handleChangeName}
                            onBlur={handleOnBlurName}
                          />
                        </div>
                      </div> */}

                      <div className="col-md-4 col-sm-6 col-12">
                        <label> Inventory Status </label>
                        <div class="form-check form-check-inline checkbox-main-outer">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="inventory"
                            id="inlineRadio1"
                            value="1"
                            checked={inventory == "1"}
                            onChange={handleChangeName}
                          />
                          <label class="form-check-label" for="inlineRadio1">
                            Yes
                          </label>
                        </div>
                        <div class="form-check form-check-inline checkbox-main-outer">
                          <input
                            class="form-check-input"
                            type="radio"
                            name="inventory"
                            id="inlineRadio2"
                            value="0"
                            checked={inventory == "0"}
                            onChange={handleChangeName}
                          />
                          <label class="form-check-label" for="inlineRadio2">
                            No
                          </label>
                        </div>

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
                      </div>
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
                      onClick={clearInputs}
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
export default OprationExecutiveEdit;
