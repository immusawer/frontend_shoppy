import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Request a password reset link to be sent to the user's email
 */
export async function requestPasswordReset(email: string) {
  const url = `${API_URL}/password-reset/request`;

  try {
    const response = await axios.post(url, {
      email,
    });
    return {
      success: true,
      message:
        response.data.message || "Password reset email sent successfully",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to request password reset",
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

/**
 * Reset the user's password using the token sent via email
 */
export async function resetPassword(token: string, password: string) {
  const url = `${API_URL}/password-reset/reset`;

  try {
    const response = await axios.post(url, {
      token,
      password,
      confirmPassword: password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to reset password"
      );
    }
    throw error;
  }
}
