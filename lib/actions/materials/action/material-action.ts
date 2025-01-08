"use server";

import {
  IMaterial,
  IMaterialWarehouse,
  IMaterialPost,
  IUnit,
} from "./../type/material-type";

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

export async function createMaterial(
  data: any
): Promise<ApiSingleResponse<IMaterialPost>> {
  noStore();
  const result = await apiRequest(() => axiosAuth.post("/materials", data));
  console.log("result", result);
  if (!result.success) {
    return { data: null, error: result.error };
  }
  return result.data;
}

export async function createUnit(data: any): Promise<ApiSingleResponse<IUnit>> {
  noStore();
  const result = await apiRequest(() => axiosAuth.post("/units", data));
  if (!result.success) {
    return { data: null, error: result.error };
  }
  return result.data;
}

// form mẫu fetch list
export async function getMaterialsWarehouse(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IMaterialWarehouse>> {
  noStore();

  const result = await fetchListDataWithPagi<IMaterialWarehouse>(
    "/warehouse/get-warehouse-products",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }
  return result.data;
}

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

export async function CreateMaterial(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() => axiosAuth.post("/materials", data));
  console.log(result);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
export async function UpdateMaterial(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() => axiosAuth.put("/materials", data));

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
export async function UpdateVariant(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() => axiosAuth.put("/variants", data));

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
export async function CreateDiscount(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post("/materials/update-material-discount", data)
  );
  console.log(result);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
