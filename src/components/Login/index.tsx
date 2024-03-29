import { useState } from "react";
import Nav from "../../Nav";
import { useNavigate } from "react-router";
import axios from "axios";
import { apiAccountLogin, cacheSessionToken } from "../../dao";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
        <label>Username <input value={username} onChange={e => setUsername(e.target.value)}/></label>
        <label>Password <input value={password} type="password" onChange={e => setPassword(e.target.value)}/></label>
        <button onClick={login}>Log in</button>
      </div>
    </div>
  );
}
export default Login;
