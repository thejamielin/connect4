import Nav from "../../Nav";
import { Link, useNavigate } from "react-router-dom";
import GameList from "./GameList";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { apiCreateGame, apiGetCurrentSessionUser } from "../../dao";

function StartGamePanel() {
  const navigate = useNavigate();

  async function onPlayWithFriend() {
    apiCreateGame().then(gameID => navigate(`/game/${gameID}`));
  }

  return (
    <div style={{borderStyle: 'solid', padding: '10px'}}>
      <h3>Play</h3>
      <Stack gap={2}>
        <Button>Random Match</Button>
        <Button onClick={onPlayWithFriend}>Play with Friend</Button>
      </Stack>
    </div>
  );
}

function Home() {
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [isBeginner, setIsBeginner] = useState<boolean>();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setLoggedIn(!!data)
      setIsBeginner(!!data && data.role === "beginner")
    })
  }, []);

  if (loggedIn === undefined || isBeginner === undefined) {
    return <div>Loading</div>;
  }
  
  return (
    <div>
      <Nav loggedIn={loggedIn} isBeginner={isBeginner}/>
      <div>
        <Container style={{marginLeft: '5%', marginRight: '5%'}}>
          <h1>Home</h1>
          <Row>
            <Col className="col-8">
              <StartGamePanel/>
            </Col>
            <Col>
              <GameList />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}
export default Home;
