import client from "../client";

export default {
  Photo: {
    // user와 hashtags는 Photo DB에는 존재하지 않고 스키마에만 존재하는 Computed Fields로
    // Query Photo 등 에서 user와 hashtags를 resolver를 통해 각각의 DB에서 가져와 명시해줘야 한다.
    user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
    hashtags: ({ id }) =>
      client.hashtag.findMany({ where: { photos: { some: { id } } } }),
    // photo가 가진 like 카운트
    likes: ({ id }) => client.like.count({ where: { photoId: id } }),
    comments: ({ id }) => client.comment.count({ where: { photoId: id } }),
    isMine: ({ userId }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return userId === loggedInUser.id;
    },
    isLiked: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      const ok = await client.like.findUnique({
        where: { photoId_userId: { photoId: id, userId: loggedInUser.id } },
        select: { id: true },
      });
      if (ok) {
        return true;
      }
      return false;
    },
  },
  Hashtag: {
    // pagination 하기
    photos: ({ id }, { page }, { loggedInUser }) =>
      client.hashtag
        .findUnique({ where: { id } })
        .photos({ take: 10, skip: (page - 1) * 10 }),
    totalPhotos: ({ id }) =>
      client.photo.count({ where: { hashtags: { some: { id } } } }),
  },
};

// resolve field(computed field) 도 args를 받을 수 있고, context도 받을 수 있음
