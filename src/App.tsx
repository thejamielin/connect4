import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Account/Login";
import Search from "./components/Search";
import Details from "./components/Details";
import Game from "./components/Game";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Register from "./components/Account/Register";
import { getSessionToken } from "./dao";

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Details" element={<Details />} />
          <Route path="/Game" element={<Game />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
export default App;
