import React, { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import Slider from "react-slick";
import { useRef } from "react";
import { useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useEffect } from "react";
import { Button } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import Product from "../../common/product";
import api from "../../../api/api";
import { UserContext } from "../../../pages/UserPage";

import { formatPrice } from "../../../utils/formart";
import { baseURL_ } from "../../../utils/env";
import { useDispatch } from "react-redux";
import { addtoCart } from "../../../redux/reducer/shopReducer";

const DetailsPage = ({ productData }) => {
  const dispatch = useDispatch();
  const [zoomInage, setZoomImage] = useState(
    "https://www.jiomart.com/images/product/original/490000363/maggi-2-minute-masala-noodles-70-g-product-images-o490000363-p490000363-0-202305292130.jpg"
  );

  const [bigImageSize, setBigImageSize] = useState([1500, 1500]);
  const [smlImageSize, setSmlImageSize] = useState([150, 150]);

  const [activeSize, setActiveSize] = useState('');
  const [activeColor, setActiveColor] = useState('');

  const [inputValue, setinputValue] = useState(1);

  const [activeTabs, setActiveTabs] = useState(0);

  const [currentProduct, setCurrentProduct] = useState({});
  const [isAdded, setIsadded] = useState(false);

  const context = useContext(UserContext);

  const [prodCat, setProdCat] = useState({
    parentCat: sessionStorage.getItem("parentCat"),
    subCatName: sessionStorage.getItem("subCatName"),
  });

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [rating, setRating] = useState(0.0);

  const [reviewsArr, setReviewsArr] = useState([]);

  const [isAlreadyAddedInCart, setisAlreadyAddedInCart] = useState(false);

  const [reviewFields, setReviewFields] = useState({
    review: "",
    userName: "",
    rating: 0.0,
    productId: 0,
    date: "",
  });

  const zoomSliderBig = useRef();
  const zoomSlider = useRef();

  let { id } = useParams();

  var settings2 = {
    dots: false,
    infinite: false,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    arrows: false,
  };

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth > 992 ? true : false,
  };

  var related = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth > 992 ? true : false,
  };

  const goto = (index) => {
    zoomSlider.current.slickGoTo(index);
    zoomSliderBig.current.slickGoTo(index);
  };

  const plus = () => {
    setinputValue(inputValue + 1);
  };

  const minus = () => {
    if (inputValue !== 1) {
      setinputValue(inputValue - 1);
    }
  };

  const getProductData = async (url) => {
    try {
      await api.get(url).then((response) => {
        console.log("setCurrentProduct", response.data);
        // setDataCateGori([response.data]);
        if (response.data.status === true) {
          setCurrentProduct(response.data);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const profileData = currentProduct?.data?.userId
    ? currentProduct.data.userId
    : null;

  // const {
  //   idConversation,
  //   createdAt,
  //   deviceToken,
  //   idDiscount,
  //   idInformation,
  //   idNotification,
  //   isActive,
  //   role,
  //   updateAt,
  //   email,
  //   ...newUser
  // } = profileData||null;

  console.log("newuser", profileData);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProductData(`${baseURL_}/shose/${id}`);
  }, [id]);
  // console.log("productDatadsdsdsd", productData);
  // console.log("idproduct", id);
  // console.log("currentProduct", currentProduct);
  // console.log("isAlreadyAddedInCart", isAlreadyAddedInCart);
  // console.log("isAdded", isAdded);

  //   useEffect(() => {
  // productData.length !== 0 &&
  // productData.map((product) => {
  //     if (parseInt(product._id) === parseInt(id)) {
  //         setCurrentProduct(product);
  //     }
  //     })
  //related products code

  // const related_products = [];

  // productData.length !== 0 &&
  // productData.map((item) => {
  //         if (prodCat.parentCat === item.cat_name) {
  //             item.items.length !== 0 &&
  //                 item.items.map((item_) => {
  //                     if (prodCat.subCatName === item_.cat_name) {
  //                         item_.products.length !== 0 &&
  //                             item_.products.map((product, index) => {
  //                                 if (product.id !== parseInt(id)) {
  //                                     related_products.push(product)
  //                                 }

  //                             })
  //                     }
  //                 })
  //         }

  //     })

  //     if (related_products.length !== 0) {
  //       setRelatedProducts(related_products);
  //     }

  //     showReviews();

  //     getCartData("http://localhost:5000/cartItems");
  //   }, [id]);

  const changeInput = (name, value) => {
    if (name === "rating") {
      setRating(value);
    }
    setReviewFields(() => ({
      ...reviewFields,
      [name]: value,
      productId: id,
      date: new Date().toLocaleString(),
    }));
  };

  const reviews_Arr = [];

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await api
        .post("http://localhost:5000/productReviews", reviewFields)
        .then((response) => {
          reviews_Arr.push(response.data);
          setReviewFields(() => ({
            review: "",
            userName: "",
            rating: 0.0,
            productId: 0,
            date: "",
          }));
        });
    } catch (error) {
      console.log(error.message);
    }

    showReviews();
  };

  var reviews_Arr2 = [];
  const showReviews = async () => {
    try {
      await api.get("http://localhost:5000/productReviews").then((response) => {
        if (response.data.length !== 0) {
          response.data.map((item) => {
            if (parseInt(item.productId) === parseInt(id)) {
              reviews_Arr2.push(item);
            }
          });
        }
      });
    } catch (error) {
      console.log(error.message);
    }

    if (reviews_Arr2.length !== 0) {
      setReviewsArr(reviews_Arr2);
    }
  };

  const addToCart = (item) => {
    const randomNumber = Math.floor(Math.random() * 9000) + 1000;
    console.log("item", item.data);
    const data = {
      userId: profileData,
      item: [
        {
          id: randomNumber + item.data._id,
          productId: item.data._id,
          name: item.data.name,
          image: item.data.imageUrl,
          size: activeSize,
          color: activeColor,
          quantity: 1,
          price: item.data.price - item.data.price * (item.data.discount / 100),
          selected: false,
        },
      ],
    };
    console.log("data", data);

    dispatch(addtoCart(data));
    // context.addToCart(item);
    // setIsadded(true);
  };

  const getCartData = async (url) => {
    try {
      await api.get(url).then((response) => {
        response.data.length !== 0 &&
          response.data.map((item) => {
            if (parseInt(item.id) === parseInt(id)) {
              setisAlreadyAddedInCart(true);
            }
          });
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFavorite = () => {
    console.log("handleFavorite");
  };


  return (
    <>
      {context.windowWidth < 992 && (
        <Button
          className={`btn-g btn-lg w-100 filterBtn {isAlreadyAddedInCart===true && 'no-click'}`}
          onClick={() => addToCart(currentProduct)}
        >
          <ShoppingCartOutlinedIcon />
          {isAdded === true || isAlreadyAddedInCart === true
            ? "Mua ngay"
            : "Thêm vào giỏ hàng"}
        </Button>
      )}
      {currentProduct.status === true && (
        <section className="detailsPage mb-5">
          {/* {context.windowWidth > 992 && (
            <div className="breadcrumbWrapper mb-4">
              <div className="container-fluid">
                <ul className="breadcrumb breadcrumb2 mb-0">
                  <li>
                    <Link>Home</Link>{" "}
                  </li>
                  <li>
                    <Link
                      to={`/cat/${prodCat.parentCat
                        .split(" ")
                        .join("-")
                        .toLowerCase()}`}
                      onClick={() =>
                        sessionStorage.setItem(
                          "cat",
                          prodCat.parentCat.split(" ").join("-").toLowerCase()
                        )
                      }
                      className="text-capitalize"
                    >
                      {prodCat.parentCat}
                    </Link>{" "}
                  </li>

                  <li>
                    <Link
                      to={`/cat/${prodCat.parentCat.toLowerCase()}/${prodCat.subCatName
                        .replace(/\s/g, "-")
                        .toLowerCase()}`}
                      onClick={() =>
                        sessionStorage.setItem(
                          "cat",
                          prodCat.subCatName.toLowerCase()
                        )
                      }
                      className="text-capitalize"
                    >
                      {prodCat.subCatName}
                    </Link>{" "}
                  </li>
                  <li>{currentProduct.data.name}</li>
                </ul>
              </div>
            </div>
          )} */}

          <div className="container detailsContainer pt-3 pb-3">
            <div className="row">
              {/* productZoom code start here */}
              <div className="col-md-5">
                <div className="productZoom">
                  <Slider
                    {...settings2}
                    className="zoomSliderBig"
                    ref={zoomSliderBig}
                  >
                    {currentProduct.imgShose !== undefined &&
                      currentProduct.imgShose.map((imgUrl, index) => {
                        return imgUrl.images.map((item, subIndex) => {
                          return (
                            <div className="item" key={subIndex}>
                              <InnerImageZoom
                                zoomType="hover"
                                zoomScale={1}
                                // src={item.url}
                                src={`${baseURL_}/resize?url=${item}&width=${bigImageSize[0]}&height=${bigImageSize[0]}`}
                              />
                            </div>
                          );
                        });
                      })}
                  </Slider>
                </div>

                <Slider {...settings} className="zoomSlider" ref={zoomSlider}>
                  {currentProduct.imgShose !== undefined &&
                    currentProduct.imgShose.map((imgUrl, index) => {
                      return imgUrl.images.map((item, subIndex) => {
                        return (
                          <div className="item" key={subIndex}>
                            <img
                              src={`${baseURL_}/resize?url=${item}&width=${bigImageSize[0]}&height=${bigImageSize[0]}`}
                              className="w-100"
                              onClick={() => goto(subIndex)}
                            />
                          </div>
                        );
                      });
                    })}
                </Slider>
              </div>
              {/* productZoom code ends here */}

              {/* product info code start here */}
              <div className="col-md-7 productInfo">
                <h1>{currentProduct.data.name}</h1>
                <div className="d-flex align-items-center mb-4 mt-3">
                  <Rating
                    name="half-rating-read"
                    value={parseFloat(currentProduct.data.star)}
                    precision={0.5}
                    readOnly
                  />
                  {/* <span className='text-light ml-2'>(32 reviews)</span> */}
                </div>

                <div className="priceSec d-flex align-items-center mb-3">
                  <span className="text-g priceLarge">
                    {formatPrice(
                      currentProduct.data.price -
                        currentProduct.data.price *
                          (currentProduct.data.discount / 100)
                    )}
                  </span>
                  <div className="ml-3 d-flex flex-column">
                    <span className="text-org">
                      {currentProduct.data.discount}% Off
                    </span>
                    <span className="text-light oldPrice">
                      {formatPrice(currentProduct.data.price)}
                    </span>
                  </div>
                </div>

                <p>{currentProduct.data.description}</p>

                {currentProduct.data.size !== undefined &&
                  currentProduct.data.size.length !== 0 && (
                    <div className="productSize d-flex align-items-center">
                      <span>Size:</span>
                      <ul className="list list-inline mb-0 pl-4">
                        {currentProduct.data.size.map((item) => {
                          return (
                            <li className="list-inline-item">
                              <a
                                className={`tag ${
                                  activeSize === item ? "active" : ""
                                }`}
                                onClick={() => setActiveSize(item)}
                              >
                                {item}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                <div className="productSize d-flex align-items-center">
                  <span>Màu:</span>
                  <ul className="list list-inline mb-0 pl-4">
                    {currentProduct.data.color.map((item) => (
                      <li className="list-inline-item">
                        <a
                          className={`tag ${
                            activeColor === item ? "active" : ""
                          }`}
                          onClick={()=>setActiveColor(item)}

                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    {context.windowWidth > 992 && (
                      <Button
                        className={`btn-g btn-lg addtocartbtn ${
                          isAlreadyAddedInCart === true && "no-click"
                        }`}
                        onClick={() => addToCart(currentProduct)}
                      >
                        <ShoppingCartOutlinedIcon />
                        {isAdded === true || isAlreadyAddedInCart === true
                          ? "Mua Ngay"
                          : "Thêm vào giỏ hàng"}
                      </Button>
                    )}
                    <Button
                      style={{}}
                      className=" btn-lg addtocartbtn  ml-3  wishlist btn-border"
                      onClick={handleFavorite}
                    >
                      <FavoriteBorderOutlinedIcon />{" "}
                    </Button>
                  </div>
                </div>
              </div>
              {/* product info code ends here */}
            </div>

            <div className="card mt-5 p-5 detailsPageTabs">
              <div className="customTabs">
                <ul className="list list-inline">
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 0 && "active"}`}
                      onClick={() => {
                        setActiveTabs(0);
                      }}
                    >
                      Description
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 1 && "active"}`}
                      onClick={() => {
                        setActiveTabs(1);
                      }}
                    >
                      Additional info
                    </Button>
                  </li>
                  {/* <li className="list-inline-item">
                    <Button
                      className={`${activeTabs === 2 && "active"}`}
                      onClick={() => {
                        setActiveTabs(2);
                        showReviews();
                      }}
                    >
                      Reviews (3)
                    </Button>
                  </li> */}
                </ul>

                <br />

                {/* {activeTabs === 0 && (
                  <div className="tabContent">
                    <p>{currentProduct.description}</p>
                  </div>
                )}

                {activeTabs === 1 && (
                  <div className="tabContent">
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr class="stand-up">
                            <th>Stand Up</th>
                            <td>
                              <p>35″L x 24″W x 37-45″H(front to back wheel)</p>
                            </td>
                          </tr>
                          <tr class="folded-wo-wheels">
                            <th>Folded (w/o wheels)</th>
                            <td>
                              <p>32.5″L x 18.5″W x 16.5″H</p>
                            </td>
                          </tr>
                          <tr class="folded-w-wheels">
                            <th>Folded (w/ wheels)</th>
                            <td>
                              <p>32.5″L x 24″W x 18.5″H</p>
                            </td>
                          </tr>
                          <tr class="door-pass-through">
                            <th>Door Pass Through</th>
                            <td>
                              <p>24</p>
                            </td>
                          </tr>
                          <tr class="frame">
                            <th>Frame</th>
                            <td>
                              <p>Aluminum</p>
                            </td>
                          </tr>
                          <tr class="weight-wo-wheels">
                            <th>Weight (w/o wheels)</th>
                            <td>
                              <p>20 LBS</p>
                            </td>
                          </tr>
                          <tr class="weight-capacity">
                            <th>Weight Capacity</th>
                            <td>
                              <p>60 LBS</p>
                            </td>
                          </tr>
                          <tr class="width">
                            <th>Width</th>
                            <td>
                              <p>24″</p>
                            </td>
                          </tr>
                          <tr class="handle-height-ground-to-handle">
                            <th>Handle height (ground to handle)</th>
                            <td>
                              <p>37-45″</p>
                            </td>
                          </tr>
                          <tr class="wheels">
                            <th>Wheels</th>
                            <td>
                              <p>12″ air / wide track slick tread</p>
                            </td>
                          </tr>
                          <tr class="seat-back-height">
                            <th>Seat back height</th>
                            <td>
                              <p>21.5″</p>
                            </td>
                          </tr>
                          <tr class="head-room-inside-canopy">
                            <th>Head room (inside canopy)</th>
                            <td>
                              <p>25″</p>
                            </td>
                          </tr>
                          <tr class="pa_color">
                            <th>Color</th>
                            <td>
                              <p>Black, Blue, Red, White</p>
                            </td>
                          </tr>
                          <tr class="pa_size">
                            <th>Size</th>
                            <td>
                              <p>M, S</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTabs === 2 && (
                  <div className="tabContent">
                    <div className="row">
                      <div className="col-md-8">
                        <h3>Customer questions & answers</h3>
                        <br />

                        {reviewsArr.length !== 0 &&
                          reviewsArr !== undefined &&
                          reviewsArr.map((item, index) => {
                            return (
                              <div
                                className="card p-4 reviewsCard flex-row"
                                key={index}
                              >
                                <div className="image">
                                  <div className="rounded-circle">
                                    <img src="https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png" />
                                  </div>
                                  <span className="text-g d-block text-center font-weight-bold">
                                    {item.userName}
                                  </span>
                                </div>

                                <div className="info pl-5">
                                  <div className="d-flex align-items-center w-100">
                                    <h5 className="text-light">{item.date}</h5>
                                    <div className="ml-auto">
                                      <Rating
                                        name="half-rating-read"
                                        value={parseFloat(item.rating)}
                                        precision={0.5}
                                        readOnly
                                      />
                                    </div>
                                  </div>

                                  <p>{item.review} </p>
                                </div>
                              </div>
                            );
                          })}

                        <br className="res-hide" />

                        <br className="res-hide" />

                        <form className="reviewForm" onSubmit={submitReview}>
                          <h4>Add a review</h4> <br />
                          <div className="form-group">
                            <textarea
                              className="form-control"
                              placeholder="Write a Review"
                              name="review"
                              value={reviewFields.review}
                              onChange={(e) =>
                                changeInput(e.target.name, e.target.value)
                              }
                            ></textarea>
                          </div>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                <input
                                  type="text"
                                  value={reviewFields.userName}
                                  className="form-control"
                                  placeholder="Name"
                                  name="userName"
                                  onChange={(e) =>
                                    changeInput(e.target.name, e.target.value)
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <Rating
                                  name="rating"
                                  value={rating}
                                  precision={0.5}
                                  onChange={(e) =>
                                    changeInput(e.target.name, e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <br />
                          <div className="form-group">
                            <Button type="submit" className="btn-g btn-lg">
                              Submit Review
                            </Button>
                          </div>
                        </form>
                      </div>

                      <div className="col-md-4 pl-5 reviewBox">
                        <h4>Customer reviews</h4>

                        <div className="d-flex align-items-center mt-2">
                          <Rating
                            name="half-rating-read"
                            defaultValue={4.5}
                            precision={0.5}
                            readOnly
                          />
                          <strong className="ml-3">4.8 out of 5</strong>
                        </div>

                        <br />

                        <div className="progressBarBox d-flex align-items-center">
                          <span className="mr-3">5 star</span>
                          <div
                            class="progress"
                            style={{ width: "85%", height: "20px" }}
                          >
                            <div
                              class="progress-bar bg-success"
                              style={{ width: "75%", height: "20px" }}
                            >
                              75%
                            </div>
                          </div>
                        </div>

                        <div className="progressBarBox d-flex align-items-center">
                          <span className="mr-3">4 star</span>
                          <div
                            class="progress"
                            style={{ width: "85%", height: "20px" }}
                          >
                            <div
                              class="progress-bar bg-success"
                              style={{ width: "50%", height: "20px" }}
                            >
                              50%
                            </div>
                          </div>
                        </div>

                        <div className="progressBarBox d-flex align-items-center">
                          <span className="mr-3">3 star</span>
                          <div
                            class="progress"
                            style={{ width: "85%", height: "20px" }}
                          >
                            <div
                              class="progress-bar bg-success"
                              style={{ width: "55%", height: "20px" }}
                            >
                              55%
                            </div>
                          </div>
                        </div>

                        <div className="progressBarBox d-flex align-items-center">
                          <span className="mr-3">2 star</span>
                          <div
                            class="progress"
                            style={{ width: "85%", height: "20px" }}
                          >
                            <div
                              class="progress-bar bg-success"
                              style={{ width: "35%", height: "20px" }}
                            >
                              35%
                            </div>
                          </div>
                        </div>

                        <div className="progressBarBox d-flex align-items-center">
                          <span className="mr-3">1 star</span>
                          <div
                            class="progress"
                            style={{ width: "85%", height: "20px" }}
                          >
                            <div
                              class="progress-bar bg-success"
                              style={{ width: "25%", height: "20px" }}
                            >
                              25%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
            </div>

            <br />

            {/* <div className="relatedProducts homeProductsRow2  pt-5 pb-4">
              <h2 class="hd mb-0 mt-0">Related products</h2>
              <br className="res-hide" />
              <Slider {...related} className="prodSlider">
                {relatedProducts.length !== 0 &&
                  relatedProducts.map((product, index) => {
                    return (
                      <div className="item" key={index}>
                        <Product tag={product.type} item={product} />
                      </div>
                    );
                  })}
              </Slider>
            </div> */}
          </div>
        </section>
      )}
    </>
  );
};

export default DetailsPage;
