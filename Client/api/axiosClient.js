import axios from "axios";
import Cookies from "universal-cookie";
import { cookieDecryption, expireTime } from "../utils";

const cookies = new Cookies();

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});
axiosClient.defaults.timeout = 600000;

axiosClient.interceptors.response.use(
  function (response) {
    if (response.data?.code === 401) {
      cookies.remove("userDetails", {
        path: "/",
        expires: 1 / 2,
        secure: true,
        sameSite: "strict",
      });
      window.location.reload();
    }
    return response;
  },
  function (error) {
    let res = error.response;
    console.error("Looks like there was a problem. Status Code:" + res.status);
    if (res.status === 401 || res.status === 403) {
      Cookies.remove("userDetails", { path: "/", expires: 1 / 2 });
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

axiosClient.interceptors.request.use(function (config) {
  const auth = cookieDecryption("userDetails");
  const token = auth?.token;
  config.headers["x-auth-token"] = token || "";
  return config;
});

export default axiosClient;
