import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Nav from "../../Nav";
import Inputs from "./Inputs";
import { apiAccountRegister, apiGetCurrentSessionUser, cacheSessionToken } from "../../dao";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [isBeginner, setIsBeginner] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setLoggedIn(!!data)
    })  }, []);

  if (loggedIn === undefined) {
    return <div>Loading</div>;
  }

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
    if (!username || !password || !email) {
      return;
    }
    apiAccountRegister(username, password, email, isBeginner).then(token => {
      cacheSessionToken(token);
      navigate('/home');
    }).catch(() => {
      // TODO: handle registration fail
    });
  }

  return (
    <div>
      <Nav loggedIn={loggedIn}/>
      <h1>Register</h1>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Inputs fields={FIELDS}/>
        <label>Are you a beginner? <input type="checkbox"/></label>
        <button onClick={register}>Register</button>
        <button onClick={() => navigate('/login')}>Go Login</button>
      </div>
    </div>
  );
}