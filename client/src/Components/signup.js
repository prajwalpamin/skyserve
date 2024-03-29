import React from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = () => {};
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
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
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