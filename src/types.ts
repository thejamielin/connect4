export interface GameResult {
  id: string;
  player1: string;
  player2: string;
  // if winner is undefined, the game ended in a draw
  winner?: string;
  //moves: Move[];
  date: Date;
}

export type User = RegularUser | BeginnerUser;

export interface RegularUser {
  email: string;
  role: "regular";
  username: string;
  following: string[];
  stats: UserStats;
  password: string;
  pfp?: string;
}

export interface BeginnerUser {
  email: string;
  role: "beginner";
  username: string;
  password: string;
}

export interface UserStats {
  // TODO: Add stat fields
}
