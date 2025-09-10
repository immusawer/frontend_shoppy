"use server";

import { getproducts } from "../../common/utill/fetch";

export default async function getProduct() {
  try {
    // Use the correct endpoint for getting all products
    return await getproducts("products/all");
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}
