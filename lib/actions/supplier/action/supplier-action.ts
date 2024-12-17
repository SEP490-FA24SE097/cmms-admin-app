"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { ISupplier } from "../type/supplier-type";

// form mẫu fetch list
export async function getSuppliers(): Promise<ApiListResponse<ISupplier>> {
  noStore();

  const result = await fetchListData<ISupplier>("/suppliers");

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
