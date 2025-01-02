"use server";

import { IBrand } from "../type/brand-type";
import { unstable_noStore as noStore } from "next/cache";
import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";

export async function getBrands(): Promise<ApiListResponse<IBrand>> {
  noStore();
  const result = await fetchListData<IBrand>("/brands");
  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }
  return result.data;
}
