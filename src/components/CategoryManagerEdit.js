import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import { Modal } from "react-bootstrap";
import * as myConstList from "./BaseUrl";
import { useParams } from "react-router-dom";

const baseUrl = myConstList.baseUrl;

function CategoryManagerEdit(props) {
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
  const Params = useParams();

  useEffect(() => {
    categoryMangerSingle();
    categoryData();
  }, []);

  const handleChangeCategory = async (event) => {
    let eventValue = event.target.value;
    setCategoryId(eventValue);
  };

  const handleChangeName = async (event) => {
    if (event.target.name === "name") {
      let eventValue = event.target.value;
      setName(eventValue);
    }
    if (event.target.name === "email") {
      let eventValue = event.target.value;
      setEmail(eventValue);
    }
    if (event.target.name === "number") {
      let eventValue = event.target.value;
      setNumber(eventValue);
    }
    if (event.target.name === "password") {
      let eventValue = event.target.value;
      setPassword(eventValue);
    }
  };

  const handleOnBlurName = async (event) => {
    if (event.target.name === "name") {
      var Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Name required");
        return false;
      }
    }
    if (event.target.name === "email") {
      Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Email required");
        return false;
      }
    }
    if (event.target.name === "number") {
      Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Number required");
        return false;
      }
    }
    if (event.target.name === "password") {
      Value = await event.target.value;
      if (!Value) {
        toast.dismiss();
        toast.error("Password required");
        return false;
      }
    }
  };

  const categoryMangerSingle = async () => {
    await axios
      .post(baseUrl + "/frontapi/category-manager-single", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setId(resp.data.sqlRun[0].id);
          setName(resp.data.sqlRun[0].name);
          setCategoryId(resp.data.sqlRun[0].categoryId);
          setEmail(resp.data.sqlRun[0].email);
          setNumber(resp.data.sqlRun[0].mobile_no);
          setPassword(resp.data.sqlRun[0].password);
        }
      });
  };

  const categoryHtml = () => {
    const categoryhtml = [];

    catData.map((value, i) => {
      return categoryhtml.push(<option value={value.id}>{value.name}</option>);
    });
    return categoryhtml;
  };

  const categoryData = () => {
    axios
      .post(baseUrl + "/frontapi/category-data", categoryData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setCatData(resp.data);
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
      email: email,
      categoryId: categoryId,
      number: number,
      // password: password,
    };
    axios
      .post(baseUrl + "/frontapi/category-manager-update", customerData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          toast.success("Category Manager Updated Successfully");
          setTimeout(() => {
            window.location = "/category-manager";
          }, 3000);
          return false;
        }
      });
  };

  const clearForm = () => {
    window.location.href = "/category-manager";
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
          window.location.href = "/category-manager";
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
                <b>Category Manager Update</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer">
                  <form>
                    <div className="row">
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Category Name</label>
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
export default CategoryManagerEdit;
