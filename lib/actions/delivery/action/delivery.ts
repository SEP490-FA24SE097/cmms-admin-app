"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  Result,
  ApiListResponse,
  ApiSingleResponse,
  apiRequest,
  fetchListDataWithPagi,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { api, axiosAuth } from "@/lib/api/api-interceptor/api";
import { IShippingDetails } from "../type/delivery-type";

// form mẫu fetch list
export async function getShipping(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IShippingDetails>> {
  noStore();

  const result = await fetchListDataWithPagi<IShippingDetails>(
    "/shippingDetails/getShippingDetails",
    searchParams
  );
  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

export async function updateShipping(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post("/shippingDetails/update-shippingDetail-status", data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function updateShippingFail<T>(
  data: any
): Promise<ApiListResponse<T>> {
  noStore();
  const result = await apiRequest(() =>
    api.post("/invoices/update-invoice", data)
  );
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
export async function UpdateNotSip(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post("/shippingDetails/send-request-to-change", data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
