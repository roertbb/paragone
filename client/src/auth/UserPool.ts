import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import config from "../config";

const poolData = {
  UserPoolId: config.Auth.userPoolId!,
  ClientId: config.Auth.userPoolWebClientId!,
};

export const UserPool = new CognitoUserPool(poolData);

export function getAccessToken() {
  let accessToken = "";

  UserPool.getCurrentUser()?.getSession(
    (error: unknown, session: CognitoUserSession | null) => {
      if (session?.isValid()) {
        accessToken = session.getAccessToken().getJwtToken();
      }
    }
  );

  return accessToken;
}

export function getUserSession() {
  return UserPool.getCurrentUser();
}

export { CognitoUserAttribute };
