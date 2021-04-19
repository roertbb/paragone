import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { UserContext, UserContextProvider } from "./Auth";
import ApolloProvider from "./Apollo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Nav from "./components/Nav";
import Wrapper from "./components/Wrapper";
import Receipts from "./pages/Receipts";

const Routes = () => {
  const { authenticated } = useContext(UserContext);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      {authenticated && <Route path="/" exact component={Receipts} />}
      <Route path="/" component={Login} />
    </Switch>
  );
};

export const App = () => (
  <ChakraProvider theme={theme}>
    <UserContextProvider>
      <ApolloProvider>
        <BrowserRouter>
          <Nav />
          <Wrapper>
            <Routes />
          </Wrapper>
        </BrowserRouter>
      </ApolloProvider>
    </UserContextProvider>
  </ChakraProvider>
);
