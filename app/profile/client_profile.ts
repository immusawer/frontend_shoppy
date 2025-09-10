import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string | null;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export function getProfileImageUrl(imagePath: string | null): string {
  const imageUrl = `${API_BASE_URL}/uploads/profiles/${imagePath}`;
  if (!imagePath) return "/avatars/01.png";

  // If the path already includes the full URL, return it as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If the path starts with /uploads, use it directly
  if (imagePath.startsWith("/uploads")) {
    return `${API_BASE_URL}${imagePath}`;
  }

  // Otherwise, construct the full path
  return imageUrl;
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const profileImage = `${API_BASE_URL}/users/profile`;
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("=== Profile Service Debug ===");
    console.log("API URL:", `${API_BASE_URL}/users/profile`);
    console.log("Token (first 10 chars):", token.substring(0, 10) + "...");

    const response = await axios.get(profileImage, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    if (error.response?.status === 404) {
      throw new Error("User profile not found");
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch user profile"
    );
  }
}

export async function updateUserProfile(
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const profileImage = `${API_BASE_URL}/users/profile`;

  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(profileImage, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("API Response:", response.data);

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    }
    if (error.response?.status === 404) {
      throw new Error("User profile not found");
    }
    throw new Error(
      error.response?.data?.message || "Failed to update user profile"
    );
  }
}
