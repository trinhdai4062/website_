import React, { useState, useEffect, useRef, useContext } from "react";
import SliderBanner from "./slider/index";
import CatSlider from "../../common/catSlider";
import Banners from "../../common/banners";
import "./style.css";
import Product from "../../common/product";
import Banner4 from "../../../assets/images/banner4.jpg";
import Slider from "react-slick";
import TopProducts from "./TopProducts";
import axios from "axios";
import { UserContext } from "../../../pages/UserPage";

const Home = ({ categoriData, productData }) => {
  const [activeTab, setactiveTab] = useState();
  const [activeTabIndex, setactiveTabIndex] = useState(0);
  const [activeTabData, setActiveTabData] = useState([]);
  const [bestSells, setBestSells] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const productRow = useRef();
  const context = useContext(UserContext);

  useEffect(() => {
    var arr = [];
    setActiveTabData(arr);
    productData.length !== 0 &&
      productData.forEach((item, index) => {
        if (item.parentCategory === activeTab) {
          arr.push({ ...item });
        }
      });
    setActiveTabData(arr);
    setTimeout(() => {
      setIsLoadingProducts(false);
    }, 4000);
  }, [activeTab, productData]);

  useEffect(() => {
    const bestSellsArr = productData.filter((item) => item.seller === true);
    setBestSells(bestSellsArr);
  }, [categoriData, productData, activeTab]);
  // console.log("categoriData", categoriData);

  var settings = {
    dots: false,
    infinite: context.windowWidth < 992 ? false : true,
    speed: 500,
    slidesToShow:
      context.windowWidth < 992 ? (context.windowWidth < 450 ? 5 : 3) : 5,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth < 992 ? false : true,
    vertical: context.windowWidth < 992 ? true : false,
    verticalSwiping: context.windowWidth < 992 ? true : false,
  };

  return (
    <div className="containerUser" style={{ display: "block" }}>
      <SliderBanner />
      {categoriData && categoriData.length > 0 && (
        <CatSlider data={categoriData} />
      )}
      <Banners />

      <section className="homeProducts homeProductWrapper">
        <div className="container-fluid">
          <div className="d-flex align-items-center homeProductsTitleWrap">
            <h2 className="hd mb-0 mt-0 res-full">Sản phẩm phổ biến</h2>
            <ul className="list list-inline ml-auto filterTab mb-0 res-full">
              {categoriData.length !== 0 &&
                categoriData.map((cat, index) => (
                  <li className="list list-inline-item" key={cat._id}>
                    <a
                      className={`cursor text-capitalize ${
                        activeTabIndex === index ? "act" : ""
                      }`}
                      onClick={() => {
                        setactiveTab(cat._id);
                        setactiveTabIndex(index);
                        productRow.current.scrollLeft = 0;
                        setIsLoadingProducts(true);
                      }}
                    >
                      {cat.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div
            className={`productRow ${isLoadingProducts && "loading"}`}
            ref={productRow}
          >
            {activeTabData.map((item, index) => (
              <div className="item" key={index}>
                <Product item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="homeProducts homeProductsRow2 pt-0">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <h2 className="hd mb-0 mt-0">Sản phẩm bán chạy</h2>
          </div>

          <br className="res-hide" />
          <br className="res-hide" />
          <div className="prodSlider">
            <Slider {...settings}>
              {bestSells.map((item, index) => (
                <div className="item" key={index}>
                  <Product item={item} />
                </div>
              ))}
            </Slider>
          </div>
          {/* <div className="row">
            <div className="col-md-12">
              <Slider {...settings} className="prodSlider">
                {bestSells.map((item, index) => (
                  <div className="item" key={index}>
                    <Product item={item} />
                  </div>
                ))}
              </Slider>
            </div>
          </div> */}
        </div>
      </section>

      {/* <section className="topProductsSection">
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <TopProducts title="Top Selling" />
            </div>

            <div className="col">
              <TopProducts title="Trending Products" />
            </div>

            <div className="col">
              <TopProducts title="Recently added" />
            </div>

            <div className="col">
              <TopProducts title="Top Rated" />
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;
