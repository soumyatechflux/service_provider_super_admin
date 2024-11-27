import axios from "axios";
import { decryptData } from "./../CRYPTO/cryptoFunction";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect } from "react";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_DINE_RIGHT_USER_WEBSITE_BASE_API_URL,
  timeout: 30000,
});

// Create a new Axios instance without setting the Authorization header
const axiosInstanceNoAuth = axios.create({
  baseURL: process.env.REACT_APP_DINE_RIGHT_USER_WEBSITE_BASE_API_URL,
  timeout: 30000,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { navigate } = require("react-router-dom");
    if (
      error?.response &&
      error?.response?.data &&
      error?.response?.data?.message === "Expired token"
    ) {
      toast.error("Time elapsed, Please log in again!");
      console.log("Expired token error....");
      sessionStorage.clear();
      navigate("/");
    }
    return Promise.reject(error);
  }
);

export function authorizeMe() {
  const encryptedTokenForDineRightUser = sessionStorage.getItem("encryptedTokenForDineRightUser");

  const token = decryptData(encryptedTokenForDineRightUser);

  if (token && token !== null && token !== undefined) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}

// Intercept requests and authorize them before sending
axiosInstance.interceptors.request.use(async (config) => {
  await authorizeMe();
  return config;
});


const App = () => {
  useEffect(() => {
    authorizeMe();
  }, []);

  // Your component code here

  return (
  <>
  </>
  );
};

export default App;
export { axiosInstance , axiosInstanceNoAuth};