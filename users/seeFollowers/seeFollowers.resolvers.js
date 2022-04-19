import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      // select로 특정 필드만 가져올 수 있다 : DB부담 덜기
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "User not found.",
        };
      }
      // 나를 팔로우한 사람 찾기
      const followers = client.user
        .findUnique({ where: { username } })
        .followers({
          // Offset pagination
          take: 5,
          skip: (page - 1) * 5,
        });
      //역으로 A를 팔로우한 사람 찾기
      //   const bfollowers = client.user.findMany({
      //     where: { following: { some: { username } } },
      //   });

      const totalFollowers = await client.user.count({
        // username을 follow한 모든 user 찾기
        where: { following: { some: { username } } },
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
