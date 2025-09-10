"use server";
import axios from "axios";
import { cookies } from "next/headers";

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  imageFile: string; // This is a base64 string
  categoryId: number;
}

export const createProduct = async (formData: ProductFormValues) => {
  try {
    // Get the access token from server-side cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("JWT token not found in cookies.");
    }

    console.log("Token found:", token.substring(0, 10) + "..."); // Debug log

    // Create a FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("detail", formData.description);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("categoryId", formData.categoryId.toString());

    // Convert base64 to blob
    const base64Data = formData.imageFile.split(',')[1];
    const binaryData = Buffer.from(base64Data, 'base64');
    const blob = new Blob([binaryData], { type: 'image/png' });
    formDataToSend.append("image", blob, "product-image.png");

    console.log("Sending request with token in header"); // Debug log

    // Send the request to the backend with the JWT token in the headers
    const result = await axios.post(
      "http://localhost:3001/products",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return result.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};
