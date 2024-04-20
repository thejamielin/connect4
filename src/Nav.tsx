import {
  Button,
  Dropdown,
  DropdownButton,
  NavItem,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { PictureInfo, apiAccountLogout, apiPictureId } from "./dao";
import { User } from "./types";
import { useEffect, useState } from "react";
import "./index.css";

function AccountButton({ loggedIn }: { loggedIn: boolean }) {
  const navigate = useNavigate();

  async function logout() {
    await apiAccountLogout().then(() => {
      navigate("/Home");
      window.location.reload();
    });
  }

  return (
    <div>
      {loggedIn ? (
        <DropdownButton title="Profile" align="end">
          <Dropdown.Item href="/#/profile">Profile</Dropdown.Item>
          <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        </DropdownButton>
      ) : (
        <Button href="/#/login">Log in</Button>
      )}
    </div>
  );
}

function Nav({ userData }: { userData: User | false }) {
  const [pfp, setPfp] = useState<PictureInfo>();
  const DEFAULT_PFP_ID = "973460";

  useEffect(() => {
    if (userData && userData.role === "regular" && userData.pfp) {
      apiPictureId(userData.pfp).then((entry: PictureInfo) => {
        setPfp(entry);
      });
    } else {
      apiPictureId(DEFAULT_PFP_ID).then((entry: PictureInfo) => {
        setPfp(entry);
      });
    }
  }, [userData]);

  return (
    <Navbar className="nav nav-tabs mt-2">
      <Link className="nav-link" to="/Home">
        <Navbar.Brand style={{ display: "flex", alignItems: "center" }}>
          <img
            style={{ height: "30px", marginRight: "8px" }}
            src="c4-icon.ico"
          ></img>
          Connect4Fun
        </Navbar.Brand>
      </Link>
      <Navbar.Collapse>
        <NavItem
          className="d-flex justify-content-end align-items-center"
          style={{ width: "100%", paddingRight: "5%" }}
        >
          {userData !== undefined &&
            !(userData && userData.role === "beginner") && (
              <Link className="nav-link" to="/Search">
                Search Profile Pictures
              </Link>
            )}
          <AccountButton loggedIn={!!userData} />
          <img className="pfp" src={pfp && pfp.previewURL} />
        </NavItem>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default Nav;
