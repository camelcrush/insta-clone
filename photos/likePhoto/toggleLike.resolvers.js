import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    toggleLike: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({ where: { id } });
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found.",
        };
      }
      const like = await client.like.findUnique({
        where: {
          photoId_userId: { photoId: id, userId: loggedInUser.id },
        },
      });
      if (like) {
        // like 레코드가 있으면 지우기
        await client.like.delete({ where: { id: like.id } });
      } else {
        // like 레코드가 없으면 만들기
        await client.like.create({
          data: {
            // user와 photo 동시 유니크 연결
            // user: {
            //   connect: { id: loggedInUser.id },
            // },
            // photo: {
            //   connect: { id: photo.id },
            // },
            userId: loggedInUser.id,
            photoId: photo.id,
          },
        });
      }
      return {
        ok: true,
      };
    }),
  },
};
