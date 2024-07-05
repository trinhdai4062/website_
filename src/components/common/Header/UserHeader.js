import React, { useState, useEffect, useRef } from "react";
import "../Header/userheader.css";
import Logo from "../../../assets/images/logo.svg";
import SearchIcon from "@mui/icons-material/Search";
import Select from "../selectDrop/select";
import axios from "axios";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import IconCompare from "../../../assets/images/icon-compare.svg";
import IconHeart from "../../../assets/images/icon-heart.svg";
import IconCart from "../../../assets/images/icon-cart.svg";
import IconUser from "../../../assets/images/icon-user.svg";

import Button from "@mui/material/Button";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import Nav from "./nav/nav";
import { Link } from "react-router-dom";
import { useContext } from "react";

// import { MyContext } from '../../../App';
import { UserContext } from "../../../pages/UserPage";

import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { baseIMG_ } from "../../../utils/env";

const UserHeader = (props) => {
  const [isOpenDropDown, setisOpenDropDown] = useState(false);
  const [isOpenAccDropDown, setisOpenAccDropDown] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isopenSearch, setOpenSearch] = useState(false);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [categories, setcategories] = useState([]);
  const [selectCate, setSelectCate] = useState("");
  const headerRef = useRef();
  const searchInput = useRef();
  const [searchValue, setSearchValue] = useState("");

  const context = useContext(UserContext);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log("user", userData);
  useEffect(() => {}, [context.cartItems]);

  useEffect(() => {
    const temp = props.data.categoriData.map((item) => ({
      name: item.name,
      id: item._id,
    }));
    setcategories(temp);
  }, [props]);

  // useEffect(() => {
  //     window.addEventListener("scroll", () => {
  //         let position = window.pageYOffset;
  //         if (position > 100) {
  //             headerRef.current.classList.add('fixed');
  //         } else {
  //             headerRef.current.classList.remove('fixed');
  //         }
  //     })
  // }, [])
  console.log("context", context);

  const signOut = () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (token !== null) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("_id");
      localStorage.removeItem("userData");
      localStorage.removeItem("shop");
    }
    context.setIsLogin(false);
    navigate("/login");
  };

  const openSearch = () => {
    setOpenSearch(true);
    searchInput.current.focus();
  };

  const closeSearch = () => {
    setOpenSearch(false);
    searchInput.current.blur();
    searchInput.current.value = "";
  };

  const openNav = () => {
    setIsOpenNav(true);
    context.setIsopenNavigation(true);
  };

  const closeNav = () => {
    setIsOpenNav(false);
    setisOpenAccDropDown(false);
    context.setIsopenNavigation(false);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const performSearch = () => {
    const kd = props.data.productData.filter((i) => {
      const nameMatches = i.name
        .toLowerCase()
        .includes(searchValue.toLowerCase());
      const categoryMatches = selectCate
        ? i.parentCategory === selectCate
        : true;
      return nameMatches && categoryMatches;
    });

    console.log("usser:", kd);
    console.log("Searching for:", searchValue);
  };

  const handleCategorySelect = (category) => {
    setSelectCate(category);
  };

  return (
    <>
      <div className="headerWrapper" ref={headerRef}>
        <header>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-2 part1 d-flex align-items-center">
                <Link to="/user/">
                  <img
                    src={require("../../../assets/images/logo_background.png")}
                    className="logo"
                    style={{ height: 80, width: 120 }}
                  />
                </Link>
                {windowWidth < 992 && (
                  <div className="ml-auto d-flex align-items-center">
                    <div className="navbarToggle mr-0" onClick={openSearch}>
                      <SearchIcon />
                    </div>
                    <ul className="list list-inline mb-0 headerTabs pl-0 mr-4">
                      <li className="list-inline-item">
                        <span>
                          <Link to={"/user/cart"}>
                            {" "}
                            <img src={IconCart} />
                            <span className="badge bg-success rounded-circle">
                              {context.cartItems.length}
                            </span>
                          </Link>
                        </span>
                      </li>
                    </ul>
                    <div className="navbarToggle mr-2" onClick={openNav}>
                      <MenuIcon />
                    </div>
                    {context.isLogin === "true" && (
                      <div
                        className="myAccDrop"
                        onClick={() => setisOpenAccDropDown(!isOpenAccDropDown)}
                      >
                        <PersonOutlineOutlinedIcon />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/*headerSearch start here */}
              <div className="col-sm-5 part2">
                <div
                  className={`headerSearch d-flex align-items-center ${
                    isopenSearch === true ? "open" : ""
                  }`}
                >
                  {windowWidth < 992 && (
                    <div class="closeSearch" onClick={closeSearch}>
                      <ArrowBackIosIcon />
                    </div>
                  )}
                  <Select
                    data={categories}
                    placeholder={"All Categories"}
                    icon={false}
                    onSelect={handleCategorySelect}
                  />

                  <div className="search">
                    <input
                      type="text"
                      placeholder="Search for items..."
                      ref={searchInput}
                      value={searchValue}
                      onChange={handleSearch}
                      onKeyPress={(e) => e.key === "Enter" && performSearch()}
                    />
                    <SearchIcon
                      className="searchIcon cursor"
                      onClick={performSearch}
                    />
                  </div>
                </div>
              </div>
              {/*headerSearch start here */}

              <div className="col-sm-5 d-flex align-items-center part3 res-hide">
                <div className="ml-auto d-flex align-items-center">
                  <ClickAwayListener
                    onClickAway={() => setisOpenDropDown(false)}
                  >
                    <ul className="list list-inline mb-0 headerTabs">
                      {/* <li className="list-inline-item">
                        <span>
                          <img src={IconCompare} />
                          <span className="badge bg-success rounded-circle">
                            3
                          </span>
                          Compare
                        </span>
                      </li> */}
                      <li className="list-inline-item">
                        <EmailOutlinedIcon />
                        <span>
                        <Link to={"/user/chat"}>
                          <span className="badge bg-success rounded-circle">
                            3
                          </span>
                          Message
                          </Link>
                        </span>
                      </li>
                      <li className="list-inline-item">
                        <span>
                          <Link to={"/cart"}>
                            {" "}
                            <img src={IconCart} />
                            <span className="badge bg-success rounded-circle">
                              {context.cartItems.length}
                            </span>
                            Cart
                          </Link>
                        </span>
                      </li>

                      {context.isLogin === true ? (
                        <li className="list-inline-item">
                          <span
                            onClick={() => setisOpenDropDown(!isOpenDropDown)}
                          >
                            <img
                              src={
                                userData && userData.avatar
                                  ? userData.avatar
                                  : IconUser
                              }
                              style={{ height: 50, width: 50,borderRadius:25 }}
                            />
                            {userData.fullName
                              ? userData.fullName
                              : userData.username}
                          </span>

                          {isOpenDropDown !== false && (
                            <ul className="dropdownMenu">
                              <li>
                                <Button className="align-items-center">
                                  <Person2OutlinedIcon />{" "}
                                  {userData.fullName
                                    ? userData.fullName
                                    : userData.username}
                                </Button>
                              </li>
                              <li>
                                <Button>
                                  <LocationOnOutlinedIcon /> Order Tracking
                                </Button>
                              </li>
                              <li>
                                <Button>
                                  <FavoriteBorderOutlinedIcon /> My Wishlist
                                </Button>
                              </li>
                              <li>
                                <Button>
                                  <SettingsOutlinedIcon /> Setting
                                </Button>
                              </li>
                              <li>
                                <Button onClick={signOut}>
                                  <LogoutOutlinedIcon /> Sign out
                                </Button>
                              </li>
                            </ul>
                          )}
                        </li>
                      ) : (
                        <li className="list-inline-item">
                          <Link to={"/login"}>
                            <Button className="btn btn-g">Log In</Button>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </ClickAwayListener>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* <Nav data={props.data} openNav={isOpenNav} closeNav={closeNav} /> */}
      </div>

      <div className="afterHeader"></div>

      {isOpenAccDropDown !== false && (
        <>
          <div className="navbarOverlay" onClick={closeNav}></div>
          <ul className="dropdownMenu dropdownMenuAcc" onClick={closeNav}>
            <li>
              <Button className="align-items-center">
                <Link to="">
                  <Person2OutlinedIcon /> My Account
                </Link>
              </Button>
            </li>
            <li>
              <Button className="align-items-center">
                <Link to="">
                  {" "}
                  <img src={IconCompare} />
                  Compare
                </Link>
              </Button>
            </li>
            <li>
              <Button className="align-items-center">
                <Link to="">
                  {" "}
                  <img src={IconCart} />
                  Cart
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link to="">
                  <LocationOnOutlinedIcon /> Order Tracking
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link to="">
                  <FavoriteBorderOutlinedIcon /> My Wishlist
                </Link>
              </Button>
            </li>
            <li>
              <Button>
                <Link to="">
                  <SettingsOutlinedIcon /> Setting
                </Link>
              </Button>
            </li>
            <li>
              <Button onClick={signOut}>
                <Link to="">
                  <LogoutOutlinedIcon /> Sign out
                </Link>
              </Button>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default UserHeader;
