import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        // subcription 전에 유저가 참여한 룸이 있는지 체크
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: { some: { id: context.loggedInUser.id } },
          },
          select: { id: true },
        });
        if (!room) {
          // room이 존재하지 않으면 에러를 일으킨다.
          // return null을 하게되면 sbuscribe는 함수를 리턴해야 하는데 null값으로 인해 에러 발생.
          throw new Error("Room not found.");
        }
        // withFillter는 resolveFn이기 때문에 fx()()인 currying function으로 만들어서 함수를 call해줘야함.
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async ({ roomUpdates }, { id }, { loggedInUser }) => {
            // loggedInUser double check
            if (roomUpdates.roomId === id) {
              const room = await client.room.findFirst({
                where: {
                  id,
                  users: { some: { id: loggedInUser.id } },
                },
                select: { id: true },
              });
              if (!room) {
                return false;
              }
              return true;
            }
          }
        )(root, args, context, info);
      },
    },
  },
};
