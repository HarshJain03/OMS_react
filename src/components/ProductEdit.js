import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import axios from "axios";
import {
  isMobile,
  isDesktop,
  isAndroid,
  isIOS,
  browserName,
  browserVersion,
  osName,
  BrowserTypes,
  osVersion,
} from "react-device-detect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Header from "./Header";
import jwt_decode from "jwt-decode";
import Header from "./Header";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Editor } from "@tinymce/tinymce-react";
import * as myConstList from "./BaseUrl";
import { useParams } from "react-router-dom";
// import { create } from "../../../../alpha/models/ibotModel";
const baseUrl = myConstList.baseUrl;

const tinyMceApiKey = "xyivgeik8gvhgy1y1nars7qe2fa2yf22zdjrt0k2n7anmbna";
const tinyMceEditorOptions = {
  height: 300,
  menubar: false,
  plugins: [
    "advlist lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code wordcount",
  ],
  toolbar:
    "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code",
};

function ProductEdit(props) {
  const [productName, setProductName] = useState("");
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [data, setData] = useState([]);
  const [id, setId] = useState(useParams().id);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [searchHDN, setSearchHDN] = useState("");
  const [tax, setTax] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [attrData, setAttrData] = useState([]);
  const [availableQty, setAvailableQty] = useState("");

  // const [name, setname] = useState([]);
  const [productDefination, setProductDefination] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [productType, setProductType] = useState("");
  const [invalidImage, setInvalidImage] = useState([]);
  const [imgCollection, setImgCollection] = useState([]);
  const [imgData, setImgData] = useState([]);
  const [image, setImage] = useState(null);
  const [inventoryValues, setInventoryValues] = useState([
    {
      mType: "",
      mQty: "",
    },
  ]);
  const [isMaterialUse, setIsMaterialUse] = useState(false);
  const [subCatId, setSubCatId] = useState("");
  const [materialData, setMaterialData] = useState([]);

  const [value, setvalue] = useState([]);
  const [formValues, setFormValues] = useState([{ name: "", value: "" }]);

  const Params = useParams();

  useEffect(() => {
    productData();
    categoryData();
    getMaterialData();
    attributeData();
  }, []);

  const productData = async () => {
    await axios
      .post(baseUrl + "/frontapi/product-single", Params)
      .then((resp) => {
        var resp = resp.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status == true) {
          setData(resp.data.sqlRun);
          if (resp.data.sqlRun2.length > 0) {
            setFormValues(resp.data.sqlRun2);
          } else {
            setFormValues(resp.data.sqlRun2);
          }
          setId(resp.data.sqlRun[0].id);
          setProductName(resp.data.sqlRun[0].name);
          setDescription(resp.data.sqlRun[0].description);
          setPrice(resp.data.sqlRun[0].price);
          setHsnCode(resp.data.sqlRun[0].hsnCode);
          setSearchHDN(resp.data.sqlRun[0].searchHDN);
          setTax(resp.data.sqlRun[0].tax);
          setImage(resp.data.sqlRun[0].image);
          setCategoryId(resp.data.sqlRun[0].category_id);
          setLowStockThreshold(resp.data.sqlRun[0].lowStockThreshold);
          setSalePrice(resp.data.sqlRun[0].sale_price);
          setProductType(resp.data.sqlRun[0].prod_type);
          setProductDefination(resp.data.sqlRun[0].prod_def);
          setSubCatId(resp.data.sqlRun[0].sub_categories_id);
          setAvailableQty(resp.data.sqlRun[0].avaliable_qty)

          if (resp.data.sqlRun3.length > 0) {
            setInventoryValues(resp.data.sqlRun3);
          } else {
            setInventoryValues(resp.data.sqlRun3);
          }

          if (resp.data.sqlRun[0].prod_type === "finished") {
            setIsMaterialUse(true);
          }

          subCategoryData(resp.data.sqlRun[0].category_id);

          const html = [];
          var oldImages = resp.data.sqlRun[0].image;
          var uploadIMages = oldImages.split(",");

          if (uploadIMages) {
            uploadIMages.forEach((element, index) => {
              if (element) {
                html.push(
                  <div className="col-md-3 col-12 imageSize">
                    <img
                      className="uploaded-images"
                      src={baseUrl + "/static" + element}
                    />
                  </div>
                );
              }
            });
            setImage(html);
          }
        }
      });
  };

  const getMaterialData = () => {
    axios
      .post(baseUrl + "/frontapi/material-data-raw", getMaterialData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setMaterialData(resp.data);
        }
      });
  };

  const handleChangeDesc = (e) => {
    let value = e.target.value;
    setDescription(value);
  };

  const handleChange = async (event) => {
    let fieldValue = event.target.value;
    let fieldName = event.target.name;

    if (fieldName == "productName") {
      setProductName(fieldValue);
    }
    if (fieldName == "salePrice") {
      setSalePrice(fieldValue);
    }
    if (fieldName == "price") {
      setPrice(fieldValue);
    }
    if (fieldName == "hsnCode") {
      setHsnCode(fieldValue);
    }
    if (fieldName == "searchHDN") {
      setSearchHDN(fieldValue);
    }
    if (fieldName == "tax") {
      setTax(fieldValue);
    }
    if (fieldName === "categoryId") {
      setId(fieldValue);
      setCategoryId(fieldValue);
      subCategoryData(fieldValue);
    }
    if (fieldName === "subCategoryId") {
      setSubCatId(fieldValue);
    }
    if (fieldName === "avaliableQty") {
      setAvailableQty(fieldValue);
    }
  };

  const handleOnBlur = async (event) => {
    let fieldValue = event.target.value;
    let fieldName = event.target.name;

    if (fieldName == "productName") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("Product Name required");
        return false;
      }
    }
    if (fieldName == "description") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("Description required");
        return false;
      }
    }
    if (fieldName == "price") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("Price required");
        return false;
      }
    }
    if (fieldName == "hsnCode") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("HSN code required");
        return false;
      }
    }
    if (fieldName == "searchHDN") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("Dearch HDN required");
        return false;
      }
    }
    if (fieldName == "tax") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("TAX required");
        return false;
      }
    }
  };

  const subCategoryData = (id) => {
    const data = {
      id: id,
    };
    axios
      .post(baseUrl + "/frontapi/sub-category-by-catid", data)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          // toast.error(resp.message);
          setSubCatData([]);
          return false;
        }
        if (resp.status === true) {
          setSubCatData(resp.data);
        }
      });
  };

  const categoryData = () => {
    axios
      .post(baseUrl + "/frontapi/category-data", categoryData)
      .then((res) => {
        var resp = res.data;
        if (resp.status === false) {
          toast.dismiss();
          // toast.error(resp.message);
          return;
        }
        if (resp.status === true) {
          setCatData(resp.data);
        }
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
          setAttrData(resp.data);
        }
      });
  };

  // const subCategoryHtml = () => {
  //   const html = [];

  //   subCatData.map((value, i) => {
  //     return html.push(<option value={value.id}>{value.name}</option>);
  //   });
  //   return html;
  // };

  // const categoryHtml = () => {
  //   const categoryhtml = [];

  //   catData.map((value, i) => {
  //     return categoryhtml.push(<option value={value.id}>{value.name}</option>);
  //   });
  //   return categoryhtml;
  // };

  // const handleChangeCategory = async (event) => {
  //   let { name, value } = event.target;
  //   if (name === "categoryId") {
  //     setCategoryId(value);
  //     subCategoryData(value);
  //   }
  //   if (name === "subCategoryId") {
  //     setSubCategoryId(value);
  //   }
  // };

  const handleSubmit = async (event) => {
    if (event.key === "Enter") {
    }

    event.preventDefault();

    var formData = new FormData();
    if (isMaterialUse === true) {
      for (let i = 0; i < inventoryValues.length; i++) {
        const element = inventoryValues[i];
        var itemName = element.material_name;
        var itemType = element.material_type;
        var itemQuantity = element.material_quantity;
        // if (!itemName) {
        //   toast.error("Material name is require");
        //   return false;
        // }
        if (!itemType) {
          toast.error("Material type is require");
          return false;
        }
        if (!itemQuantity) {
          toast.error("Material quantity is require");
          return false;
        }
      }
    }
    for (let i = 0; i < formValues.length; i++) {
      const element = formValues[i];
      var aName = element.name;
      var aValue = element.value;
      if (!aName) {
        toast.error("Attribute name is require");
        return false;
      }
      if (!aValue) {
        toast.error("Attribute value is require");
        return false;
      }
    }
    // if (imgCollection.length === 0) {
    //   toast.error("Please add at least 1 image");
    //   return false;
    // }

    for (const key of Object.keys(imgCollection)) {
      formData.append("imgCollection", imgCollection[key]);
    }
    formData.append("id", id);
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("hsnCode", hsnCode);
    formData.append("searchHDN", searchHDN);
    formData.append("tax", tax);
    formData.append("atribute", JSON.stringify(formValues));
    formData.append("materials", JSON.stringify(inventoryValues));
    formData.append("avaliableQty", availableQty);

    /*  let productData = {
            productName: productName,
            description: description,
            price: price,
            hsnCode: hsnCode,
            searchHDN: searchHDN,
            tax: tax,
            atribute: formValues,
            imgCollection: imgCollection
        }; */

    axios.post(baseUrl + "/frontapi/product-edit", formData).then((resp) => {
      var resp = resp.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status == true) {
        toast.success("Product Updated Successfully");
        setTimeout(
          function () {
            window.location = "/products";
          }.bind(this),
          3000
        );
        return false;
      }
    });
  };

  let handleChangeAttr = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      // { name: "", value: "" }
      {},
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const onFileChange = async (event) => {
    const html = [];
    setImgCollection(event.target.files);
    var uploadIMages = event.target.files;
    if (uploadIMages) {
      uploadIMages.forEach((element, index) => {
        if (element) {
          setImage(URL.createObjectURL(element));
          html.push(
            <div className="imageSize">
              <img
                className="uploaded-images"
                src={URL.createObjectURL(element)}
              />
              <span className="text-danger" onClick={() => removeItem(index)}>
                X
              </span>
            </div>
          );
        }
      });
      setImage(html);
    }
  };

  const attributeHtml = () => {
    const attributeHtml = [];
    attrData.map(function (value, i) {
      return attributeHtml.push(<option value={value.id}>{value.name}</option>);
    });
    return attributeHtml;
  };

  const removeItem = (index) => {
    imgCollection.pop(index);
  };

  const materialHtml = () => {
    const materialHtml = [];
    // materialData.map(function (value, i) {
    //   return materialHtml.push(
    //     <option value={value.name}>{value.name}</option>
    //   );
    // });
    return materialHtml;
  };

  let handleChangeMaturial = (i, e) => {
    let newFormValues = [...inventoryValues];
    newFormValues[i][e.target.name] = e.target.value;
    setInventoryValues(newFormValues);
  };
  let addFormFieldsMaturials = () => {
    setInventoryValues([
      ...inventoryValues,
      // { itemType: "", itemName: "", itemQuantity: "" },
      {},
    ]);
  };
  let removeFormFieldsMaturial = (i) => {
    let newFormValues = [...inventoryValues];
    newFormValues.splice(i, 1);
    setInventoryValues(newFormValues);
  };

  const handleChangeProductDefination = async (event) => {
    let eventValue = event.target.value;
    if (!eventValue) {
      toast.error("Please select product defination");
      setProductDefination(eventValue);
      return false;
    }
    toast.dismiss();
    setProductDefination(eventValue);
  };

  const handleChangeLowStock = (e) => {
    let { value } = e.target;
    setLowStockThreshold(value);
  };

  const handleChangeProductType = async (event) => {
    let eventValue = event.target.value;
    if (eventValue === "finished") {
      setProductType(eventValue);
      setIsMaterialUse(true);
      return false;
    }
    if (eventValue === "raw") {
      setProductType(eventValue);
      setIsMaterialUse(false);
      return false;
    }
    setIsMaterialUse(false);
    setProductType(eventValue);
  };

  return (
    <div id="layout-wrapper">
      <Header />
      <Navbar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="section-heading">
              <h2 className="text-black">
                <b>ADD PRODUCT</b>
              </h2>
            </div>

            <div className="row">
              <div className="col-xxl-5">
                <div className="add-product-outer">
                  <form enctype="multipart/form-data">
                    <div className="row">
                      <div className="form-group mb-0">
                        <label>Product Image</label>
                      </div>
                      <div className="form-group file-upload position-relative">
                        <div className="">
                          <input
                            className="profile_input"
                            type="file"
                            name="bunner"
                            multiple
                            onChange={onFileChange}
                          />
                        </div>
                        <span className="text-danger">{invalidImage}</span>
                      </div>

                      <div id="uploadedImages">{image}</div>

                      <div className="form-group">
                        <label>Product Name</label>
                        <input
                          type="text"
                          name="productName"
                          placeholder=""
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleOnBlur}
                          value={productName}
                        />
                      </div>

                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Category Name</label>
                          <select
                            className="form-control"
                            onChange={handleChange}
                            name="categoryId"
                            value={categoryId}
                          >
                            <option value="">Select Category</option>
                            {catData.map((item, i) => {
                              return (
                                <option value={item.id}>{item.name}</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {/* <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Category Name</label>
                          <select
                            className="form-control"
                            name="categoryId"
                            onChange={handleChangeCategory}
                          >
                            <option>Please select</option>
                            {categoryHtml()}
                          </select>
                        </div>
                      </div> */}
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Sub Category Name</label>
                          <select
                            className="form-control"
                            onChange={handleChange}
                            name="subCategoryId"
                            value={subCatId}
                          >
                            <option value="">Select Category</option>
                            {subCatData.map((item, i) => {
                              return (
                                <option value={item.id}>{item.name}</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>DESC</label>
                        <textarea
                          placeholder="Enter Description"
                          className="form-control"
                          name="description"
                          value={description}
                          onChange={handleChangeDesc}
                        ></textarea>
                        {/* <Editor
                          apiKey={tinyMceApiKey}
                          name="description"
                          initialValue={description}
                          init={tinyMceEditorOptions}
                          onEditorChange={(content, editor) => {
                            handleChangeDesc(content, editor);
                          }}
                        /> */}
                      </div>

                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Product Defination</label>
                          <select
                            className="form-control"
                            name="productDefination"
                            onChange={handleChangeProductDefination}
                            value={productDefination}
                          >
                            <option value="">Please select</option>
                            <option value="inventory">Inventory</option>
                            <option value="make_to_order">Make to Order</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Low Stock Threshold</label>
                        <input
                          type={"text"}
                          className="form-control"
                          onChange={handleChangeLowStock}
                          name="lowStock"
                          value={lowStockThreshold}
                        />
                        {/* <Editor
                          apiKey={tinyMceApiKey}
                          name="lowStock"
                          initialValue={""}
                          init={tinyMceEditorOptions}
                          onEditorChange={(content, editor) => {
                            handleChangeLowStock(content, editor);
                          }}
                        /> */}
                      </div>

                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Product Type</label>
                          <select
                            className="form-control"
                            name="productType"
                            onChange={handleChangeProductType}
                            value={productType}
                          >
                            <option value="">Please select</option>
                            <option value="raw">Raw</option>
                            <option value="finished">Finished</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Product Price</label>
                          <input
                            type="text"
                            name="price"
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                            value={price}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Sale Price</label>
                          <input
                            type="number"
                            name="salePrice"
                            value={salePrice}
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                          />
                        </div>
                      </div>

                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>HSN Code</label>
                          <input
                            type="text"
                            name="hsnCode"
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                            value={hsnCode}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Search HSN</label>
                          <input
                            type="text"
                            name="searchHDN"
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                            value={searchHDN}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Available Quantity</label>
                          <input
                            type="text"
                            name="avaliableQty"
                            placeholder=""
                            value={availableQty}
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>TAX</label>
                        <input
                          type="number"
                          name="tax"
                          placeholder=""
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleOnBlur}
                          value={tax}
                        />
                      </div>
                      {formValues.map((element, index) => (
                        <div class="row">
                          <div className="col-md-5 col-12 order-1">
                            <div class="form-group">
                              <label>Name</label>
                              <select
                                className="form-control"
                                name="name"
                                onChange={(e) => handleChangeAttr(index, e)}
                                value={element.name || ""}
                              >
                                <option>Please select</option>
                                {attributeHtml()}
                              </select>

                              {/* <input
                                type="text"
                                name="name"
                                placeholder=""
                                class="form-control"
                                value={element.name || ""}
                                onChange={(e) => handleChangeAttr(index, e)}
                              /> */}
                            </div>
                          </div>
                          <div className="col-md-5 col-12 order-1">
                            <div class="form-group">
                              <label>Value</label>
                              <input
                                type="text"
                                name="value"
                                placeholder=""
                                class="form-control"
                                value={element.value || ""}
                                onChange={(e) => handleChangeAttr(index, e)}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-12 order-2 add-row">
                            {index ? (
                              <a
                                href="javascript:void(0)"
                                className="add-btn add"
                                onClick={() => removeFormFields(index)}
                              >
                                -
                              </a>
                            ) : null}

                            <a
                              className="add-btn add"
                              href="javascript:void(0)"
                              onClick={() => addFormFields()}
                            >
                              +
                            </a>
                          </div>
                        </div>
                      ))}
                      {isMaterialUse === true && (
                        <>
                          {inventoryValues.map((element, index) => (
                            <div className="row align-items-center" key={index}>
                              <div className="col-md-6 col-12 order-1">
                                <div className="form-group">
                                  <label>MATERIAL TYPE</label>
                                  <select
                                    className="form-control"
                                    name="material_type"
                                    onChange={(e) =>
                                      handleChangeMaturial(index, e)
                                    }
                                    value={element.material_type || ""}
                                  >
                                    <option value="">Please select</option>

                                    {materialData.map((item, i) => {
                                      return (
                                        <option value={element.materialType}>
                                          {item.name}
                                        </option>
                                      );
                                    })}
                                    {/* {materialHtml()} */}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-6 col-12 order-1">
                                <div className="form-group">
                                  <label>MATERIAL QUANTITY</label>
                                  <input
                                    className="form-control"
                                    name="material_quantity"
                                    onChange={(e) =>
                                      handleChangeMaturial(index, e)
                                    }
                                    value={element.material_quantity || ""}
                                  />
                                </div>
                              </div>

                              <div className="col-md-2 col-12 order-2 add-row">
                                <a
                                  className="add-btn add"
                                  href="#!"
                                  onClick={() => addFormFieldsMaturials()}
                                >
                                  +
                                </a>
                                {index ? (
                                  <a
                                    className="add-btn add"
                                    href="#!"
                                    onClick={() =>
                                      removeFormFieldsMaturial(index)
                                    }
                                  >
                                    -
                                  </a>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </form>
                  <div className="btn-group">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="btn btn-primary"
                    >
                      {" "}
                      Save{" "}
                    </button>
                    <br />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        window.location.href = "/products";
                      }}
                    >
                      {" "}
                      Cancel{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer limit={1} />
    </div>
  );
}
export default ProductEdit;
