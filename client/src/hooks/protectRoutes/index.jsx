import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import { useEffect } from "react";
import { checkUserToken } from "../session";

export const ProtectRoutes = () => {
  const { cookies, logout } = useAuth();

  useEffect(() => {
    checkUserToken(cookies, logout);
  }, [cookies.token]);

  return cookies.token ? <Outlet /> : <Navigate to="/" exact />;
};
