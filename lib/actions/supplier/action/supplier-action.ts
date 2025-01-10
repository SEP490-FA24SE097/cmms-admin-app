"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  Result,
  apiRequest,
  fetchListData,
} from "@/lib/api/api-handler/generic";
import { ISupplier } from "../type/supplier-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

// form mẫu fetch list
export async function getSuppliers(): Promise<ApiListResponse<ISupplier>> {
  noStore();

  const result = await fetchListData<ISupplier>("/suppliers");

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

export async function createSupplier<T>(data: any): Promise<Result<void>> {
  noStore();
  const result = await apiRequest(() => axiosAuth.post("/suppliers", data));
  console.log(result);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
