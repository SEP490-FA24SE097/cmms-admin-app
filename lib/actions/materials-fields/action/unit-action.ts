"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  Result,
  ApiListResponse,
  ApiSingleResponse,
  apiRequest,
  fetchListDataWithPagi,
  fetchSingleData,
  fetchListData,
} from "@/lib/api/api-handler/generic";
import { IUnit } from "../type/unit";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

// form mẫu fetch list
export async function getUnit(): Promise<ApiListResponse<IUnit>> {
  noStore();

  const result = await fetchListData<IUnit>("/units");

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }
  return result.data;
}

export async function CreateUnit(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() => axiosAuth.post("/units", data));

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
