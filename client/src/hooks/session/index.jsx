import { jwtDecode } from "jwt-decode";

export const checkUserToken = (cookies, logout) => {
  const userToken = cookies.token;
  if (!userToken || userToken === "undefined") {
    logout();
    return false;
  }

  try {
    const decodedToken = jwtDecode(userToken);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      logout();
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    logout();
    return false;
  }
};
