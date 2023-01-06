import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
import { useParams } from "react-router-dom";

const baseUrl = myConstList.baseUrl;

function CategoryEdit(props) {
  // const [data, setData] = useState([]);
  const [id, setId] = useState(useParams().id);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const Params = useParams();

  const handleChangeCustomerName = async (event) => {
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
  const handleOnBlurshortName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Short Name required");
      return false;
    }
  };

  useEffect(() => {
    categoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const categoryData = async () => {
    await axios
      .post(baseUrl + "/frontapi/category-single", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          // setData(resp.data.sqlRun);
          setId(resp.data.sqlRun[0].id);
          setName(resp.data.sqlRun[0].name);
          setShortName(resp.data.sqlRun[0].short_name);
        }
      });
  };
  const handleSubmit = async (event) => {
    if (event.key === "Enter") {
    }
    event.preventDefault();
    let categoryData = {
      id: id,
      name: name,
      shortName: shortName,
    };
    setBtnDisabled(true);
    setTimeout(() => {
      setBtnDisabled(false);
    }, 1000);
    axios
      .post(baseUrl + "/frontapi/category-edit", categoryData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          toast.success("Category updated successfully");
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
                <b>Edit Category</b>
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
                            value={name}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeCustomerName}
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
                            value={shortName}
                            placeholder=""
                            className="form-control"
                            onChange={handleChangeshortName}
                            onBlur={handleOnBlurshortName}
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
                      disabled={btnDisabled}
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
export default CategoryEdit;
