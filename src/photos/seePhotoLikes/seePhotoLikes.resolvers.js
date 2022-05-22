import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      // 사진 좋아요 누른 유저 보여주기
      const likes = await client.like.findMany({
        where: { photoId: id },
        select: { user: true },
      });
      // or await client.user.findMansy({where:{likes:some{photoId:id}}})
      return likes.map((like) => like.user);
    },
  },
};
