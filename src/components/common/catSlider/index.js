import React, { useEffect, useRef, useState, useContext } from "react";
import Slider from "react-slick";
import "./style.css";
import { Link } from "react-router-dom";

import { UserContext } from "../../../pages/UserPage";
import { baseURL_ ,baseIMG_} from "../../../utils/env";
const CatSlider = (props) => {
  const [allData, setAllData] = useState(props.data);
  const [totalLength, setTotalLength] = useState([]);
  const context = useContext(UserContext);

  const [itemBg, setItemBg] = useState([
    "#fffceb",
    "#ecffec",
    "#feefea",
    "#fff3eb",
    "#fff3ff",
    "#f2fce4",
    "#feefea",
    "#fffceb",
    "#feefea",
    "#ecffec",
    "#feefea",
    "#fff3eb",
    "#fff3ff",
    "#f2fce4",
    "#feefea",
    "#fffceb",
    "#feefea",
    "#ecffec",
  ]);
  useEffect(() => {
    setAllData(props.data);
  }, [props.data]);

  const slider = useRef();

  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 1,
    fade: false,
    arrows: context.windowWidth > 992 ? true : false,
    autoplay: context.windowWidth > 992 ? 2000 : false,
    centerMode: context.windowWidth > 992 ? true : false,
  };

  return (
    <>
      <div className="catSliderSection">
        <div className="container-fluid" ref={slider}>
          <h2 className="hd">Danh mục sản phẩm</h2>
          <Slider
            {...settings}
            className="cat_slider_Main"
            id="cat_slider_Main"
          >
            {allData.length !== 0 &&
              allData.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <Link to={`/user/cat/${item._id}`}>
                      <div
                        className="info"
                        style={{ background: itemBg[index] }}
                      >
                        <img src={baseIMG_+item.image} width="100" height="100" />
                        <h5 className="text-capitalize mt-3">
                          {item.name.toLowerCase()}
                        </h5>
                        <p>{item.parentShose.length} sản phẩm</p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            {/* {itemBg.length !== 0 &&
              itemBg.map((item, index) => {
                return (
                  <div className="item">
                    <div className="info" style={{ background: item }}>
                      <img src="https://wp.alithemes.com/html/nest/demo/assets/imgs/shop/cat-13.png" />
                      <h5>Cake & Milk</h5>
                      <p>26 items</p>
                    </div>
                  </div>
                );
              })} */}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default CatSlider;
