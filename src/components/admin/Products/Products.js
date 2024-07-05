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
import {
  formatVND,
  truncate,
  convertToVietnamTime,
} from "../../../utils/formart";
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

const Products = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBy, setshowBy] = useState(10);
  const open = Boolean(anchorEl);
  const [isLoading, setisLoading] = useState(false);

  const [dataProduct, setdataProduct] = useState([]);
  const [data, setData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  //admin
  const [dataUser, setdataUser] = useState([]);
  const [showUser, setshowUser] = useState("");
  const [allProduct, setAllProduct] = useState([]);

  // const data = localStorage.getItem("userData");
  const id = localStorage.getItem("_id");
  const context = useContext(AdminContext);

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    if (!context.isLogin || !context.shop) {
      navigate("/login");
    }
    if (context.role === "admin") {
      getAdminProducts();
    } else {
      getDataProduct();
    }
    window.scrollTo(0, 0);
  }, [id, context]);

  useEffect(() => {
    if (dataProduct.length > 0) {
      setTotalPages(Math.ceil(dataProduct.length / showBy));
    }
  }, [dataProduct, showBy]);

  //admin
  useEffect(() => {
    if (showUser) {
      const dataNewsUser = allProduct.filter(
        (item) => item.userId === showUser
      );
      setdataProduct(dataNewsUser);
    } else {
      getAdminProducts();
    }
  }, [showUser]);

  const indexOfLastProduct = currentPage * showBy;
  const indexOfFirstProduct = indexOfLastProduct - showBy;

  const currentProducts = dataProduct.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  //admin
  const getAdminProducts = async () => {
    try {
      const user_ = JSON.parse(localStorage.getItem("user_"));
      const res = await api.get(`${baseURL_}/shose`);
      const allNotification = res.data.data;
      setdataUser(user_);
      const mapping = {};
      user_.forEach((item) => {
        mapping[item._id] = {
          email: item.email,
          deviceToken: item.deviceToken,
        };
      });
      const responsiveData = allNotification.map((item) => ({
        ...item,
        email: mapping[item.userId].email,
        deviceToken: mapping[item.userId].deviceToken,
      }));
      setAllProduct(responsiveData);
      setdataProduct(responsiveData);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getDataProduct = async () => {
    try {
      const responsive = await api.get(`${baseURL_}/auth/user/${id}`);
      if (responsive.data.status === true) {
        setdataProduct(responsive.data.data.idProduct);
        setData(responsive.data.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      const newCheckedItems = dataProduct.map((item) => item._id);
      setCheckedItems(newCheckedItems);
    } else {
      setCheckedItems([]);
    }
  };

  const handleCheckboxChange = (event, id) => {
    console.log("event", event.target.checked);
    if (event.target.checked) {
      setCheckedItems([...checkedItems, id]);
    } else {
      setCheckedItems(checkedItems.filter((i) => i !== id));
    }
    console.log("checkedItems", checkedItems);
  };

  //   console.log('product',product)

  const handleStatus = async (checked, id) => {
    try {
      const responsive = await api.put(`${baseURL_}/shose/${id}`, {
        status: checked,
      });
      if (responsive.data.status === true) {
        toast.success("Cập nhật thành công!");
      } else {
        toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleSeller = async (checked, id) => {
    // console.log("checked", checked);
    try {
      setisLoading(true);
      const responsive = await api.put(`${baseURL_}/shose/${id}`, {
        seller: checked,
      });
      if (responsive.data.status === true) {
        toast.success("Cập nhật thành công!");
      } else {
        toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setisLoading(false);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm đã chọn không?")) {
      try {
        setisLoading(true);
        if (checkedItems.length > 0) {
          // Nếu có mục nào được chọn, xóa tất cả các mục đó
          const deletePromises = checkedItems.map((itemId) =>
            api.delete(`${baseURL_}/shose/${itemId}`)
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
          const response = await api.delete(`${baseURL_}/shose/${id}`);

          if (response.data.status === true) {
            toast.success("Xoá thành công!");
            setCheckedItems(checkedItems.filter((itemId) => itemId !== id)); // Loại bỏ mục đã xóa khỏi danh sách đã chọn nếu nó tồn tại
          } else {
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
          }
        }
      } catch (error) {
        console.log("error", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setisLoading(false);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="right-content w-100">
          <div className="card shadow border-0 w-100 flex-row p-4">
            <h5 className="mb-0">Product List</h5>
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
                label="Products"
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
                    data={["Total Product", `${data.idProduct.length}`]}
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
            <h3 className="hd">Products</h3>
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
                    <th >PRODUCT</th>
                    <th>BRAND</th>
                    <th>PRICE</th>
                    <th>RATING</th>
                    <th>QUANTITY</th>
                    <th>COLOR</th>
                    <th>SIZE</th>
                    <th>DISCOUNT</th>
                    <th>FAVORITE</th>
                    <th>SELLER</th>
                    <th>STATUS</th>
                    <th>TIME CREATE</th>
                    <th>TIME UPDATE</th>
                    {context.role === "admin" && (
                      <>
                        <th>EMAIL</th>
                        <th>DEVICE_TOKEN</th>
                      </>
                    )}
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {currentProducts !== undefined &&
                    currentProducts.map((item, index) => (
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
                        <td >
                          <div className="d-flex align-items-center productBox">
                            <div className="imgWrapper">
                              <div className="img card shadow m-0">
                                <img
                                  src={`${baseURL_}/resize?url=${item.imageUrl}&width=100&height=100`}
                                  className="w-100"
                                />
                              </div>
                            </div>
                            <div className="info pl-3">
                              <h6>{truncate(item.name, 20)}</h6>
                              <p>{truncate(item.description, 20)}</p>
                            </div>
                          </div>
                        </td>

                        <td>{item.brand}</td>
                        <td>
                          <div>
                            <del className="old">{formatVND(item.price)}</del>
                            <span className="new text-danger">
                              {formatVND(
                                item.price - item.price * (item.discount / 100)
                              )}
                            </span>
                          </div>
                        </td>
                        <td>
                          <Rating
                            name="read-only"
                            defaultValue={item.star}
                            precision={0.5}
                            size="small"
                            readOnly
                          />
                        </td>
                        <td>{item.quantity}</td>
                        <td>
                          {item.color.map((items) => (
                            <span className="new text-danger">{items}</span>
                          ))}
                        </td>
                        <td>
                          {item.size.map((items) => (
                            <span className="new text-danger">{items}</span>
                          ))}
                        </td>
                        <td>{item.discount}%</td>
                        <td>
                          <span className="new text-danger">
                            {item.favorite ? "Có" : "Không"}
                          </span>
                        </td>
                        <td>
                          <Switch
                            color="success"
                            checked={item.seller ? true : false}
                            onChange={(event) => {
                              handleSeller(event.target.checked, item._id);
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </td>
                        <td>
                          <Switch
                            color="success"
                            checked={item.status ? true : false}
                            onChange={(event) => {
                              handleStatus(event.target.checked, item._id);
                            }}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </td>
                        <td>{convertToVietnamTime(item.createdAt)}</td>
                        <td>{convertToVietnamTime(item.updatedAt)}</td>
                        {context.role === "admin" && (
                          <>
                            <td>{item.email}</td>
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
                                        maxWidth: "250px",
                                        wordWrap: "break-word",
                                      }}
                                    >
                                      {token}
                                    </li>
                                  ))}
                              </ul>
                            </td>
                          </>
                        )}
                       

                        <td>
                          <div className="actions d-flex align-items-center">
                            <Link to={`/admin/product/details/${item._id}`}>
                              <Button className="secondary" color="secondary">
                                <FaEye />
                              </Button>
                            </Link>
                            <Link to={`/admin/product/upload/${item._id}`}>
                              <Button className="success" color="success">
                                <FaPencilAlt />
                              </Button>
                            </Link>
                            {context.role === "admin" && (
                              <Button
                                className="error"
                                color="error"
                                onClick={() => handleDelete(item._id)}
                              >
                                <MdDelete />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="d-flex tableFooter">
                <p>
                  Showing <b>{currentProducts.length}</b> of{" "}
                  <b>{dataProduct.length}</b> results
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

export default Products;
