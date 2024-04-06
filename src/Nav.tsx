import { Button, Dropdown, DropdownButton, NavItem, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { apiAccountLogout } from "./dao";

function AccountButton({loggedIn}: {loggedIn: boolean}) {
  const navigate = useNavigate();
  async function logout() {
    await apiAccountLogout().then(() => navigate('/login'));
  }

  return (
    <div>
      {
        loggedIn ? (
          <DropdownButton title='Account' align='end'>
            <Dropdown.Item href="/#/profile">Profile</Dropdown.Item>
            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
          </DropdownButton>
        ) : <Button href='/#/login'>Log in</Button>
      }
    </div>
  )
}

function Nav({loggedIn}: {loggedIn: boolean}) {
  return (
    <Navbar className="nav nav-tabs mt-2">
      <Link className="nav-link" to="/Home">
        Home
      </Link>
      <Navbar.Collapse>
        <NavItem className="d-flex justify-content-end" style={{width: '100%', paddingRight: '5%'}}>
          <Link className="nav-link" to="/Search">
            Search
          </Link>
          <Link className="nav-link" to="/friends">Friends</Link>
          <AccountButton loggedIn={loggedIn}/>
        </NavItem>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default Nav;
