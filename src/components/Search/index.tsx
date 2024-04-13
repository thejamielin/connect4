import { useEffect, useState } from "react";
import Nav from "../../Nav";
import {
  PictureInfo,
  apiGetCurrentSessionUser,
  apiPictureLike,
  apiPictureSearch,
  apiPictureUnlike,
} from "../../dao";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import { BsHeartFill } from "react-icons/bs";
import { User } from "../../types";

function SearchEntry({
  pictureInfo,
  userData,
}: {
  pictureInfo: PictureInfo;
  userData: User | false;
}) {
  const navigate = useNavigate();
  const [hoveringOver, setHoveringOver] = useState<boolean>();
  const [liked, setLiked] = useState<boolean>();
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    if (!userData) {
      return;
    }
    setLiked(!!pictureInfo.likes.find((user) => user === userData.username));
    setLikeCount(pictureInfo.likes.length);
  }, [userData]);

  function onLike(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    if (liked) {
      apiPictureUnlike(pictureInfo.id + "");
      setLikeCount(likeCount - 1);
    } else {
      apiPictureLike(pictureInfo.id + "");
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  }

  function LikeButton() {
    return (
      <div>
        {userData && (
          <div
            onMouseEnter={() => setHoveringOver(false)}
            onMouseLeave={() => setHoveringOver(true)}
          >
            <button
              onClick={(e) => onLike(e)}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              <BsHeartFill color={liked ? "red" : "gray"} size={24} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="unselectable justify-content-between"
      style={{
        borderStyle: "solid",
        margin: "1%",
        height: "20vh",
        display: "flex",
        width: "40em",
        cursor: "pointer",
        ...(hoveringOver ? { backgroundColor: "lightgray" } : {}),
      }}
      onMouseEnter={() => setHoveringOver(true)}
      onMouseLeave={() => setHoveringOver(false)}
      onClick={() => navigate(`/details/${pictureInfo.id}`)}
    >
      <div style={{ display: "flex", alignItems: "center", padding: "2%" }}>
        Image #{pictureInfo.id}
      </div>
      <img
        src={pictureInfo.previewURL}
        style={{ objectFit: "fill", height: "100%" }}
      />
      <div style={{ display: "flex", alignItems: "center", padding: "2%" }}>
        {likeCount}
        <LikeButton />
      </div>
    </div>
  );
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [userData, setUserData] = useState<User | false>();
  const [searchString, setSearchString] = useState<string>("");
  const [imageEntries, setImageEntries] = useState<PictureInfo[]>([]);

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      setLoggedIn(!!data);
      setUserData(data);
      data && data.role === "beginner" && navigate("/home");
    });
    apiPictureSearch(searchParams.get("search") || "").then((result) =>
      setImageEntries(result)
    );
  }, [searchParams]);

  if (loggedIn === undefined || userData === undefined) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Nav loggedIn={loggedIn} isBeginner={false} />
      <div
        style={{ marginLeft: "5%", marginRight: "5%", position: "relative" }}
      >
        <div style={{ position: "sticky", top: 0 }}>
          <h1>Search Profile Pictures</h1>
          <Form.Control
            value={searchString}
            placeholder="Type to search"
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchParams.set("search", searchString);
                setSearchParams(searchParams);
              }
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {imageEntries.slice(10).map((imageEntry, i) => (
            <SearchEntry pictureInfo={imageEntry} userData={userData} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Search;
