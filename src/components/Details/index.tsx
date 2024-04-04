import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { validateLoggedIn } from "../../dao";

function Details() {
  const [loggedIn, setLoggedIn] = useState<boolean>();

  useEffect(() => {
    validateLoggedIn(setLoggedIn)
  }, []);

  if (loggedIn === undefined) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Nav loggedIn={loggedIn}/>
      <h1>Details</h1>
    </div>
  );
}
export default Details;
