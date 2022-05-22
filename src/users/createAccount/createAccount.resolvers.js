import bycrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        // 계정 생성 전 User가 있는지 체크하기
        const existingUser = await client.user.findFirst({
          where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
          throw new Error("This username/email is already taken");
        }
        // passwrod hashing
        const uglyPasswrod = await bycrypt.hash(password, 10);
        await client.user.create({
          data: {
            firstName,
            lastName,
            username,
            email,
            password: uglyPasswrod,
          },
        });
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: "Can't create account.",
        };
      }
    },
  },
};
