import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated} from "./PhimContext";


export default function PrivateRoute({ element }) {
  return isAuthenticated() ? element : <Navigate to="/DangNhap" />;
}
