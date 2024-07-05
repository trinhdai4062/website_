import React, { useEffect, useState, useContext } from "react";
import Slider from "@mui/material/Slider";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { Button } from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import bannerImg from "../../../assets/images/banner1.jpg";
import { Link, useParams } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

import { UserContext } from "../../../pages/UserPage";
import { baseURL_ } from "../../../utils/env";
import {formatVND} from '../../../utils/formart'

function valuetext(value) {
  return `${value}°C`;
}
const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Sidebar = (props) => {
  const [value, setValue] = useState([100000, 60000000]);
  const [value2, setValue2] = useState(0);
  const [brandFilters, setBrandFilters] = React.useState([]);
  const [ratingsArr, setRatings] = React.useState([]);
  const [totalLength, setTotalLength] = useState([]);

  const context = useContext(UserContext);

  let { id } = useParams();

  var brands = [];
  var ratings = [];
  console.log('props',props.currentCatData)

  useEffect(() => {
    brands = [];
    ratings = [];
    props.currentCatData.length !== 0 &&
      props.currentCatData.map((item) => {
        brands.push(item.brand);
        ratings.push(parseFloat(item.star));
      });

    const brandList = brands.filter(
      (item, index) => brands.indexOf(item) === index
    );
    setBrandFilters(brandList);

    const ratings_ = ratings.filter(
      (item, index) => ratings.indexOf(item) === index
    );
    setRatings(ratings_);
  }, []);

  useEffect(() => {
    var priceMin = 0;
    var priceMax = 0;
    props.currentCatData.length !== 0 &&
      props.currentCatData.map((item, index) => {
        let prodPrice = parseInt(item.price);
        if (prodPrice > priceMax) {
            priceMax = prodPrice;
        }
        if (prodPrice < priceMin) {
            priceMin = prodPrice;
          }
      });
    const updatedValue = [...value];
    updatedValue[1] = priceMax;
    setValue(updatedValue);
  }, [props.currentCatData]);

  const filterByBrand = (keyword) => {
    props.filterByBrand(keyword);
  };

  const filterByRating = (keyword) => {
    props.filterByRating(parseFloat(keyword));
  };

  // useEffect(() => {
  //     filterByPrice(value[0], value[1]);
  // }, [value]);

  const filterByPrice = (minValue, maxValue) => {
    props.filterByPrice(minValue, maxValue);
  };

  return (
    <>
      <div className={`sidebarUser ${context.isOpenFilters === true && "open"}`} 
      style={{top: 0,paddingBottom:0}}>
        <div className="card border-0 shadow res-hide">
          <h3>Danh mục</h3>
          <div className="catList">
            {props.data.length !== 0 &&
              props.data.map((item, index) => {
                return (
                  <Link to={`/user/cat/${item._id}`}>
                    <div className="catItem d-flex align-items-center">
                      <span className="img">
                        <img
                          src={`${baseURL_}/resize?url=${item.image}&width=100&height=100`}
                          width={50}

                        />
                      </span>
                      <h4 className="mb-0 ml-3 mr-3 text-capitalize">
                        {item.name}
                      </h4>
                      <span className="d-flex align-items-center justify-content-center rounded-circle ml-auto">
                        {item.parentShose.length}
                      </span>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="card border-0 shadow">
          <h3>Lọc theo giá</h3>

          <RangeSlider
            value={value}
            onInput={setValue}
            min={100}
            max={60000}
            step={5}
          />

          <div className="d-flex pt-2 pb-2 priceRange">
            <span>
              Từ: <strong className="text-success">{formatVND(value[0]) }</strong>
            </span>
            <span className="ml-auto">
              Đến: <strong className="text-success">{formatVND(value[1])}</strong>
            </span>
          </div>

          <div className="filters pt-5">
            <h5>Lọc theo thương hiệu</h5>

            <ul className="mb-0">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {brandFilters.length !== 0 &&
                  brandFilters.map((item, index) => {
                    return (
                      <li key={index}>
                        {" "}
                        <FormControlLabel
                          value={item}
                          control={
                            <Radio onChange={() => filterByBrand(item)} />
                          }
                          label={item}
                        />
                      </li>
                    );
                  })}
              </RadioGroup>
            </ul>
          </div>

          <div className="filters pt-0">
            <h5>Lọc theo đánh chất lượng</h5>
            <ul>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                {ratingsArr.length !== 0 &&
                  ratingsArr.map((item, index) => {
                    return (
                      <li key={index}>
                        {" "}
                        <FormControlLabel
                          value={item}
                          control={
                            <Radio onChange={() => filterByRating(item)} />
                          }
                          label={item}
                        />
                      </li>
                    );
                  })}
              </RadioGroup>
            </ul>
          </div>

          <div className="d-flex filterWrapper">
            <Button
              className="btn btn-g w-100"
              onClick={() => context.openFilters()}
            >
              <FilterAltOutlinedIcon /> Filter
            </Button>
          </div>
        </div>

        {/* <img src={bannerImg} className="w-100" /> */}
      </div>
    </>
  );
};

export default Sidebar;
