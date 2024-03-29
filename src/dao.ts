import axios from "axios";
import { GameResult } from "./types";

const COOKIE_TOKEN_NAME = 'token';
export function cacheSessionToken(token: string) {
  localStorage.setItem(COOKIE_TOKEN_NAME, token);
}

export function getSessionToken(): string | undefined {
  return localStorage.getItem(COOKIE_TOKEN_NAME) || undefined;
}

const API_BASE = process.env.REACT_APP_API_BASE;
const GAMES_SEARCH = `${API_BASE}/games/search`;
const ACCOUNT_LOGIN = `${API_BASE}/account/login`;

export interface GameSearchParameters {
  count: number;
  sort?: 'newest' | 'oldest';
  filter?: {
    players?: string[];
  }
}

export async function apiGamesSearch(searchParams: GameSearchParameters): Promise<GameResult[]> {
  const response = await axios.post(GAMES_SEARCH, searchParams);
  return response.data;
}

export async function apiAccountLogin(username: string, password: string): Promise<string> {
  const response = await axios.post(ACCOUNT_LOGIN, {username: username, password: password});
  return response.data.token;
}
