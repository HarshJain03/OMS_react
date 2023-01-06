import React, { Fragment, useEffect, useState } from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import ReactDatatable from "@mkikets/react-datatable";
import axios from "axios";
import { baseUrl } from "./BaseUrl";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const SubCategory = () => {
  const [record, setRecord] = useState([]);

  useEffect(() => {
    getSubCategoryData();
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
      key: "name",
      text: "Sub Category Name",
      className: "cust_name",
      align: "left",
      sortable: true,
    },
    {
      key: "short_name",
      text: "Short Name",
      className: "id",
      align: "left",
      sortable: true,
    },

    {
      key: "cat_name",
      text: "Category Name",
      className: "price",
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
            <Link to={"/sub-category-edit/" + record.id}>
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

  const getSubCategoryData = () => {
    axios.post(baseUrl + "/frontapi/sub-category-data").then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        setRecord(resp.data);
      }
    });
  };

  // const dataHtml = () => {
  //   const html = [];
  //   data.map((value, i) => {
  //     return html.push(
  //       <tr>
  //         <td> {i + 1} </td>
  //         <td> {value.name} </td>
  //         <td> {value.short_name} </td>
  //         <td> {value.cat_name} </td>
  //         <td className="action">
  //           <Link to={"/sub-category-edit/" + value.id}>
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

  const deleted = (id) => {
    let data = {
      id: id,
    };
    axios.post(baseUrl + "/frontapi/remove-sub-category", data).then((res) => {
      var resp = res.data;
      if (resp.status === true) {
        toast.success(resp.message);
        getSubCategoryData();
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
                <b>Sub Category LIST</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="product-list-outer customer-list-outer">
                  {/* <table className="w-100 border">
                    <tbody>
                      <tr>
                        <th>S.No.</th>
                        <th>Sub Category Name</th>
                        <th>Short Name</th>
                        <th>Category Name</th>
                        <th>Action</th>
                      </tr>
                      {dataHtml()}
                    </tbody>
                  </table> */}
                  <div className="add-product-btn text-center">
                    <Link to={"/sub-category-add"} className="btn btn-primary">
                      Add Sub Category
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
        <Footer />
      </div>
    </div>
  );
};

export default SubCategory;
