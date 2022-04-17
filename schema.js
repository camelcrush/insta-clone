import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

const loadTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);
const typeDefs = mergeTypeDefs(loadTypes);
const resolvers = mergeResolvers(loadResolvers);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
