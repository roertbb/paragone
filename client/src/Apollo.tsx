import { ApolloProvider } from "@apollo/react-hooks";
import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split,
} from "@apollo/client";
import { AUTH_TYPE, createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { getAccessToken } from "./Auth";
import config from "./config";

type AuthType = "AMAZON_COGNITO_USER_POOLS" | "OPENID_CONNECT";

type AuthData = {
  url: string;
  region: string;
  auth: {
    type: AuthType;
    jwtToken: string;
  };
};

const httpLink = new HttpLink({
  uri: config.aws_appsync_graphqlEndpoint!,
});

const getAuth = () => ({
  url: config.aws_appsync_graphqlEndpoint!,
  region: config.aws_appsync_region!,
  auth: {
    type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS as AuthType,
    jwtToken: getAccessToken(),
  },
});

const createClient = (auth: AuthData) =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: from([
      createAuthLink(auth),
      split(
        (op) => {
          const { operation } = op.query.definitions[0] as any;

          if (operation === "subscription") {
            return false;
          }

          return true;
        },
        httpLink,
        createSubscriptionHandshakeLink(auth, httpLink)
      ),
    ]),
  });

interface Props {
  children: React.ReactNode;
}

let client: ApolloClient<NormalizedCacheObject> | undefined;

const Apollo = ({ children }: Props) => {
  const auth = getAuth();
  if (!client) {
    client = createClient(auth);
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Apollo;
