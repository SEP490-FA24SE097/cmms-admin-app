"use server";

import { IMaterial } from "./../type/material-type";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  Result,
  ApiListResponse,
  ApiSingleResponse,
  apiRequest,
  fetchListDataWithPagi,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";

// form mẫu fetch list
export async function getMaterials(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IMaterial>> {
  noStore();

  const result = await fetchListDataWithPagi<IMaterial>(
    "/materials",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

// form mẫu fetch object => data by id
export async function getMaterialById(
  id: string
): Promise<ApiSingleResponse<IMaterial>> {
  const result = await fetchSingleData<IMaterial>(`/materials/${id}`);
  if (!result.success) {
    return { data: null, error: result.error };
  }

  return result.data;
}
