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
import "./index.css";
import TempMessage from "../Util/TempMessage";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../Account/reducer";
import { Connect4State } from "../../store";

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
    setLikeCount(pictureInfo.likes.length);
    if (!userData) {
      return;
    }
    setLiked(!!pictureInfo.likes.find((user) => user === userData.username));
  }, [userData]);

  function onLike(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    if (!userData) {
      return;
    }
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
        <div
          onMouseEnter={() => setHoveringOver(false)}
          onMouseLeave={() => setHoveringOver(true)}
        >
          <button onClick={(e) => onLike(e)} className="heart">
            <BsHeartFill color={liked ? "red" : "gray"} size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="unselectable justify-content-between entry"
      style={{
        ...(hoveringOver ? { backgroundColor: "lightgray" } : {}),
      }}
      onMouseEnter={() => setHoveringOver(true)}
      onMouseLeave={() => setHoveringOver(false)}
      onClick={() => navigate(`/details/${pictureInfo.id}`)}
    >
      <div className="text-style">Image #{pictureInfo.id}</div>
      <img src={pictureInfo.previewURL} className="img" />
      <div className="text-style">
        {likeCount}
        <LikeButton />
      </div>
    </div>
  );
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const userData = useSelector(
    (state: Connect4State) => state.accountReducer.userData
  );
  const [searchString, setSearchString] = useState<string>("");
  const [imageEntries, setImageEntries] = useState<PictureInfo[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    apiGetCurrentSessionUser().then((data) => {
      dispatch(setUserData(data));
      data && data.role === "beginner" && navigate("/home");
    });
    setImageEntries([])
    apiPictureSearch(searchParams.get("search") || "").then((result) =>
      setImageEntries(result)
    );
  }, [searchParams]);

  if (userData === undefined) {
    return <TempMessage text="Loading..." />;
  }

  return (
    <div>
      <Nav userData={userData} />
      <div className="search-page">
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
        <div className="entry-container">
          {imageEntries.length === 0 ?
          <p style={{fontSize: "40px"}}>Loading Images...</p>
          :
          imageEntries.slice(10).map((imageEntry, i) => (
            <SearchEntry pictureInfo={imageEntry} userData={userData} key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Search;
