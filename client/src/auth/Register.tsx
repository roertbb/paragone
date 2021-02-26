import { useState } from "react";
import { UserPool, CognitoUserAttribute } from "./UserPool";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const attributes = [
      new CognitoUserAttribute({
        Name: "email",
        Value: "email@mydomain.com",
      }),
    ];

    UserPool.signUp(username, password, attributes, [], (error, data) => {
      if (error) {
        console.error({ error });
      } else {
        console.log({ data });
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={username}
          placeholder="username"
          onChange={(event) => setUsername(event.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
