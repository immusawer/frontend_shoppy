"use client";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function logout() {
  // Remove token from localStorage
  localStorage.removeItem("access_token");
  
  // Remove token from cookies
  Cookies.remove("access_token");
  
  // Clear axios default headers
  delete axios.defaults.headers.common["Authorization"];
  
  // Force a page refresh to update the server-side authentication state
  window.location.href = "/login";
}
