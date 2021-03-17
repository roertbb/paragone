import backendConfig from "./config.json";

const {
  ParagoneStack: {
    UserPoolId,
    GraphQLAPIKey,
    Region,
    ClientId,
    GraphQLEndpoint,
  },
} = backendConfig;

const config = {
  Auth: {
    region: Region,
    userPoolId: UserPoolId,
    userPoolWebClientId: ClientId,
  },
  aws_appsync_graphqlEndpoint: GraphQLEndpoint,
  aws_appsync_region: Region,
  aws_appsync_apiKey: GraphQLAPIKey,
};

export default config;
