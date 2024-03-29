import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Search from "./components/Search";
import Details from "./components/Details";
import { HashRouter } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";

function App() {
  return (
    <HashRouter>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Details" element={<Details />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
export default App;
