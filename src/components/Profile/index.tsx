import { useEffect, useState } from "react";
import Nav from "../../Nav";
import {
  PictureInfo,
  apiGetCurrentSessionUser,
  apiGetUser,
  apiPictureId,
  apiSetUser,
} from "../../dao";
import { useNavigate, useParams } from "react-router";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { User } from "../../types";
import "./index.css"
import GameList from "../Home/GameList";
import TempMessage from "../Util/TempMessage";

export function SelfProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | false>();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setUserData(data);
    });
  }, []);

  if (userData === undefined) {
    return <TempMessage text="Loading..."/>
  }

  if (!userData) {
    navigate("/login");
    return <TempMessage text="Must be logged in. Redirecting..."/>
  }

  return <Profile username={userData.username} isChill={true} />;
}

export function OtherProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | false>();
  const { username } = useParams();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setUserData(data);
    });
  }, []);

  useEffect(() => {
    if (userData) {
      // are we the person we're looking at?
      const isChill = userData.username === username;
      if (isChill) {
        navigate("/profile");
        return;
      }
      userData.role === "beginner" && navigate("/home");
    }
  }, [userData, username]);

  if (!username) {
    return <TempMessage text="Loading..."/>;
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
  const [currentUserData, setCurrentUserData] = useState<User | false>();
  const [userData, setUserData] = useState<User | false>();
  const [amIFollowing, setAmIFollowing] = useState<boolean>(false);
  const [profilePic, setProfilePic] = useState<PictureInfo>();

  const navigate = useNavigate();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setCurrentUserData(data);
      data 
      && data.role === "regular" 
      && setAmIFollowing(data.following.includes(username));
    });
  }, []);

  useEffect(() => {
    apiGetUser(username)
      .then((userData) => {
        setUserData(userData);
        if (userData.pfp) {
          apiPictureId(userData.pfp).then((entry: PictureInfo) => {
            setProfilePic(entry);
          });
        }
      })
      .catch(() => {
        setUserData(false);
      });
  }, [username]);

  if (currentUserData === undefined || userData === undefined) {
    return <TempMessage text="Loading..."/>;
  }
  if (!userData) {
    return (
      <div>
        <TempMessage text="User does not exist!"/>
        <Button style={{marginLeft: "20px"}} onClick={() => navigate("/Home")}>Go Home</Button>
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
    if (currentUserData && currentUserData.role === "regular") {
      const ownFollowing = currentUserData.following;
      if (ownFollowing.includes(username)) {
        currentUserData.following = ownFollowing.filter(
          (followee: string) => followee !== username
        );
      } else {
        currentUserData.following.push(username);
      }
      apiSetUser({ following: currentUserData.following }).then((success) => {
        if (!success) {
          throw Error("Cannot update following list!");
        }
      });
      setAmIFollowing(!amIFollowing);
    }
  };

  const chillUI = () => {
    return (
      <div style={{display: "flex"}}>
        <form>
          <label htmlFor="email-field">
            Email:
          </label>
          <input
            type="text"
            id="email-field"
            title="Email field"
            placeholder="Email"
            value={userData.email}
            style={{marginLeft: "10px", width: "250px"}}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          <Button style={{marginLeft: "10px"}} 
                onClick={handleEmailChange}>
                  Change Email
          </Button>
        </form>
        
      </div>
    );
  };

  const notChillUI = () => {
    return (
      <div>
        {currentUserData && (
          <Button onClick={handleFollow}>
            {amIFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div>
      <Nav userData={currentUserData}/>
      <Container className="profile">
        <Row lg={2} sm={1}>
          <Col>
            <div style={{display: "flex"}}>
              {userData.role === "regular" && profilePic && (
                <Link to={`/details/${userData.pfp}`}>
                  <img className="pfp" style={{}} src={profilePic.previewURL} />
                </Link>
              )}
              <h1>{username}'s Profile</h1>
            </div>
            {isChill ? chillUI() : notChillUI()}
            {userData.role === "regular" &&
              <div className="box">
                <h2>Following</h2>
                <ul>
                  {userData.following.length !== 0 ?
                  userData.following.map((follower: string) => (
                    <Link to={`/profile/${follower}`}>
                      <li key={follower}>{follower}</li>
                    </Link>
                  ))
                  :
                  <p>Not following anyone {":("}</p>}
                </ul>
              </div>
            }
          </Col>
          {userData.role === "regular" && (
            <Col>
              <GameList userData={userData}/>
              <div>Wins: {userData.stats.wins} Losses: {userData.stats.losses} Ties: {userData.stats.ties}</div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
