import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../client";

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // User Check
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "User not found.",
        };
      }
      // Compare Password
      const passwordOk = await bycrypt.compare(password, user.password);
      if (!passwordOk) {
        return {
          ok: false,
          error: "Wrong password.",
        };
      }
      const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return {
        ok: true,
        token,
      };
    },
  },
};
