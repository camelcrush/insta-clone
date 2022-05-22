import client from "../client";

export default {
  User: {
    // 유저들의 팔로워 리스트에서 카운트
    totalFollowing: ({ id }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    // 유저들의 팔로잉 리스트에서 카운트
    totalFollowers: ({ id }) =>
      client.user.count({ where: { following: { some: { id } } } }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const exists = await client.user.count({
        where: { username: loggedInUser.username, following: { some: { id } } },
      });
      return Boolean(exists);
    },
    photos: ({ id }, { lastId }) =>
      client.user.findUnique({ where: { id } }).photos({
        take: 10,
        skip: lastId ? 1 : 0,
        ...(lastId && { cursor: { id: lastId } }),
      }),
  },
};
