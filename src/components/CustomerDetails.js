import React, { useState, useEffect } from "react";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as myConstList from "./BaseUrl";
import Header from "./Header";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Country } from "country-state-city";

const baseUrl = myConstList.baseUrl;

function CustomerDetails(props) {
  const [aData, setAData] = useState([]);
  const [sData, setSData] = useState([]);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [pNumber, setPNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [gst, setGst] = useState("");
  const [panNum, setPanNum] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [customerOrderModal, setCustomerOrderModal] = useState(false);
  const [oredrData, setOredrData] = useState([]);
  const [state, setState] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [pincode, setPincode] = useState("");
  const Params = useParams();
  useEffect(() => {
    customerData();
  }, []);

  const customerData = async () => {
    await axios
      .post(baseUrl + "/frontapi/customer-single", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setAData(resp.data.sqlRun2);
          setSData(resp.data.sqlRun3);
          setName(resp.data.sqlRun[0].name);
          setState(resp.data.sqlRun[0].state);
          setCustomerType(resp.data.sqlRun[0].customerType);
          setPincode(resp.data.sqlRun[0].pincode);
          setCompanyName(resp.data.sqlRun[0].companyName);
          setEmail(resp.data.sqlRun[0].email);
          setPNumber(resp.data.sqlRun[0].phoneNumber);
          setWebsite(resp.data.sqlRun[0].website);
          setGst(resp.data.sqlRun[0].gst);
          setPanNum(resp.data.sqlRun[0].panNumber);
          setBillingAddress(resp.data.sqlRun[0].billingAddress);
          setShippingAddress(resp.data.sqlRun[0].shippingAddress);
        }
      });
  };
  const deleteCustomer = () => {
    axios.post(baseUrl + "/frontapi/customer-delete", Params).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        toast.success(resp.message);
        setTimeout(() => {
          window.location.href = "/customer";
        }, 1000);
      }
    });
  };

  const getOrdersCustomer = () => {
    setCustomerOrderModal(true);
    axios.post(baseUrl + "/frontapi/getOrderByCustomer", Params).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setOredrData(resp.data);
        // console.log("yooopo",oredrData);
      }
    });
  };
  const closeCustomerModal = () => {
    setCustomerOrderModal(false);
  };

  const customerOrderDetailsHtml = () => {
    const html = [];
    console.log("yooopo", oredrData.length);
    if (oredrData.length) {
      oredrData.map((item, i) => {
        var status;
        if (item.order_status == 0) {
          status = "Pending";
        }
        if (item.order_status == 1) {
          status = "InProgress";
        }
        if (item.order_status == 2) {
          status = "Packing Complete";
        }
        if (item.order_status == 3) {
          status = "Out for Deliver";
        }
        if (item.order_status == 6) {
          status = "Delivered";
        }

        return html.push(
          <tr>
            <td>{i + 1}</td>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>{item.quantity}</td>
            <td>{item.gst}</td>
            <td>{item.gstAmount}</td>
            <td>{item.subTotal}</td>
            <td>{item.isCustomize}</td>
            <td>{status}</td>
          </tr>
        );
      });
      return <tbody>{html}</tbody>;
    } else {
      html.push(
        <tr>
          <td colSpan="6">
            <h5 style={{ color: "black" }}>No Orders Placed</h5>
          </td>
        </tr>
      );
      return <tbody>{html}</tbody>;
    }
  };

  const dataHtml = () => {
    const html = [];

    aData.map((value, i) => {
      return html.push(
        <div className="row">
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Person Name : <b>{value.aName}</b>
              </p>
            </div>
          </div>
          {/* <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Shipping Address : <b>{value.ashippingAddress}</b>
              </p>
            </div>
          </div> */}
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Person Email : <b>{value.aEmail}</b>
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Person Designation : <b>{value.selected}</b>
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 more-padding">
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

  const dataHtmlShipping = () => {
    const html = [];

    sData.map((value, i) => {
      console.log("yuppp", value);
      // const countryName = Country.getCountryByCode(sData[i].country);
      return html.push(
        <div className="row">
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Country : <b>{value.country}</b>
              </p>
            </div>
          </div>

          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                State: <b>{value.state}</b>
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                City : <b>{value.city}</b>
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Pincode : <b>{value.zipcode}</b>
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                Phone No. : <b>{value.phone_no}</b>
              </p>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-12 more-padding">
            <div className="person-detail">
              <p>
                Address : <b>{value.address}</b>
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
                <b>CUSTOMER DETAIL</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer customer-detail-outer">
                  <div className="row">
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Name : <b>{name}</b>
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
                          Location : <b>India</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding">
                      <div className="customer-detail">
                        <p>
                          Shipping Address : <b>{shippingAddress}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Billing Address : <b>{billingAddress}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          State : <b>{state}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Pincode : <b>{pincode}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding border-right">
                      <div className="customer-detail">
                        <p>
                          Customer Type : <b>{customerType}</b>
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 col-12 more-padding">
                      <div className="customer-detail">
                        <p>
                          Placed Orders :{" "}
                          <a
                            href="#!"
                            className="btn btn-primary"
                            onClick={getOrdersCustomer}
                          >
                            View Order
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="person-contact customer-detail">
                        <h5>
                          <b>Shipping Address Detail</b>
                        </h5>
                        {dataHtmlShipping()}
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
                          href={"/customer-edit/" + Params.id}
                          className="btn btn-primary"
                        >
                          Edit
                        </a>
                        <a
                          href="#!"
                          className="btn btn-primary"
                          onClick={deleteCustomer}
                        >
                          Delete
                        </a>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            className="modal-update"
            show={customerOrderModal}
            onHide={closeCustomerModal}
          >
            <Modal.Header closeButton>
              <Modal.Title className="m-0" style={{ color: "black" }}>
                Order Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="assign-vendor">
              <div className="row align-items-center">
                <table className="table-responsive">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>GST</th>
                      <th>GST Amount</th>
                      <th>Sub Total</th>
                      <th>Customizable</th>
                      <th>Order Status</th>
                    </tr>
                  </thead>
                  {customerOrderDetailsHtml()}
                </table>
              </div>
            </Modal.Body>
          </Modal>
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
        <ToastContainer />
      </div>
    </>
  );
}
export default CustomerDetails;
