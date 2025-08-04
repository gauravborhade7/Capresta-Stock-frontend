// routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import UserApp from "./User-side/App"; // or Admin-side/App
import Loginform from "./login/AuthPage";
import AdminSide from "./Admin-side/App"

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<UserApp />} />
    <Route path="/login" element={<Loginform />} />
    <Route path="/admin" element={<AdminSide />} />
  </Routes>
);

export default AppRouter; // ✅ default export
