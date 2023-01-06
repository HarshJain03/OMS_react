import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt_decode from "jwt-decode";
import * as myConstList from "./BaseUrl";
import axios from "axios";

const baseUrl = myConstList.baseUrl;
function Login(props) {
  if (!localStorage.jwtToken) {
  } else {
    window.location.href = "/dashboard";
  }
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setisChecked] = useState(false);

  useEffect(() => {
    if (localStorage.checkbox && localStorage.email !== "") {
      setisChecked(true);
      setEmail(localStorage.email);
      setPassword(localStorage.password);
    }
  }, []);

  const handleChangeEmail = async (event) => {
    let eventValue = event.target.value;
    setEmail(eventValue);
  };
  const handlePassword = async (event) => {
    let eventValue = event.target.value;
    setPassword(eventValue);
  };
  const handleOnBlurEmail = async (event) => {
    var eventValue = await event.target.value;
    var Email1Reg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(
      Email
    );
    if (!eventValue) {
      toast.dismiss();
      toast.error("Enter Email Address");
      return false;
    }
    if (!Email1Reg) {
      toast.dismiss();
      toast.error("Enter valid Email Address");
      return false;
    }
  };
  const handleOnBlurPassword = async (event) => {
    var password = await event.target.value;
    if (!password) {
      toast.dismiss();
      toast.error("Password required");
      return false;
    }
  };

  const handleSubmit = async (event) => {
    if (event.key === "Enter") {
    }
    event.preventDefault();
    let LoginData = {
      email: Email,
      password: password,
    };
    // return
    axios.post(baseUrl + "/frontapi/login-admin", LoginData).then((resp) => {
      var resp = resp.data;
      if (resp.status === false) {
        toast.dismiss();
        toast.error(resp.message);
        return;
      }
      if (resp.status == true) {
        localStorage.setItem("email", Email);
        localStorage.setItem("password", password);
        // localStorage.setItem("checkbox", isChecked);
        let token = resp.token;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userType", resp.data[0].userType);
        toast.success("Login Successfully");
        setTimeout(
          function () {
            window.location = "/dashboard";
          }.bind(this),
          3000
        );
        return false;
      }
    });
  };

  return (
    <div className="login d-flex nm-aic nm-vh-md-100">
      <div className="overlay" />
      <div className="nm-tm-wr">
        <div className="container">
          <form>
            <div className="nm-hr nm-up-rl-3">
              <h2>Login</h2>
            </div>
            <div className="input-group nm-gp">
              <span className="nm-gp-pp">
                {/* <i className="fa-user" /> */}
                <iconify-icon icon="ph:user-duotone"></iconify-icon>
              </span>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                tabIndex={1}
                placeholder="Email"
                required=""
                onChange={handleChangeEmail}
                onBlur={handleOnBlurEmail}
              />
            </div>
            <div className="input-group nm-gp">
              <span className="nm-gp-pp">
                {/* <i className="fa-lock" /> */}
                <iconify-icon icon="material-symbols:lock"></iconify-icon>
              </span>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                tabIndex={2}
                placeholder="Password"
                required=""
                onChange={handlePassword}
                onBlur={handleOnBlurPassword}
              />
            </div>
            <div className="input-group nm-gp">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label
                  className="form-check-label nm-check"
                  htmlFor="rememberMe"
                >
                  Keep me logged in
                </label>
              </div>
            </div>
            <div className="row nm-aic nm-mb-1">
              <div className="col-sm-6 nm-mb-1 nm-mb-sm-0">
                <button
                  type="submit"
                  className="btn btn-primary nm-hvr nm-btn-2"
                  onClick={handleSubmit}
                >
                  Log In
                </button>
              </div>
              <div className="col-sm-6 nm-sm-tr">
                <a
                  className="nm-fs-1 nm-fw-bd"
                  href="template/v04/recover.html"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
            <footer
              style={{
                textAlign: "center",
                marginTop: "2rem",
                fontSize: "0.75rem",
                color: "#97a4af",
                fontWeight: 400,
              }}
            >
              Don't have an account?{" "}
              <a
                className="nm-fs-1 nm-fw-bd"
                style={{ fontSize: "0.75rem" }}
                href="template/v04/signup.html"
              >
                Signup
              </a>
            </footer>
          </form>
        </div>
      </div>
      <ToastContainer limit={1} />
    </div>
  );
}
export default Login;
