import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

function GstAdd(props) {
  const [gst, setGst] = useState("");

  // const handleChangeGst = async (event) => {
  //   let eventValue = event.target.value;
  //   setGst(eventValue);
  // };

    const handleChangeGst = async (event) => {
    let eventValue = event.target.value;
    setGst(eventValue);
  };

  const handleOnBlurGst = async (event) => {
    var Value = await event.target.value;
    if (!Value) {
      toast.dismiss();
      toast.error("GST required");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    if (event.key === "Enter") {
      console.log("do validate");
    }
    event.preventDefault();
    if (!gst) {
      toast.dismiss();
      toast.error("GST required");
      return false;
    }

    let customerData = {
      gst: gst,
    };
    axios.post(baseUrl + "/frontapi/gst-add", customerData).then((resp) => {
      var resp = resp.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status == true) {
        toast.success("GST Added Successfully");
        setTimeout(
          function () {
            window.location = "/gst";
          }.bind(this),
          3000
        );
        return false;
      }
    });
  };
  const clearInputs = () => {
    window.location.href = "/gst";
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
                <b>ADD GST</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer">
                  <form>
                    <div className="row">
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">

                          <label>GST</label>

                          <input
                          type="number"
                          name="gst"
                          placeholder=""
                          className="form-control"
                          onChange={handleChangeGst}
                          onBlur={handleOnBlurGst}
                        />

                          {/* <select
                            className="form-control"
                            value={gst}
                            name="gst"
                            onChange={handleChangeGst}
                          >
                            <option>Please select</option>
                            <option value={"5"}>5%</option>
                            <option value={"12"}>12%</option>
                            <option value={"18"}>18%</option>
                            <option value={"28"}>28%</option>
                            <option value={"40"}>40%</option>
                          </select> */}
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
export default GstAdd;
