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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const createProduct = async (formData: ProductFormValues) => {
  const url = `${API_URL}/products`; // ✅ full endpoint

  try {
    // Get the access token from server-side cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      throw new Error("JWT token not found in cookies.");
    }

    // Create a FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("detail", formData.description);
    formDataToSend.append("price", formData.price.toString());
    formDataToSend.append("categoryId", formData.categoryId.toString());

    // Convert base64 to blob
    const base64Data = formData.imageFile.split(",")[1];
    const binaryData = Buffer.from(base64Data, "base64");
    const blob = new Blob([binaryData], { type: "image/png" });
    formDataToSend.append("image", blob, "product-image.png");

    // Send the request to the backend with the JWT token in the headers
    const result = await axios.post(url, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data;
  } catch (error) {
    throw error;
  }
};
