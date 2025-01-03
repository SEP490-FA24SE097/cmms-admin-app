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
import {  Data, ICustomer, ITransaction } from "../type/customer";
import { api, axiosAuth } from "@/lib/api/api-interceptor/api";

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

export async function getAllCustomer(
  searchParams: any
): Promise<ApiSingleResponse<Data>> {
  const result = await fetchSingleData<Data>(
    `/customers?${new URLSearchParams(searchParams)}`
  );

  if (!result.success) {
    return { data: null, error: result.error };
  }

  return result.data;
}

export async function createAccount<T>(data: any): Promise<ApiListResponse<T>> {
  noStore();
  console.log(data);
  const result = await apiRequest(() => axiosAuth.post("/customers", data));
  console.log(result);
  if (!result.success) {
    return { data: [], error: result.error };
  }

  // Assuming the result.data contains the expected fields from the API response
  return {
    data: result.data.data ? [result.data.data] : [],
    pageCount: result.data.pagination?.perPage ?? 0,
    totalPages: result.data.pagination?.total ?? 0,
  };
}

export async function createShipper<T>(data: any): Promise<ApiListResponse<T>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post("/shippingDetails/add-shipper", data)
  );

  if (!result.success) {
    return { data: [], error: result.error };
  }

  // Assuming the result.data contains the expected fields from the API response
  return {
    data: result.data.data ? [result.data.data] : [],
    pageCount: result.data.pagination?.perPage ?? 0,
    totalPages: result.data.pagination?.total ?? 0,
  };
}


export async function getCustomerTransaction(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<ITransaction>> {
  noStore();

  const result = await fetchListDataWithPagi<ITransaction>(
    "/transactions",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}