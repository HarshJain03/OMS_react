import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactDatatable from "@mkikets/react-datatable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import * as myConstList from "./BaseUrl";
const baseUrl = myConstList.baseUrl;

const VendorOrderCompleted = () => {
  const [record, setRecord] = useState([]);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    productData();
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
      key: "order_id",
      text: "Order ID",
      className: "order_id",
      align: "left",
      sortable: true,
      cell: (record) => (
        <Fragment>
          {record.order_id === null ? "N/A" : record.order_id}
        </Fragment>
      ),
    },
    {
      key: "name",
      text: "Product Name",
      className: "name",
      align: "left",
      sortable: true,
    },
    {
      key: "price",
      text: "Amount",
      className: "Amount",
      align: "left",
      sortable: true,
    },
    {
      key: "detail",
      text: "Detail",
      className: "Detail",
      align: "left",
      sortable: true,
      cell: (record) => {
        return (
          <Fragment>
            <Link to={"/vendor-order-details/" + record.id}>
              <img src="assets/images/view-icon.png" alt="" class="img-fluid" />
            </Link>
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

  const productData = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    };
    let requestData = { status: 2, orderType: "vendor" };
    axios
      .post(baseUrl + "/frontapi/order-data", requestData, config)
      .then((resp) => {
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

  let orderStatusUpdate = async (order_id, status) => {
    let requestData = { orderId: order_id, status: status };

    await axios
      .post(baseUrl + "/frontapi/order-status-update", requestData)
      .then((resp) => {
        var resp = resp.data;
        console.log("resppp", resp.message);
        // console.log('baseUresprl', resp.token);
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          // setPasswordErr(resp.messagep);
          return;
        }
        if (resp.status == true) {
          toast.success(resp.message);
          setRefreshed(true);
        }
      });
  };

  return (
    <div id="layout-wrapper">
      <Header />
      <Navbar />
      <div class="main-content">
        <div class="page-content">
          <div class="container-fluid">
            <div class="section-heading">
              <h2 class="text-black">
                <b>VENDOR ORDERS COMPLETED</b>
              </h2>
            </div>
            <div class="row">
              <div class="col-xxl-5">
                <div class="product-list-outer customer-list-outer">
                  {/* <table class="w-100 border">
                    <tr>
                      <th>S.No.</th>
                      <th>Order Id</th>
                      <th>Customer Name</th>
                      
                      <th>Amount</th>
                      <th>Detail</th>
                     
                    </tr>
                    {dataHtml()}
                    
                  </table> */}

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
        <Footer refreshed={refreshed} setRefreshed={setRefreshed} />
      </div>
    </div>
  );
};

export default VendorOrderCompleted;
