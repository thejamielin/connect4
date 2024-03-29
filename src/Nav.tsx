import { Link } from "react-router-dom";
function Nav() {
  return (
    <nav className="nav nav-tabs mt-2">
      <Link className="nav-link" to="/Home">
        Home
      </Link>
      <Link className="nav-link" to="/Login">
        Login
      </Link>
      <Link className="nav-link" to="/Profile">
        Profile
      </Link>
      <Link className="nav-link" to="/Search">
        Search
      </Link>
    </nav>
  );
}
export default Nav;
