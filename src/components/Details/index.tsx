import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { PictureInfo, apiGetCurrentSessionUser, apiPictureId, apiSetUser } from "../../dao";
import { useNavigate, useParams } from "react-router";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

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
    return <div>Loading</div>;
  }

  if (entryData === 'invalid') {
    return (
      <div>
        <Nav loggedIn={loggedIn} isBeginner={false}/>
        <div style={{marginLeft: '5%', marginRight: '5%'}}>
          <h1>This image does not exist.</h1>
        </div>
      </div>
    );
  }

  const setProfilePicture = () => {
    apiSetUser({ pfp: entryData.id + '' }).then(setPfpSet);
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
    <div>
      <Nav loggedIn={loggedIn} isBeginner={false}/>
      <div style={{marginLeft: '5%', marginRight: '5%'}}>
        <h1>Details</h1>
        <div>
          <h2>Image #{entryData.id}</h2>
          <h4>Artist: {entryData.user} &nbsp; Views: {entryData.views} &nbsp; Tags: {entryData.tags}</h4>
          <img src={entryData.webformatURL}/>
        </div>
        <div>
          <SetPfpButton/>
        </div>
        <Link to={entryData.pageURL} style={{fontSize: 20}}>{entryData.pageURL}</Link>
      </div>
    </div>
  );
}
export default Details;
