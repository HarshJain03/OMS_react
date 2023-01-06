import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { baseUrl } from "./BaseUrl";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

const SubCategoryAdd = () => {
  const [subCatName, setSubCatName] = useState("");
  const [subShortName, setSubShortName] = useState("");
  const [catData, setCatData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    categoryData();
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "name") {
      setSubCatName(value);
    }
    if (name === "shortName") {
      setSubShortName(value);
    }
    if (name === "categoryId") {
      setCategoryId(value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      subCatName: subCatName,
      subShortName: subShortName,
      categoryId: categoryId,
    };
    console.log(data);
    setBtnDisabled(true);
    setTimeout(() => {
      setBtnDisabled(false);
    }, 1000);
    axios.post(baseUrl + "/frontapi/add-sub-category", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        toast.success(resp.message);
        setTimeout(() => {
          window.location.href = "/sub-categories";
        }, 2000);
      } else {
        toast.error(resp.message);
      }
    });
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

  const getBack = () => {
    window.location.href = "/sub-categories";
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
                <b>ADD Sub Category</b>
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
                            onChange={handleChange}
                            value={subCatName}
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
                            onChange={handleChange}
                            value={subShortName}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Select Category</label>
                          <select
                            className="form-control"
                            onChange={handleChange}
                            name="categoryId"
                          >
                            <option>Select Category</option>
                            {catData.map((item, i) => {
                              return (
                                <option value={item.id}>{item.name}</option>
                              );
                            })}
                          </select>
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
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default SubCategoryAdd;
