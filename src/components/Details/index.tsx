import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { PictureInfo, apiGetCurrentSessionUser, apiPictureId, apiSetUser } from "../../dao";
import { useNavigate, useParams } from "react-router";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./index.css"
import TempMessage from "../Util/TempMessage";

function Details() {
  const { imageID } = useParams();
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [entryData, setEntryData] = useState<PictureInfo | 'invalid'>();
  const [pfpSet, setPfpSet] = useState<boolean>(false);

  const navigate = useNavigate()

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setLoggedIn(!!data)
      !!data && data.role === "beginner" && navigate("/home")
    })
  }, []);

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setLoggedIn(!!data)
    })
    if (!imageID) {
      setEntryData('invalid');
      return;
    }
    apiPictureId(imageID).then(result => setEntryData(result)).catch(() => setEntryData('invalid'));
  }, []);

  if (loggedIn === undefined || entryData === undefined) {
    return <TempMessage text="Loading..."/>;
  }

  const setProfilePicture = () => {
    entryData !== 'invalid' && apiSetUser({ pfp: entryData.id + '' }).then(setPfpSet);
  }

  function SetPfpButton() {
    if (!loggedIn) {
      return <Button disabled={true}>Log in to Set as Profile Picture</Button>;
    }
    if (pfpSet) {
      return <Button disabled={true}>Profile Picture Already Set!</Button>;
    }
    return <Button onClick={setProfilePicture}>Set as Profile Picture</Button>;
  }

  return (
    <div style={{overflow: "hidden"}}>
      <Nav loggedIn={loggedIn} isBeginner={false}/>
      <div className="details-page">
        {entryData === 'invalid' ?
        <>
          <Button onClick={() => navigate('/search')}>
            {"< Search"}
          </Button>
          <TempMessage text="This image does not exist"/>
        </>
        :
        <div style={{display: "flex"}}>
          <div className="img-container">
            <Button onClick={() => navigate('/search')}>
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
              <h4>Artist: {entryData.user} &nbsp; Views: {entryData.views} &nbsp; Tags: {entryData.tags}</h4>
            </div>
            <Link to={entryData.pageURL}>{entryData.pageURL}</Link>
            <div style={{paddingTop: "10px"}}>
              <SetPfpButton/>
            </div>
            <div>
              Liked by: 
              <ul>
                {
                  entryData.likes.map((name) => {
                    return (
                      <li>
                        <a href={"/#/profile/"+name}>{name}</a>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  );
}
export default Details;
