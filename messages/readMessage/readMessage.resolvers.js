import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
      // 내가 보내지 않은, 내가 참여한 방의 메세지 찾기
      const message = await client.message.findFirst({
        where: {
          id,
          userId: { not: loggedInUser.id },
          room: { users: { some: { id: loggedInUser.id } } },
        },
        select: {
          id: true,
        },
      });
      if (!message) {
        return {
          ok: false,
          error: "Message not found.",
        };
      }
      // 메세지 읽음으로 업데이트
      await client.message.update({ where: { id }, data: { read: true } });
      return {
        ok: true,
      };
    }),
  },
};
