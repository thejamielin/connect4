import { useState, useEffect } from "react";
import { RegularUser, User } from "../../types";
import { apiGamesSearch } from "../../dao";
import { GameResult } from "../Game/gameTypes";
import "./index.css"

export interface GameSearchParameters {
  count: number;
  sort?: "newest" | "oldest";
  filter?: {
    players?: string[];
  };
}

function GameList({userData} : {userData : RegularUser | false}) {
  const [games, setGames] = useState<GameResult[]>([]);
  
  useEffect(() => {
    let searchParams: GameSearchParameters = { count: 10, sort: 'newest' };
    if (userData) {
      searchParams.filter = { players: [userData.username] };
    }
    apiGamesSearch(searchParams).then(setGames);
  }, [userData]);

  return (
    <div className="game-box">
      <h3>Game History</h3>
      {games.length !== 0 ?
      games.map((game, i) => (
        <GameListEntry game={game} key={i}/>
      ))
      :
      <p>Play some games to see your results!</p>
    }
    </div>
  );
}

export default GameList;

function GameListEntry({ game }: { game: GameResult }) {
  function winIcon(playerName: string) {
    return <>{game.winnerID === playerName && <span style={{width: '20pt', display: 'inline-block'}}><i className="bi bi-trophy"></i></span>}</>
  }
  return (
    <div className="result-box">
      <div className="result-entry">
        {
          game.playerIDs.map((player, index) => {
            return (
              <div>
                <span>
                  {index ? "vs" : ''} <a href={`/#/profile/${player}`}>{winIcon(player)}{player}</a>&nbsp;
                </span>
              </div>
            )
          })
        }          
      </div>
    </div>
  );
}
