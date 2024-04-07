import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import { OtherProfile, SelfProfile } from "./components/Profile";
import Login from "./components/Account/Login";
import Search from "./components/Search";
import Details from "./components/Details";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import Register from "./components/Account/Register";
import Game from "./components/Game";

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile/:username" element={<OtherProfile />} />
          <Route path="/Profile" element={<SelfProfile />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/details/:imageID" element={<Details />} />
          <Route path="/game/:gameID" element={<Game />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
export default App;