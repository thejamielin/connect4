import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { apiAccountGetUsername, apiGetUser, validateLoggedIn } from "../../dao";
import { useNavigate, useParams } from "react-router";
import { Button } from "react-bootstrap";

export function SelfProfile() {
  const [username, setUsername] = useState()
  useEffect(() => {
    apiAccountGetUsername().then(setUsername);
  }, []);

  if(!username) {
    return <div>Loading</div>;
  }

  return(
    <Profile username={username} isChill={true}/>
  )
}

export function OtherProfile() {
  const navigate = useNavigate();
  const { username } = useParams();

  useEffect(() => {
    apiAccountGetUsername().then((currentUsername) => {
      // are we the person we're looking at?
      const isChill = (currentUsername === username)
      if(isChill) {
        navigate('/profile')
      }
    })

  }, [username]);

  if(!username) {
    return <div>Loading</div>;
  }

  return(
    <Profile username={username} isChill={false}/>
  )
}

function Profile({username, isChill} : {username : string, isChill: boolean}) {
  const [doesUserExist, setDoesUserExist] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [userData, setUserData] = useState<any>();

  const navigate = useNavigate();

  useEffect(() => {
    validateLoggedIn(setLoggedIn);
    apiGetUser(username).then((userData) => {
      setUserData(userData)
    }).catch(() => {
      setDoesUserExist(false)
    })
  }, [username]);

  if (loggedIn === undefined || userData === undefined) {
    return <div>Loading</div>;
  }
  if (!doesUserExist) {
    return (
      <div>
        User {username} does not exist!
        <Button onClick={() => navigate("/Home")}>Go Home</Button>
      </div>
    );
  }

  const chillUI = () => {
    return (
      <div>
        <p>Username: {username}</p>
        <form>
          <label>
            Email:
            <input
              type="text"
              id="email-field"
              title="Email field"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
            />
          </label>
        </form>
        <h2>Followers</h2>
        <ul>
          {userData.following.map((follower: string) => (
            <li key={follower}>{follower}</li>
          ))}
        </ul>
      </div>
    )
  }

  const notChillUI = () => {
    return (
      <div>
        <p>Username: {username}</p>
        <Button>Follow/Unfollow</Button>
        <h2>Followers</h2>
        <ul>
          {userData.following.map((follower: string) => (
            <li key={follower}>{follower}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      <Nav loggedIn={loggedIn} />
      <h1>Profile</h1>
      {isChill ? chillUI() : notChillUI()}
    </div>
  );
}
