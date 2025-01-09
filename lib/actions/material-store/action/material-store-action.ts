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
import { Material } from "../type/material-store";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

// form mẫu fetch list
export async function getMaterialsStore(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<Material>> {
  noStore();

  const result = await fetchListDataWithPagi<Material>(
    "/store-inventories/get-products-by-store-id",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

export async function UpdateStockInStore(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post(
      "/store-inventories/update-store-material-min-max-stock",
      data
    )
  );
  console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function CreateAutoImport(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post(
      "/store-inventories/update-auto-import-material-quantity",
      data
    )
  );
  console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
