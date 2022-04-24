import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    // 팔로우한 유저의 게시물과 나 자신의 게시물 불러오기
    seeFeed: protectedResolver((_, { lastId }, { loggedInUser }) =>
      client.photo.findMany({
        where: {
          OR: [
            { user: { followers: { some: { id: loggedInUser.id } } } },
            { userId: loggedInUser.id },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      })
    ),
  },
};
