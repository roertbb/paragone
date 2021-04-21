import backendConfig from "./config.json";

const {
  ParagoneStack: { UserPoolId, Region, ClientId, GraphQLEndpoint },
} = backendConfig;

const config = {
  Auth: {
    region: Region,
    userPoolId: UserPoolId,
    userPoolWebClientId: ClientId,
  },
  aws_appsync_graphqlEndpoint: GraphQLEndpoint,
  aws_appsync_region: Region,
};

export default config;
