import { EXPIRED_SESSION_ROUTE } from "@/constants";
import { ApiResponse } from "@/types";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axiosInstance from "../axios";
import { serializeError } from "../utils";
import { getRenewedCookies } from "./server";

const MAX_RETRIES = 1;

interface HandleRequestParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  extraHeaders?: Record<string, string>;
  renewedCookies?: {
    cookies: string;
    csrfTokenCookie: string;
  }
}

interface HandleErrorsParams extends HandleRequestParams {
  error: any;
  currentRetry?: number;
}

/**
 * The ServerSideRequestsManager class handles server-side requests and errors.
 */
class ServerSideRequestsManager {
  private cookiesString: string;
  private csrfTokenCookie: string;

  constructor() {
    this.cookiesString = "";
    this.csrfTokenCookie = "";
  }

  public get getCookiesString() {
    return this.cookiesString;
  }

  private get getCsrfTokenCookie() {
    return this.csrfTokenCookie;
  }

  private setCookiesString(cookies: string) {
    if (cookies) {
      this.cookiesString = cookies;
    }
  }

  private setCsrfTokenCookie(csrfTokenCookie: string) {
    if (csrfTokenCookie) {
      this.csrfTokenCookie = csrfTokenCookie;
    }
  }

  private async renewCookies() {
    const { cookies, csrfTokenCookie } = await getRenewedCookies();
    this.setCookiesString(cookies);
    this.setCsrfTokenCookie(csrfTokenCookie);
  }

  public async handleRequest<T>({
    url,
    method,
    data,
    extraHeaders
  }: HandleRequestParams): Promise<ApiResponse<T>> {
    try {
      return await this.makeRequest<T>({
        url,
        method,
        data,
        extraHeaders
      });
    } catch (error) {
      return await this.handleErrors<T>({
        error,
        url,
        method,
        data,
        extraHeaders
      });
    }
  }

  private async makeRequest<T>({
    url,
    method,
    data,
    extraHeaders,
    renewedCookies
  }: HandleRequestParams): Promise<ApiResponse<T>> {
    const headers = {
      Referer: process.env.FRONTEND_URL,
      Cookie: renewedCookies?.cookies ?? cookies().toString(),
      "X-XSRF-TOKEN": renewedCookies?.csrfTokenCookie ?? (cookies().get("XSRF-TOKEN")?.value as string),
      ...extraHeaders,
    };

    let response = {} as AxiosResponse<T>;

    switch (method) {
      case "GET":
        response = await axiosInstance.get<T>(url, { headers });
        break;
      case "POST":
        response = await axiosInstance.post<T>(url, data, { headers });
        break;
      case "PUT":
        response = await axiosInstance.put<T>(url, data, { headers });
        break;
      case "PATCH":
        response = await axiosInstance.patch<T>(url, data, { headers });
        break;
      case "DELETE":
        response = await axiosInstance.delete<T>(url, { headers });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    this.setCookiesString(response.headers["set-cookie"]?.join(", ") ?? "");

    return { success: true, result: response.data };
  }

  private async retryRequest<T>({
    url,
    method,
    data,
    extraHeaders
  }: HandleRequestParams): Promise<ApiResponse<T>> {
    await this.renewCookies();

    return this.makeRequest<T>({
      url,
      method,
      data,
      extraHeaders,
      renewedCookies: {
        cookies: this.getCookiesString,
        csrfTokenCookie: this.getCsrfTokenCookie
      }
    });
  }

  private async handleErrors<T>({
    error,
    url,
    method,
    data,
    extraHeaders,
    currentRetry = 0
  }: HandleErrorsParams): Promise<ApiResponse<T>> {
    console.log("Failed to make request: ", error?.response?.data ?? error.message);

    // Handle error 401 (Unauthorized)
    if (error.response?.status === 401) {
      redirect(EXPIRED_SESSION_ROUTE);
    }

    // Handle error 419 (CSRF token mismatch)
    if (error.response?.status === 419 && currentRetry < MAX_RETRIES) {
      try {
        return await this.retryRequest<T>({
          url,
          method,
          data,
          extraHeaders,
        });
      } catch (csrfError: any) {
        console.log(
          "Failed to retry request after CSRF token renewal:",
          csrfError?.response?.data ?? csrfError.message
        );
        return this.handleErrors<T>({ error: csrfError, url, method, data, extraHeaders, currentRetry: currentRetry + 1 });
      }
    }

    return serializeError(error);
  }
}

const serverSideRequestsManager = new ServerSideRequestsManager();

export default serverSideRequestsManager;