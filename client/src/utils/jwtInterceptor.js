import axios from "axios";

// 6.) เครื่องมือAxios Interceptor เพื่อสร้าง Request พร้อมกับแนบ JWT Token เข้าไปใน Header
/* 
<axios.interceptors.request.use>
- Callback Function ที่จะให้ Axios เรียกใช้ทุกครั้ง 
**เวลาสร้าง Request ไปหา Server**
- Callback Function ที่จะให้ Axios เรียกใช้ทุกครั้ง 
**เวลาที่สร้าง Request ไปหา Server ไม่สำเร็จ** 

<axios.interceptors.response.use>
- Callback Function ที่จะให้ Axios เรียกใช้ทุกครั้ง 
**เวลาได้รับ Response มาจาก Server**
- Callback Function ที่จะให้ Axios เรียกใช้ทุกครั้ง 
เวลาได้รับ **Error** **Response มาจาก Server**
*/

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    // การส่ง req ไปหาserverจะต้องแนบ Tokenไปด้วย โค้ดด้านล่างคือlogicการแนบToken (ตัวTokenนี้ server จะเอาไว้ใช้ตรวจสอบว่าข้อมูลถูกต้องมั้ย)
    const hasToken = Boolean(window.localStorage.getItem("token"));

    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
      };
    }
    // 🐨 Todo: Exercise #6
    //  ให้เขียน Logic ในการแนบ Token เข้าไปใน Header ของ Request
    // เมื่อมีการส่ง Request จาก Client ไปหา Server
    // ภายใน Callback Function axios.interceptors.request.use

    return req;
  });

  axios.interceptors.response.use(
    (req) => {
      return req;
    },
    (error) => {
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        window.localStorage.removeItem("token");
        window.location.replace("/");
      }

      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;
