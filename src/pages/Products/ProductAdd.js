import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Rating from "@mui/material/Rating";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Icon } from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../api/api";
import { useParams } from "react-router-dom";
// import { htmlToMarkdown } from 'html-to-markdown';
import TurndownService from "turndown";
import Loading from "../../components/loading";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { normalizeFileName, convertToWords } from "../../utils/formart";
import { red } from "@mui/material/colors";

//breadcrumb code
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ProductAdd = ({ history }) => {
  const navigate = useNavigate();

  const reactQuillRef = useRef();

  const [fileExcel, setFileExcel] = useState(null);

  const [name, setName] = useState("");
  const [dataCategory, setdataCategory] = useState();
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const [depscription, setDepscription] = useState("");
  const [selectedCategoryOption, setSelectedCategoryOption] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [inputColor, setInputColor] = useState("");
  const [inputSize, setInputSize] = useState("");

  const [sizeValue, setSizeValue] = useState([]);
  const [colorValue, setColorValue] = useState([]);
  const [formFields, setFormFields] = useState({
    color: [],
    size: [],
    url: [],
    pathDep: [],
  });

  const [dataUser, setdataUser] = useState();

  const turndownService = new TurndownService();
  const url = "http://192.168.10.110:6969/v1";
  const UrlIMG = "http://192.168.10.110:6969";
  // const id = "661256cbb03b0c689798ad33";
  // const email = "account8@gmail.com";

  const data = localStorage.getItem("userData");
  const id = localStorage.getItem("_id");

  useEffect(() => {
    if (data) {
      setdataUser(JSON.parse(data));
    }
  }, [id]);

  const getDataCate = async () => {
    try {
      const responsive = await api.get(`${url}/categori/`);
      if (responsive.data.status === true) {
        setdataCategory(responsive.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getDataCate();
  }, []);

  const handleKeyColor = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputColor.trim() !== "") {
        const newColors = inputColor
          .split(",")
          .map((color) => color.trim())
          .filter((color) => color !== "");

        const uniqueColors = newColors.filter((i) => !colorValue.includes(i));

        setColorValue((prevColors) => [...prevColors, ...uniqueColors]);
        setInputColor("");
        setFormFields((prevFields) => ({
          ...prevFields,
          color: [...new Set([...prevFields.color, ...uniqueColors])],
        }));
      }
    }
  };

  const removeColor = (index) => {
    setColorValue((prevColors) => prevColors.filter((_, i) => i !== index));
    setFormFields((prevFields) => ({
      ...prevFields,
      color: prevFields.color.filter((_, i) => i !== index),
    }));
  };

  // size
  const handleKeySize = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputSize.trim() !== "") {
        const newSize = inputSize
          .split(",")
          .map((size) => size.trim())
          .filter((size) => size !== "");

        const uniqueSize = newSize.filter((i) => !sizeValue.includes(i));

        setSizeValue((prev) => [...prev, ...uniqueSize]);
        setFormFields((prevFields) => ({
          ...prevFields,
          size: [...new Set([...prevFields.size, ...uniqueSize])],
        }));
        setInputSize("");
      }
    }
  };

  // Hàm để xóa màu khỏi mảng colors
  const removeSize = (index) => {
    setSizeValue((prev) => prev.filter((_, i) => i !== index));
    setFormFields((prevFields) => ({
      ...prevFields,
      size: prevFields.size.filter((_, i) => i !== index),
    }));
  };
  const onChangeImages = (e) => {
    const files = Array.from(e.target.files);
    const newImagesWithRenamed = files.map((file) => {
      const renamedFile = new File([file], normalizeFileName(file.name), {
        type: file.type,
      });
      return renamedFile;
    });
    // console.log('New image name:',newImagesWithRenamed);
    const newImages = newImagesWithRenamed.filter(
      (file) => !images.some((image) => image.name === file.name)
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
    setFormFields((prevFields) => ({
      ...prevFields,
      url: [...prevFields.url, ...newImagesWithRenamed],
    }));
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFormFields((prevFields) => ({
      ...prevFields,
      url: formFields.url.filter((_, i) => i !== index),
    }));
  };

  const upfile = async () => {
    const formData = new FormData();
    // Thêm các file từ formFields.url vào FormData
    formFields.url.forEach((image) => {
      formData.append("files", image);
    });
    try {
      const response = await api.post(`${url}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.status;
    } catch (error) {
      console.error("Upload failed", error);
    }
  };
  const updateImg = async (idProduct) => {
    try {
      const response = await api.post(`${url}/imgshose`, {
        productId: idProduct,
        images: formFields.url.slice(1).map((image) => image.name),
      });
      return response.status;
    } catch (error) {
      console.error("Upload failed", error);
    }
  };
  // console.log("Upload",formFields)
  // console.log("formFields.url",formFields.url.slice(1).map((image) => image))

  const submitForm = async (e) => {
    e.preventDefault();
    if (name === "") {
      return window.alert("Please input name enter");
    }
    if (brand === "") {
      return window.alert("Please input brand enter");
    }
    if (quantity === 0) {
      return window.alert("Please input quantity enter");
    }
    // if (discount === 0) {
    //   return window.alert("Please input discount enter");
    // }
    // if (description === "") {
    //   return window.alert("Please input description enter");
    // }
    if (colorValue.length === 0) {
      return window.alert("Please input color enter");
    }
    if (images.length === 0) {
      return window.alert("Please input images enter");
    }
    if (sizeValue.length === 0) {
      return window.alert("Please input size enter");
    }
    if (selectedCategoryOption === "") {
      return window.alert("Please input dataCategory enter");
    }

    try {
      setIsLoading(true);
      const file = await upfile();

      const jsonData = {
        userId: dataUser.email,
        parentCategory: selectedCategoryOption,
        name: name,
        brand: brand,
        price: price,
        quantity: parseInt(quantity),
        discount: parseFloat(discount !== 0 ? discount : 0),
        color: formFields.color.filter((color) => color.trim() !== ""),
        description: depscription,
        size: formFields.size.filter((color) => color.trim() !== ""),
        imageUrl: formFields.url[0].name,
      };
      // turndownService.turndown(depscription)
      // console.log("jsonData", jsonData);
      console.log("depscription", depscription);
      const response = await api.post(`${url}/shose`, jsonData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.status === true) {
        // console.log("response", response.data.data._id);
        const img = await updateImg(response.data.data._id);
        // console.log("img", img);

        if (img === 200) {
          window.alert("Đã thêm sản phẩm thành công");
          navigate("/products");
        } else {
          window.alert("Error");
        }
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Cấu hình lỗi:", error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const submitFile = async (e) => {
    e.preventDefault();
    if (fileExcel) {
      const formData = new FormData();
      formData.append("excelFile", fileExcel);
      api
        .post(`${url}/shose/upload/${id}`, formData)
        .then((response) => {
          if (response.status === 200) {
            alert("Bạn đã cập nhật thành công!");
          } else {
            alert(`Đã xảy ra lỗi: ${response.data}`);
          }
        })
        .catch((error) => {
          console.error(error);
          alert("Đã xảy ra lỗi: " + error.message);
        });
    } else {
      console.log("No file selected");
      alert(`Hãy chọn file`);
    }
  };
  const handleFileUpload = async (file, endpoint) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${url}${endpoint}`, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      return data.url;
    } else {
      throw new Error("Failed to upload file");
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("multiple", true);
    input.click();

    input.onchange = async () => {
      if (input.files !== null && input.files.length > 0) {
        const file = input.files[0];
        const renamedFile = new File([file], normalizeFileName(file.name), {
          type: file.type,
        });
        // Đọc ảnh và hiển thị ngay lập tức
        const reader = new FileReader();
        reader.onload = () => {
          const dataURL = reader.result;
          const quill = reactQuillRef.current.getEditor();
          const cursorPosition = quill.getSelection().index || 0;
          quill.insertEmbed(cursorPosition, "image", dataURL, "user");
          // Tải ảnh lên server và thay thế base64 bằng URL
          handleFileUpload(renamedFile, "/upload-image")
            .then((Purl) => {
              console.log("Purl", Purl);
              const editor = quill.root;
              const images = editor.getElementsByTagName("img");
              for (let i = 0; i < images.length; i++) {
                if (images[i].src === dataURL) {
                  images[i].src = UrlIMG + Purl;
                  break;
                }
              }
            })
            .catch((error) => {
              console.error("Error uploading image:", error);
              // Tìm và xóa ảnh base64 đã chèn
              const editor = quill.root;
              const images = editor.getElementsByTagName("img");
              for (let i = 0; i < images.length; i++) {
                if (images[i].src === dataURL) {
                  images[i].parentNode.removeChild(images[i]);
                  break;
                }
              }
              alert("Lỗi update ảnh.");
            });
        };
        reader.readAsDataURL(renamedFile);
      }
    };
  }, [reactQuillRef]);

  const videoHandler = useCallback(() => {
    const url = prompt(
      "Please enter the video URL (YouTube, TikTok) or choose a file to upload:"
    );
    if (url) {
      let embedUrl = "";
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId =
          url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("tiktok.com")) {
        const videoId = url.split("/video/")[1]?.split("?")[0];
        embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
      } else {
        alert(
          "Invalid URL format. Please enter a valid YouTube or TikTok URL."
        );
        return;
      }
      const range = reactQuillRef.current.getEditor().getSelection();
      reactQuillRef.current
        .getEditor()
        .insertEmbed(range.index, "video", embedUrl);
    } else {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "video/*");
      input.click();

      input.onchange = async () => {
        const file = input.files[0];
        const renamedFile = new File([file], normalizeFileName(file.name), {
          type: file.type,
        });
        // console.log("Uploading video", file);
        try {
          // Handle the video file upload
          const PathUrl = await handleFileUpload(renamedFile, "/upload-video");
          const range = reactQuillRef.current.getEditor().getSelection();
          reactQuillRef.current
            .getEditor()
            .insertEmbed(range.index, "video", `${UrlIMG}` + PathUrl);
        } catch (error) {
          alert("Error uploading video.");
          console.error("Error uploading video:", error);
        }
      };
    }
  }, [reactQuillRef]);

  const decodeHTML = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleEditorChange = (content, delta, source, editor) => {
    console.log('handleEditorChange', content);
    setDepscription(content);
  };


  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="right-content w-100">
          <div className="card shadow border-0 w-100 flex-row p-4">
            <h5 className="mb-0">Product Upload</h5>
            <Breadcrumbs
              aria-label="breadcrumb"
              className="ml-auto breadcrumbs_"
            >
              <StyledBreadcrumb
                component="a"
                href="#"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                component="a"
                label="Products"
                href="#"
                deleteIcon={<ExpandMoreIcon />}
              />
              <StyledBreadcrumb
                label="Product Upload"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>

          <div className="card shadow border-0 w-100 p-4">
            <h5 className="mb-0">Upload File Product </h5>
            <br />
            <form className="form" onSubmit={submitFile}>
              <h5 style={{ color: "red" }} className="mb-4">
                LƯU Ý: khi sử dụng thêm bằng file excel có dạng .xlsx
              </h5>
              <div style={{ marginLeft: 20, marginRight: 20 }}>
                <ul>
                  <li>
                    {" "}
                    + Gồm các
                    cột:ID,NAME,BRAND,PRICE,ARRAY_COLOR,PARENTCATEGORY,ARRAY_SIZE,QUANTITY,DEPSCRIPTION,IMAGEURL,ARRAY_IMG
                  </li>
                  <li> + </li>
                </ul>
              </div>

              <div className="form-group">
                <h6>Upload file .xlsx</h6>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(e) => setFileExcel(e.target.files[0])}
                  className="form-control"
                />
              </div>

              <Button type="submit" className="btn-blue btn-lg btn-big">
                <FaCloudUploadAlt /> &nbsp; UPDATE TO FILE
              </Button>
            </form>
          </div>
          <div className="row22">
            <form className="form" onSubmit={submitForm}>
              <div className="row">
                <div className="col-sm">
                  <div className="card p-4">
                    <h5 className="mb-4">Product Information</h5>
                    <div className="form-group">
                      <h6>Name Product</h6>
                      <input
                        type="text"
                        name="nameProduct"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <h6> Category Option</h6>
                      <select
                        name="options"
                        value={selectedCategoryOption}
                        onChange={(e) =>
                          setSelectedCategoryOption(e.target.value)
                        }
                        className="form-control"
                      >
                        <option value="">--Please choose an option--</option>
                        {dataCategory !== undefined &&
                          dataCategory.map((category) => (
                            <option value={`${category._id}`}>
                              {category.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-sm">
                        <div className="form-group">
                          <h6>Discount</h6>
                          <input
                            type="number"
                            name="discount"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-sm">
                        <div className="form-group">
                          <h6>Brand</h6>
                          <input
                            type="text"
                            name="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm">
                        <div className="form-group">
                          <h6>Quantity</h6>
                          <input
                            type="number"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                          {quantity && !isNaN(parseInt(quantity)) && (
                            <p style={{ color: "red" }}>
                              {convertToWords(parseInt(quantity))}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col">
                        <div className="form-group">
                          <h6>Price </h6>
                          <input
                            type="text"
                            value={price}
                            name="price"
                            onChange={(e) => setPrice(e.target.value)}
                          />
                          {price && !isNaN(parseInt(price)) && (
                            <p style={{ color: "red" }}>
                              {convertToWords(parseInt(price))}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6>Color</h6>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          border: "1px solid #ccc",
                          padding: "5px",
                          borderRadius: "4px",
                        }}
                      >
                        {colorValue.map((color, index) => (
                          <span
                            key={index}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              margin: "2px",
                              padding: "2px 5px",
                              background: `${color}`,
                              borderRadius: "3px",
                              border: "1px solid #ccc",
                            }}
                          >
                            {color}
                            <Icon
                              component={CloseIcon}
                              sx={{ marginLeft: 3, height: 20 }}
                              onClick={() => removeColor(index)}
                            />
                          </span>
                        ))}
                        <input
                          name="color"
                          type="text"
                          value={inputColor}
                          onChange={(e) => setInputColor(e.target.value)}
                          onKeyPress={handleKeyColor}
                          placeholder="Please enter data, separated by commas, then press enter: green,red,blue,..."
                          style={{
                            border: "none",
                            outline: "none",
                            flexGrow: 1,
                            minWidth: "100px",
                          }}
                        />
                      </div>
                      <br />
                    </div>
                    <h6>Size</h6>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        border: "1px solid #ccc",
                        padding: "5px",
                        borderRadius: "4px",
                      }}
                    >
                      {sizeValue.map((size, index) => (
                        <span
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            margin: "2px",
                            padding: "2px 5px",
                            background: `#f0f0f0`,
                            borderRadius: "3px",
                            border: "1px solid #ccc",
                          }}
                        >
                          {size}
                          <Icon
                            component={CloseIcon}
                            sx={{ marginLeft: 3, height: 20 }}
                            onClick={() => removeSize(index)}
                          />
                        </span>
                      ))}
                      <input
                        name="size"
                        type="text"
                        value={inputSize}
                        onChange={(e) => setInputSize(e.target.value)}
                        onKeyPress={handleKeySize}
                        placeholder="Please enter data, separated by commas, then press enter: XL,XX,XS,S,L,SM"
                        style={{
                          border: "none",
                          outline: "none",
                          flexGrow: 1,
                          minWidth: "100px",
                        }}
                      />
                    </div>
                    <br />

                    <div className="form-group">
                      <h6>Upload Image</h6>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onChangeImages}
                        className="form-control"
                        multiple
                      />
                      {images !== undefined && (
                        <div
                          className="image-list"
                          style={{ display: "flex", flexWrap: "wrap" }}
                        >
                          {images.map((image, index) => (
                            <div
                              key={index}
                              className="image-item"
                              style={{ position: "relative", margin: 5 }}
                            >
                              <img
                                className="img-preview"
                                style={{ height: 100, width: 100 }}
                                src={URL.createObjectURL(image)}
                                alt={`Image ${index}`}
                              />
                              <Icon
                                component={CloseIcon}
                                sx={{
                                  position: "absolute",
                                  top: 5,
                                  right: 5,
                                  cursor: "pointer",
                                }}
                                onClick={() => handleRemoveImage(index)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="form-group" id="editor-container">
                      <h6>Depscription</h6>
                      <div style={{ height: "auto", marginBottom: "50px" }}>
                        <ReactQuill
                          ref={reactQuillRef}
                          theme="snow"
                          style={{ height: "100%", width: "100%" }}
                          value={depscription}
                          placeholder="Chú ý : Khi thêm youtube thì dùng iframe src=https://www.youtube.com/embed/+ mã trên youtube "
                          onChange={handleEditorChange}
                          modules={{
                            toolbar: {
                              container: [
                                [
                                  { header: "1" },
                                  { header: "2" },
                                  { font: [] },
                                ],
                                [{ size: [] }],
                                [
                                  "bold",
                                  "italic",
                                  "underline",
                                  "strike",
                                  "blockquote",
                                ],
                                [
                                  { list: "ordered" },
                                  { list: "bullet" },
                                  { indent: "-1" },
                                  { indent: "+1" },
                                ],
                                ["link", "image", "video"],
                                ["code-block"],
                                ["clean"],
                              ],
                              handlers: {
                                image: imageHandler,
                                video: videoHandler,
                              },
                            },
                            clipboard: {
                              matchVisual: false,
                            },
                          }}
                          formats={[
                            "header",
                            "font",
                            "size",
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                            "list",
                            "bullet",
                            "indent",
                            "link",
                            "image",
                            "video",
                            "code-block",
                          ]}
                        />
                      </div>
                    </div>

                    <br />

                    <Button type="submit" className="btn-blue btn-lg btn-big">
                      <FaCloudUploadAlt /> &nbsp; ADD TO VIEW
                    </Button>
                  </div>
                </div>
              </div>
            </form>
            <br />
            <div className="form-preview-container">
              <form className="form-preview" >
                <h3>HTML Preview depscription:</h3>
                <div
                  dangerouslySetInnerHTML={{ __html: decodeHTML(depscription) }}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductAdd;
