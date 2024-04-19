import { useEffect, useRef, useState } from "react";
import Nav from "../../Nav";
import { apiGetCurrentSessionUser, gameWebSocketURL } from "../../dao";
import { Connect4Board } from "./connect4";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate, useParams } from "react-router";
import Confetti from "react-confetti";
import {
  ClientRequest,
  GameData,
  GameCreationData,
  OngoingGameData,
  ServerMessage,
} from "./gameTypes";
import { Button } from "react-bootstrap";
import { User } from "../../types";
import "./index.css";
import "../../style.css";
import { Link } from "react-router-dom";
import TempMessage from "../Util/TempMessage";

const MINIMUM_NUMBER_OF_PLAYERS = 2;

function getListOfColors(numPlayers: number) {
  const colors = [
    "var(--c4-red)",
    "var(--c4-yellow)",
    "var(--c4-green)",
    "var(--c4-purple)",
  ];
  if (numPlayers > colors.length) {
    const newColorCount = numPlayers - colors.length;
    for (let i = 0; i < newColorCount; i++) {
      var randomColor = "#000000".replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16);
      });
      colors.push(randomColor);
    }
  }
  return colors.slice(0, numPlayers);
}

interface Connect4RendererProps {
  board: Connect4Board;
  colors: string[];
  onClickSlot: (column: number, row: number) => void;
  lastMove?: Connect4Board.ExecutedMove;
}

function Connect4Slot({ pieceColor }: { pieceColor?: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ objectFit: "fill" }}
    >
      <path
        d="M 0,0 
              L 100,0 
              L 100,100 
              L 0,100 
              Z 
              M 50,50 
              m -45,0 
              a 45,45 0 1,0 90,0 
              a 45,45 0 1,0 -90,0"
        fill="var(--c4-blue)"
      />
      {pieceColor && <circle cx={50} cy={50} r={45} fill={pieceColor} />}
    </svg>
  );
}

function Connect4Piece({ pieceColor }: { pieceColor: string }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <circle cx={50} cy={50} r={45} fill={pieceColor} />
    </svg>
  );
}

interface PieceAnimation {
  playerIndex: number;
  animatedVelocity: number;
  animatedHeight: number;
  column: number;
  row: number;
}

