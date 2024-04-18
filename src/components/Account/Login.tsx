import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  apiAccountLogin,
  apiGetCurrentSessionUser,
  cacheSessionToken
} from "../../dao";
import Inputs from "./Inputs";
import { Button } from "react-bootstrap";
import TempMessage from "../Util/TempMessage";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [loginFail, setLoginFail] = useState<boolean>(false);


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
    return <TempMessage text="Loading..." />;
  }

  const FIELDS = [
    {
      name: "Username",
      set: setUsername,
      value: username,
    },
    {
      name: "Password",
      set: setPassword,
      value: password,
      type: "password"
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
        setLoginFail(true)
      });
  }

  return (
    <div>
      <Nav loggedIn={loggedIn} isBeginner={false}/>
      <div className="login-page">
        <h1>Login</h1>
        <Inputs fields={FIELDS} />
        {loginFail && <p className="error-text">Login Failed</p>}
        <div>
          <Button size="lg" style={{marginRight: "10px"}} onClick={login}>Log in</Button>
          <Button size="lg" onClick={() => navigate("/register")}>Go Register</Button>
        </div>
      </div>
    </div>
  );
}
export default Login;
