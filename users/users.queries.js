import client from "../client";

export default {
  Query: {
    seeProfile: async (_, { username }) =>
      await client.user.findUnique({ where: { username } }),
  },
};
