import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../common/Sidebar/UserSideBar";
import Product from "../../common/product";
import { Button } from "@mui/material";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import api from "../../../api/api";
import { baseURL_ } from "../../../utils/env";

import { UserContext } from "../../../pages/UserPage";

const Listing = ({ categoriData, single }) => {
  const [isOpenDropDown, setisOpenDropDown] = useState(false);
  const [isOpenDropDown2, setisOpenDropDown2] = useState(false);
  const [showPerPage, setHhowPerPage] = useState(3);
  const [name, setName] = useState();
  const [dataCateGori, setDataCateGori] = useState([]);

  const [data, setData] = useState([]);

  const context = useContext(UserContext);

  // const [currentId, setCurrentId] = useState();

  let { id } = useParams();

  var itemsData = [];
  // console.log("categoriData", categoriData);
  // console.log("single", single);
  // console.log("id", id);
  useEffect(() => {
    const getCartData = async () => {
      try {
        const response = await api.get(`${baseURL_}/categori/${id}`);
        setName(response.data.name);
        setDataCateGori([response.data]);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (categoriData.length > 0) {
      getCartData();
    }

    window.scrollTo(0, 0);
  }, [categoriData, id]);

  useEffect(() => {
    const processData = () => {
      if (dataCateGori.length > 0 && single) {
        const itemsData = dataCateGori.reduce((acc, item) => {
          if (single === true &&item._id === id) {
            acc.push(...item.parentShose); 
          }
          return acc;
        }, []);
        setData(itemsData);
      }
    };

    processData();
  }, [dataCateGori, single, id]);
 

  // useEffect(() => {
  //   dataCateGori.length !== 0 &&
  //     dataCateGori.map((item, index) => {
  //       console.log('iddd',item)
  //       //page == single cat
  //       if (single === true && item._id === id) {
  //         item.parentShose.map((item_) => {
  //           itemsData.push({ ...item_ });
  //         });
  //       }
  //       // //page == double cat
  //       // else {
  //       //   item.parentShose.length !== 0 &&
  //       //   item.parentShose.map((item_, index_) => {
  //       //       console.log(item_.slug.replace(/[^A-Za-z]/g,"-").toLowerCase())
  //       //       if (
  //       //         item_.slug.split(" ").join("-").toLowerCase() ==id.split(" ").join("-").toLowerCase()
  //       //       ) {
  //       //           itemsData.push({
  //       //             ...item_
  //       //           });
  //       //       }
  //       //     });
  //       // }
  //     });

  //   setData(itemsData);
  //   window.scrollTo(0, 0);
  // }, [id]);

  const filterByBrand = (keyword) => {
    //page == single cat
    if (single === true) {
      dataCateGori.length !== 0 &&
        dataCateGori.map((item, index) => {
          item.parentShose.length !== 0 &&
            item.parentShose.map((item_) => {
              if (item_.brand.toLowerCase() === keyword.toLowerCase()) {
                itemsData.push({ ...item_ });
              }
            });
        });
    }
    //page == double cat
    // else {
    //   categoriData.length !== 0 &&
    //     categoriData.map((item, index) => {
    //       if (item.slug.split(" ").join("-").toLowerCase() ==id.split(" ").join("-").toLowerCase()) {
    //         item_.products.map((item__, index__) => {
    //           if (item__.brand.toLowerCase() === keyword.toLowerCase()) {
    //             itemsData.push({
    //               ...item__,
    //               parentCatName: item.cat_name,
    //               subCatName: item_.cat_name,
    //             });
    //           }
    //         });
    //       }
    //     });
    // }

    const list2 = itemsData.filter(
      (item, index) => itemsData.indexOf(item) === index
    );

    setData(list2);

    window.scrollTo(0, 0);
  };

  const filterByPrice = (minValue, maxValue) => {
    dataCateGori.length !== 0 &&
      dataCateGori.map((item, index) => {
        //page == single cat
        if (single === true && item._id === id) {
          item.parentShose.length !== 0 &&
            item.parentShose.map((product) => {
              let price = parseInt(product.price);
              if (minValue <= price && maxValue >= price) {
                itemsData.push({ ...product });
              }
            });
        }
        // else {
        //     item.items.length !== 0 &&
        //         item.items.map((item_, index_) => {
        //             if (item_.cat_name.split(' ').join('-').toLowerCase() == id.split(' ').join('-').toLowerCase()) {
        //                 item_.products.map((product) => {
        //                     let price = parseInt(product.price.toString().replace(/,/g, ""))
        //                     if (minValue <= price && maxValue >= price) {
        //                         itemsData.push({ ...product, parentCatName: item.cat_name, subCatName: item_.cat_name })
        //                     }
        //                 })

        //             }
        //         })
        // }
      });

    const list2 = itemsData.filter(
      (item, index) => itemsData.indexOf(item) === index
    );
    setData(list2);
  };

  const filterByRating = (keyword) => {
    dataCateGori.length !== 0 &&
      dataCateGori.map((item, index) => {
        //page == single cat
        if (single === true && item._id === id) {
          item.parentShose.length !== 0 &&
            item.parentShose.map((product) => {
              if (product.star === keyword) {
                itemsData.push({ ...product });
              }
            });
        }
      });
    const list3 = itemsData.filter(
      (item, index) => itemsData.indexOf(item) === index
    );
    setData(list3);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {context.windowWidth < 992 && (
        <>
          {context.isopenNavigation === false && (
            <Button
              className="btn-g btn-lg w-100 filterBtn"
              onClick={() => context.openFilters()}
            >
              Filters
            </Button>
          )}
        </>
      )}

      <section className="listingPage">
        <div className="container-fluid">
          {
            <div className="breadcrumb flex-column">
              <h1 className="text-capitalize">{name}</h1>
              <ul className="list list-inline mb-0">
                <li className="list-inline-item">
                  <Link to={"/user/home"}>Home </Link>
                </li>
                <li className="list-inline-item">
                  <Link
                    to={`/user/cat/${sessionStorage.getItem("cat")}`}
                    className="text-capitalize"
                  >
                    {sessionStorage.getItem("cat")}{" "}
                  </Link>
                </li>
                {/* {props.single === false && (
                  <li className="list-inline-item">
                    <Link to={""} class="text-capitalize">
                      {id.split("-").join(" ")}
                    </Link>
                  </li>
                )} */}
              </ul>
            </div>
          }

          <div className="listingData">
            <div className="row">
              <div
                className={`col-md-3 sidebarWrapper ${
                  context.isOpenFilters === true && "click"
                }`}
              >
                
                {data.length !== 0 && (
                  <Sidebar
                    data={categoriData}
                    currentCatData={data}
                    filterByBrand={filterByBrand}
                    filterByPrice={filterByPrice}
                    filterByRating={filterByRating}
                  />
                )}
              </div>

              <div className="col-md-9 rightContent homeProducts pt-0">
                <div className="topStrip d-flex align-items-center">
                  <p className="mb-0">
                    Chúng tôi{" "}
                    {data.length > 0 ? "tìm thấy " : "không tìm thấy "}
                    <span className="text-success">{data.length}</span> sản
                    phẩm!!
                  </p>
                  <div className="ml-auto d-flex align-items-center">
                    <div className="tab_ position-relative">
                      <Button
                        className="btn_"
                        onClick={() => setisOpenDropDown(!isOpenDropDown)}
                      >
                        <GridViewOutlinedIcon /> Hiển Thị: {showPerPage * 5}
                      </Button>
                      {isOpenDropDown !== false && (
                        <ul className="dropdownMenu">
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(1);
                              }}
                            >
                              5
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(2);
                              }}
                            >
                              10
                            </Button>
                          </li>

                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(3);
                              }}
                            >
                              15
                            </Button>
                          </li>

                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => {
                                setisOpenDropDown(false);
                                setHhowPerPage(4);
                              }}
                            >
                              20
                            </Button>
                          </li>
                        </ul>
                      )}
                    </div>
                    <div
                      className="tab_ ml-3 position-relative"
                      style={{ width: "250px" }}
                    >
                      <Button
                        className="btn_"
                        onClick={() => setisOpenDropDown2(!isOpenDropDown2)}
                      >
                        <FilterListOutlinedIcon /> Sắp xếp: Phổ thông{" "}
                      </Button>
                      {isOpenDropDown2 !== false && (
                        <ul className="dropdownMenu">
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              Phổ thông
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Giá: Từ thấp lên cao
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Giá: Từ cao xuống thấp
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Ngày bắt đầu
                            </Button>
                          </li>
                          <li>
                            <Button
                              className="align-items-center"
                              onClick={() => setisOpenDropDown2(false)}
                            >
                              {" "}
                              Xếp hạng
                            </Button>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="productRow pl-4 pr-3 ">
                  {data.length !== 0 &&
                    data.map((item, index) => {
                      return (
                        <div className="item" key={index}>
                          <Product item={item} />
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Listing;
