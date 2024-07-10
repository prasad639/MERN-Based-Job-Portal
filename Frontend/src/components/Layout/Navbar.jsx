import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };

  return (
    <nav
      className={
        isAuthorized
          ? "navbarShow navbar navbar-expand-lg "
          : "navbarHide navbar navbar-expand-lg"
      }
    >
      <div
        className="container collapse navbar-collapse"
        id="navbarSupportedContent"
      >
        <div className="row">
          <div className="cold-flex">
            <ul
              className={
                !show ? "menu navbar-nav " : "show-menu menu navbar-nav "
              }
            >
              <li className={"nav-item"}>
                <Link to={"/"} onClick={() => setShow(false)}>
                  Home
                </Link>
              </li>
              <li className={"nav-item "}>
                <Link to={"/job/getall"} onClick={() => setShow(false)}>
                  ALL JOBS
                </Link>
              </li>
              <li className={"nav-item"}>
                <Link to={"/application/me"} onClick={() => setShow(false)}>
                  {user && user.role === "Employer"
                    ? "APPLICANT'S APPLICATIONS"
                    : " MY APPLICATIONS"}
                </Link>
              </li>
              {user && user.role === "Employer" ? (
                <>
                  <li className={"nav-item"}>
                    <Link to={"/job/post"} onClick={() => setShow(false)}>
                      POST NEW JOB
                    </Link>
                  </li>
                  <li className={"nav-item"}>
                    <Link to={"/job/me"} onClick={() => setShow(false)}>
                      VIEW YOUR JOBS
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}
            </ul>
          </div>
          <div className="col d-flex justify-content-end align-items-center">
            {/* <button btn btn-primary
              onClick={handleLogout}
              
            >
              LOGOUT
            </button> */}
            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{ float: "right" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="hamburger">
            <GiHamburgerMenu onClick={() => setShow(!show)} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
