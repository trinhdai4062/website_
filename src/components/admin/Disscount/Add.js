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
import { toast } from "react-toastify";
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

const DisscountAdd = ({ history }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [value, setValue] = useState();
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTypeOption, setSelectedTypeOption] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const data = localStorage.getItem("userData");
  const id = localStorage.getItem("_id");
  const typeData = ["percent", "fixed"];


  const submitForm = async (e) => {
    e.preventDefault();
    if (name === "" || value <=0|| selectedTypeOption === "" || quantity <=0) {
      toast.error("Please enter input name or quantity or type option or value")
    }
    const start=startTime?new Date(startTime).getTime():0;
    const end=new Date(endTime).getTime()
    const now= new Date();
    if(endTime ===undefined){
      toast.warning("Please enter input the end time ")
    }

    if(start > end){
      toast.warning("Please enter input the start time is greater than the end time ")
    }
    try {
      setIsLoading(true);
      const jsonData = {
        idUser:id,
        name: name,
        quantity: quantity,
        discountType: selectedTypeOption,
        discountValue:value,
        endDate:endTime
      };
      start!==0
      ? (jsonData.startDate = startTime)
      : (jsonData.startDate = new Date(now.getTime() + 1 * 60000));
      const response = await api.post(`${baseURL_}/disscount`, jsonData)
      if (response.status === 200) {
        toast.success('Đã thêm sản phẩm thành công');
        navigate("/admin/disscount");
      }
    } catch (error) {
      toast.warning(error.response.data.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="right-content w-100">
          <div className="card shadow border-0 w-100 flex-row p-4">
            <h5 className="mb-0">Disscount Add</h5>
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
                label="Disscount"
                href="/admin/disscount/"
                deleteIcon={<ExpandMoreIcon />}
              />
              <StyledBreadcrumb
                label="Disscount Add"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>

          <div className="row22">
            <form className="form" onSubmit={submitForm}>
              <div className="row">
                <div className="col-sm">
                  <div className="card p-4">
                    <h5 className="mb-4">Disscount Information</h5>

                    <div className="form-group">
                      <h6>Name</h6>
                      <input
                        type="text"
                        name="nameDiscount"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <h6>Quantity</h6>
                      <input
                        type="text"
                        name="quantityDiscount"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="row">
                      <div className="col-sm">
                        <div className="form-group">
                          <h6> Option Type</h6>
                          <select
                            name="options"
                            value={selectedTypeOption}
                            onChange={(e) =>
                              setSelectedTypeOption(e.target.value)
                            }
                            className="form-control"
                          >
                            <option value="">
                              --Please choose an option--
                            </option>
                            {typeData !== undefined &&
                              typeData.map((i) => (
                                <option value={i}>{i}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm">
                        <div className="form-group">
                          <h6>Value</h6>
                          <input
                            type="number"
                            name="value"
                            value={value}
                            placeholder="only numbers"
                            onChange={(e) => setValue(e.target.value)}
                          />
                        </div>
                        <br />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm">
                        <div className="form-group">
                          <h6>Start Time</h6>
                          <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="col-sm">
                        <div className="form-group">
                          <h6>End Time</h6>
                          <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(a) => setEndTime(a.target.value)}
                          />
                        </div>
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
          </div>
        </div>
      )}
    </>
  );
};

export default DisscountAdd;
