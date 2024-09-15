"use server"

import { ApiResponse, ApiResponseModify } from "@/types";
import { revalidatePath } from "next/cache";
import serverSideRequestsManager from "../auth/server-side-requests-manager";

interface MutateDataParams<T> {
  url: string;
  data: T;
  path: string;
  extraHeaders?: Record<string, string>;
}

export const postData = async <T>({
  url,
  data,
  path,
  extraHeaders,
}: MutateDataParams<T>): Promise<ApiResponse<ApiResponseModify>> => {
  const response = await serverSideRequestsManager.handleRequest<ApiResponseModify>({
    url,
    method: "POST",
    data,
    extraHeaders
  });

  if (!response.success) {
    return response as ApiResponse<ApiResponseModify>;
  }

  revalidatePath(path);
  return { success: true, result: response.result };
};

export const putData = async <T>({
  url,
  data,
  path,
  extraHeaders,
}: MutateDataParams<T>): Promise<ApiResponse<ApiResponseModify>> => {
  const response = await serverSideRequestsManager.handleRequest<ApiResponseModify>({
    url,
    method: "PUT",
    data,
    extraHeaders
  });

  if (!response.success) {
    return response as ApiResponse<ApiResponseModify>;
  }

  revalidatePath(path);
  return { success: true, result: response.result };
};

export const patchData = async <T>({
  url,
  data,
  path,
}: MutateDataParams<T>): Promise<ApiResponse<ApiResponseModify>> => {
  const response = await serverSideRequestsManager.handleRequest<ApiResponseModify>({
    url,
    method: "PATCH",
    data
  });

  if (!response.success) {
    return response as ApiResponse<ApiResponseModify>;
  }

  revalidatePath(path);
  return { success: true, result: response.result };
};

export const deleteData = async (
  url: string,
  path: string
): Promise<ApiResponse<ApiResponseModify>> => {
  const response = await serverSideRequestsManager.handleRequest<ApiResponseModify>({
    url,
    method: "DELETE"
  });
  
  if (!response.success) {
    return response as ApiResponse<ApiResponseModify>;
  }

  revalidatePath(path);
  return { success: true, result: response.result };
};