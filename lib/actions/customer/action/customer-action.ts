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
import { Customer, Data, ICustomer, ITransaction } from "../type/customer";
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

export async function getStaffById(
  searchParams: any
): Promise<ApiSingleResponse<Customer>> {
  const result = await fetchSingleData<Customer>(
    `/store/get-staff-id?${new URLSearchParams(searchParams)}`
  );

  if (!result.success) {
    return { data: null, error: result.error };
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

export async function createAccount<T>(data: any): Promise<Result<void>> {
  noStore();
  const result = await apiRequest(() => axiosAuth.post("/customers", data));

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function createAccountStaff<T>(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post("/store/add-staff", data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function UpdateCustomerC(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.put("/customers/update-customer", data)
  );
  console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function UpdateStatusCustomer(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post(`/customers/update-customer-status/${data}`)
  );
  console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}
export async function DeleteCustomer(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.delete(`/customers/update-customer-status/${data}`)
  );
  console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: undefined };
}

export async function getCustomerTransaction(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<ITransaction>> {
  noStore();
  console.log(searchParams);
  const result = await fetchListDataWithPagi<ITransaction>(
    "/transactions",
    searchParams
  );
  console.log(result);
  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}
