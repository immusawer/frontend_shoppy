"use client";
export const getErrorMessages = (response: any) => {
  if (response?.message) {
    if (Array.isArray(response.message)) {
      // Check if the array is non-empty
      if (response.message.length > 0) {
        return formatError(response.message[0]);
      }
      return "An error occurred"; // Handle empty array
    }
    return formatError(response.message);
  }
  return "An error occurred"; // Fallback for missing or malformed message
};

const formatError = (message: string) => {
  if (typeof message === "string" && message) {
    return message.charAt(0).toUpperCase() + message.slice(1);
  }
  return "An error occurred"; // If the message isn't a valid string, return fallback
};
