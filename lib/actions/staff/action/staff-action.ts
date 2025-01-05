

  
  import { unstable_noStore as noStore, revalidatePath } from "next/cache";
  import { axiosAuth } from "@/lib/api/api-interceptor/api";
  
  import {
    Result,
    ApiListResponse,
    ApiSingleResponse,
    apiRequest,
    fetchListDataWithPagi,
    fetchSingleData,
  } from "@/lib/api/api-handler/generic";
import { IStaff } from "../type/staff-type";
export async function getStaffs(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IStaff>> {
  noStore();

  const result = await fetchListDataWithPagi<IStaff>(
    "/store/get-staff",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}