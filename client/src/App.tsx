import { useState } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Apollo from "./Apollo";
import { getUserSession, logout } from "./Auth";
import Receipts from "./pages/Receipts";
import Nav from "./components/Nav";
import ConfirmEmail from "./pages/ConfirmEmail";

function App() {
  const userSession = getUserSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!userSession);

  const onLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (
    <>
      <Nav onLogout={onLogout} />
      <Switch>
        <Route path="/login">
          <Login onLogin={() => setIsLoggedIn(true)} />
        </Route>
        <Route path="/register" component={Register} />
        <Route path="/confirm" component={ConfirmEmail} />
        {isLoggedIn && (
          <Apollo>
            <Route path="/" exact component={Receipts} />
          </Apollo>
        )}
        <Route path="/">
          <Login onLogin={() => setIsLoggedIn(true)} />
        </Route>
      </Switch>
    </>
  );
}

export default App;
