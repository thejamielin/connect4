import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function AccountButton() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

function Nav() {
  return (
    <nav className="nav nav-tabs mt-2 d-flex justify-content-between">
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
      <AccountButton/>
    </nav>
  );
}
export default Nav;
