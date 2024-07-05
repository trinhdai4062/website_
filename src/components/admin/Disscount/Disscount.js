import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import { IoIosTimer } from "react-icons/io";
import Button from "@mui/material/Button";
import { Chart } from "react-google-charts";

import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";

import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { AdminContext } from "../../../App";

import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";

import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardBox from "../Dashboard/components/dashboardBox";

import Checkbox from "@mui/material/Checkbox";
import api from "../../../api/api";
import { convertToVietnamTime, formatVND } from "../../../utils/formart";
import { toast } from "react-toastify";
import Loading from "../../../components/loading";
import { useNavigate } from "react-router-dom";
import { baseURL_ } from "../../../utils/env";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

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

const Disscount = () => {
  const navigate = useNavigate();
  const [showBy, setshowBy] = useState(10);
  const [isLoading, setisLoading] = useState(false);

  const [dataDisscount, setdataDisscount] = useState([]);
  const [data, setData] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  //admin
  const [showUser, setshowUser] = useState("");
  const [allDisscount, setAllDisscount] = useState([]);
  const [dataUser, setdataUser] = useState([]);

  const idd = localStorage.getItem("_id");
  const context = useContext(AdminContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    if (!context.isLogin || !context.shop) {
      navigate("/login");
    }
    if (context.role === "admin") {
      getAdminDisscount();
    } else {
      getdataDisscount();
    }

    window.scrollTo(0, 0);
  }, [context, idd]);

  // console.log("context.isLogin", context.role);
  useEffect(() => {
    if (dataDisscount.length > 0) {
      setTotalPages(Math.ceil(dataDisscount.length / showBy));
    }
  }, [dataDisscount, showBy]);
  //admin
  useEffect(() => {
    if (showUser) {
      const dataNewsUser = allDisscount.filter(
        (item) => item.idUser === showUser
      );
      // console.log("showUser", showUser);
      setdataDisscount(dataNewsUser);
    } else {
      getAdminDisscount();
    }
  }, [showUser]);

  const indexOfLastDisscount = currentPage * showBy;
  const indexOfFirstDisscount = indexOfLastDisscount - showBy;

  const currentDisscount = dataDisscount.slice(
    indexOfFirstDisscount,
    indexOfLastDisscount
  );
  const getAdminDisscount = async () => {
    try {
      const user_ = JSON.parse(localStorage.getItem("user_"));
      const res = await api.get(`${baseURL_}/disscount`);
      const allDisscount = res.data;

      setdataUser(user_);
      const mapping = {};
      user_.forEach((item) => {
        mapping[item._id] = {
          email: item.email,
          deviceToken: item.deviceToken,
        };
      });
      const responsiveData = allDisscount.map((item) => ({
        ...item,
        email: mapping[item.idUser].email,
        deviceToken: mapping[item.idUser].deviceToken,
      }));
      // console.log("responsiveData", responsiveData);
      setAllDisscount(responsiveData);
      setdataDisscount(responsiveData);
      // console.log("dataNewsUser", dataNewsUser);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getdataDisscount = async () => {
    try {
      const responsive = await api.get(`${baseURL_}/auth/user/${idd}`);
      if (responsive.data.status === true) {
        setdataDisscount(responsive.data.data.idDiscount);
        setData(responsive.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log("dataDisscount", dataDisscount);

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      const newCheckedItems = dataDisscount.map((item) => item._id);
      setCheckedItems(newCheckedItems);
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((i) => i !== id));
    }
  };

  const handleDelete = async (id) => {
    console.log("id", id);
    if (window.confirm("Bạn có chắc chắn muốn xóa thông báo đã chọn không?")) {
      try {
        setisLoading(true);
        if (checkedItems.length > 0) {
          // Nếu có mục nào được chọn, xóa tất cả các mục đó
          const deletePromises = checkedItems.map((itemId) =>
            api.delete(`${baseURL_}/disscount/${itemId}`)
          );
          const responses = await Promise.all(deletePromises);

          const successCount = responses.filter(
            (response) => response.data.status === true
          ).length;
          const failureCount = responses.length - successCount;

          if (successCount > 0) {
            toast.success(`${successCount} items deleted successfully!`);
            setCheckedItems([]);
          }

          if (failureCount > 0) {
            toast.error(
              `${failureCount} items failed to delete. Please try again.`
            );
          }
        } else {
          // Nếu không có mục nào được chọn, xóa mục cụ thể với ID đã truyền vào
          const response = await api.delete(`${baseURL_}/disscount/${id}`);

          if (response.status === 200) {
            toast.success("Xoá thành công!");
            setCheckedItems(checkedItems.filter((itemId) => itemId !== id));
          } else {
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
          }
        }
        context.role === "admin" ? getAdminDisscount() : setdataDisscount();
      } catch (error) {
        console.log("error", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setisLoading(false);
      }
    }
  };
  // const handleStatus = async (checked, id,endDate) => {
  //   const currentTime = new Date().getTime();
  //   const endTime = new Date(endDate).getTime();
  //   console.log('checked',checked)
  //   if(currentTime > endTime){
  //     toast.warning("Thời gian kết thúc phải lớn hơn thời gian hiện tại");
  //   }
  //   try {
  //     const responsive = await api.put(`${url}/disscount/${idd}`, {
  //       status: checked,
  //     });

  //     if (responsive.status === 200) {
  //       toast.success("Cập nhật thành công!");
  //       if (context.role === "admin") {
  //         getAdminDisscount();
  //       } else {
  //         getdataDisscount();
  //       }
  //     } else {
  //       toast.error("Cập nhật thất bại. Vui lòng thử lại.");
  //     }
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="right-content w-100">
          <div className="card shadow border-0 w-100 flex-row p-4">
            <h5 className="mb-0">Disscount List</h5>
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
                label="Disscount"
                deleteIcon={<ExpandMoreIcon />}
              />
            </Breadcrumbs>
          </div>
          {data !== undefined && (
            <div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
              <div className="col-md-12">
                <div className="dashboardBoxWrapper d-flex">
                  <DashboardBox
                    color={["#c012e2", "#eb64fe"]}
                    icon={<MdShoppingBag />}
                    data={["Total Disscount", `${data.idDisscount.length}`]}
                  />
                  <DashboardBox
                    color={["#2c78e5", "#60aff5"]}
                    icon={<IoMdCart />}
                    data={["Total Order", `${data.idOrder.length}`]}
                  />
                  <DashboardBox
                    color={["#1da256", "#48d483"]}
                    icon={<FaUserCircle />}
                    grow={true}
                    data={["Total Discount", `${data.idDiscount.length}`]}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="card shadow border-0 p-3 mt-4">
            <h3 className="hd">Disscount</h3>

            <div className="row cardFilters mt-3">
              <div className="col-md-3">
                <h4>SHOW BY</h4>
                <FormControl size="small" className="w-100">
                  <Select
                    value={showBy}
                    onChange={(e) => setshowBy(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    labelId="demo-select-small-label"
                    className="w-100"
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {context.role === "admin" && (
                <div className="col-md-3">
                  <h4>SHOW USER BY</h4>
                  <FormControl size="small" className="w-100">
                    <Select
                      value={showUser}
                      onChange={(e) => setshowUser(e.target.value)}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      labelId="demo-select-small-label"
                      className="w-100"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 500,
                            width: 250,
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {dataUser.length > 0 &&
                        dataUser.map((i, index) => (
                          <MenuItem key={i._id} value={i._id}>
                            {i.email}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-bordered table-striped v-align">
                <thead className="thead-dark">
                  <tr>
                    <th>
                      <Checkbox
                        checked={selectAll}
                        onChange={handleSelectAll}
                        inputProps={{ "aria-label": "controlled" }}
                        style={{ color: "white" }}
                      />
                    </th>
                    <th>UID</th>
                    <th>NAME</th>
                    <th>QUANTITY</th>
                    <th>TYPE</th>
                    <th>VALUE</th>
                    <th>TIME CREATE</th>
                    <th>TIME START</th>
                    <th>TIME END</th>
                    <th>STATUS</th>
                    {context.role === "admin" && (
                      <>
                        <th style={{ width: "300px" }}>DEVICE_TOKEN</th>
                        <th>USER</th>
                        <th>ACTION</th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {currentDisscount !== undefined &&
                    currentDisscount.map((item, index) => (
                      <tr key={item._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Checkbox
                              checked={checkedItems.includes(item._id)}
                              onChange={(e) =>
                                handleCheckboxChange(e, item._id)
                              }
                              inputProps={{ "aria-label": "controlled" }}
                              color="success"
                            />
                          </div>
                        </td>
                        <td>
                          <span>{index}</span>
                        </td>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.discountType}</td>
                        <td>
                          {item.discountType === "fixed"
                            ? formatVND(item.discountValue)
                            : item.discountValue + "%"}
                        </td>

                        <td>{convertToVietnamTime(item.createdAt)}</td>
                        <td>{convertToVietnamTime(item.startDate)}</td>
                        <td>{convertToVietnamTime(item.endDate)}</td>
                        <td>
                            <span
                              className={
                                item.status
                                  ? "new text-success"
                                  : "new text-danger"
                              }
                            >
                              {item.status ? "Đang sử dụng" : "Đã sử dụng"}
                            </span>
                            {/* <Switch
                              color="success"
                              checked={item.status ? true : false}
                              onChange={(event) => {
                                handleStatus(event.target.checked, item._id,item.endDate);
                              }}
                              inputProps={{ "aria-label": "controlled" }}
                            /> */}
                        </td>
                        {context.role === "admin" && (
                          <>
                            <td>
                              <ul
                                style={{
                                  // listStyleType: "none",
                                  marginLeft: "5px",
                                }}
                              >
                                {item.deviceToken.length > 0 &&
                                  item.deviceToken.map((token, index) => (
                                    <li
                                      key={index}
                                      style={{
                                        // overflow: "hidden",
                                        maxWidth: "200px",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {token}
                                    </li>
                                  ))}
                              </ul>
                            </td>

                            <td>{item.email}</td>
                            <td>
                              <div className="actions d-flex align-items-center">
                                <Button
                                  className="error"
                                  color="error"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <MdDelete />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="d-flex tableFooter">
                <p>
                  Showing <b>{currentDisscount.length}</b> of{" "}
                  <b>{dataDisscount.length}</b> results
                </p>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  className="pagination"
                  showFirstButton
                  showLastButton
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Disscount;
