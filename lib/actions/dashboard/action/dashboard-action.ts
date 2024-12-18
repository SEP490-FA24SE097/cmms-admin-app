import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { IDashboardResponse } from "../type/dashboard-type";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

// form mẫu fetch list
export async function getDashboard(
  searchParams: any
): Promise<ApiListResponse<IDashboardResponse>> {
  noStore();

  const result = await fetchListData<IDashboardResponse>(
    "/invoices/get-revenue-all?",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }
  return result.data;
  
}

