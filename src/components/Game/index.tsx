import { useEffect, useRef, useState } from "react";
import Nav from "../../Nav";
import { apiAccountGetUsername, gameWebSocketURL, validateLoggedIn } from "../../dao";
import { Connect4Board } from "./connect4";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router";
import { ClientRequest, GameData, GameCreationData, OngoingGameData, ServerMessage } from "./gameData";
import { Button } from "react-bootstrap";

interface Connect4RendererProps {
  board: Connect4Board;
  colors: string[];
  onClickSlot: (column: number, row: number) => void;
  lastMove?: Connect4Board.ExecutedMove;
}

function Connect4Slot({pieceColor}: {pieceColor?: string}) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{objectFit: 'fill'}}>
      <path d="M 0,0 
              L 100,0 
              L 100,100 
              L 0,100 
              Z 
              M 50,50 
              m -45,0 
              a 45,45 0 1,0 90,0 
              a 45,45 0 1,0 -90,0" fill="red"/>
      {pieceColor && <circle cx={50} cy={50} r={45} fill={pieceColor}/>}
    </svg>
  )
}

function Connect4Piece({pieceColor}: {pieceColor: string}) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <circle cx={50} cy={50} r={45} fill={pieceColor}/>
    </svg>
  )
}

interface PieceAnimation {
  playerIndex: number;
  animatedVelocity: number;
  animatedHeight: number;
  column: number;
  row: number;
}

function Connect4Renderer({board, colors, lastMove, onClickSlot}: Connect4RendererProps) {
  const [G, E, minVelocity] = [0.05, 0.3, 0.2];
  const [slotWidthPercent, slotHeightPercent] = [100 / board.slots[0].length, 100 / board.slots.length];
  const [animation, setAnimation] = useState<PieceAnimation>();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!animation) {
        return;
      }
      let height = animation.animatedHeight += animation.animatedVelocity;
      let velocity = animation.animatedVelocity += G;
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
        animatedVelocity: velocity
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
      animatedVelocity: 0
    })
  }, [lastMove]);

  return (
    <div className="unselectable" style={{width: '100%', height: '100%', position: 'relative'}}>
      {animation && (
        <div style={{
          position: 'absolute',
          left: slotWidthPercent * animation.column + '%',
          top: slotHeightPercent * animation.animatedHeight + '%',
          width: slotWidthPercent + '%',
          height: slotHeightPercent + '%',
          zIndex: -1
          }}>
          <Connect4Piece pieceColor={colors[animation.playerIndex]}/>
        </div>
      )}
      {board.slots.map((row, i) => (
        <div style={{height: slotHeightPercent + '%', width: '100%', display: 'flex'}} key={i}>
          {row.map((slot, j) => {
            const pieceColor = (slot === false || (animation && i === animation.row && j === animation.column)) ? undefined : colors[slot];
            return (
              <div style={{width: slotWidthPercent + '%', height: '100%'}} key={j} onMouseDown={() => onClickSlot(j, i)}>
                <Connect4Slot key={j} pieceColor={pieceColor}/>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function GameCreationPanel({ gameState, onReady }: { gameState: GameCreationData, onReady: () => void }) {
  return (
    <div>
      <h1>Invite Friends with This Link: {'<nothing, bc f u>'}</h1>
      <h4>Players: {JSON.stringify(gameState.connectedIDs)}</h4>
      <h4>Ready: {JSON.stringify(gameState.readyIDs)}</h4>
      <Button onClick={onReady}>Ready!</Button>
    </div>
  )
}

interface GameplayPanelProps {
  playerIndex: number;
  gameState: OngoingGameData;
  onMove: (col: number) => void;
}

function GameplayPanel({ playerIndex, gameState, onMove }: GameplayPanelProps) {
  function onClickSlot(col: number, row: number) {
    console.log('players', playerIndex, gameState.board.playerTurn)
    console.log(Connect4Board.canMove(gameState.board, col));
    if (playerIndex === gameState.board.playerTurn && Connect4Board.canMove(gameState.board, col)) {
      onMove(col);
    }
  }

  return (
    <div>
      <h1>Play Game!</h1>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{height: '100%', width: '30%'}}>
          <div>Connected: {JSON.stringify(gameState.connectedIDs)}</div>
          <div>Players: {JSON.stringify(gameState.playerIDs)}</div>
          <Connect4Renderer
            board={gameState.board}
            lastMove={gameState.board.lastMove}
            colors={['red', 'yellow']}
            onClickSlot={onClickSlot}
          />
        </div>
      </div>
    </div>
  )
}

export default function Game() {
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [username, setUsername] = useState<string>();
  const { gameID } = useParams();
  const [connectionSuccess, setConnectionSuccess] = useState<boolean>();
  const didUnmount = useRef(false);
  const { sendMessage, lastMessage, readyState } = useWebSocket(gameID ? gameWebSocketURL(gameID) : null, { shouldReconnect: () => didUnmount.current === false});
  const [gameState, setGameState] = useState<GameData>();

  useEffect(() => {
    validateLoggedIn(setLoggedIn);
    apiAccountGetUsername().then(setUsername);
    return () => { didUnmount.current = true };
  }, []);

  useEffect(() => {
    if (lastMessage === null) {
      return;
    }
    console.log(lastMessage.data)
    const message: ServerMessage = JSON.parse(lastMessage.data);
    if (message.type === 'state') {
      console.log('setting it !')
      setGameState(message.gameState);
    } else if (message.type === 'move') {
      setGameState(message.gameState);
    }

    if (gameState === undefined) {
      return;
    }

    if (message.type === 'join') {
      if (!gameState.connectedIDs.find(id => id === message.playerID)) {
        setGameState({...gameState, connectedIDs: [...gameState.connectedIDs, message.playerID]});
      }
      // TODO: indication
    } else if (message.type === 'leave') {
      setGameState({...gameState, connectedIDs: gameState.connectedIDs.filter(id => id !== message.playerID)});
    } else if (message.type === 'ready') {
      if (gameState.phase !== 'creation') {
        console.error('A player has readied when the game already started?');
        return;
      }
      setGameState({...gameState, readyIDs: [...gameState.readyIDs, message.playerID]});
    } else if (message.type === 'gameover') {
      alert('game over man')
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

  if (loggedIn === undefined || username === undefined || connectionSuccess === undefined) {
    return <div>Loading</div>;
  }

  if (connectionSuccess === false) {
    return (
      <div>
        Connection failed! Does this game exist?
      </div>
    );
  }

  if (gameState === undefined) {
    return <div>Loading (for game data)</div>
  }

  // TODO: perhaps send an api request to ask if the game exists
  // if (gameID === undefined)

  function send(message: ClientRequest) {
    console.log('sending message')
    sendMessage(JSON.stringify(message));
  }

  return (
    <div>
      <Nav loggedIn={loggedIn}/>
      {readyState !== ReadyState.OPEN && <div>Connecting...</div>}
      {gameState.phase === 'creation' && <GameCreationPanel gameState={gameState} onReady={() => send({ type: 'ready' })}/>}
      {gameState.phase === 'ongoing' && (
        <GameplayPanel
          playerIndex={gameState.playerIDs.findIndex(playerID => playerID === username)}
          gameState={gameState}
          onMove={column => send({ type: 'move', column })}
        />
      )}
    </div>
  );
}
