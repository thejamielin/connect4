import { useState } from "react";
import Nav from "../../Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import { apiAccountLogin, cacheSessionToken } from "../../dao";
import Inputs from "./Inputs";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const FIELDS = [
    {
      name: 'username',
      set: setUsername,
      value: username,
    },
    {
      name: 'password',
      set: setPassword,
      value: password,
      hide: true
    }
  ]
  function login() {
    if (!username || !password) {
      return;
    }
    apiAccountLogin(username, password).then(token => {
      cacheSessionToken(token);
      navigate('/home');
    }).catch(() => {
      // TODO: handle login fail
    });
  }

  return (
    <div>
      <Nav />
      <h1>Login</h1>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Inputs fields={FIELDS}/>
        <button onClick={login}>Log in</button>
        <button onClick={() => navigate('/register')}>Go Register</button>
      </div>
    </div>
  );
}
export default Login;
