import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
import { useParams } from "react-router-dom";

const baseUrl = myConstList.baseUrl;

function AttributeEdit(props) {
  // const [data, setData] = useState([]);
  const [id, setId] = useState(useParams().id);
  const [name, setName] = useState("");
  const Params = useParams();

  const handleChangeName = async (event) => {
    let eventValue = event.target.value;
    setName(eventValue);
  };

  const handleOnBlurName = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("Name required");
      return false;
    }
  };

  useEffect(() => {
    attributeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const attributeData = async () => {
    await axios
      .post(baseUrl + "/frontapi/attribute-single", Params)
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
        }
      });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let attributeData = {
      id: id,
      name: name,
    };
    axios
      .post(baseUrl + "/frontapi/attribute-edit", attributeData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          toast.success("Attribute updated successfully");
          setTimeout(() => {
            window.location = "/attributes";
          }, 3000);
          return false;
        }
      });
  };
  const clearInputs = () => {
    window.location.href = "/attributes";
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
                <b>Edit Attribute</b>
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
export default AttributeEdit;
