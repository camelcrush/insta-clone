import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

const loadTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

// makeExecutableSchema()를 통해 직접 스키마를 생성하지 않고 typeDefs, resolvers를 아폴로 서버에 주면 아폴로 스스로 스키마 자동생성
// scalar upload 기능을 사용하기 위해
export const typeDefs = mergeTypeDefs(loadTypes);
export const resolvers = mergeResolvers(loadResolvers);
