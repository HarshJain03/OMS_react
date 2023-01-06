import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ReactDatatable from "@mkikets/react-datatable";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;
function Customer(props) {
  const [record, setRecord] = useState([]);

  useEffect(() => {
    customerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      key: "Sr No.",
      text: "Customer Id",
      className: "cust_id",
      align: "left",
      sortable: true,
      cell: (row, index) => index + 1,
    },
    {
      key: "name",
      text: "Customer Name",
      className: "cust_name",
      align: "left",
      sortable: true,
    },
    {
      key: "email",
      text: "Email",
      className: "email",
      align: "left",
      sortable: true,
    },
    {
      key: "phoneNumber",
      text: "Phone No.",
      className: "phoneno",
      align: "left",
      sortable: true,
    },
    {
      key: "Detail",
      text: "Detail",
      className: "detail",
      align: "left",
      sortable: true,
      cell: (record) => {
        return (
          <Fragment>
            <Link to={"/customer-details/" + record.id}>
              <img
                src="assets/images/view-icon.png"
                alt=""
                className="img-fluid"
              />
              {/* </a> */}
            </Link>
          </Fragment>
        );
      },
    },
    {
      key: "view",
      text: "Action",
      className: "view",
      align: "left",
      sortable: true,
      cell: (record) => {
        return (
          <Fragment>
            <Link to={"/customer-edit/" + record.id}>
              <img
                src="assets/images/edit-icon.png"
                alt=""
                className="img-fluid"
              />
            </Link>

            <a href="#" onClick={() => Conn(record.id)}>
              <img
                src="assets/images/delete-icon.png"
                alt=""
                className="img-fluid"
              />
            </a>
          </Fragment>
        );
      },
    },
  ];
  const config = {
    page_size: 10,
    length_menu: [10, 20, 50],
    filename: "Fund Request List",
    no_data_text: "No user found!",
    button: {
      print: true,
      csv: true,
    },
    language: {
      // length_menu: "Show MENU result per page",
      filter: "Filter in records...",
      // info: "Showing START to END of TOTAL records",
      pagination: {
        first: "First",
        previous: "Previous",
        next: "Next",
        last: "Last",
      },
    },
    show_length_menu: true,
    show_filter: true,
    show_pagination: true,
    show_info: true,
  };
  const pageChange = (pageData) => {
    console.log("OnPageChange", pageData);
  };

  const checkCall = () => {
    return false;
  };

  const Conn = (getMethodDeleteId) => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleted(getMethodDeleteId),
        },
        {
          label: "No",
          onClick: () => checkCall(),
        },
      ],
    });
  };

  const customerData = () => {
    axios
      .post(baseUrl + "/frontapi/customer-data", customerData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setRecord(resp.data);
        }
      });
  };
  const deleted = (id) => {
    // customer-delete
    let params = {
      id: id,
    };
    axios.post(baseUrl + "/frontapi/customer-delete", params).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        customerData();
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
              <h2>
                <b>CUSTOMER LIST</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="product-list-outer customer-list-outer">
                  <div className="add-product-btn">
                    <Link to={"/customer-add"} className="btn btn-primary">
                      Add Customer
                    </Link>
                  </div>
                  <ReactDatatable
                    config={config}
                    records={record}
                    columns={columns}
                    onPageChange={pageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer></footer>
      </div>
    </div>
  );
}
export default Customer;
