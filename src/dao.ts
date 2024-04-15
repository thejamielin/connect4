import axios from "axios";
import { User, BeginnerUser, GameResult, RegularUser } from "./types";

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

const API_BASE = process.env.REACT_APP_API_BASE;
const GAMES_SEARCH = `${API_BASE}/games/search`;
const ACCOUNT_LOGIN = `${API_BASE}/account/login`;
const ACCOUNT_REGISTER = `${API_BASE}/account/register`;
const ACCOUNT_LOGOUT = `${API_BASE}/account/logout`;
const PICTURES_SEARCH = `${API_BASE}/pictures/search`;
const PICTURES_ID = `${API_BASE}/pictures`;
const PICTURES_LIKE = `${API_BASE}/pictures/like`;
const USER = `${API_BASE}/user`;
const GAME = `${API_BASE}/game`;
const ACCOUNT_GETUSERDATA = `${API_BASE}/account`;

const WS_BASE = process.env.REACT_APP_WS_BASE;
const GAME_WEBSOCKET_URL = `${WS_BASE}/game`;

export function gameWebSocketURL(gameID: string) {
  return `${GAME_WEBSOCKET_URL}/${gameID}?token=${getSessionToken()}`;
}

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
  email: string,
  isBeginner: boolean
): Promise<string> {
  const response = await axios.post(ACCOUNT_REGISTER, {
    username: username,
    password: password,
    email: email,
    isBeginner: isBeginner,
  });
  return response.data.token;
}

export async function apiAccountLogout() {
  await axios.post(ACCOUNT_LOGOUT, {}, { headers: { Authorization: getSessionToken() } });
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
  pageURL: string;
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

export async function apiPictureLike(imageID: string) {
  await axios.put(`${PICTURES_LIKE}/${imageID}`, {}, { headers: { Authorization: getSessionToken() } }).catch(() => 0);
}

export async function apiPictureUnlike(imageID: string) {
  await axios.delete(`${PICTURES_LIKE}/${imageID}`, { headers: { Authorization: getSessionToken() } }).catch(() => 0);
}

export async function apiSetUser(
  user:
    | Partial<Pick<RegularUser, "email" | "following" | "pfp">>
    | Partial<Pick<BeginnerUser, "email">>
): Promise<boolean> {
  const response = await axios.put(USER, {
    body: { editedFields: user },
  }, { headers: { Authorization: getSessionToken() } });
  return response.data.success;
}

export async function apiCreateGame(): Promise<string> {
  const response = await axios.post(GAME, {}, { headers: { Authorization: getSessionToken() } });
  return response.data.gameID;
}

export async function apiGetUser(username: string) {
  const response = await axios.get(`${USER}/${username}`, { headers: { Authorization: getSessionToken() } });
  return response.data;
}

export async function apiGetCurrentSessionUser(): Promise<User | false> {
  return await axios
    .get(ACCOUNT_GETUSERDATA, { headers: { Authorization: getSessionToken() }})
    .then((response) => {
      return response.data;
    })
    .catch(() => {
      return false;
    });
}
