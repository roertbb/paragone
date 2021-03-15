import { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReceiptUploader from "./components/ReceiptUploader";
import Apollo from "./Apollo";
import { getUserSession } from "./auth/UserPool";
import ReceiptList from "./pages/ReceiptList";
import Layout from "./components/Layout";

function App() {
  const userSession = getUserSession();
  const [isLoggedIn, setIsLoggedIn] = useState(!!userSession);

  const history = useHistory();

  if (!isLoggedIn) {
    history.replace("/login");
  }

  return (
    <Layout>
      <Switch>
        <Route path="/login">
          <Login onLogin={() => setIsLoggedIn(true)} />
        </Route>
        <Route path="/register" component={Register} />
        {isLoggedIn && (
          <Apollo>
            <Route path="/upload" component={ReceiptUploader} />
            <Route path="/" exact component={ReceiptList} />
          </Apollo>
        )}
      </Switch>
    </Layout>
  );
}

export default App;
