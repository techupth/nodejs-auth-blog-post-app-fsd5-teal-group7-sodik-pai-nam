import jwt from "jsonwebtoken";

/* Validating a Token with the Secret Key 
: กำหนดให้ API ต่างๆ บน Server ทำงานเฉพาะ Request ที่มี Token แนบมาใน Header ด้วยเท่านั้น

- Header ของ Request จะเก็บข้อมูลในรูปแบบ Key-Value Pair
- ส่วนใหญ่จะแนบ Token ไว้ใน propertyที่ชื่อ authorization ซึ่งมี value = รูปแบบ Bearer <token>

ต้องสร้าง Middleware มา validate ว่ามีTokenแนบมากับheaderมั้ย
- เงื่อนไขแรก คือมีการแนบ Token ไว้ใน Header
- เงื่อนไขที่สอง คือ Token ที่แนบมานั้นต้อง Valid (ถูกต้อง)
- ถ้าผ่านเงื่อนไขทั้งสองข้อ ฝั่ง Server ก็จะส่ง Response กลับไป แต่ถ้าไม่ผ่านเงื่อนไข 
ฝั่ง Server ก็จะส่ง Response กลับไปบอก Client ว่าไม่สามารถขอข้อมูลได้ 
เนื่องจาก Token ไม่ Valid

*/

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Token has invalid format",
    });
  }

  const tokenWithoutBearer = token.split(" ")[1];
  // ใช้ Function jwt.verify จาก Package jsonwebtoken เพื่อตรวจสอบว่า Token นั้นมีความถูกต้องหรือหมดอายุหรือไม่
  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Token is invalid",
      });
    }
    req.user = payload;
    next();
  });
};

// นำ Middleware ไปใส่ไว้ใน postRouter
