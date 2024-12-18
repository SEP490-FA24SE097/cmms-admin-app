"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  apiRequest,
  ApiSingleResponse,
  fetchListData,
} from "@/lib/api/api-handler/generic";
import { IShipper, IShipPrice } from "../type/shipper-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

// form mẫu fetch list
export async function getShippers(): Promise<ApiListResponse<IShipper>> {
  noStore();

  const result = await fetchListData<IShipper>("/shippingDetails/get-shipper");

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

export async function getShipPrice(
  data: any
): Promise<ApiSingleResponse<IShipPrice>> {
  noStore();
  const result = await apiRequest(() =>
    axiosAuth.post("/shippingDetails/get-shipping-fee", data)
  );
  console.log(data);
  if (!result.success) {
    return { data: null, error: result.error };
  }

  return result.data;
}
