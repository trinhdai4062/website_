import { useContext, useEffect, useState, useCallback } from "react";
// import Logo from "../../assets/images/logo.webp";
import patern from "../../assets/images/pattern.webp";
// import { MyContext } from "../../App";
import { AdminContext } from "../../App";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import googleIcon from "../../assets/images/googleIcon.png";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

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

import { app } from "../../firebase";
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setisShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const context = useContext(AdminContext);
  const navigate = useNavigate();


  console.log("context", context);
  //   console.log("email", email);
  //   console.log("password", password);

  const handleMK = useCallback((event) => {
    const value = event.target.value;
    setPassword(value);
    if (value.length >= 8) {
      setPasswordError("");
    } else {
      setPasswordError("Mật khẩu phải từ 8 ký tự trở lên");
    }
  }, []);

  const handleChange = useCallback((event) => {
    const value = event.target.value;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (re.test(String(value).toLowerCase())) {
      setEmailError("");
    } else {
      setEmailError("Email không hợp lệ");
    }
    setEmail(value);
  }, []);

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
  }, [context]);

  const focusInput = (index) => {
    setInputIndex(index);
  };

  const handleLogin = async () => {


    console.log('baseURL_',baseURL_)


    if (!emailError && !passwordError && email && password) {

      axios
        .post(
          `${baseURL_}/auth/login`,
          { email, password },
          // { withCredentials: true }
        )
        .then((response) => {
          // console.log("response", response.data);
          if (response.data.status === true) {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("_id", response.data.data._id);
            localStorage.setItem(
              "userData",
              JSON.stringify(response.data.data)
            );
            localStorage.setItem("shop", response.data.data.shop);
            // console.log("login", response.data.data.shop);
            const role = response.data.data.role;
            context.setIsLogin(true);
            context.setShop(response.data.data.shop);
            // navigate(role==='admin'?'/admin':'/user');
            navigate("/admin");
          }
        })
        .catch((error) => {
          console.log("error", error)
          // console.log("error", error.response.data.message);
          // window.alert(error.response.data.message);
        });
    } else {
      if (!email) setEmailError("Vui lòng nhập email");
      if (!password) setPasswordError("Vui lòng nhập mật khẩu");
    }
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
      console.log('Response from server:', res.data);
  
      setShowLoader(false); 
      if (res.data.status === true) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("_id", res.data.data._id);
        localStorage.setItem(
          "userData",
          JSON.stringify(res.data.data)
        );
        localStorage.setItem("shop", res.data.data.shop);
        // console.log("login", response.data.data.shop);
        const role = res.data.data.role;
        context.setIsLogin(true);
        context.setShop(res.data.data.shop);
        navigate(role==='admin'?'/admin':'/user');
        // navigate("/admin");
      }
    
    } catch (error) {
      setShowLoader(false); 
      console.error('Error signing in with Google:', error);
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };
  

  return (
    <>
      <div className="loginWrapper">
        <div className="card shadow">
          <Backdrop
            sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showLoader}
            className="formLoader"
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <img src={patern} className="loginPatern" alt="Pattern" />
          <section className="loginSection">
            <div className="loginBox">
              <div className="logo text-center">
                <img src={require('../../assets/images/logo_background.png')} width="120px" alt="Logo" />
                <h5 className="font-weight-bold">Login to BigShose</h5>
              </div>

              <div className="wrapper mt-3 card border">
                <form>
                  <div
                    className={`form-group position-relative ${
                      inputIndex === 0 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <MdEmail />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="enter your email"
                      onFocus={() => focusInput(0)}
                      onBlur={(event) => handleChange(event)}
                      onChange={(event) => handleChange(event)}
                      value={email}
                      autoFocus
                    />
                    {inputIndex === 0 && emailError && (
                      <span style={{ color: "red" }}>{emailError}</span>
                    )}
                  </div>

                  <div
                    className={`form-group position-relative ${
                      inputIndex === 1 && "focus"
                    }`}
                  >
                    <span className="icon">
                      <RiLockPasswordFill />
                    </span>
                    <input
                      type={isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="enter your password"
                      onFocus={() => focusInput(1)}
                      onBlur={(event) => handleMK(event)}
                      onChange={(event) => handleMK(event)}
                      value={password}
                    />
                    {inputIndex === 1 && passwordError && (
                      <span style={{ color: "red" }}>{passwordError}</span>
                    )}

                    <span
                      className="toggleShowPassword"
                      onClick={() => setisShowPassword(!isShowPassword)}
                    >
                      {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </span>
                  </div>

                  <div className="form-group">
                    <Button
                      onClick={handleLogin}
                      className="btn-blue btn-lg w-100 btn-big"
                    >
                      Sign In
                    </Button>
                  </div>

                  <div className="form-group text-center mb-0">
                    <Link to={"/forgot-password"} className="link">
                      FORGOT PASSWORD
                    </Link>
                    <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                      <span className="line"></span>
                      <span className="txt">or</span>
                      <span className="line"></span>
                    </div>

                    <Button
                      variant="outlined"
                      className="w-100 btn-lg btn-big loginWithGoogle"
                      onClick={signInWithGoogle}
                    >
                      <img src={googleIcon} width="25px" alt="Google Icon" />{" "}
                      &nbsp; Sign In with Google
                    </Button>
                  </div>
                </form>
              </div>

              <div className="wrapper mt-3 card border footer p-3">
                <span className="text-center">
                  Don't have an account?
                  <Link to={"/signUp"} className="link color ml-2">
                    Register
                  </Link>
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Login;
