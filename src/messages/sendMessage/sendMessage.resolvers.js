import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    sendMessage: protectedResolver(
      async (_, { payload, roomId, userId }, { loggedInUser }) => {
        let room = null; // room 전역변수 설정
        // 챌린지: 이미 룸이 있다면 룸을 새로 생성하지 않기
        if (userId) {
          // userId가 있으면 User 찾기
          const user = await client.user.findUnique({
            where: {
              id: userId,
            },
            select: { id: true },
          });
          if (!user) {
            return {
              ok: false,
              error: "User does not found.",
            };
          }
          // 찾은 유저와 room 만들기
          room = await client.room.create({
            data: {
              users: {
                connect: [
                  {
                    id: userId,
                  },
                  { id: loggedInUser.id },
                ],
              },
            },
          });
        } else if (roomId) {
          // roomId가 있으면 room 찾기
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true },
          });
          if (!room) {
            return {
              ok: false,
              error: "Room not found.",
            };
          }
        }
        // message 만들기
        const message = await client.message.create({
          data: {
            payload,
            room: {
              connect: { id: room.id },
            },
            user: {
              connect: { id: loggedInUser.id },
            },
          },
        });
        // pubsub.publish를 통해 이벤트 발생
        pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });
        return {
          ok: true,
          id: message.id,
        };
      }
    ),
  },
};
