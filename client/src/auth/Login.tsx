import { useState } from "react";
import { useHistory } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { UserPool } from "./UserPool";

interface Props {
  onLogin: () => void;
}

function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const user = new CognitoUser({ Username: email, Pool: UserPool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => {
        console.log("success", { data });

        onLogin();
        history.push("/");
      },
      onFailure: (error) => console.log("failure", { error }),
      newPasswordRequired: (data) =>
        console.log("newPasswordRequired", { data }),
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={email}
          placeholder="email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
