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
import { ICategory } from "../type/category";
import { IBrand } from "../type/brand";

// form mẫu fetch list
export async function getBrand(
): Promise<ApiListResponse<IBrand>> {
  noStore();

  const result = await fetchListData<IBrand>(
    "/brands"
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }
  return result.data;
}

