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
