import Nav from "../../Nav";
import { Link } from "react-router-dom";
import ListOfGames from "./listofgames";

function Home() {
  return (
    <div>
      <Nav />
      <h1>Home</h1>
      <Link to="/Game">
        <button>Create New Game</button>
      </Link>
      <ListOfGames />
    </div>
  );
}
export default Home;
