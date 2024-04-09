import { useEffect, useState } from "react";
import Nav from "../../Nav";
import {
  PictureInfo,
  User,
  apiAccountGetUsername,
  apiGetCurrentSessionUser,
  apiGetUser,
  apiPictureId,
  apiSetUser,
  validateLoggedIn,
} from "../../dao";
import { useNavigate, useParams } from "react-router";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export function SelfProfile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [loggedIn, setLoggedIn] = useState<boolean>();

  useEffect(() => {
    validateLoggedIn(setLoggedIn);
    if(loggedIn){
      apiAccountGetUsername().then(setUsername);
    }
  }, []);

  if (!loggedIn) {
    navigate("/login")
  }

  if (!username) {
    return <div>Loading</div>;
  }

  return <Profile username={username} isChill={true} />;
}

export function OtherProfile() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const { username } = useParams();

  useEffect(() => {
    validateLoggedIn(setLoggedIn);
  }, [])

  useEffect(() => {
    if(loggedIn) {
      apiAccountGetUsername().then((currentUsername) => {
        // are we the person we're looking at?
        const isChill = currentUsername === username;
        if (isChill) {
          navigate("/profile");
        }
      });
    }
  }, [username]);

  if (!username) {
    return <div>Loading</div>;
  }

  return <Profile username={username} isChill={false} />;
}

function Profile({
  username,
  isChill,
}: {
  username: string;
  isChill: boolean;
}) {
  const [doesUserExist, setDoesUserExist] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [userData, setUserData] = useState<User>();
  const [amIFollowing, setAmIFollowing] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<PictureInfo>();

  const navigate = useNavigate();

  useEffect(() => {
    validateLoggedIn(setLoggedIn);

    if(loggedIn) {
      apiGetCurrentSessionUser().then((me) => {
        setAmIFollowing(me.following.includes(username));
      });
    }
    apiGetUser(username)
      .then((userData: User) => {
        setUserData(userData);
        if (userData.pfp) {
          apiPictureId(userData.pfp).then((entry: PictureInfo) => {
            setProfilePic(entry);
          });
        }
      })
      .catch(() => {
        setDoesUserExist(false);
      });
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

  const handleEmailChange = async () => {
    apiSetUser({ email: userData.email }).then((success) => {
      if (!success) {
        throw Error("Cannot update email!");
      }
    });
  };

  const handleFollow = async () => {
    const me = await apiGetCurrentSessionUser();
    const ownFollowing = me.following;
    if (ownFollowing.includes(username)) {
      me.following = ownFollowing.filter(
        (followee: string) => followee !== username
      );
    } else {
      me.following.push(username);
    }
    apiSetUser({ following: me.following }).then((success) => {
      if (!success) {
        throw Error("Cannot update following list!");
      }
    });
    setAmIFollowing(!amIFollowing);
  };

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
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </label>
        </form>
        <Button onClick={handleEmailChange}>Change Email</Button>
        <h2>Followers</h2>
        <ul>
          {userData.following.map((follower: string) => (
            <Link to={`/profile/${follower}`}>
              <li key={follower}>{follower}</li>
            </Link>
          ))}
        </ul>
      </div>
    );
  };

  const notChillUI = () => {
    return (
      <div>
        <p>Username: {username}</p>
        {loggedIn &&
          <Button onClick={handleFollow}>
            {amIFollowing ? "Unfollow" : "Follow"}
          </Button>
        } 
        <h2>Followers</h2>
        <ul>
          {userData.following.map((follower: string) => (
            <li key={follower}>{follower}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <Nav loggedIn={loggedIn} />
      <h1>Profile</h1>
      {profilePic && (
        <Link to={`/details/${userData.pfp}`}>
          <img
            src={profilePic.previewURL}
            style={{ objectFit: "fill", height: "100%" }}
          />
        </Link>
      )}
      {isChill ? chillUI() : notChillUI()}
    </div>
  );
}
