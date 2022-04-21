import client from "../client";

export default {
  Photo: {
    // user와 hashtags는 Photo DB에는 존재하지 않고 스키마에만 존재하는 Computed Fields로
    // Query Photo 등 에서 user와 hashtags를 resolver를 통해 각각의 DB에서 가져와 명시해줘야 한다.
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
  },
};
