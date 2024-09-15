import { SerializableError } from "@/types";
import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import qs from "qs";
import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface BackendFormErrors {
  [key: string]: string[];
}

interface HandleBackendFormErrorsProps<T extends FieldValues> {
  setError?: UseFormSetError<T>;
  error: any;
  toast: (options: { variant: "default" | "destructive"; description: string }) => void;
  customMessage?: string;
}

/**
 * Handle backend form errors
 */
export function handleBackendFormErrors<T extends FieldValues>({
  setError,
  error,
  toast,
  customMessage
}: HandleBackendFormErrorsProps<T>) {
  if (customMessage) {
    toast({
      variant: "destructive",
      description: customMessage
    });
    return;
  }

  if (!setError) {
    toast({
      variant: "destructive",
      description: error?.response?.data?.message ?? "An unexpected error occurred."
    });
    return;
  }

  if (error?.response?.status === 422 && error?.response?.data.errors) {
    const errors: BackendFormErrors = error.response.data.errors;
    Object.keys(errors).forEach((field) => {
      // Join error messages on one single string
      const errorMessage = errors[field].join(" ");
      setError(field as Path<T>, {
        type: "manual",
        message: errorMessage as string,
      });
    });
  } else {
    toast({
      variant: "destructive",
      description: error?.response?.data?.message ?? "An unexpected error occurred."
    });
  }
}

/**
 * Create a serializable error
 */
export const serializeError = (error: any): SerializableError => {
  if (axios.isAxiosError(error)) {
    // Create a serializable object from axios error
    const serializableError: SerializableError = {
      success: false,
      result: {},
      error: {
        message: error?.response?.data?.message ?? error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : undefined,
      }
    };

    return serializableError;
  } else {
    // Throw a generic error
    return {
      success: false,
      result: {},
      error: {
        message: "Unknown error occurred",
      }
    };
  }
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
  pathname: string;
  resetPagination?: boolean;
  withPagination?: boolean;
}

/**
 * Form a URL Query with the given params
 */
export const formUrlQuery = ({
  params,
  key,
  value,
  pathname,
  resetPagination = false,
  withPagination = true
}: UrlQueryParams) => {
  const currentParams = qs.parse(params);

  currentParams[key] = value as string;

  if (resetPagination && withPagination) {
    currentParams.page = "1";
  }

  return `${pathname}?${qs.stringify(currentParams, {
    skipNulls: true,
  })}`;
};