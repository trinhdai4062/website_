import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React, { useEffect, useState, useContext } from "react";
import Rating from "@mui/material/Rating";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Icon } from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../../api/api";
import { useParams } from "react-router-dom";
import Loading from "../../../components/loading";

import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { normalizeFileName, convertToWords } from "../../../utils/formart";
import { toast } from "react-toastify";
import { AdminContext } from "../../../App";
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

const CategoryUpload = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [depscription, setDepscription] = useState("");
  const [images, setImages] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [dataCategory, setDataCategory] = useState();

  const [formFields, setFormFields] = useState({
    url: [],
  });


  const context = useContext(AdminContext);
  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    if (!context.isLogin || !context.shop) {
      navigate("/login");
    }
    getDataCategory();
  }, [context, id]);

  const getDataCategory = async () => {
    const res = await api.get(`${baseURL_}/categori/${id}`);
    if (res.status === 200) {
      setDataCategory(res.data);
      setName(res.data.name);
      setDepscription(res.data.description);
    }
    console.log("res", res.data);
  };

  const upfile = async () => {
    const formData = new FormData();
    formData.append("files", images);
    try {
      const response = await api.post(`${baseURL_}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      return response.status;
    } catch (error) {
      // console.log(error)
      if (error.response) {
        const errorMessage = error.response.data.error;
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  // console.log("Upload",formFields)
  // console.log("formFields.url",formFields.url.slice(1).map((image) => image))

  const submitForm = async (e) => {
    e.preventDefault();
    if (name === "") {
      toast.error("Please input name enter.");
    }
    if (images.length === 0) {
      toast.error("Please input images enter.");
    }
    try {
      setIsLoading(true);
      const file = await upfile();
      const jsonData = {
        name: name,
        description: depscription,
        image: normalizeFileName(images.name)
      };  
      const response = await api.put(`${baseURL_}/categori/${id}`, jsonData)
      if (response.data.status === true) {
        toast.success("Đã thêm danh mục thành công");
        navigate("/admin/category");
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error(error.response.data);
      setIsLoading(false);
     console.log("Cấu hình lỗi:", error); 
    } finally {
      setIsLoading(false);
    }
  };
//   console.log('images',images)

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
                        onChange={(e) => {setImages(e.target.files[0])}}
                        className="form-control"
                        multiple={false}
                      />
                      {images !== undefined && (
                        <img
                          className="img-preview"
                          style={{ height: 100, width: 100, margin: "10px" }}
                          src={URL.createObjectURL(images)}
                          alt={`Image `}
                        />
                      )}
                     
                    </div>

                    <div className="form-group">
                      <h6>Depscription</h6>
                      <textarea
                        name="description"
                        value={depscription}
                        style={{ height: "300px" }}
                        onChange={(a) => setDepscription(a.target.value)}
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

export default CategoryUpload;
