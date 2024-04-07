import axios from "axios";
import { GameResult } from "./types";

const COOKIE_TOKEN_NAME = "token";
export function cacheSessionToken(token: string) {
  localStorage.setItem(COOKIE_TOKEN_NAME, token);
}

export function deleteSessionToken() {
  localStorage.removeItem(COOKIE_TOKEN_NAME);
}

export function getSessionToken(): string | undefined {
  return localStorage.getItem(COOKIE_TOKEN_NAME) || undefined;
}

export function validateLoggedIn(setLoggedIn: (isLoggedIn: boolean) => void) {
  const token = getSessionToken();
  if (!token) {
    setLoggedIn(false);
    return;
  }
  apiAccountCheckSession(token).then((isValidSession) => {
    setLoggedIn(isValidSession);
    isValidSession || deleteSessionToken();
  });
}

const API_BASE = process.env.REACT_APP_API_BASE;
const GAMES_SEARCH = `${API_BASE}/games/search`;
const ACCOUNT_LOGIN = `${API_BASE}/account/login`;
const ACCOUNT_REGISTER = `${API_BASE}/account/register`;
const ACCOUNT_CHECKSESSION = `${API_BASE}/account/checkSession`;
const ACCOUNT_LOGOUT = `${API_BASE}/account/logout`;
const PICTURES_SEARCH = `${API_BASE}/pictures/search`;
const PICTURES_ID = `${API_BASE}/pictures`;
const USER = `${API_BASE}/user`;
const GAME = `${API_BASE}/game`;

const WS_BASE = process.env.REACT_APP_WS_BASE
const GAME_WEBSOCKET_URL = `${WS_BASE}/game`;

export function gameWebSocketURL(gameID: string) {
  return `${GAME_WEBSOCKET_URL}/${gameID}?token=${getSessionToken()}`;
}

const ACCOUNT_GETUSERNAME = `${API_BASE}/account`;

export interface GameSearchParameters {
  count: number;
  sort?: "newest" | "oldest";
  filter?: {
    players?: string[];
  };
}

export async function apiGamesSearch(
  searchParams: GameSearchParameters
): Promise<GameResult[]> {
  const response = await axios.post(GAMES_SEARCH, searchParams);
  return response.data;
}

export async function apiAccountLogin(
  username: string,
  password: string
): Promise<string> {
  const response = await axios.post(ACCOUNT_LOGIN, {
    username: username,
    password: password,
  });
  return response.data.token;
}

export async function apiAccountRegister(
  username: string,
  password: string,
  email: string
): Promise<string> {
  const response = await axios.post(ACCOUNT_REGISTER, {
    username: username,
    password: password,
    email: email,
  });
  return response.data.token;
}

export async function apiAccountCheckSession(token: string) {
  const response = await axios.post(ACCOUNT_CHECKSESSION, { token: token });
  return response.data.isValidSession;
}

export async function apiAccountLogout() {
  await axios.post(ACCOUNT_LOGOUT, { token: getSessionToken() });
}

export interface PictureInfo {
  id: number;
  previewURL: string;
  webformatURL: string;
  views: number;
  downloads: number;
  user: string;
  tags: string;
  likes: string[];
}

export async function apiPictureSearch(
  searchString: string
): Promise<PictureInfo[]> {
  const response = await axios.get(PICTURES_SEARCH, {
    params: { q: searchString },
  });
  return response.data;
}

export async function apiPictureId(imageID: string): Promise<PictureInfo> {
  const response = await axios.get(`${PICTURES_ID}/${imageID}`);
  return response.data;
}

export interface User {
  email: string;
  beginner: boolean;
  username: string;
  following: string[];
  stats: UserStats;
  password: string;
  pfp?: string;
}

export interface UserStats {
  // TODO: Add stat fields
}

export async function apiSetUser(
  user: Partial<Pick<User, "email" | "following" | "pfp">>
): Promise<boolean> {
  const response = await axios.put(USER, {
    body: { token: getSessionToken(), editedFields: user },
  });
  return response.data.success;
}

export async function apiCreateGame(): Promise<string> {
  const response = await axios.post(GAME, { token: getSessionToken() });
  return response.data.gameID;
}
export async function apiAccountGetUsername() {
  const response = await axios.post(ACCOUNT_GETUSERNAME, {
    token: getSessionToken(),
  });
  return response.data.username;
}

export async function apiGetUser(username : string) {
  const response = await axios.post(`${USER}/${username}`, {
    token: getSessionToken(),
  });
  return response.data;
}
