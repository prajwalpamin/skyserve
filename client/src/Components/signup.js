import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundimg from "../satelite.jpg";
import axios from "axios";

export const Signup = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL || `http://localhost:8080`;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    axios
      .post(`${baseUrl}/signup`, {
        email,
        user_name: username,
        password,
        confirmPassword,
      })
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Signup error:", error);
      });
  };

  const onLoginClick = () => {
    navigate("/");
  };
  return (
    <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
      <div className="container py-3 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src={backgroundimg}
                    alt="signup form"
                    className="img-fluid"
                    style={{ borderRadius: "1rem 0 0 1rem" }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <form>
                      <div className="d-flex align-items-center mb-3 pb-1">
                        <i
                          className="fas fa-cubes fa-2x me-3"
                          style={{ color: "#ff6219" }}
                        ></i>
                        <span className="h1 fw-bold mb-0">Logo</span>
                      </div>

                      <h5
                        className="fw-normal mb-2 pb-3"
                        style={{ letterSpacing: "1px" }}
                      >
                        Create your account
                      </h5>

                      <div className="form-outline mb-3">
                        <input
                          type="text"
                          id="username"
                          className="form-control form-control-lg"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="form-label" htmlFor="username">
                          Username
                        </label>
                      </div>

                      <div className="form-outline mb-3">
                        <input
                          type="email"
                          id="email"
                          className="form-control form-control-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="form-label" htmlFor="email">
                          Email address
                        </label>
                      </div>

                      <div className="form-outline mb-3">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                      </div>
                      <div className="form-outline mb-3">
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <label className="form-label" htmlFor="password">
                          Confirm Password
                        </label>
                      </div>

                      <div className="pt-1 mb-3">
                        <button
                          className="btn btn-dark btn-lg btn-block"
                          type="button"
                          onClick={handleSignup}
                        >
                          Signup
                        </button>
                      </div>

                      <p className="mb-3 pb-lg-2" style={{ color: "#393f81" }}>
                        Already have an account?{" "}
                        <span
                          onClick={onLoginClick}
                          style={{ cursor: "pointer" }}
                        >
                          Sign in here
                        </span>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
