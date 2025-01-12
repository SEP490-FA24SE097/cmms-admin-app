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
import { IRequest } from "../type/request";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

// form mẫu fetch list
export async function getRequestStore(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IRequest>> {
  noStore();

  const result = await fetchListDataWithPagi<IRequest>(
    "/store-material-import-requests/get-request-list-by-storeId-and-status",
    searchParams
  );
  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
export async function CreateRequest(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post(
      "/store-material-import-requests/create-store-material-import-request",
      data
    )
  );
  console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
export async function CancelRequest(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post(
      "/store-material-import-requests/cancel-processing-request",
      data
    )
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function ConfirmRequest(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post(
      "/store-material-import-requests/confirm-or-cancel-store-material-import-request",
      data
    )
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
export async function SubmitRequest(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post(
      "/store-material-import-requests/approve-or-cancel-store-material-import-request",
      data
    )
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
