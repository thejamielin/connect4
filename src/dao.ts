import axios from "axios";
import { GameResult } from "./types";

const COOKIE_TOKEN_NAME = 'token';
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
const ACCOUNT_CHECKSESSION = `${API_BASE}/account/checkSession`;
const ACCOUNT_LOGOUT = `${API_BASE}/account/logout`;

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

export async function apiAccountRegister(username: string, password: string, email: string): Promise<string> {
  const response = await axios.post(ACCOUNT_REGISTER, {username: username, password: password, email: email});
  return response.data.token;
}

export async function apiAccountCheckSession(token: string) {
  const response = await axios.post(ACCOUNT_CHECKSESSION, {token: token});
  return response.data.isValidSession;
}

export async function apiAccountLogout() {
  await axios.post(ACCOUNT_LOGOUT, {token: getSessionToken()});
}