const config = {
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
  },
  aws_appsync_graphqlEndpoint: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  aws_appsync_region: process.env.REACT_APP_REGION,
  aws_appsync_authenticationType:
    process.env.REACT_APP_GRAPHQL_AUTHENTICATION_TYPE,
  aws_appsync_apiKey: process.env.REACT_APP_GRAPHQL_API_KEY,
};

export default config;
