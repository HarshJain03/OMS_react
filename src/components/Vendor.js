import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import ReactDatatable from "@mkikets/react-datatable";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const baseUrl = myConstList.baseUrl;

function Vendor(props) {
  const [record, setRecord] = useState([]);

  useEffect(() => {
    customerData();
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
      key: "mobile_no",
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
            <Link to={"/vendor-details/" + record.id}>
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
            <Link to={"/vendor-edit/" + record.id}>
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
    axios.post(baseUrl + "/frontapi/vendor-data", customerData).then((resp) => {
      var resp = resp.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status == true) {
        setRecord(resp.data);
      }
    });
  };
  const deleted = (id) => {
    let params = {
      id: id,
    };
    axios.post(baseUrl + "/frontapi/vendor-delete", params).then((resp) => {
      var resp = resp.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        // setPasswordErr(resp.messagep);
        return;
      }
      if (resp.status == true) {
        // setData(resp.data);
        customerData();
      }
    });
  };
  // const dataHtml = () => {
  //   const html = [];

  //   data.map(function (value, i) {
  //     // data.map((value) => (
  //     html.push(
  //       <tr>
  //         <td> {i + 1} </td>
  //         <td> {value.name} </td>
  //         <td> {value.email} </td>
  //         <td>{value.mobile_no} </td>
  //         <td>
  //           {/* <a href="customer-detail.html"> */}
  //           <Link to={"/vendor-details/" + value.id}>
  //             <img
  //               src="assets/images/view-icon.png"
  //               alt=""
  //               className="img-fluid"
  //             />
  //             {/* </a> */}
  //           </Link>
  //         </td>
  //         <td className="action">
  //           {/* <a href="javascript:void(0)"> */}
  //           <Link to={"/vendor-edit/" + value.id}>
  //             <img
  //               src="assets/images/edit-icon.png"
  //               alt=""
  //               className="img-fluid"
  //             />
  //           </Link>
  //           {/* </a>{" "} */}
  //           {/* <a href="javascript:void(0)"> */}
  //           <button onClick={() => deleted(value.id)}>
  //             <img
  //               src="assets/images/delete-icon.png"
  //               alt=""
  //               className="img-fluid"
  //             />
  //           </button>
  //           {/* </a> */}
  //         </td>
  //       </tr>
  //     );
  //   });
  //   return html;
  // };
  return (
    <div id="layout-wrapper">
      <Header />
      <Navbar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="section-heading">
              <h2>
                <b>VENDOR LIST</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="product-list-outer customer-list-outer">
                  <div className="add-product-btn text-center">
                    <Link to={"/vendor-add"} className="btn btn-primary">
                      Add Vendor
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
export default Vendor;
