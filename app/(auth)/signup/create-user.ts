"use server";

import post from "@/app/common/utill/fetch";
import { redirect } from "next/navigation";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";

export default async function createUser(
  _prevState: FormResponse,
  data: FormData
) {
  const { error } = await post("users", data);

  if (error) {
    return { error };
  }

  redirect("/login");
}
