import React, { useEffect, useRef, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";

import Slider from "react-slick";
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import UserAvatarImgComponent from "../../components/userAvatarImg";
import Rating from "@mui/material/Rating";
import { FaReply } from "react-icons/fa";
import { MdFilterVintage } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { MdPhotoSizeSelectActual } from "react-icons/md";
import { IoIosPricetags } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { MdRateReview } from "react-icons/md";
import { BsPatchCheckFill } from "react-icons/bs";
import axios from "axios";
import { formatVND, truncate } from "../../utils/formart";
import { useParams } from "react-router-dom";

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

const ProductDetails = () => {
  const { id } = useParams();

  const url = "http://192.168.10.110:6969/v1";

  const [dataProduct, setDataProduct] = useState();
  const productSliderBig = useRef();
  const productSliderSml = useRef();

  var productSliderOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  var productSliderSmlOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  const goToSlide = (index) => {
    productSliderBig.current.slickGoTo(index);
    productSliderSml.current.slickGoTo(index);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  useEffect(() => {
    getDataProductDetails(id);
  }, [id, dataProduct]);
  const getDataProductDetails = async (id) => {
    try {
      const responsive = await axios.get(`${url}/shose/${id}`);
      // console.log('responsive',responsive.data)
      if (responsive.data.status === true) {
        setDataProduct(responsive.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log("datass", dataProduct);

  const decodeHTML = (html) => {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Product View</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="#"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />

            <StyledBreadcrumb label="Products" component="a" href="#" />
            <StyledBreadcrumb label="Product View" />
          </Breadcrumbs>
        </div>
        {dataProduct !== undefined &&
          dataProduct.imgShose !== undefined &&
          dataProduct.data !== undefined && (
            <div className="card productDetailsSEction">
              <div className="row">
                <div className="col-md-5">
                  <div className="sliderWrapper pt-3 pb-3 pl-4 pr-4">
                    <h6 className="mb-4">Product Gallery</h6>
                    <Slider
                      {...productSliderOptions}
                      ref={productSliderBig}
                      className="sliderBig mb-2"
                    >
                      {dataProduct !== undefined &&
                        dataProduct.imgShose.map((f2) =>
                          f2.images.map((image) => (
                            <div className="item">
                              <img
                                src={`${url}/resize?url=${image}&width=500&height=500`}
                                className="w-100"
                              />
                            </div>
                          ))
                        )}
                    </Slider>
                    <Slider
                      {...productSliderSmlOptions}
                      ref={productSliderSml}
                      className="sliderSml"
                    >
                      {dataProduct !== undefined &&
                        dataProduct.imgShose.map((f2) =>
                          f2.images.map((image, index) => (
                            <div
                              className="item"
                              onClick={() => goToSlide(index)}
                            >
                              <img
                                src={`${url}/resize?url=${image}&width=500&height=500`}
                                className="w-100"
                              />
                            </div>
                          ))
                        )}
                    </Slider>
                  </div>
                </div>

                <div className="col-md-7">
                  <div className=" pt-3 pb-3 pl-4 pr-4">
                    <h6 className="mb-4">Product Details</h6>

                    <h4>{dataProduct.data.name}</h4>

                    <div className="productInfo mt-4">
                      <div className="row mb-2">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <MdBrandingWatermark />
                          </span>
                          <span className="name">Brand</span>
                        </div>

                        <div className="col-sm-9">
                          : <span>{dataProduct.data.brand}</span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <BiSolidCategoryAlt />
                          </span>
                          <span className="name">Category</span>
                        </div>

                        <div className="col-sm-9">
                          :{" "}
                          <span>
                            {dataProduct.data.parentCategory !== null
                              ? dataProduct.data.parentCategory.name
                              : null}
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <MdFilterVintage />
                          </span>
                          <span className="name">Size</span>
                        </div>

                        <div className="col-sm-9">
                          :{" "}
                          <span>
                            <div className="row">
                              <ul className="list list-inline tags sml">
                                {dataProduct.data.size.map((size) => (
                                  <li className="list-inline-item">
                                    <span>{size}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <IoIosColorPalette />
                          </span>
                          <span className="name">Color</span>
                        </div>

                        <div className="col-sm-9">
                          :{" "}
                          <span>
                            <div className="row">
                              <ul className="list list-inline tags sml">
                                {dataProduct.data.color.map((color) => (
                                  <li className="list-inline-item">
                                    <span>{color}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <BiSolidCategoryAlt />
                          </span>
                          <span className="name">Price</span>
                        </div>

                        <div className="col-sm-9">
                          : <span>{formatVND(dataProduct.data.price)}</span>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <BiSolidCategoryAlt />
                          </span>
                          <span className="name">Quantity</span>
                        </div>

                        <div className="col-sm-9">
                          : <span>{dataProduct.data.quantity}</span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <FaShoppingCart />
                          </span>
                          <span className="name">Discount</span>
                        </div>

                        <div className="col-sm-9">
                          : <span>{dataProduct.data.discount}%</span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <MdRateReview />
                          </span>
                          <span className="name">Favorite</span>
                        </div>

                        <div className="col-sm-9">
                          :{" "}
                          <span>
                            {dataProduct.data.favorite ? "Có" : "Không"}
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-sm-3 d-flex align-items-center">
                          <span className="icon">
                            <BsPatchCheckFill />
                          </span>
                          <span className="name">Seller</span>
                        </div>

                        <div className="col-sm-9">
                          :{" "}
                          <span>
                            {dataProduct.data.seller ? "Có" : "Không"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h6 className="mt-4 mb-3">Product Description</h6>
                {dataProduct.data.description && (
                  <p
                    style={{
                      padding:"15px",
                      background:"#EEEEEE"
                    }}
                  >
                    {decodeHTML(dataProduct.data.description)}
                  </p>
                )}{" "}
                <div
                  dangerouslySetInnerHTML={{
                    __html: decodeHTML(dataProduct.data.description),
                  }}
                />
                <br />
                {/* <h6 className="mt-4 mb-4">Rating Analytics</h6>

                <div className="ratingSection">
                    <div className="ratingrow d-flex align-items-center">
                      <span className="col1"> Star</span>
                      <div className="col2">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{ width: "70%" }}
                          ></div>
                        </div>
                      </div>
                      <span className="col3">(22)</span>
                    </div>

                  <div className="ratingrow d-flex align-items-center">
                    <span className="col1">4 Star</span>

                    <div className="col2">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>

                    <span className="col3">(22)</span>
                  </div>

                  <div className="ratingrow d-flex align-items-center">
                    <span className="col1">3 Star</span>

                    <div className="col2">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>

                    <span className="col3">(2)</span>
                  </div>

                  <div className="ratingrow d-flex align-items-center">
                    <span className="col1">2 Star</span>

                    <div className="col2">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                    </div>

                    <span className="col3">(2)</span>
                  </div>

                  <div className="ratingrow d-flex align-items-center">
                    <span className="col1">1 Star</span>

                    <div className="col2">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{ width: "50%" }}
                        ></div>
                      </div>
                    </div>

                    <span className="col3">(2)</span>
                  </div> 
                </div> */}
                <br />
                {/* <h6 className="mt-4 mb-4">Customer_reviews</h6> */}
                {/* <div className="reviewsSecrion">
                  <div className="reviewsRow">
                    <div className="row">
                      <div className="col-sm-7 d-flex">
                        <div className="d-flex flex-column">
                          <div className="userInfo d-flex align-items-center mb-3">
                            <UserAvatarImgComponent
                              img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                              lg={true}
                            />

                            <div className="info pl-3">
                              <h6>Miron Mahmud</h6>
                              <span>25 minutes ago!</span>
                            </div>
                          </div>

                          <Rating
                            name="read-only"
                            value={4.5}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-5 d-flex align-items-center">
                        <div className="ml-auto">
                          <Button className="btn-blue btn-big btn-lg ml-auto">
                            <FaReply /> &nbsp; Reply
                          </Button>
                        </div>
                      </div>

                      <p className="mt-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Omnis quo nostrum dolore fugiat ducimus labore debitis
                        unde autem recusandae? Eius harum tempora quis minima,
                        adipisci natus quod magni omnis quas.
                      </p>
                    </div>
                  </div>

                  <div className="reviewsRow reply">
                    <div className="row">
                      <div className="col-sm-7 d-flex">
                        <div className="d-flex flex-column">
                          <div className="userInfo d-flex align-items-center mb-3">
                            <UserAvatarImgComponent
                              img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                              lg={true}
                            />

                            <div className="info pl-3">
                              <h6>Miron Mahmud</h6>
                              <span>25 minutes ago!</span>
                            </div>
                          </div>

                          <Rating
                            name="read-only"
                            value={4.5}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-5 d-flex align-items-center">
                        <div className="ml-auto">
                          <Button className="btn-blue btn-big btn-lg ml-auto">
                            <FaReply /> &nbsp; Reply
                          </Button>
                        </div>
                      </div>

                      <p className="mt-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Omnis quo nostrum dolore fugiat ducimus labore debitis
                        unde autem recusandae? Eius harum tempora quis minima,
                        adipisci natus quod magni omnis quas.
                      </p>
                    </div>
                  </div>

                  <div className="reviewsRow reply">
                    <div className="row">
                      <div className="col-sm-7 d-flex">
                        <div className="d-flex flex-column">
                          <div className="userInfo d-flex align-items-center mb-3">
                            <UserAvatarImgComponent
                              img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                              lg={true}
                            />

                            <div className="info pl-3">
                              <h6>Miron Mahmud</h6>
                              <span>25 minutes ago!</span>
                            </div>
                          </div>

                          <Rating
                            name="read-only"
                            value={4.5}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-5 d-flex align-items-center">
                        <div className="ml-auto">
                          <Button className="btn-blue btn-big btn-lg ml-auto">
                            <FaReply /> &nbsp; Reply
                          </Button>
                        </div>
                      </div>

                      <p className="mt-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Omnis quo nostrum dolore fugiat ducimus labore debitis
                        unde autem recusandae? Eius harum tempora quis minima,
                        adipisci natus quod magni omnis quas.
                      </p>
                    </div>
                  </div>

                  <div className="reviewsRow">
                    <div className="row">
                      <div className="col-sm-7 d-flex">
                        <div className="d-flex flex-column">
                          <div className="userInfo d-flex align-items-center mb-3">
                            <UserAvatarImgComponent
                              img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp"
                              lg={true}
                            />

                            <div className="info pl-3">
                              <h6>Miron Mahmud</h6>
                              <span>25 minutes ago!</span>
                            </div>
                          </div>

                          <Rating
                            name="read-only"
                            value={4.5}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="col-md-5 d-flex align-items-center">
                        <div className="ml-auto">
                          <Button className="btn-blue btn-big btn-lg ml-auto">
                            <FaReply /> &nbsp; Reply
                          </Button>
                        </div>
                      </div>

                      <p className="mt-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Omnis quo nostrum dolore fugiat ducimus labore debitis
                        unde autem recusandae? Eius harum tempora quis minima,
                        adipisci natus quod magni omnis quas.
                      </p>
                    </div>
                  </div>
                </div> */}
                <h6 className="mt-4 mb-4">Review Reply Form</h6>
                <form className="reviewForm">
                  <textarea placeholder="write here "></textarea>

                  <Button className="btn-blue btn-big btn-lg w-100 mt-4">
                    drop your replies
                  </Button>
                </form>
              </div>
            </div>
          )}
      </div>
    </>
  );
};

export default ProductDetails;
