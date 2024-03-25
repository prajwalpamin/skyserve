import { createContext, useContext, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const hostIp = process.env.REACT_APP_HOST_IP || "localhost";
  const baseUrl = process.env.REACT_APP_BASE_URL || `http://${hostIp}:5000`;

  const navigate = useNavigate();
  const [cookies, setCookies, removeCookie] = useCookies();

  const login = async ({ email, password }) => {
    try {
      const res = await api.post(`${baseUrl}/login`, {
        email: email,
        password: password,
      });

      if (res.status === 200) {
        setCookies("token", res.data.token);
        setCookies("email", res.data.email);
        setCookies("userId", res.data.userId);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error.response.data);

        if (error.response.data.error === "INVALID_PASSWORD") {
          alert("Invalid Password");
        } else if (error.response.data.error === "INVALID_EMAIL") {
          alert("Invalid Email");
        } else if (error.response.data.error === "EMAIL_NOT_VERIFIED") {
          alert("Email not verified!");
        }
      } else {
        console.error("An error occurred:", error);
        alert("Something went wrong!");
      }
    }
  };

  const logout = () => {
    ["token", "email", "userId"].forEach((obj) => removeCookie(obj));
    navigate("/");
  };

  const value = useMemo(
    () => ({
      cookies,
      login,
      logout,
    }),
    [cookies]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
  return useContext(UserContext);
};
