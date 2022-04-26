import client from "../../client";
import { deleteFromS3 } from "../../shared/shared.utils";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    deletePhoto: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const photo = await client.photo.findUnique({
        where: { id },
        select: { userId: true, file: true },
      });
      console.log(photo.file);
      if (!photo) {
        return {
          ok: false,
          error: "Photo not found.",
        };
      } else if (photo.userId !== loggedInUser.id) {
        return {
          ok: false,
          error: "Not authorized.",
        };
      } else {
        await deleteFromS3(photo.file, "uploads");
        await client.photo.delete({ where: { id } });
      }
      return {
        ok: true,
      };
    }),
  },
};
