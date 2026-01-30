// import Stocks from "./pages/Stocks";
import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
