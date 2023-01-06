import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as myConstList from "./BaseUrl";
import Header from "./Header";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import $ from "jquery";

const baseUrl = myConstList.baseUrl;

function ProductDetails(props) {
  const [aData, setAData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [searchHDN, setSearchHDN] = useState("");
  const [tax, setTax] = useState("");
  const [image, setImage] = useState(null);
  const Params = useParams();

  useEffect(() => {
    productData();
  }, []);

  const productData = async () => {
    await axios
      .post(baseUrl + "/frontapi/product-single", Params)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setAData(resp.data.sqlRun2);
          setId(resp.data.sqlRun[0].id);
          setName(resp.data.sqlRun[0].name);
          setDescription(resp.data.sqlRun[0].description);
          setPrice(resp.data.sqlRun[0].price);
          setHsnCode(resp.data.sqlRun[0].hsnCode);
          setSearchHDN(resp.data.sqlRun[0].searchHDN);
          setTax(resp.data.sqlRun[0].tax);
          setImage(resp.data.sqlRun[0].image);
        }
      });
  };

  const dataHtml = () => {
    console.log("dataaa", aData);
    const html = [];

    aData.map((value, i) => {
      return html.push(
        <div className="row">
          <div className="col-md-4 col-sm-6 col-12 more-padding border-right">
            <div className="person-detail">
              <p>
                <b>
                  {/* {value.name} : */}
                  {value.value}
                </b>
              </p>
            </div>
          </div>
        </div>
      );
    });
    return html;
  };

  const imageDataHtml = () => {
    const html = [];
    if (image) {
      let allImages = image.split(",");
      html.push(
        <div className="detail-left">
          <img
            id="singleImage"
            src={baseUrl + "/static" + allImages[0]}
            alt=""
            className="img-fluid"
          />
        </div>
      );
      allImages.map((value, i) => {
        return html.push(
          <div className="col-md-3">
            <div className="item-images">
              <a href="#!">
                <img
                  src={baseUrl + "/static" + value}
                  onClick={() => changeImage(baseUrl + "/static" + value)}
                  alt=""
                  className="img-fluid"
                />
              </a>
            </div>
          </div>
        );
      });
    }

    return html;
  };

  const changeImage = (image_link) => {
    $("#singleImage").attr("src", image_link);
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
                <b>PRODUCT DETAIL</b>
              </h2>
            </div>
            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer product-detail-outer">
                  <div className="row">
                    <div className="col-md-5 col-12">
                      <div className="row">{imageDataHtml()}</div>
                    </div>

                    <div className="col-md-7 col-12">
                      <div className="detail-right">
                        <h2>
                          <b>{name}</b>
                        </h2>
                        <p>
                          Product Id : <b>{id}</b>
                        </p>
                        <p>
                          HSN Code : <b>{hsnCode}</b>
                        </p>
                        <p>
                          Search HDN : <b>{searchHDN}</b>
                        </p>
                        <p>
                          Price : <b>INR {price}/-</b>
                        </p>
                        <p>
                          Tax : <b>{tax}%</b>
                        </p>
                        <p
                          dangerouslySetInnerHTML={{ __html: description }}
                        ></p>

                        <div className="col-12">
                          <div className="person-contact customer-detail">
                            <h5>
                              <b>Attributes</b>
                            </h5>

                            {dataHtml()}
                          </div>
                        </div>
                        <div className="btn-group align-items-start">
                          <a
                            href={"/product-edit/" + Params.id}
                            className="btn btn-primary"
                          >
                            Edit
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
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
export default ProductDetails;
