import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/images/logo.webp";
import patern from "../../assets/images/pattern.webp";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import googleIcon from "../../assets/images/googleIcon.png";
import { IoMdHome } from "react-icons/io";
import { AdminContext } from "../../App";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { baseURL_ } from "../../utils/env";
import axios from "axios";
import { app } from "../../firebase";
import { useNavigate } from "react-router-dom";


const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const SignUp = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const context = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const focusInput = (index) => {
    setInputIndex(index);
  };
  const signInWithGoogle = async () => {
    setShowLoader(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      const user = result.user;
      const data = {
        username: user.email,
        email: user.email,
        fullName: user.displayName,
        avatar: user.photoURL,
      };

      const res = await axios.post(`${baseURL_}/auth/loginsocial`, { data });
      console.log("Response from server:", res.data);

      setShowLoader(false);
      if (res.data.status === true) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("_id", res.data.data._id);
        localStorage.setItem("userData", JSON.stringify(res.data.data));
        localStorage.setItem("shop", res.data.data.shop);
        // console.log("login", response.data.data.shop);
        const role = res.data.data.role;
        context.setIsLogin(true);
        context.setShop(res.data.data.shop);
        navigate(role === "admin" ? "/admin" : "/user");
        // navigate("/admin");
      }
    } catch (error) {
      setShowLoader(false);
      console.error("Error signing in with Google:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Xử lý submit form đăng ký
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setShowLoader(true);
      const { name, email, password } = formData;
      const newUser = { username:name, email, password  };
      console.log('newUser',newUser)
      const res = await axios.post(`${baseURL_}/auth/register`, newUser);

        console.log('res',res)
      setShowLoader(false);
      if (res.data.status === true) {
        // alert("Registration successful!");
        // Đăng nhập ngay sau khi đăng ký thành công
        const loginRes = await axios.post(`${baseURL_}/auth/login`, {
          email,
          password,
        });

        if (loginRes.data.status === true) {
          localStorage.setItem("accessToken", loginRes.data.accessToken);
          localStorage.setItem("_id", loginRes.data.data._id);
          localStorage.setItem("userData", JSON.stringify(loginRes.data.data));
          localStorage.setItem("shop", loginRes.data.data.shop);

          const role = loginRes.data.data.role;
          context.setIsLogin(true);
          context.setShop(loginRes.data.data.shop);
          navigate(role === "admin" ? "/admin" : "/user");
        }
      } else {
        alert("Registration failed!");
      }
    }catch (error) {
        setShowLoader(false);
        if (error.response && error.response.data && Array.isArray(error.response.data.message)) {
          const errorMessages = error.response.data.message.map(msg => msg.msg).join("\n");
          alert(errorMessages);
        } else {
          alert("Unexpected error occurred. Please try again later.");
        }
      } }

  return (
    <>
      <img src={patern} className="loginPatern" />
      <section className="loginSection signUpSection">
        <Backdrop
          sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showLoader}
          className="formLoader"
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className="row">
          <div className="col-md-8 d-flex align-items-center flex-column part1 justify-content-center">
          
            <div className="w-100 mt-4">
              <Link to={"/"}>
                {" "}
                <Button className="btn-blue btn-lg btn-big">
                  <IoMdHome /> Go To Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="col-md-4 pr-0">
            <div className="loginBox">
              <div className="logo text-center">
                <img
                  src={require("../../assets/images/logo_background.png")}
                  width="120px"
                />
                <h5 className="font-weight-bold">Register a new account</h5>
              </div>

              <div className="wrapper mt-3 card border">
              <form onSubmit={handleSubmit}>
                  <div
                    className={`form-group position-relative ${
                      inputIndex === 0 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <FaUserCircle />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => focusInput(0)}
                      onBlur={() => setInputIndex(null)}
                      autoFocus
                      required
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 1 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <MdEmail />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      required
                    />
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 2 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={`${isShowPassword ? "text" : "password"}`}
                      className="form-control"
                      placeholder="Enter your password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => focusInput(2)}
                      onBlur={() => setInputIndex(null)}
                      minLength="6"
                      required
                    />

                    <span
                      className="toggleShowPassword"
                      onClick={() => setisShowPassword(!isShowPassword)}
                    >
                      {isShowPassword === true ? <IoMdEyeOff /> : <IoMdEye />}
                    </span>
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 3 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <IoShieldCheckmarkSharp />
                    </span>
                    <input
                      type={`${isShowConfirmPassword ? "text" : "password"}`}
                      className="form-control"
                      placeholder="Confirm your password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onFocus={() => focusInput(3)}
                      onBlur={() => setInputIndex(null)}
                      minLength="6"
                      required
                    />

                    <span
                      className="toggleShowPassword"
                      onClick={() =>
                        setisShowConfirmPassword(!isShowConfirmPassword)
                      }
                    >
                      {isShowConfirmPassword === true ? (
                        <IoMdEyeOff />
                      ) : (
                        <IoMdEye />
                      )}
                    </span>
                  </div>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        name="agreeTerms"
                      />
                    }
                    label="I agree to the all Terms & Conditions"
                  />

                  <div className="form-group">
                    <Button className="btn-blue btn-lg w-100 btn-big"  type="submit">
                      Sign Up
                    </Button>
                  </div>

                  <div className="form-group text-center mb-0">
                    <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                      <span className="line"></span>
                      <span className="txt">or</span>
                      <span className="line"></span>
                    </div>

                    <Button
                      onClick={signInWithGoogle}
                      variant="outlined"
                      className="w-100 btn-lg btn-big loginWithGoogle"
                    >
                      <img src={googleIcon} width="25px" /> &nbsp; Sign In with
                      Google
                    </Button>
                  </div>
                </form>

                <span className="text-center d-block mt-3">
                  Don't have an account?
                  <Link to={"/login"} className="link color ml-2">
                    Sign In
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
