import React, { useState } from "react";
import useNavigate from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();
const navigate = useNavigate();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  // 4.) สร้าง Requestสำหรับทำการ login และนำ Token ไปเก็บไว้ใน local storage เพื่อใช้ในการ login ครั้งต่อไป
  const login = async (data) => {
    await axios.post("http://localhost:4000/auth/login", data);

    //นำ Token ไปเก็บไว้ใน local storage
    const token = result.data.token;
    localStorage.setItem("token", token);

    /* เนื่องจาก Token มีข้อมูลผู้ใช้แนบไว้ด้วย เราจึงต้องนำข้อมูลนี้ไปเก็บไว้ใน State user 
    ใน AuthContext เพื่อจะได้เอาไปใช้แสดงผลได้ในภายหลัง 
    (เช่น อาจจะต้องแสดงผล First Name บนหน้าเว็บเพื่อต้อนรับผู้ใข้งาน)*/
    const userDataFromToken = jwtDecode(token);
    setState({ ...state, user: userDataFromToken });
    navigate("/");
  };

  // 2.) register จะสร้าง Request พร้อม body ส่งกลับไปหาserver
  const register = async (data) => {
    await axios.post("http://localhost:4000/auth/register", data);
    navigate("/login");
  };

  // 7.) ทำการลบ Token ออกจาก Local Storage และลบ JWT Token ออกจาก Local Storage
  const logout = () => {
    localStorage.removeItem("token");
    setState({ ...state, user: null });
  };

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{ state, login, logout, register, isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
