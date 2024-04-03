import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { apiAccountLogin, cacheSessionToken } from "../../dao";
import Inputs from "./Inputs";
import { Connect4State } from "../../store";
import { validateLoggedIn } from "./reducer";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { isLoggedIn } = useSelector(
    (state: Connect4State) => state.accountReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateLoggedIn());
  }, []);

  useEffect(() => {
    if (isLoggedIn === true) {
      navigate("/home");
    }
  }, [isLoggedIn]);

  if (isLoggedIn === undefined) {
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
      <Nav />
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
