import Nav from "../../Nav";
import { useNavigate } from "react-router-dom";
import GameList from "./GameList";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { apiCreateGame, apiGetCurrentSessionUser } from "../../dao";
import { User } from "../../types";

function StartGamePanel({
  isBeginner,
  loggedIn,
}: {
  isBeginner: boolean;
  loggedIn: boolean;
}) {
  const navigate = useNavigate();

  async function onPlayWithFriend() {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    apiCreateGame().then((gameID) => navigate(`/game/${gameID}`));
  }

  return (
    <div style={{ borderStyle: "solid", padding: "10px" }}>
      <h3>Play</h3>
      <Stack gap={2}>
        {!isBeginner ? (
          <>
            <Button>Random Match</Button>
            <Button onClick={onPlayWithFriend}>Play with Friend</Button>
          </>
        ) : (
          <Button>Start New Game</Button>
        )}
      </Stack>
    </div>
  );
}

function Home() {
  const [userData, setUserData] = useState<User | false>();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setUserData(data);
    });
  }, []);

  if (userData === undefined) {
    return <div>Loading</div>;
  }

  const [loggedIn, isBeginner] = [
    !!userData,
    userData && userData.role === "beginner",
  ];

  return (
    <div>
      <Nav loggedIn={loggedIn} isBeginner={isBeginner} />
      <div>
        <Container style={{ marginLeft: "5%", marginRight: "5%" }}>
          <h1>Home</h1>
          <Row>
            <Col className="col-8">
              <StartGamePanel loggedIn={loggedIn} isBeginner={isBeginner} />
            </Col>
            <Col>
              {userData && userData.role === "beginner" ? (
                <p>
                  To play with other users and see their stats, create a
                  non-beginner account!
                </p>
              ) : (
                <GameList userData={userData} />
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
export default Home;
