import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { PictureInfo, apiPictureSearch, validateLoggedIn } from "../../dao";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router";

function Search() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [searchString, setSearchString] = useState<string>('');
  const [hoveringOver, setHoveringOver] = useState<number>();
  const [imageEntries, setImageEntries] = useState<PictureInfo[]>([]);

  useEffect(() => {
    validateLoggedIn(setLoggedIn);
    refreshSearchResults();
  }, []);

  function refreshSearchResults() {
    apiPictureSearch(searchString).then(result => setImageEntries(result));
  }

  if (loggedIn === undefined) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Nav loggedIn={loggedIn}/>
      <div style={{marginLeft: '5%', marginRight: '5%', position: 'relative'}}>
        <div style={{position: 'sticky', top: 0}}>
          <h1>Search Profile Pictures</h1>
          <Form.Control value={searchString} onChange={e => setSearchString(e.target.value)} onKeyDown={e => {
            if (e.key === 'Enter') {
              refreshSearchResults();
            }
          }}/>
        </div>
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          {imageEntries.slice(10).map((imageEntry, i) => {
            return (
              <div
                className="unselectable"
                style={{
                  borderStyle: 'solid',
                  margin: '1%',
                  height: '20vh',
                  display: 'flex',
                  width: '40em',
                  cursor: 'pointer',
                  ...(hoveringOver === i ? {backgroundColor: 'lightgray'} : {})
                }}
                key={i}
                onMouseEnter={() => setHoveringOver(i)}
                onMouseLeave={() => setHoveringOver(undefined)}
                onClick={() => navigate(`/#/details/${imageEntry.id}`)}
              >
                <div style={{display: 'flex', alignItems: 'center', padding: '2%'}}>Image #{imageEntry.id}</div>
                <img src={imageEntry.previewURL} style={{objectFit: 'fill', height: '100%'}}/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Search;
