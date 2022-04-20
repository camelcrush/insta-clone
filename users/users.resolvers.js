import client from "../client";

export default {
  User: {
    // 유저들의 팔로워 리스트에서 카운트
    totalFollowing: ({ id }) =>
      client.user.count({ where: { followers: { some: { id } } } }),
    // 유저들의 팔로잉 리스트에서 카운트
    totalFollowers: () =>
      client.user.count({ where: { following: { some: { id } } } }),
  },
};
