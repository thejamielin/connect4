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
  const [userExists, setUserExists] = useState<boolean>(false);
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
      type: "password"
    },
    {
      name: 'beginner',
      set: setIsBeginner,
      value: isBeginner,
      type: "checkbox"
    }
  ]

  function register() {
    if (!username || !password || !email) {
      return;
    }
    apiAccountRegister(username, password, email, isBeginner).then(token => {
      cacheSessionToken(token);
      navigate('/home');
    }).catch((response) => {
      if(response.response.status === 409) {
        setUserExists(true)
      }
    });
  }

  return (
    <div>
      <Nav loggedIn={loggedIn}/>
      <h1>Register</h1>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Inputs fields={FIELDS}/>
        {userExists && <p style={{color: "red"}}>User Already Exists!</p>}
        <button onClick={register}>Register</button>
        <button onClick={() => navigate('/login')}>Go Login</button>
      </div>
    </div>
  );
}