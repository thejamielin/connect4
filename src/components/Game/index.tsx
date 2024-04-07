import { useEffect, useState } from "react";
import Nav from "../../Nav";
import { validateLoggedIn } from "../../dao";
import { Connect4Board } from "./connect4";

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
            const pieceColor = (slot === undefined || (animation && i === animation.row && j === animation.column)) ? undefined : colors[slot];
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

function Game() {
  const [loggedIn, setLoggedIn] = useState<boolean>();
  const [lastMove, setLastMove] = useState<Connect4Board.ExecutedMove>();
  const [board, setBoard] = useState<Connect4Board>();

  useEffect(() => {
    validateLoggedIn(setLoggedIn);
    setBoard(Connect4Board.newBoard(4, 2, 7, 6));
  }, []);

  if (loggedIn === undefined || board === undefined) {
    return <div>Loading</div>;
  }

  function onClickSlot(column: number, row: number) {
    if (board === undefined) {
      return;
    }
    const player = board.playerTurn;
      Connect4Board.move(board, column);
      const move = board.lastMove;
      move && setLastMove(move);
  }

  return (
    <div>
      <Nav loggedIn={loggedIn}/>
      <h1>Game</h1>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div style={{height: '100%', width: '30%'}}>
          <Connect4Renderer board={board} colors={['blue', 'green', 'orange']} lastMove={lastMove} onClickSlot={onClickSlot}/>
        </div>
      </div>
    </div>
  );
}
export default Game;
