import { useState } from "react";
import { useNavigate } from "react-router";
import Nav from "../../Nav";
import Inputs from "./Inputs";
import { apiAccountRegister, cacheSessionToken } from "../../dao";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const FIELDS = [
    {
      name: 'username',
      set: setUsername,
      value: username,
    },
    {
      name: 'email',
      set: setEmail,
      value: email,
    },
    {
      name: 'password',
      set: setPassword,
      value: password,
      hide: true
    }
  ]

  function register() {
    if (!username || !password) {
      return;
    }
    apiAccountRegister(username, password, email).then(token => {
      cacheSessionToken(token);
      navigate('/home');
    }).catch(() => {
      // TODO: handle registration fail
    });
  }

  return (
    <div>
      <Nav />
      <h1>Register</h1>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Inputs fields={FIELDS}/>
        <button onClick={register}>Register</button>
        <button onClick={() => navigate('/login')}>Go Login</button>
      </div>
    </div>
  );
}