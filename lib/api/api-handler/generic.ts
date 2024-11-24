"use server";

import axios, { AxiosResponse } from "axios";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { handleAPIError, translateError } from "./handler-api-error";

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export interface ApiListResponse<T> {
  data: T[];
  pageCount?: number;
  totalPages?: number;
  error?: string;
}
export interface ApiSingleResponse<T> {
  data: T | null;
  error?: string;
}

export async function apiRequest<T>(
  request: () => Promise<AxiosResponse<T>>
): Promise<Result<T>> {
  try {
    const response = await request();
    return { success: true, data: response.data };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      try {
        // Attempt to parse the response body as text if available
        const errorMessage = typeof error.response.data === 'string'
          ? error.response.data // If it's text, use as is
          : JSON.stringify(error.response.data); // If JSON, stringify it
          
        return { success: false, error: errorMessage };
      } catch (parseError) {
        console.error("Error parsing response body:", parseError);
        return { success: false, error: "Failed to parse error response." };
      }
    }
    
    // For other types of errors, use a generic message or translateError
    return { success: false, error: translateError(error) };
  }
}

export async function fetchListDataWithPagi<T>(
  url: string,
  searchParams?: Record<string, any>
): Promise<Result<ApiListResponse<T>>> {
  const result = await apiRequest<{
    data: T[];
    pagination: {
      total: number;
      perPage: number;
      currentPage: number;
    };
  }>(() => axiosAuth.get(url, { params: searchParams }));

  if (result.success) {
    const { data, pagination } = result.data;
    const totalPages = Math.ceil(pagination.total / pagination.perPage);

    return {
      success: true,
      data: {
        data: data || [],
        totalPages, // Include totalPages in the response
      },
    };
  }

  return result;
}

export async function fetchListData<T>(
  url: string,
  searchParams?: Record<string, any>
): Promise<Result<ApiListResponse<T>>> {
  const result = await apiRequest<{
    data: T[];
    metaData: {
      totalItemsCount: number;
      pageSize: number;
      totalPagesCount: number;
    };
  }>(() => axiosAuth.get(url, { params: searchParams }));
  if (result.success) {
    const { data, metaData } = result.data;
    return {
      success: true,
      data: { data: data || [], pageCount: metaData?.totalPagesCount || 0 },
    };
  }
  return result;
}

export async function fetchSingleData<T>(
  url: string
): Promise<Result<ApiSingleResponse<T>>> {
  const result = await apiRequest<{ data: T }>(() => axiosAuth.get(url));

  if (result.success) {
    return {
      success: true,
      data: { data: result.data.data },
    };
  }

  return result;
}
