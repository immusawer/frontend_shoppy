"use client";

import { z } from "zod";
import axios from "axios";

// Define the schema for password reset validation
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/,
        "Password must include uppercase, lowercase, numbers, and special characters (!@#$%^&*)"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

// API service to reset password using axios
export const resetPassword = async (
  data: ResetPasswordFormValues
): Promise<{ success: boolean; message: string }> => {
  try {
    // Update to use port 3001 instead of 3000
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const response = await axios.post(`${apiUrl}/password-reset/reset`, {
      token: data.token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    return {
      success: true,
      message: response.data.message || "Password reset successful",
    };
  } catch (error) {
    console.error("Error resetting password:", error);

    // Handle axios error responses
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "Failed to reset password",
      };
    }

    return {
      success: false,
      message: "An error occurred while resetting your password",
    };
  }
};

// Helper function to extract token from URL
export const getTokenFromUrl = (): string | null => {
  if (typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("token");
  }
  return null;
};
