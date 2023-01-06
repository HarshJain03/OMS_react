import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

function CategoryAdd(props) {
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleChangeName = async (event) => {
    let eventValue = event.target.value;
    setName(eventValue);
  };
  const handleChangeshortName = async (event) => {
    let eventValue = event.target.value;
    setShortName(eventValue);
  };

  const handleOnBlurName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Name required");
      return false;
    }
  };
  const handleOnBlurShortName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Short name required");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let customerData = {
      name: name,
      shortName: shortName,
    };
    setBtnDisabled(true);
    setTimeout(() => {
      setBtnDisabled(false);
    }, 1000);
    axios.post(baseUrl + "/frontapi/category-add", customerData).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        toast.success("Category Added Successfully");
        setTimeout(() => {
          window.location = "/categories";
        }, 3000);
        return false;
      }
    });
  };

  const clearForm = () => {
    window.location.href = "/categories";
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
                <b>ADD Category</b>
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
                          <label>Short Name</label>
                          <input
                            type="text"
                            name="shortName"
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeshortName}
                            onBlur={handleOnBlurShortName}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="btn-group">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={btnDisabled}
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
export default CategoryAdd;
