import Nav from "../../Nav";
import { Link } from "react-router-dom";
import GameList from "./GameList";

function Home() {
  return (
    <div>
      <Nav />
      <h1>Home</h1>
      <Link to="/Game">
        <button>Create New Game</button>
      </Link>
      <GameList />
    </div>
  );
}
export default Home;
