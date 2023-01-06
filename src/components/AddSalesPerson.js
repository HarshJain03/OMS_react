import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

function AddSalesPerson(props) {
  const [name, setName] = useState("");
  const [catData, setCatData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    categoryData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryData = () => {
    axios
      .post(baseUrl + "/frontapi/category-manager-data", categoryData)
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

  const categoryHtml = () => {
    const categoryhtml = [];

    catData.map((value, i) => {
      return categoryhtml.push(<option value={value.id}>{value.name}</option>);
    });
    return categoryhtml;
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

  const handleOnBlurCategoryName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Please select category");
      return false;
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

  const handleChangeCategory = async (event) => {
    let eventValue = event.target.value;
    setCategoryId(eventValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let customerData = {
      name: name,
      email: email,
      categoryId: categoryId,
      number: number,
      password: password,
    };
    axios
      .post(baseUrl + "/frontapi/sales-person-add", customerData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          toast.success("Sales Person Added Successfully");
          setTimeout(() => {
            window.location = "/sales-person";
          }, 3000);
          return false;
        }
      });
  };

  const clearInputs = () => {
    setName("");
    setEmail("");
    setCategoryId("");
    setNumber("");
    setPassword("");

    window.location.href = "/sales-person";
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
                <b>ADD Sales Person</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer">
                  <form>
                    <div className="row">
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            name="name"
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
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeName}
                            onBlur={handleOnBlurName}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Category Manager </label>
                          <select
                            className="form-control"
                            name="categoryId"
                            onChange={handleChangeCategory}
                            onBlur={handleOnBlurCategoryName}
                          >
                            <option>Please select</option>
                            {categoryHtml()}
                          </select>
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
                            onChange={handleChangeName}
                            onBlur={handleOnBlurName}
                          />
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
                      type="reset"
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
export default AddSalesPerson;
