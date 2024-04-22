import { useEffect, useState } from "react";
import Nav from "../../Nav";
import {
  PictureInfo,
  apiGetCurrentSessionUser,
  apiPictureId,
  apiSetUser,
} from "../../dao";
import { useNavigate, useParams } from "react-router";
import { Button } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import "./index.css";
import TempMessage from "../Util/TempMessage";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../Account/reducer";
import { Connect4State } from "../../store";

function Details() {
  const { imageID } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const userData = useSelector(
    (state: Connect4State) => state.accountReducer.userData
  );
  const [entryData, setEntryData] = useState<PictureInfo | "invalid">();
  const [pfpSet, setPfpSet] = useState<boolean>(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      dispatch(setUserData(data));
      if (!!data && data.role === "beginner") {
        navigate("/home");
      }
    });
  }, [pfpSet]);

  useEffect(() => {
    if (!imageID) {
      setEntryData("invalid");
      return;
    }
    apiPictureId(imageID)
      .then((result) => setEntryData(result))
      .catch(() => setEntryData("invalid"));
  }, []);

  if (userData === undefined || entryData === undefined) {
    return <TempMessage text="Loading..." />;
  }

  if (entryData === "invalid") {
    return (
      <>
        <TempMessage text="This image does not exist" />
        <Button style={{margin: "20px"}} onClick={() => navigate("/search" + (searchParams.get("query") ? "?search=" + searchParams.get("query") : ""))}>
          {"< Search"}
        </Button>
      </>
    )
  }

  const setProfilePicture = () => {
    apiSetUser({ pfp: entryData.id + "" }).then(() => setPfpSet(true));
  };

  function SetPfpButton() {
    if (!userData) {
      return <Button disabled={true}>Log in to Set as Profile Picture</Button>;
    }
    if (pfpSet) {
      return <Button disabled={true}>Profile Picture Already Set!</Button>;
    }
    return <Button onClick={setProfilePicture}>Set as Profile Picture</Button>;
  }

  return (
    <div style={{ overflow: "hidden" }}>
      <Nav userData={userData} />
      <div className="details-page">
        <div style={{ display: "flex" }}>
          <div className="img-container">
            <Button onClick={() => navigate("/search" + (searchParams.get("query") ? "?search=" + searchParams.get("query") : ""))}>
              {"< Search"}
            </Button>
            <div>
              <img className="img" src={entryData.webformatURL} />
            </div>
          </div>
          <div>
            <h1>Details</h1>
            <div>
              <h2>Image #{entryData.id}</h2>
              <h4>
                Artist: {entryData.user} &nbsp; Views: {entryData.views}{" "}
                &nbsp; Tags: {entryData.tags}
              </h4>
            </div>
            <Link to={entryData.pageURL}>{entryData.pageURL}</Link>
            <div style={{ paddingTop: "10px" }}>
              <SetPfpButton />
            </div>
            {userData && (
              <div>
                Liked by:
                <ul>
                  {entryData.likes.length === 0
                    ? "No one :("
                    : entryData.likes.map((name) => {
                        return (
                          <li>
                            <a href={"/#/profile/" + name}>{name}</a>
                          </li>
                        );
                      })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Details;
