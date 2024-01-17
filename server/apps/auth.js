import { Router } from "express";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRouter = Router();

// 1.) สร้าง API register > นำไปใส่ Register Page
authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstName,
    lastname: req.body.lastName,
  };
  // saltจะทำการสุ่ม string มาencrypt(เข้ารหัส) ทำให้ข้อมูลที่ส่งมาเข้าถึงได้ยากขึ้น
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const collection = db.collection("users");
  await collection.insertOne(user);

  return res.json({
    message: "User has been create successfully",
  });
});

// 3.) สร้าง API login > นำไปใส่ Login Page

authRouter.post("/login", async (req, res) => {
  const user = await db.collection("users").findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(401).json({
      message: "password not valid",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      firstname: user.firstName,
      lastname: user.lastName,
    },
    process.env.SECRET_KEY,
    { expiresIn: "900000" }
  );

  return res.json({ message: "login successfully", token });
});

export default authRouter;
