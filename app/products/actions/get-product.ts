"use server";

import { getproducts } from "../../common/utill/fetch";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function getProduct() {
  const url = `${API_URL}products/all`;
  try {
    // Use the correct endpoint for getting all products
    return await getproducts(url);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
