"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import {
  Result,
  ApiListResponse,
  ApiSingleResponse,
  apiRequest,
  fetchListData,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { api } from "@/lib/api/api-interceptor/api";

export async function createAccount<T>(data: any): Promise<ApiListResponse<T>> {
  noStore();
  const result = await apiRequest(() => api.post("/auth/signUp", data));
  if (!result.success) {
    return { data: [], error: result.error };
  }

  // Assuming the result.data contains the expected fields from the API response
  return {
    data: result.data.data ? [result.data.data] : [],
    pageCount: result.data.pagination?.perPage ?? 0,
    totalPages: result.data.pagination?.total ?? 0,
  };
}
