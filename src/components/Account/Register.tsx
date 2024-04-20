import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import C4Nav from "../../Nav";
import Inputs from "./Inputs";
import {
  apiAccountRegister,
  apiGetCurrentSessionUser,
  cacheSessionToken,
} from "../../dao";
import { Button } from "react-bootstrap";
import TempMessage from "../Util/TempMessage";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../Account/reducer";
import { Connect4State } from "../../store";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [isBeginner, setIsBeginner] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<boolean>(false);
  const userData = useSelector(
    (state: Connect4State) => state.accountReducer.userData
  );
  const dispatch = useDispatch();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      dispatch(setUserData(data));
    });
  }, []);

  if (userData === undefined) {
    return <TempMessage text="Loading..." />;
  }

  const FIELDS = [
    {
      name: "Username",
      set: setUsername,
      value: username,
    },
    {
      name: "Email",
      set: setEmail,
      value: email,
    },
    {
      name: "Password",
      set: setPassword,
      value: password,
      type: "password",
    },
    {
      name: "Are you a beginner? ",
      set: setIsBeginner,
      value: isBeginner,
      type: "checkbox",
    },
  ];

  function register() {
    if (!username || !password || !email) {
      return;
    }
    apiAccountRegister(username, password, email, isBeginner)
      .then((token) => {
        cacheSessionToken(token);
        navigate("/home");
      })
      .catch((response) => {
        if (response.response.status === 409) {
          setUserExists(true);
        }
      });
  }

  return (
    <div>
      <C4Nav userData={userData} />
      <div className="login-page">
        <h1>Register</h1>
        <Inputs fields={FIELDS} />
        {userExists && <p className="error-text">User Already Exists!</p>}
        <div>
          <Button size="lg" style={{ marginRight: "10px" }} onClick={register}>
            Register
          </Button>
          <Button size="lg" onClick={() => navigate("/login")}>
            Go Login
          </Button>
        </div>
      </div>
    </div>
  );
}
