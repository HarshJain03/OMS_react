import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { baseUrl } from "./BaseUrl";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

const SubCategoryEdit = () => {
  const [subCatName, setSubCatName] = useState("");
  const [subShortName, setSubShortName] = useState("");
  const [catData, setCatData] = useState([]);
  const [id, setId] = useState("");
  const [nameType, setNameType] = useState("");
  const Params = useParams();

  useEffect(() => {
    getSubCategoryById();
    categoryData();
  }, []);

  const getSubCategoryById = () => {
    axios.post(baseUrl + "/frontapi/sub-category-by-id", Params).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setSubCatName(resp.data.name);
        setSubShortName(resp.data.short_name);
        setId(resp.data.category_id);
        setNameType(resp.data.name)
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

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "name") {
      setSubCatName(value);
    }
    if (name === "shortName") {
      setSubShortName(value);
    }
    if (name === "categoryId") {
      setId(value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      id: Params.id,
      subCatName: subCatName,
      subShortName: subShortName,
      catId: id,
    };
    axios.post(baseUrl + "/frontapi/edit-sub-category", data).then((res) => {
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
                            value={subCatName}
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Short Name</label>
                          <input
                            type="text"
                            name="shortName"
                            value={subShortName}
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
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
                            value={id}
                          >
                            <option value="" >Select Category</option>
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
                    >
                      {" "}
                      Save{" "}
                    </button>
                    <br />
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={() => (window.location.href = "/sub-categories")}
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
      <Footer />
    </div>
  );
};

export default SubCategoryEdit;
