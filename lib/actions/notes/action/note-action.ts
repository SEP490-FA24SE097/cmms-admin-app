"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

import {
  Result,
  ApiListResponse,
  ApiSingleResponse,
  apiRequest,
  fetchListDataWithPagi,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { INote } from "../type/note-type";

// form mẫu fetch list
export async function getNotes(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<INote>> {
  noStore();

  const result = await fetchListDataWithPagi<INote>(
    "/goods-notes",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

export async function UpdateTracking(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post("/goods-notes/quantity-tracking", data)
  );
  console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
