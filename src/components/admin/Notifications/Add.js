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
import Checkbox from "@mui/material/Checkbox";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { normalizeFileName, convertToWords } from "../../../utils/formart";
import { red } from "@mui/material/colors";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const NotificationAdd = ({ history }) => {
  const navigate = useNavigate();

  const [fileExcel, setFileExcel] = useState(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState();
  const [scheduleTime, setScheduleTime] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [dataDeviceToken, setdataDeviceToken] = useState();
  const [AllDevices, setAllDevices] = useState([]);
  const dataDevice = ["android", "ios", "websites"];

  const [selectAll, setSelectAll] = useState(true);
  const [selectEmailOnly, setSelectEmailOnly] = useState(false);
  const [selectDevice, setSelectDevice] = useState(false);

  const [selectedNotificationOption, setSelectedNotificationOption] = useState(
    []
  );
  const currentTime = new Date();
  const data = localStorage.getItem("userData");
  const id = localStorage.getItem("_id");

  useEffect(() => {
    getDeviceToken();
  }, [id]);

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
  const submitForm = async (e) => {
    e.preventDefault();
    if (title === "" || body === "") {
      toast.error("Please input title,body enter");
    }
    if (id) {
      toast.error("Id not found");
    }
    try {
      // setIsLoading(true);
      const jsonData = {
        userId: id,
        title: title,
        body: body,
      };

      if (selectAll) {
        jsonData.tokens = selectedNotificationOption;
      }
      if (selectEmailOnly) {
        if (selectedNotificationOption.length > 1) {
          jsonData.tokens = selectedNotificationOption;
        } else {
          jsonData.token = selectedNotificationOption.join(",");
        }
      }

      if (selectDevice) {
        jsonData.topic = selectedNotificationOption.join(",");
      }

      if (images) {
        const file = await upfile();
        console.log(file);
        // if(file===200){
        jsonData.imageUrl = baseURL_ + '/resize?url='+images.name + '&width=1000&height=1000';
        // }
      }
      scheduleTime
        ? (jsonData.scheduleTime = scheduleTime)
        : (jsonData.scheduleTime = new Date(currentTime.getTime() + 1 * 60000));

      const response = await api.post(`${baseURL_}/notification/news`, jsonData, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/admin/notification");
      }
      setIsLoading(false);

      // else {
      //   toast.error(response.data.message);
      // }
      // console.log(response);
    } catch (error) {
      console.error("Cấu hình lỗi:", error.response);
      toast.error(error.response.data.error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceToken = async () => {
    try {
      const response = await api.get(`${baseURL_}/notification/devicetoken`);
      setdataDeviceToken(response.data);
      const AllDevices = response.data.reduce((all, device) => {
        return all.concat(device.deviceToken);
      }, []);
      setAllDevices(AllDevices);
    } catch (error) {
      console.error(error);
    }
  };
  console.log("scheduleTime", scheduleTime);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="right-content w-100">
          <div className="card shadow border-0 w-100 flex-row p-4">
            <h5 className="mb-0">Notification Add</h5>
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
                label="Notification"
                href="/admin/notification/"
                deleteIcon={<ExpandMoreIcon />}
              />
              <StyledBreadcrumb
                label="Notification Add"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>

          <div className="row22">
            <form className="form" onSubmit={submitForm}>
              <div className="row">
                <div className="col-sm">
                  <div className="card p-4">
                    <h5 className="mb-4">Notification Information</h5>
                    <div className="row">
                      <div className="col-sm">
                        <Checkbox
                          checked={selectAll}
                          onChange={(event) => (
                            setSelectAll(event.target.checked),
                            setSelectedNotificationOption(AllDevices),
                            setSelectEmailOnly(false),
                            setSelectDevice(false)
                          )}
                          inputProps={{ "aria-label": "controlled" }}
                          style={{ color: "red" }}
                        />
                        <span>All</span>
                      </div>
                      <div className="col-sm">
                        <Checkbox
                          checked={selectEmailOnly}
                          onChange={(event) => (
                            setSelectEmailOnly(event.target.checked),
                            setSelectAll(false),
                            setSelectDevice(false)
                            // setSelectedNotificationOption([])
                          )}
                          inputProps={{ "aria-label": "controlled" }}
                          style={{ color: "red" }}
                        />
                        <span>Email Only</span>
                      </div>
                      <div className="col-sm">
                        <Checkbox
                          checked={selectDevice}
                          onChange={(event) => (
                            setSelectDevice(event.target.checked),
                            setSelectAll(false),
                            setSelectEmailOnly(false)
                            // setSelectedNotificationOption([])
                          )}
                          inputProps={{ "aria-label": "controlled" }}
                          style={{ color: "red" }}
                        />
                        <span>Device</span>
                      </div>
                    </div>
                    <br />
                    {selectEmailOnly && (
                      <div className="form-group">
                        <h6> Notification Email</h6>
                        <select
                          name="options"
                          value={selectedNotificationOption}
                          onChange={(e) =>
                            setSelectedNotificationOption(
                              e.target.value.split(",")
                            )
                          }
                          className="form-control"
                        >
                          {/* <option value="">--Please choose an option--</option> */}
                          {dataDeviceToken !== undefined &&
                            dataDeviceToken.map((i) => (
                              <option value={i.deviceToken}>{i.email}</option>
                            ))}
                        </select>
                      </div>
                    )}

                    {selectDevice && (
                      <div className="form-group">
                        <h6> Notification Device</h6>
                        <select
                          name="options"
                          value={selectedNotificationOption[0]}
                          onChange={(e) =>
                            setSelectedNotificationOption(
                              e.target.value.split(",")
                            )
                          }
                          className="form-control"
                        >
                          {/* <option value="">--Please choose an option--</option> */}
                          {dataDevice !== undefined &&
                            dataDevice.map((i) => (
                              <option value={`${i}`}>{i}</option>
                            ))}
                        </select>
                      </div>
                    )}

                    <br />
                    <div className="form-group">
                      <h6> Title Notification</h6>
                      <input
                        type="text"
                        name="nameProduct"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <br />

                    <div className="form-group" id="editor-container">
                      <h6>Body Notification</h6>
                      <textarea
                        name="body"
                        value={body}
                        style={{ height: "200px" }}
                        onChange={(a) => setBody(a.target.value)}
                      />
                    </div>

                    <br />
                    <div className="form-group">
                      <h6>Image Notification</h6>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImages(e.target.files[0])}
                        className="form-control"
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
                    <br />
                    <div className="form-group">
                      <h6>Schedule Time</h6>
                      <input
                        type="datetime-local"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="form-control"
                      />
                    </div>

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

export default NotificationAdd;
