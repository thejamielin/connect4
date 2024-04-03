import Nav from "../../Nav";
import { Link } from "react-router-dom";
import GameList from "./GameList";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";

function StartGamePanel() {
  return (
    <div style={{borderStyle: 'solid', padding: '10px'}}>
      <h3>Play</h3>
      <Stack gap={2}>
        <Button>Random Match</Button>
        <Button>Play with Friend</Button>
      </Stack>
    </div>
  );
}

function Home() {
  return (
    <div>
      <Nav />
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
