import { useState } from "react";
import { Switch, Route, Link } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ReceiptUploader from "./components/ReceiptUploader";
import WithApollo from "./WithApollo";
import { getUserSession } from "./auth/UserPool";

function App() {
  const userSession = getUserSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!userSession);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/login">
          <Login onLogin={() => setIsLoggedIn(true)} />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        {isLoggedIn && (
          <>
            <Route path="/">
              <WithApollo>
                <ReceiptUploader />
              </WithApollo>
            </Route>
          </>
        )}
      </Switch>
    </div>
  );
}

export default App;
