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
import { IImport } from "../type/import-type";

// form mẫu fetch list
export async function getImports(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IImport>> {
  noStore();

  const result = await fetchListDataWithPagi<IImport>("/imports", searchParams);

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
