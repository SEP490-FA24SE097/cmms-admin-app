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
import { IImport, IMaterialImport } from "../type/import-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

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

export async function CreateImportAction(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() => axiosAuth.post("/imports", data));
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function getMaterialsImport(
): Promise<ApiListResponse<IMaterialImport>> {
  noStore();

  const result = await fetchListData<IMaterialImport>(
    "/materials/get-all-materials-for-import"
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
