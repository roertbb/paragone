import { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Apollo from "./Apollo";
import { getUserSession, logout } from "./Auth";
import Receipts from "./pages/Receipts";
import Nav from "./components/Nav";

function App() {
  const userSession = getUserSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!userSession);

  const history = useHistory();

  if (!isLoggedIn) {
    history.replace("/login");
  }

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
        {isLoggedIn && (
          <Apollo>
            <Route path="/" exact component={Receipts} />
          </Apollo>
        )}
      </Switch>
    </>
  );
}

export default App;
