"use server";

import axios from "axios";
import { cookies } from "next/headers";

interface CreateCategoryPayload {
  name: string;
}

export const createCategory = async (payload: CreateCategoryPayload) => {
  try {
    // Get the access token from cookies
    const cookieStore = cookies();
    const token = (await cookieStore).get("access_token")?.value;

    if (!token) {
      throw new Error("JWT token not found in cookies.");
    }

    console.log("Token found:", token.substring(0, 10) + "..."); // Debug log

    // Send request to backend
    const result = await axios.post(
      "http://localhost:3001/categories", // Your backend endpoint
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
    console.error("Error creating category:", error);
    throw error;
  }
};