function Connect4Renderer({
  board,
  colors,
  lastMove,
  onClickSlot,
}: Connect4RendererProps) {
  const [G, E, minVelocity] = [0.05, 0.3, 0.2];
  const [slotWidthPercent, slotHeightPercent] = [
    100 / board.slots[0].length,
    100 / board.slots.length,
  ];
  const [animation, setAnimation] = useState<PieceAnimation>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!animation) {
        return;
      }
      let height = (animation.animatedHeight += animation.animatedVelocity);
      let velocity = (animation.animatedVelocity += G);
      if (height > animation.row) {
        if (Math.abs(velocity) < minVelocity) {
          setAnimation(undefined);
          return;
        }
        height = animation.row;
        velocity = -velocity * E;
      }
      setAnimation({
        ...animation,
        animatedHeight: height,
        animatedVelocity: velocity,
      });
    }, 20);
    return () => clearInterval(interval);
  }, [animation]);

  useEffect(() => {
    if (lastMove === undefined) {
      return;
    }
    setAnimation({
      ...lastMove,
      animatedHeight: 0,
      animatedVelocity: 0,
    });
  }, [lastMove]);

  return (
    <div
      className="unselectable"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      {animation && (
        <div
          style={{
            position: "absolute",
            left: slotWidthPercent * animation.column + "%",
            top: slotHeightPercent * animation.animatedHeight + "%",
            width: slotWidthPercent + "%",
            height: slotHeightPercent + "%",
            zIndex: -1,
          }}
        >
          <Connect4Piece pieceColor={colors[animation.playerIndex]} />
        </div>
      )}
      {board.slots.map((row, i) => (
        <div
          style={{
            height: slotHeightPercent + "%",
            width: "100%",
            display: "flex",
          }}
          key={i}
        >
          {row.map((slot, j) => {
            const pieceColor =
              slot === false ||
              (animation && i === animation.row && j === animation.column)
                ? undefined
                : colors[slot];
            return (
              <div
                style={{ width: slotWidthPercent + "%", height: "100%" }}
                key={j}
                onMouseDown={() => onClickSlot(j, i)}
              >
                <Connect4Slot key={j} pieceColor={pieceColor} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function GameCreationPanel({
  gameState,
  onReady,
}: {
  gameState: GameCreationData;
  onReady: () => void;
}) {
  const url = window.location.href;
  const [copyText, setCopyText] = useState("Copy");

  return (
    <div className="page">
      <h1>Invite Friends with This Link:</h1>
      <div style={{ fontSize: "20px" }}>
        <Link to={url}>{url}</Link>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(url);
            setCopyText("Copied!");
          }}
          style={{ marginLeft: "10px" }}
        >
          {copyText}
        </Button>
      </div>
      Players in room:
      {gameState.connectedIDs.map((name) => {
        return (
          <p>
            {name} - {gameState.readyIDs.includes(name) ? "Ready" : "Waiting"}
          </p>
        );
      })}
      <Button onClick={onReady}>Ready!</Button>
    </div>
  );
}

interface GameplayPanelProps {
  playerIndex: number;
  gameState: OngoingGameData;
  onMove: (col: number) => void;
  username: string;
  colors: string[];
}

function GameplayPanel({
  playerIndex,
  gameState,
  onMove,
  username,
  colors,
}: GameplayPanelProps) {
  function onClickSlot(col: number, row: number) {
    if (
      playerIndex === gameState.board.playerTurn &&
      Connect4Board.canMove(gameState.board, col)
    ) {
      onMove(col);
    }
  }

  return (
    <div>
      <h2 style={{ padding: "20px" }}>Play Game!</h2>
      <div className="board-container">
        <div style={{ height: "100%", width: "40%" }}>
          <Connect4Renderer
            board={gameState.board}
            lastMove={gameState.board.lastMove}
            colors={colors}
            onClickSlot={onClickSlot}
          />
        </div>
        <div style={{ fontSize: "30px" }}>
          It's{" "}
          {username === gameState.playerIDs[gameState.board.playerTurn]
            ? "your"
            : gameState.playerIDs[gameState.board.playerTurn] + "'s"}
          {" turn"}
        </div>
      </div>
    </div>
  );
}

export default function Game() {
  const [userData, setUserData] = useState<User | false>();
  const { gameID } = useParams();
  const [connectionSuccess, setConnectionSuccess] = useState<boolean>();
  const [lastGameState, setLastGameState] = useState<OngoingGameData>();
  const didUnmount = useRef(false);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    setColors(
      getListOfColors(
        gameState?.connectedIDs.length || MINIMUM_NUMBER_OF_PLAYERS
      )
    );
  }, []);

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    gameID ? gameWebSocketURL(gameID) : null,
    { shouldReconnect: () => didUnmount.current === false, reconnectAttempts: 1 }
  );
  const [gameState, setGameState] = useState<GameData>();

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      didUnmount.current = true;
    };
  }, []);

  useEffect(() => {
    apiGetCurrentSessionUser().then((data: User | false) => {
      setUserData(data);
    });
  }, []);

  useEffect(() => {
    if (lastMessage === null) {
      return;
    }
    console.log(lastMessage.data);
    const message: ServerMessage = JSON.parse(lastMessage.data);
    if (message.type === "state") {
      if (
        message.gameState.phase === "over" &&
        gameState &&
        gameState.phase === "ongoing"
      ) {
        setLastGameState(gameState);
      }
      setGameState(message.gameState);
    } else if (message.type === "move") {
      setGameState(message.gameState);
    }

    if (gameState === undefined) {
      return;
    }

    if (message.type === "join") {
      if (!gameState.connectedIDs.find((id) => id === message.playerID)) {
        setGameState({
          ...gameState,
          connectedIDs: [...gameState.connectedIDs, message.playerID],
        });
      }
      // TODO: indication
    } else if (message.type === "leave") {
      setGameState({
        ...gameState,
        connectedIDs: gameState.connectedIDs.filter(
          (id) => id !== message.playerID
        ),
      });
    } else if (message.type === "ready") {
      if (gameState.phase !== "creation") {
        console.error("A player has readied when the game already started?");
        return;
      }
      setGameState({
        ...gameState,
        readyIDs: [...gameState.readyIDs, message.playerID],
      });
    }
  }, [lastMessage]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      setConnectionSuccess(true);
    }
    const timeout = setTimeout(() => {
      if (readyState !== ReadyState.OPEN) {
        setConnectionSuccess(false);
      } else {
        setConnectionSuccess(true);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [readyState]);

  if (
    !userData ||
    (userData.role === "beginner" &&
      !(gameState && gameState.connectedIDs.includes("bot")))
  ) {
    return (
      <div>
        {userData === undefined ? (
          <TempMessage text="Loading..." />
        ) : (
          <div>
            <Nav loggedIn={!!userData} isBeginner={true} />
            <TempMessage text="Must be logged in or non-beginner to play!" />
            <Button
              style={{ margin: "10px", fontSize: "30px" }}
              onClick={() => navigate("/home")}
            >
              Go Home
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (connectionSuccess === undefined || gameState === undefined) {
    return <TempMessage text="Loading..." />;
  }

  if (connectionSuccess === false) {
    return (
      <div>
        <Nav loggedIn={!!userData} isBeginner={true} />
        <TempMessage text="Connection failed! Does this game exist?" />
      </div>
    );
  }

  // TODO: perhaps send an api request to ask if the game exists
  // if (gameID === undefined)

  function send(message: ClientRequest) {
    console.log("sending message");
    sendMessage(JSON.stringify(message));
  }

  // TODO: Change isBeginner to check if actually a beginner here
  return (
    <div>
      <Nav loggedIn={!!userData} isBeginner={false} />
      {readyState !== ReadyState.OPEN && <div>Connecting...</div>}
      {gameState.phase === "creation" && (
        <GameCreationPanel
          gameState={gameState}
          onReady={() => send({ type: "ready" })}
        />
      )}
      {gameState.phase === "ongoing" && (
        <GameplayPanel
          playerIndex={gameState.playerIDs.findIndex(
            (playerID) => playerID === userData.username
          )}
          gameState={gameState}
          onMove={(column) => send({ type: "move", column })}
          username={userData.username}
          colors={colors}
        />
      )}
      {gameState.phase === "over" && (
        <div className="c4-jover">
          <h1>It's Jover</h1>
          {gameState.result.winnerID ? (
            <>
              {gameState.result.winnerID === userData.username && (
                <Confetti
                  width={window.innerWidth * 0.9}
                  height={window.innerHeight * 0.9}
                />
              )}
              <h2>{gameState.result.winnerID} won!</h2>
            </>
          ) : (
            <h2>No one won. Tie.</h2>
          )}
          <Button
            onClick={() => {
              navigate("/game/" + gameState.rematchId);
            }}
          >
            Rematch?
          </Button>
          {lastGameState && (
            <div className="c4-jover-state">
              <Connect4Renderer
                board={lastGameState.board}
                lastMove={lastGameState.board.lastMove}
                colors={colors}
                onClickSlot={() => {}}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
