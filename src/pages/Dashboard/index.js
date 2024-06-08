import DashboardBox from "./components/dashboardBox";
import { HiDotsVertical } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useCallback, useContext, useEffect, useState } from "react";
import { IoIosTimer } from "react-icons/io";
import Button from "@mui/material/Button";
import { Chart } from "react-google-charts";

import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import { Link } from "react-router-dom";

import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from "@mui/material/Pagination";
import { MyContext } from "../../App";
import { toast } from "react-toastify";

import { formatVND, truncate } from "../../utils/formart";

import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isWithinInterval,
} from "date-fns";

import Rating from "@mui/material/Rating";
// import axios from 'axios'
import api from "../../api/api";

export const data = [
  ["Year", "Sales", "Expenses"],
  ["2013", 1000, 400],
  ["2014", 1170, 460],
  ["2015", 660, 1120],
  ["2016", 1030, 540],
];

export const options = {
  backgroundColor: "transparent",
  chartArea: { width: "100%", height: "100%" },
};

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBy, setshowBy] = useState(10);
  const [userData, setUserData] = useState();
  const [numberFilterData, setNumberFilterData] = useState(0);

  const [product, setProduct] = useState([]);
  const [bestSell, setBestSell] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  const open = Boolean(anchorEl);
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const ITEM_HEIGHT = 48;

  const context = useContext(MyContext);
  const url = "http://192.168.10.110:6969/v1";

  //   console.log('url',process.env.URL)

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
  }, []);

  const data = localStorage.getItem("userData");
  const id = localStorage.getItem("_id");

  useEffect(() => {
    if (data) {
      setUserData(JSON.parse(data));
    }
    handleData(id);
  }, [product, id, bestSell]);

  useEffect(() => {
    if (product) {
      handleTimeRangeChange(null);
    }
  }, [product, id]);

  useEffect(() => {
    if (bestSell.length > 0) {
      setTotalPages(Math.ceil(bestSell.length / showBy));
    }
  }, [bestSell, showBy]);

  //   console.log("context", context);

  const indexOfLastProduct = currentPage * showBy;
  const indexOfFirstProduct = indexOfLastProduct - showBy;

  const currentProducts = bestSell.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handleData = async (id) => {
    try {
      const response = await api.get(`${url}/auth/user/${id}`);
      if (response.data.status === true) {
        // const data = response.data.data.idProduct;
        const data = response.data.data.idProduct.filter((i) => i.seller);
        setProduct(response.data.data.idProduct);
        setBestSell(data);
      }
    } catch (err) {
      console.log("err", err.response);
    }
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      const newCheckedItems = bestSell.map((item) => item._id);
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
      const responsive = await api.put(
        `http://192.168.10.110:6969/v1/shose/${id}`,
        { status: checked }
      );
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
      const responsive = await api.put(
        `http://192.168.10.110:6969/v1/shose/${id}`,
        { seller: checked }
      );
      if (responsive.data.status === true) {
        toast.success("Cập nhật thành công!");
      } else {
        toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm đã chọn không?")) {
        try {
            if (checkedItems.length > 0) {
                // Nếu có mục nào được chọn, xóa tất cả các mục đó
                const deletePromises = checkedItems.map((itemId) =>
                    api.delete(`${url}/shose/${itemId}`)
                );
                const responses = await Promise.all(deletePromises);

                const successCount = responses.filter((response) => response.data.status === true).length;
                const failureCount = responses.length - successCount;

                if (successCount > 0) {
                    toast.success(`${successCount} items deleted successfully!`);
                    setCheckedItems([]);
                }

                if (failureCount > 0) {
                    toast.error(`${failureCount} items failed to delete. Please try again.`);
                }
            } else {
                // Nếu không có mục nào được chọn, xóa mục cụ thể với ID đã truyền vào
                const response = await api.delete(`${url}/shose/${id}`);

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
        }
    }
};


  const handleTimeRangeChange = (range) => {
    const now = new Date();
    let startDate;
    switch (range) {
      case "lastDay":
        startDate = subDays(now, 1);
        break;
      case "lastWeek":
        startDate = subWeeks(now, 1);
        break;
      case "lastMonth":
        startDate = subMonths(now, 1);
        break;
      case "lastYear":
        startDate = subYears(now, 1);
        break;
      default:
        startDate = null;
        break;
    }
    // console.log("startDate", startDate)
    if (startDate) {
      const filtered = product.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return isWithinInterval(itemDate, { start: startDate, end: now });
      });
      setNumberFilterData(filtered.length);
    } else {
      setNumberFilterData(product.length);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-8">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                icon={<FaUserCircle />}
                grow={true}
                data={["chua lam", "Users"]}
                onTimeRangeChange={handleTimeRangeChange}
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                icon={<IoMdCart />}
                grow={false}
                data={["chua lam", "Orders"]}
                onTimeRangeChange={handleTimeRangeChange}
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                icon={<MdShoppingBag />}
                grow={true}
                data={["Products", `${numberFilterData}`]}
                onTimeRangeChange={handleTimeRangeChange}
              />
              <DashboardBox
                color={["#e1950e", "#f3cd29"]}
                icon={<GiStarsStack />}
                grow={true}
                data={["chua lam", "Reviews"]}
                onTimeRangeChange={handleTimeRangeChange}
              />
            </div>
          </div>

          <div className="col-md-4 pl-0">
            <div className="box graphBox">
              <div className="d-flex align-items-center w-100 bottomEle">
                <h6 className="text-white mb-0 mt-0">Total Sales</h6>
                <div className="ml-auto">
                  <Button className="ml-auto toggleIcon" onClick={handleClick}>
                    <HiDotsVertical />
                  </Button>
                  <Menu
                    className="dropdown_menu"
                    MenuListProps={{
                      "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    }}
                  >
                    <MenuItem onClick={handleClose}>
                      <IoIosTimer /> Last Day
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <IoIosTimer /> Last Week
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <IoIosTimer /> Last Month
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <IoIosTimer /> Last Year
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              <h3 className="text-white font-weight-bold">$3,787,681.00</h3>
              <p>$3,578.90 in last month</p>

              <Chart
                chartType="PieChart"
                width="100%"
                height="170px"
                data={data}
                options={options}
              />
            </div>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Best Selling Products</h3>

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
            {/* <div className="col-md-3">
              <h4>CATEGORY BY</h4>
              <FormControl size="small" className="w-100">
                <Select
                  value={showBysetCatBy}
                  onChange={(e) => setCatBy(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  labelId="demo-select-small-label"
                  className="w-100"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div> */}
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
                  <th style={{ width: "300px" }}>PRODUCT</th>
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
                            onChange={(e) => handleCheckboxChange(e, item._id)}
                            inputProps={{ "aria-label": "controlled" }}
                            color="success"
                          />
                        </div>
                      </td>
                      <td>
                        <span>{index}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center productBox">
                          <div className="imgWrapper">
                            <div className="img card shadow m-0">
                              <img
                                src={`http://192.168.10.110:6969/v1/resize?url=${item.imageUrl}&width=100&height=100`}
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
                      <td>
                        <div className="actions d-flex align-items-center">
                          <Link to={`/product/details/${item._id}`}>
                            <Button className="secondary" color="secondary">
                              <FaEye />
                            </Button>
                          </Link>
                          <Link to={`/product/upload/${item._id}`}>
                            <Button className="success" color="success">
                              <FaPencilAlt />
                            </Button>
                          </Link>
                          <Button
                            className="error"
                            color="error"
                            onClick={() => handleDelete(item._id)}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="d-flex tableFooter">
              <p>
                Showing <b>{currentProducts.length}</b> of{" "}
                <b>{bestSell.length}</b> results
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
    </>
  );
};

export default Dashboard;
