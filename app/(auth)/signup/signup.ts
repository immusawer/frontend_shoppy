"use server";

import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignupResponse {
  success: boolean;
  message?: string;
}

export const signup = async (formData: FormData): Promise<SignupResponse> => {
  const url = `${API_URL}/users/register`;
  try {
    const rawEmail = formData.get("email")?.toString() || "";
    formData.set("email", rawEmail.toLowerCase()); // ✅ normalize before sending
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      withCredentials: true,
    });
    return {
      success: true,
      message: "Registration successful",
    };
  } catch (error: any) {
    // Handle connection refused error
    if (error.code === "ECONNREFUSED") {
      return {
        success: false,
        message:
          "Cannot connect to server. Please make sure the backend server is running.",
      };
    }

    // Handle specific error cases
    if (error.response?.status === 409) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response.data.message || "Invalid registration data",
      };
    }

    // Handle network or server errors
    return {
      success: false,
      message: error.response?.data?.message || "Failed to register user",
    };
  }
};
