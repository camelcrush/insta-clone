import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Query: {
    // 팔로우한 유저의 게시물과 나 자신의 게시물 불러오기
    seeFeed: protectedResolver((_, { offset }, { loggedInUser }) =>
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
        take: 2,
        skip: offset,
      })
    ),
  },
};
