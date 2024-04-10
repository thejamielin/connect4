import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  apiAccountCheckSession,
  apiAccountLogin,
  apiGetCurrentSessionUser,
  cacheSessionToken,
  deleteSessionToken,
  getSessionToken,
} from "../../dao";
import Inputs from "./Inputs";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setLoggedIn(!!data)
    })
  }, []);

  useEffect(() => {
    if (loggedIn === true) {
      navigate("/home");
    }
  }, [loggedIn]);

  if (loggedIn === undefined) {
    return <div>Loading</div>;
  }

  const FIELDS = [
    {
      name: "username",
      set: setUsername,
      value: username,
    },
    {
      name: "password",
      set: setPassword,
      value: password,
      hide: true,
    },
  ];
  function login() {
    if (!username || !password) {
      return;
    }
    apiAccountLogin(username, password)
      .then((token) => {
        cacheSessionToken(token);
        navigate("/home");
      })
      .catch(() => {
        // TODO: handle login fail
      });
  }

  return (
    <div>
      <Nav loggedIn={loggedIn}/>
      <h1>Login</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Inputs fields={FIELDS} />
        <button onClick={login}>Log in</button>
        <button onClick={() => navigate("/register")}>Go Register</button>
      </div>
    </div>
  );
}
export default Login;
