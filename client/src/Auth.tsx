import React, { useEffect, useReducer, Reducer } from "react";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import config from "./config";
import Spinner from "./components/Spinner";
import { Flex } from "@chakra-ui/layout";

const poolData = {
  UserPoolId: config.Auth.userPoolId!,
  ClientId: config.Auth.userPoolWebClientId!,
};

export const UserPool = new CognitoUserPool(poolData);

export async function getAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const currentUser = UserPool.getCurrentUser()?.getSession(
      (error: Error | null, session: null | CognitoUserSession) => {
        if (session?.isValid()) {
          const accessToken = session.getAccessToken().getJwtToken();
          if (accessToken) {
            resolve(accessToken);
          } else {
            reject();
          }
        }
      }
    );

    if (!currentUser) {
      resolve("");
    }
  });
}

type LoginParams = { username: string; password: string };

export async function login({
  username,
  password,
}: LoginParams): Promise<string | undefined> {
  const user = new CognitoUser({ Username: username, Pool: UserPool });
  const authDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (session, userConfirmationNecessary) => {
        const accessToken = session.getAccessToken().getJwtToken();
        if (accessToken && !userConfirmationNecessary) {
          resolve(accessToken);
        } else if (userConfirmationNecessary) {
          reject("user confirmation necessary");
        } else {
          reject("failed to authenticate user");
        }
      },
      onFailure: (error) => reject(error.message),
      newPasswordRequired: () => reject("new password required"),
    });
  });
}

type RegisterParams = { username: string; password: string; email: string };

export async function register({ username, password, email }: RegisterParams) {
  const attributes = [
    new CognitoUserAttribute({
      Name: "email",
      Value: email,
    }),
  ];

  return new Promise((resolve, reject) => {
    UserPool.signUp(username, password, attributes, [], (error, data) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(data);
      }
    });
  });
}

type ConfirmRegistrationParams = { username: string; code: string };

export async function confirmRegistration({
  username,
  code,
}: ConfirmRegistrationParams) {
  const cognitoUser = new CognitoUser({ Username: username, Pool: UserPool });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (error, data) => {
      if (error) {
        reject(error.message);
      } else {
        resolve(data);
      }
    });
  });
}

function logout() {
  UserPool.getCurrentUser()?.signOut();
}

function getUsername() {
  return UserPool.getCurrentUser()?.getUsername();
}

type UserContextProps = {
  authenticated: boolean;
  username?: string;
  logout: () => void;
  login: (loginParams: LoginParams) => Promise<void>;
};

export const UserContext = React.createContext<UserContextProps>({
  authenticated: false,
  logout() {},
  login: () => Promise.resolve(),
});

type UserContextProviderProps = {
  children: React.ReactNode;
};

type UserContextProviderReducer = {
  token?: string;
  username?: string;
  state: "init" | "pending" | "success" | "error";
};

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [{ token, username, state }, setState] = useReducer<
    Reducer<UserContextProviderReducer, Partial<UserContextProviderReducer>>
  >((prevState, curState) => ({ ...prevState, ...curState }), {
    token: undefined,
    username: undefined,
    state: "pending",
  });

  useEffect(() => {
    getAccessToken()
      .then((tokenData) => {
        if (tokenData) {
          setState({
            token: tokenData,
            username: getUsername(),
            state: "success",
          });
        } else {
          setState({ state: "init" });
        }
      })
      .catch((error) => {
        setState({ state: "error" });
        console.error(error);
      });
  }, []);

  function handleLogout() {
    setState({ token: undefined, username: undefined, state: "init" });
    logout();
  }

  async function handleLogin(loginParams: LoginParams) {
    const accessToken = await login(loginParams);
    if (accessToken) {
      setState({
        token: accessToken,
        username: getUsername(),
        state: "success",
      });
    }
  }

  if (state === "pending") {
    return (
      <Flex w="100%" h="100vh">
        <Spinner />
      </Flex>
    );
  }

  return (
    <UserContext.Provider
      value={{
        authenticated: !!token,
        username,
        logout: handleLogout,
        login: handleLogin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
