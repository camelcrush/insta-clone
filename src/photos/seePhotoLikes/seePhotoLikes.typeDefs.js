import { gql } from "apollo-server-core";

export default gql`
  type Query {
    seePhotoLikes(id: Int!): [User]
  }
`;

// 사진에 좋아요를 누른 사람 보여주기
