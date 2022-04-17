import jwt from "jsonwebtoken";
import client from "../client";

// token으로 부터 유저를 반환하는 함우(미들웨어?)
export const getUser = async (token) => {
  try {
    if (!token) {
      // token이 없는 경우 (ex) login
      return null;
    }
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
