import axiosInstance from "@/lib/axios";
import { LoginRequest } from "@/lib/validations/auth/login.validations";
import { RegisterRequest } from "@/lib/validations/auth/register.validations";
import { User } from "@/types";
import { z } from "zod";

export const getCsrfToken = async () => {
  await axiosInstance.get("/sanctum/csrf-cookie");
};

export const login = async (
  data: z.infer<typeof LoginRequest>
) : Promise<User> => {
  await getCsrfToken(); // Get the CSRF token and store it in the cookies
  const response = await axiosInstance.post(
    "/login",
    data
  );

  return response.data.data;
};

export const register = async (
  data: z.infer<typeof RegisterRequest>
) : Promise<User> => {
  await getCsrfToken();
  const response = await axiosInstance.post(
    "/register",
    data
  );

  return response.data.data;
};

export const logout = async () => {
  await getCsrfToken();
  await axiosInstance.post("/logout");
};

export const fetchUser = async () => {
  const response = await fetch("/api/user", { cache: "no-store" });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Failed to fetch user");
  }
};