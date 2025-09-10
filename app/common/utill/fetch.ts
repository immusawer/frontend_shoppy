"use server";
import { cookies } from "next/headers";
import axios from "axios";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Helper function to get token
async function getToken() {
  try {
    // Try server-side cookies first
    const cookieStore = await cookies();
    const serverToken = cookieStore.get("access_token")?.value;
    if (serverToken) return serverToken;

    // Fallback to client-side cookies
    const clientToken = Cookies.get("access_token");
    if (clientToken) return clientToken;

    throw new Error("No authentication token found");
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
}

// POST method implementation
export default async function post(path: string, formData: FormData) {
  try {
    const token = await getToken();
    const jsonData = Object.fromEntries(formData);
    console.log("Sending request to:", `${API_URL}/${path}`);

    const res = await fetch(`${API_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jsonData),
      credentials: "include",
    });

    console.log("Response status:", res.status);
    const parsedRes = await res.json();
    
    if (!res.ok) {
      console.error("Error response:", parsedRes);
      throw new Error(parsedRes.message || `Failed to post data: ${res.statusText}`);
    }

    return parsedRes;
  } catch (error) {
    console.error("Error in post request:", error);
    throw error;
  }
}

// GET products implementation
export async function getproducts(path: string) {
  try {
    console.log("Fetching products from:", path);

    const response = await axios.get(path, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);
    console.log("Products fetched successfully");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching products:", error);
    if (error.code === 'ECONNREFUSED') {
      console.error("Connection refused. Make sure your backend server is running on the correct port.");
    }
    throw error;
  }
}

// GET categories implementation
export async function getCategories() {
  try {
    const token = await getToken();
    const url = `${API_URL}/categories`;
    console.log("Fetching categories from:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    console.log("Response status:", res.status);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      console.error("Error response:", errorData);
      throw new Error(errorData.message || `Failed to fetch categories: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Categories fetched successfully");
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
