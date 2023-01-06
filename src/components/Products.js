import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactDatatable from "@mkikets/react-datatable";

import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

function Products() {
  const [record, setRecord] = useState([]);

  useEffect(() => {
    productData();
  }, []);

  const columns = [
    {
      key: "Sr No.",
      text: "Sr No.",
      className: "sr_no.",
      align: "left",
      sortable: true,
      cell: (row, index) => index + 1,
    },
    {
      key: "ad",
      text: "Product Image",
      className: "cust_name",
      align: "left",
      sortable: true,
      cell: (record) => {
        var pimages;
        if (record.image == null || record.image.split === undefined) {
          pimages = record.image;
        } else {
          pimages = record.image.split(",");
        }
        return (
          <img
            src={
              record.image == null
                ? baseUrl + "/static" + pimages
                : baseUrl + "/static" + pimages[0]
            }
            alt=""
            className="img-fluid"
          />
        );
      },
    },
    {
      key: "subShortName",
      text: "Product ID",
      className: "id",
      align: "left",
      sortable: true,
      cell: (record) => {
        return (
          <Fragment>
            {record.id < 10
              ? record.subShortName + "000" + record.id
              : record.subShortName + "00" + record.id}
          </Fragment>
        );
      },
    },
    {
      key: "name",
      text: "Product Name",
      className: "name",
      align: "left",
      sortable: true,
    },
    {
      key: "avaliable_qty",
      text: "Available Qty",
      className: "qty",
      align: "left",
      sortable: true,
    },
    {
      key: "price",
      text: "Price",
      className: "price",
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
            <Link to={"/product-details/" + record.id}>
              <img
                src="assets/images/view-icon.png"
                alt=""
                className="img-fluid"
              />
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
            <Link to={"/product-edit/" + record.id}>
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

  const deleted = (id) => {
    let params = {
      id: id,
    };
    axios.post(baseUrl + "/frontapi/product-delete", params).then((res) => {
      var resp = res.data;

      console.log("hitt",resp.status)

      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return false;
      }
      if (resp.status === true) {
        toast.dismiss();
        toast.success(resp.message);
        productData();
      }
    });
  };

  const productData = () => {
    axios.post(baseUrl + "/frontapi/product-data", productData).then((res) => {
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
  return (
    <div id="layout-wrapper">
      <Header />
      <Navbar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="section-heading">
              <h2>
                <b>PRODUCTS LIST</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="product-list-outer">
                  <div className="add-product-btn text-center">
                    <Link to={"/product-add"} className="btn btn-primary">
                      Add Product
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
        <ToastContainer/>
        <footer></footer>
      </div>
    </div>
  );
}
export default Products;
