import { Outlet, Navigate } from "react-router-dom";
import { loadUser } from "../lib/auth";

export default function Protected() {
  const user = loadUser();
  return user ? <Outlet /> : <Navigate to="/" replace />;
}
