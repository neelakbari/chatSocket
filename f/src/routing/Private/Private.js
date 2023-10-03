import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

const Private = () => {
  const cookies = new Cookies();
  let client = cookies.get("abc");
  return client ?   <Outlet />:<Navigate to={"/"} />;

}

export default Private