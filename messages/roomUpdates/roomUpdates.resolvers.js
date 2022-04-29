import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubSub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findUnique({
          where: { id: args.id },
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
          ({ roomUpdates }, { id }) => {
            return roomUpdates.roomId === id;
          }
        )(root, args, context, info);
      },
    },
  },
};
