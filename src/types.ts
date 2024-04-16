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
  wins: number;
  losses: number;
  ties: number;
  gameIDs: string[];
}
