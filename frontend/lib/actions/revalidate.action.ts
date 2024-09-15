"use server"

import { revalidatePath } from "next/cache";

export const revalidate = async (url: string) => {
  revalidatePath(url);
}