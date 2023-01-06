import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Navbar from "./Navbar";
import { Editor } from "@tinymce/tinymce-react";
import * as myConstList from "./BaseUrl";
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

function ProductAdd(props) {
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [attrData, setAttrData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [searchHDN, setSearchHDN] = useState("");
  const [tax, setTax] = useState("");
  const [imgCollection, setImgCollection] = useState([]);
  const [image, setImage] = useState([]);
  const [formValues, setFormValues] = useState([{ aName: "", aValue: "" }]);
  const [inventoryValues, setInventoryValues] = useState([
    {
      material_type: "",
      material_quantity: "",
      material_id: "",
      material_available_quantity: "",
    },
  ]);
  // { itemType: "", itemName: "", itemQuantity: "" },
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [productDefination, setProductDefination] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("");
  const [productType, setProductType] = useState("");
  const [gstData, setGstData] = useState([]);
  const [avaliableQty, setAvaliableQty] = useState("");
  const [isMaterialUse, setIsMaterialUse] = useState(false);
  const [salePrice, setSalePrice] = useState("");

  useEffect(() => {
    categoryData();
    attributeData();
    // subCategoryData();
    getMaterialData();
    GetgstData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GetgstData = () => {
    axios.post(baseUrl + "/frontapi/gst-data", gstData).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        setGstData(resp.data);
      }
    });
  };

  const handleChangeDesc = (e) => {
    let { value } = e.target;
    setDescription(value);
  };
  const handleChangeLowStock = (e) => {
    let { value } = e.target;
    setLowStockThreshold(value);
  };
  const handleChange = async (event, editor) => {
    let fieldValue = event.target.value;
    let fieldName = event.target.name;

    if (fieldName === "productName") {
      setProductName(fieldValue);
    } else if (fieldName === "price") {
      setPrice(fieldValue);
    } else if (fieldName === "hsnCode") {
      setHsnCode(fieldValue);
    } else if (fieldName === "searchHDN") {
      setSearchHDN(fieldValue);
    } else if (fieldName === "tax") {
      setTax(fieldValue);
    } else if (fieldName === "avaliableQty") {
      setAvaliableQty(fieldValue);
    } else if (fieldName === "salePrice") {
      setSalePrice(fieldValue);
    }
  };

  const handleOnBlur = async (event) => {
    let fieldValue = event.target.value;
    let fieldName = event.target.name;

    if (fieldName === "productName") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("Product Name required");
        return false;
      }
    }
    if (fieldName === "price") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("Price required");
        return false;
      }
    }
    if (fieldName === "hsnCode") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("HSN code required");
        return false;
      }
    }
    if (fieldName === "searchHDN") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("Dearch HDN required");
        return false;
      }
    }
    if (fieldName === "tax") {
      if (!fieldValue) {
        toast.dismiss();
        toast.error("TAX required");
        return false;
      }
    }
  };

  const subCategoryHtml = () => {
    const html = [];

    subCatData.map((value, i) => {
      return html.push(<option value={value.id}>{value.name}</option>);
    });
    return html;
  };

  const categoryHtml = () => {
    const categoryhtml = [];

    catData.map((value, i) => {
      return categoryhtml.push(<option value={value.id}>{value.name}</option>);
    });
    return categoryhtml;
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

  const attributeHtml = () => {
    const attributeHtml = [];
    attrData.map(function (value, i) {
      return attributeHtml.push(<option value={value.id}>{value.name}</option>);
    });
    return attributeHtml;
  };

  const materialHtml = () => {
    const materialHtml = [];
    materialData.map(function (value, i) {
      return materialHtml.push(<option value={value.name}>{value.name}</option>);
    });
    return materialHtml;
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

  const handleSubmit = async (event) => {
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
      var aValue = element.aValue;
      if (!aValue) {
        toast.error("Attribute description is require");
        return false;
      }
    }
    if (imgCollection.length === 0) {
      toast.error("Please add at least 1 image");
      return false;
    }
    for (const key of Object.keys(imgCollection)) {
      formData.append("imgCollection", imgCollection[key]);
    }
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("salePrice", salePrice);
    formData.append("hsnCode", hsnCode);
    formData.append("searchHDN", searchHDN);
    formData.append("tax", tax);
    formData.append("categoryId", categoryId);
    formData.append("subCategoryId", subCategoryId);
    formData.append("avaliableQty", avaliableQty);
    formData.append("atribute", JSON.stringify(formValues));
    formData.append("materials", JSON.stringify(inventoryValues));
    formData.append("prod_def", productDefination);
    formData.append("prod_type", productType);
    formData.append("lowStockThreshold", lowStockThreshold);

    axios.post(baseUrl + "/frontapi/product-add", formData).then((res) => {
      var resp = res.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status === true) {
        toast.success("Product Added Successfully");
        setTimeout(function () {
          window.location = "/products";
        }, 3000);
        return false;
      }
    });
  };

  let handleChangeAttr = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let handleChangeMaturial = (i, e) => {
    let newFormValues = [...inventoryValues];
    const valv = newFormValues[i];
    valv[e.target.name] = e.target.value;

    if (valv.material_type != undefined) {
      const data = {
        byName: "yes",
        materialName: valv.material_type,
      };

      axios.post(baseUrl + "/frontapi/material-data-raw", data).then((res) => {
        var resp = res.data;

        if (resp.status === true) {
          valv.material_available_quantity = resp.data[0].avaliable_qty;
          valv.material_id = resp.data[0].id;
        }
      });
    }

    setInventoryValues(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([...formValues, { aName: "", aValue: "" }]);
  };

  let addFormFieldsMaturials = () => {
    setInventoryValues([
      ...inventoryValues,
      // { itemType: "", itemName: "", itemQuantity: "" },
      {},
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };
  let removeFormFieldsMaturial = (i) => {
    let newFormValues = [...inventoryValues];
    newFormValues.splice(i, 1);
    setInventoryValues(newFormValues);
  };

  const onFileChange = async (event) => {
    let ImagesArray = Object.entries(event.target.files).map((e) =>
      URL.createObjectURL(e[1])
    );
    setImage([...image, ...ImagesArray]);
    setImgCollection(event.target.files);
  };

  const showImages = () => {
    const html = [];

    image.map((element, index) => {
      if (element) {
        return html.push(
          <div className="imageSize" key={element}>
            <img className="uploaded-images" src={element} alt="" />
            <span
              className="text-danger"
              style={{ cursour: "pointer" }}
              onClick={() => removeItem(index)}
            >
              X
            </span>
          </div>
        );
      }
    });
    return html;
  };

  const handleChangeCategory = async (event) => {
    let { name, value } = event.target;
    if (name === "categoryId") {
      setCategoryId(value);
      subCategoryData(value);
    }
    if (name === "subCategoryId") {
      setSubCategoryId(value);
    }
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

  const removeItem = (element) => {
    const s = image.filter((item, index) => index !== element);
    setImage(s);
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
                        <label>
                          Product Image (Select Multiple Photos At Once)
                        </label>
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
                      </div>

                      <div id="uploadedImages">{showImages()}</div>
                      <div className="form-group">
                        <label>Product Name</label>
                        <input
                          type="text"
                          name="productName"
                          placeholder=""
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleOnBlur}
                        />
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
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
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Sub Category Name</label>
                          <select
                            className="form-control"
                            name="subCategoryId"
                            onChange={handleChangeCategory}
                          >
                            <option>Please select</option>
                            {subCategoryHtml()}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>DESC</label>
                        <textarea
                          placeholder="Enter Description"
                          className="form-control"
                          name="description"
                          onChange={handleChangeDesc}
                          value={description}
                        ></textarea>
                        {/* <Editor
                          apiKey={tinyMceApiKey}
                          name="description"
                          initialValue={""}
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
                            placeholder=""
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                          />
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-12">
                        <div className="form-group">
                          <label>Sale Price</label>
                          <input
                            type="number"
                            name="salePrice"
                            placeholder=""
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
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleOnBlur}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>TAX</label>
                        <select
                          className="form-control"
                          name="tax"
                          onChange={handleChange}
                          value={tax}
                        >
                          <option>Select Tax</option>
                          {gstData.map((item, i) => {
                            return <option value={item.gst}>{item.gst}</option>;
                          })}
                        </select>
                      </div>

                      {formValues.map((element, index) => (
                        <div className="row align-items-center" key={index}>
                          <div className="col-md-5 col-12 order-1">
                            <div className="form-group">
                              <label>ATTRIBUTE NAME</label>

                              <select
                                className="form-control"
                                name="aName"
                                value={element.aName || ""}
                                onChange={(e) => handleChangeAttr(index, e)}
                              >
                                <option>Please select</option>
                                {attributeHtml()}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-5 col-12 order-2">
                            <div className="form-group">
                              <label>ATTRIBUTE DESC</label>
                              <input
                                type="text"
                                name="aValue"
                                placeholder=""
                                className="form-control"
                                value={element.aValue || ""}
                                onChange={(e) => handleChangeAttr(index, e)}
                              />
                            </div>
                          </div>
                          <div className="col-md-2 col-12 order-2 add-row">
                            <a
                              className="add-btn add"
                              href="#!"
                              onClick={() => addFormFields()}
                            >
                              +
                            </a>
                            {index ? (
                              <a
                                className="add-btn add"
                                href="#!"
                                onClick={() => removeFormFields(index)}
                              >
                                -
                              </a>
                            ) : null}
                          </div>
                        </div>
                      ))}
                      {isMaterialUse === true && (
                        <>
                          {inventoryValues.map((element, index) => (
                            <div className="row align-items-center" key={index}>
                              <div className="col-md-5 col-12 order-1">
                                <div className="form-group">
                                  <label>RAW MATERIAL REQUIRED</label>
                                  <select
                                    className="form-control"
                                    name="material_type"
                                    onChange={(e) =>
                                      handleChangeMaturial(index, e)
                                    }
                                    value={element.material_type || ""}
                                  >
                                    <option value="">Please select</option>
                                    {materialHtml()}
                                  </select>
                                </div>
                              </div>
                              <div className="col-md-5 col-12 order-1">
                                <div className="form-group">
                                  <label>RAW MATERIAL QUANTITY REQUIRED</label>
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
                              {/* <div className="col-md-3 col-12 order-1">
                                <div className="form-group">
                                  <label>MATERIAL NAME</label>
                                  <input
                                    type="text"
                                    name="itemName"
                                    placeholder=""
                                    className="form-control"
                                    value={element.itemName || ""}
                                    onChange={(e) =>
                                      handleChangeMaturial(index, e)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-md-3 col-12 order-2">
                                <div className="form-group">
                                  <label>MATERIAL QUANTITY</label>
                                  <input
                                    type="text"
                                    name="itemQuantity"
                                    placeholder=""
                                    className="form-control"
                                    value={element.itemQuantity || ""}
                                    onChange={(e) =>
                                      handleChangeMaturial(index, e)
                                    }
                                  />
                                </div>
                              </div> */}
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
                      onClick={() => (window.location.href = "/products")}
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
export default ProductAdd;
