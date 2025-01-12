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
import { IShippingConfig } from "../type.tsx/config-type";

// form mẫu fetch list
export async function getShippingConfig(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IShippingConfig>> {
  noStore();

  const result = await fetchListDataWithPagi<IShippingConfig>(
    "/admin/shipping-free-config",
    searchParams
  );
  console.log(searchParams);
  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
export async function CreateConfigShip(data: any): Promise<Result<void>> {
  noStore();
  console.log(data);
  const result = await apiRequest(() =>
    axiosAuth.post("/admin/add-shipping-free-config", data)
  );
  console.log(result);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
