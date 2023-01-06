import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import ReactDatatable from "@mkikets/react-datatable";
import * as myConstList from "./BaseUrl";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const baseUrl = myConstList.baseUrl;

function Attribute(props) {
  const [record, setRecord] = useState([]);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    attributeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshed]);

  const columns = [
    {
      key: "Sr No.",
      text: "Sr No.",
      className: "srno",
      align: "left",
      sortable: true,
      cell: (row, index) => index + 1,
    },
    {
      key: "name",
      text: "Name",
      className: "name",
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
            <Link to={"/attribute-edit/" + record.id}>
              <img
                src="assets/images/edit-icon.png"
                alt=""
                className="img-fluid"
              />
            </Link>{" "}
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

  const attributeData = () => {
    axios
      .post(baseUrl + "/frontapi/attribute-data", attributeData)
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
    axios.post(baseUrl + "/frontapi/attribute-delete", params).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        toast.success("Attribute Deleted Successfully");
        setRefreshed(true);
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
  //         <td className="action">
  //           <Link to={"/attribute-edit/" + value.id}>
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
                <b>Attribute LIST</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="product-list-outer customer-list-outer">
                  {/* <table className="w-100 border">
                    <tbody>
                      <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                      {dataHtml()}
                    </tbody>
                  </table> */}
                  <div className="add-product-btn text-center">
                    <Link to={"/attribute-add"} className="btn btn-primary">
                      Add Attribute
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
export default Attribute;
