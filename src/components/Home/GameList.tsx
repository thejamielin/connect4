import { useState, useEffect } from "react";
import axios from "axios";
import { GameResult } from "../../types";
import { apiGamesSearch } from "../../dao";

function GameList({isBeginner} : {isBeginner : boolean}) {
  const [games, setGames] = useState<GameResult[]>([]);
  const searchParams = {
    count: 10,
  };

  useEffect(() => {
    apiGamesSearch({count: 10}).then(setGames);
  }, []);

  return (
    <div style={{borderStyle: 'solid', padding: '10px', height: '100%'}}>
      {!isBeginner ?
      <>
        <h3>Game History</h3>
        {games.map((game, i) => (
          <GameListEntry game={game} key={i}/>
        ))}
      </> :
      <p>To play with other users and see their stats, create a non-beginner account!</p>}
    </div>
  );
}

export default GameList;

function GameListEntry({ game }: { game: GameResult }) {
  function winIcon(playerName: string) {
    return <span style={{width: '20pt', display: 'inline-block'}}>{game.winner === playerName && <i className="bi bi-trophy"></i>}</span>;
  }
  return (
    <div style={{borderStyle: 'solid', margin: '2%'}}>
      <div style={{fontSize: 20, backgroundColor: 'lightblue', width: '100%', justifyContent: 'center', display: 'flex'}}>
        <div>
          <a href={`/#/profile/${game.player1}`}> {winIcon(game.player1)} {game.player1} </a>
          <span style={{fontSize: 16}}>vs</span>
          <a href={`/#/profile/${game.player2}`}> {game.player2}</a> {winIcon(game.player2)}
        </div>
      </div>
    </div>
  );
}
