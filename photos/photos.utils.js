export const processHashtags = (caption) => {
  // caption에 hashtag가 있는 경우와 없는 경우 ||
  const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g) || [];
  return hashtags.map((hashtag) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
