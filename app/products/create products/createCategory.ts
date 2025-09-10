"use server";

import axios from "axios";
import { cookies } from "next/headers";

interface CreateCategoryPayload {
  name: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const createCategory = async (payload: CreateCategoryPayload) => {
  const url = `${API_URL}/categories`; // ✅ full endpoint

  try {
    // Get the access token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("JWT token not found in cookies.");
    }


    // Send request to backend
    const result = await axios.post(
      url, // Your backend endpoint
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token
        },
      }
    );

    return result.data; // Return the newly created category
  } catch (error) {
    throw error;
  }
};
