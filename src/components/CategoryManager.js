import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDatatable from "@mkikets/react-datatable";
import Header from "./Header";
import Navbar from "./Navbar";
import * as myConstList from "./BaseUrl";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const baseUrl = myConstList.baseUrl;

function CategoryManager(props) {
  const [record, setRecord] = useState([]);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    CategoryManagerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshed]);

  const columns = [
    {
      key: "Sr No.",
      text: "Sr No.",
      className: "cust_id",
      align: "left",
      sortable: true,
      cell: (row, index) => index + 1,
    },
    {
      key: "name",
      text: "Category Manager Name",
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
      key: "cName",
      text: "Category",
      className: "detail",
      align: "left",
      sortable: true,
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
            <Link to={"/category-manager-edit/" + record.id}>
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

  const CategoryManagerData = () => {
    axios
      .post(baseUrl + "/frontapi/category-manager-data", CategoryManagerData)
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
    let params = {
      id: id,
    };
    axios
      .post(baseUrl + "/frontapi/category-manager-delete", params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          toast.success("Category Manager Deleted Successfully");
          setRefreshed(true);
        }
      });
  };

  // const dataHtml = () => {
  //   const html = [];
  //   data.map(function (value, i) {
  //     return html.push(
  //       <tr>
  //         <td> {i + 1} </td>
  //         <td> {value.name} </td>
  //         <td> {value.email} </td>
  //         <td> {value.mobile_no} </td>
  //         <td> {value.cName} </td>
  //         <td className="action">
  //           <Link to={"/category-manager-edit/" + value.id}>
  //             <img
  //               src="assets/images/edit-icon.png"
  //               alt=""
  //               className="img-fluid"
  //             />
  //           </Link>
  //           <button onClick={() => deleted(value.id)}>
  //             <img
  //               src="assets/images/delete-icon.png"
  //               alt=""
  //               className="img-fluid"
  //             />
  //           </button>
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
                <b>Category Manager LIST</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="product-list-outer customer-list-outer">
                  {/* <table className="w-100 border">
                    <tbody>
                      <tr>
                        <th>S.No.</th>
                        <th>Category Manager Name</th>
                        <th>Email</th>
                        <th>Number</th>
                        <th>Category</th>
                        <th>Action</th>
                      </tr>
                      {dataHtml()}
                    </tbody>
                  </table> */}
                  <div className="add-product-btn text-center">
                    <Link to={"/add-category-manager"} className="btn btn-primary">
                      Add Category Manager
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
        <ToastContainer limit={1} />
        <footer refreshed={refreshed} setRefreshed={setRefreshed}></footer>
      </div>
    </div>
  );
}
export default CategoryManager;
