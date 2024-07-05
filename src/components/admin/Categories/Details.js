import React, { useEffect, useRef, useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import Slider from "react-slick";
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdFilterVintage } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { useParams } from "react-router-dom";
import { convertToVietnamTime } from "../../../utils/formart";
import api from "../../../api/api";
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

const CategoriesDetails = () => {
  const { id } = useParams();



  const [dataCategory, setdataCategory] = useState();
  const categoriesSliderBig = useRef();
  const categoriesSliderSml = useRef();

  var categoriesSliderOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  var categoriesSliderSmlOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  const goToSlide = (index) => {
    categoriesSliderBig.current.slickGoTo(index);
    categoriesSliderSml.current.slickGoTo(index);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getdataCategory();
  }, [id]);

  const getdataCategory = async () => {
    try {
      const responsive = await api.get(`${baseURL_}/categori/${id}`);
      // console.log("res", responsive);
      if (responsive.status === 200) {
        setdataCategory(responsive.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  // console.log('dataCategory',dataCategory)

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4">
          <h5 className="mb-0">Categories View</h5>
          <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
            <StyledBreadcrumb
              component="a"
              href="/admin/dashboard"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />

            <StyledBreadcrumb
              label="Category"
              component="a"
              href="/admin/category"
            />
            <StyledBreadcrumb label="Category View" />
          </Breadcrumbs>
        </div>
        {dataCategory && (
          <div className="card categoriesDetailsSEction">
            <div className="row">
              <div className="col-md-5">
                <div className="sliderWrapper pt-3 pb-3 pl-4 pr-4">
                  <h6 className="mb-4">Categories Gallery</h6>
                  <Slider
                    {...categoriesSliderOptions}
                    ref={categoriesSliderBig}
                    className="sliderBig mb-2"
                  >
                    <div className="item">
                      <img
                        src={`${baseURL_}/resize?url=${dataCategory.image}&width=500&height=500`}
                        className="w-100"
                      />
                    </div>
                  </Slider>
                </div>
              </div>

              <div className="col-md-7">
                <div className=" pt-3 pb-3 pl-4 pr-4">
                  <h6 className="mb-4">Categories Details</h6>

                  <h4>{dataCategory.name}</h4>

                  <div className="productInfo mt-4">
                    <div className="row mb-2">
                      <div className="col ms-2 d-flex">
                        <span className="icon">
                          <BiSolidCategoryAlt />
                        </span>
                        <span className="name">Slug</span>
                      </div>

                      <div className="col-sm-7">
                        :<span>{dataCategory.slug}</span>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col ms-2 d-flex">
                        <span className="icon">
                          <IoIosColorPalette />
                        </span>
                        <span className="name">Time Create</span>
                      </div>

                      <div className="col-sm-7">
                        :
                        <span>
                          {convertToVietnamTime(dataCategory.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col ms-2 d-flex">
                        <span className="icon">
                          <MdBrandingWatermark />
                        </span>
                        <span className="name">Time Update</span>
                      </div>

                      <div className="col-sm-7">
                        :{" "}
                        <span>
                          {convertToVietnamTime(dataCategory.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col ms-2 d-flex">
                        <span className="icon">
                          <MdFilterVintage />
                        </span>
                        <span className="name">Quantity Products</span>
                      </div>

                      <div className="col-sm-7">
                        :{" "}
                        <span>
                          {dataCategory.parentShose.length>0?dataCategory.parentShose.length:0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h6 className="mt-4 mb-3">Categories Description</h6>

              <p
                style={{
                  padding: "15px",
                  background: "#EEEEEE",
                }}
              >
                {dataCategory.description}
              </p>

              {/* <h6 className="mt-4 mb-4">Review Reply Form</h6>
              <form className="reviewForm">
                <textarea placeholder="write here "></textarea>

                <Button className="btn-blue btn-big btn-lg w-100 mt-4">
                  drop your replies
                </Button>
              </form> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesDetails;
