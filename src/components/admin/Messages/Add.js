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
import api from "../../../api/api";
import { useParams } from "react-router-dom";
// import { htmlToMarkdown } from 'html-to-markdown';
import TurndownService from "turndown";
import Loading from "../../../components/loading";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { normalizeFileName, convertToWords } from "../../../utils/formart";
import { red } from "@mui/material/colors";
import { baseURL_ } from "../../../utils/env";

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

const CategoryAdd = ({ history }) => {
  const navigate = useNavigate();

  const reactQuillRef = useRef();

  const [fileExcel, setFileExcel] = useState(null);

  const [name, setName] = useState("");
  const [depscription, setDepscription] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const [dataCategory, setdataCategory] = useState();
  const [selectedCategoryOption, setSelectedCategoryOption] = useState("");

  const [formFields, setFormFields] = useState({
    url: [],
  });

  const [dataUser, setdataUser] = useState();

  const data = localStorage.getItem("userData");
  const id = localStorage.getItem("_id");

  // useEffect(() => {
  //   if (data) {
  //     setdataUser(JSON.parse(data));
  //   }
  // }, [id]);

  // const getDataCate = async () => {
  //   try {
  //     const responsive = await api.get(`${url}/categori/`);
  //     if (responsive.data.status === true) {
  //       setdataCategory(responsive.data.data);
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // useEffect(() => {
  //   getDataCate();
  // }, []);

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
      const response = await api.post(`${baseURL_}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
    if (images.length === 0) {
      return window.alert("Please input images enter");
    }
    try {
      setIsLoading(true);
      // const file = await upfile();

      const jsonData = {
        userId: dataUser.email,
        name: name,
        description: depscription,
        image: formFields.url[0].name,
      };
      // console.log("jsonData", jsonData);
      console.log("depscription", depscription);
      const response = await api.post(`${baseURL_}/shose`, jsonData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.data.status === true) {
        window.alert("Đã thêm sản phẩm thành công");
        navigate("/category");
      }
      else {
        window.alert("Error");
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Cấu hình lỗi:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleEditorChange = (content, delta, source, editor) => {
  //   console.log('handleEditorChange', content);
  //   setDepscription(content);
  // };


  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="right-content w-100">
          <div className="card shadow border-0 w-100 flex-row p-4">
            <h5 className="mb-0">Category Add</h5>
            <Breadcrumbs
              aria-label="breadcrumb"
              className="ml-auto breadcrumbs_"
            >
              <StyledBreadcrumb
                component="a"
                href="/admin/dashboard"
                label="Dashboard"
                icon={<HomeIcon fontSize="small" />}
              />

              <StyledBreadcrumb
                component="a"
                label="Category"
                href="/admin/category/"
                deleteIcon={<ExpandMoreIcon />}
              />
              <StyledBreadcrumb
                label="Category Add"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>

          <div className="row22">
            <form className="form" onSubmit={submitForm}>
              <div className="row">
                <div className="col-sm">
                  <div className="card p-4">
                    <h5 className="mb-4">Category Information</h5>
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
                    <div className="form-group">
                      <h6>Name Category</h6>
                      <input
                        type="text"
                        name="nameProduct"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
                      <textarea
                        name="description"
                        value={depscription}
                        style={{ height:"300px"}}
                        onChange={a=>setDepscription(a.target.value)}
                      />
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
          </div>
          
        </div>
      )}
    </>
  );
};

export default CategoryAdd;
