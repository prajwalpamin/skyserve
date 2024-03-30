import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("Logged out");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMapsClick = () => {
    navigate("/geoData");
  };

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="navbar-brand">Skyserve</div>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <p
              class="nav-link"
              onClick={handleUploadClick}
              style={{ cursor: "pointer" }}
            >
              Home <span class="sr-only">(current)</span>
            </p>
          </li>
          <li class="nav-item">
            <p
              class="nav-link"
              onClick={handleMapsClick}
              style={{ cursor: "pointer" }}
            >
              maps
            </p>
          </li>
          <li class="nav-item">
            <p
              class="nav-link"
              onClick={handleLogout}
              style={{ cursor: "pointer", color: "red" }}
            >
              Logout
            </p>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
