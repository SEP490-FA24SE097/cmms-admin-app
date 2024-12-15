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
import { ICustomer } from "../type/customer";

// form mẫu fetch list
export async function getCustomers(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<ICustomer>> {
  noStore();

  const result = await fetchListData<ICustomer>(
    "/customers/get-customer-data-in-store",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
