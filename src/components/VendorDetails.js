import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as myConstList from "./BaseUrl";
import Header from "./Header";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";

const baseUrl = myConstList.baseUrl;

function VendorDetails() {
  const [aData, setAData] = useState([]);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [pNumber, setPNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [gst, setGst] = useState("");
  const [panNum, setPanNum] = useState("");
  const [address, setAddress] = useState("");
  const [pData, setPData] = useState([]);
  const [vendorType, setVendorType] = useState("");
  const Params = useParams();

  useEffect(() => {
    vendorDetail2();
  }, []);

  const vendorDetail2 = async () => {
    await axios
      .post(baseUrl + "/frontapi/vendor-single", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setPData(resp.data.sqlRun3);
          setAData(resp.data.sqlRun2);
          setName(resp.data.sqlRun[0].name);
          setCompanyName(resp.data.sqlRun[0].companyName);
          setEmail(resp.data.sqlRun[0].email);
          setPNumber(resp.data.sqlRun[0].mobile_no);
          setWebsite(resp.data.sqlRun[0].website);
          setGst(resp.data.sqlRun[0].gst);
          setPanNum(resp.data.sqlRun[0].panNumber);
          setAddress(resp.data.sqlRun[0].address);
          setVendorType(resp.data.sqlRun[0].vendorType);
        }
      });
  };
  const deleteVendor = () => {
    axios.post(baseUrl + "/frontapi/vendor-delete", Params).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        toast.success(resp.message);
        setTimeout(() => {
          window.location.href = "/vendor";
        }, 1000);
      }
    });
  };
  const dataHtml = () => {
    const html = [];
    aData.map(function (value, i) {
      html.push(
        <div className="row">
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Person Name : <b>{value.aName}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Person Email : <b>{value.aEmail}</b>
              </p>
            </div>
          </div>{" "}
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Person Designation : <b>{value.designation}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding">
            <div className="person-detail">
              <p>
                Person Phone : <b>{value.aPhoneNo}</b>
              </p>
            </div>
          </div>
        </div>
      );
    });
    return html;
  };

  const prodHtml = () => {
    const html = [];
    pData.map(function (value, i) {
      html.push(
        <div className="row">
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Product Name : <b>{value.name}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                {vendorType === "Raw Material Manufacturer" ||
                "Goods Manufacturer"
                  ? "Production"
                  : "Delivery"}{" "}
                Capacity : <b>{value.mCapacity}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                {vendorType === "Raw Material Manufacturer" ||
                "Goods Manufacturer"
                  ? "Manufacturing"
                  : "Warehouse"}{" "}
                Location : <b>{value.mLocation}</b>
              </p>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 col-12 more-padding">
            <div className="person-detail">
              <p>
                SellingPrice : <b>{value.mSPrice}</b>
              </p>
            </div>
          </div>
        </div>
      );
    });
    return html;
  };

  return (
    <>
      <Header />
      <Navbar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="section-heading">
              <h2 className="text-black">
                <b>VENDOR DETAIL</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer customer-detail-outer">
                  <div className="row">
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Vendor Name : <b>{name}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Company name : <b>{companyName}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding">
                      <div className="customer-detail">
                        <p>
                          Email : <b>{email}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Phone Number : <b>{pNumber}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Website : <b>{website}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding">
                      <div className="customer-detail">
                        <p>
                          GST : <b>{gst}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          PAN Number : <b>{panNum}</b>
                        </p>
                      </div>
                    </div>

                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Address : <b>{address}</b>
                        </p>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="person-contact customer-detail">
                        <h5>
                          <b>Product Reference</b>
                        </h5>
                        {prodHtml()}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="person-contact customer-detail">
                        <h5>
                          <b>Contact Person</b>
                        </h5>
                        {dataHtml()}
                      </div>
                    </div>

                    {/* <div className="col-12">
                      <div className="btn-group customer-btn-group">
                        <a
                          href={"/vendor-edit/" + Params.id}
                          className="btn btn-primary"
                        >
                          Edit
                        </a>
                        <a
                          href="#!"
                          onClick={deleteVendor}
                          className="btn btn-primary"
                        >
                          Delete
                        </a>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <ToastContainer />
          </div>
        </div>
        <footer className="footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-6">© Procur.</div>
              <div className="col-sm-6">
                <div className="text-sm-end d-none d-sm-block">
                  Design &amp; Develop by Procur.it.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
export default VendorDetails;
