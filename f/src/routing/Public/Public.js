import { Navigate, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";
const Public = () => {
    const cookies = new Cookies();
  let client = cookies.get("abc");
  return client ? <Navigate to={"/Mainpage"} />  :<Outlet/> ;

};

export default Public;