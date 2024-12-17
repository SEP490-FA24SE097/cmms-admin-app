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

// form mẫu fetch list
export async function getUnit(
): Promise<ApiListResponse<IUnit>> {
  noStore();

  const result = await fetchListData<IUnit>(
    "/units"
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }
  return result.data;
}

