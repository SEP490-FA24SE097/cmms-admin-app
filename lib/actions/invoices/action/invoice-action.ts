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
import { ICusInvoices, IInvoices } from "../type/invoice-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

// form mẫu fetch list
export async function getInvoices(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<ICusInvoices>> {
  noStore();

  const result = await fetchListDataWithPagi<ICusInvoices>(
    "/invoices/customer",
    searchParams
  );
  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

export async function getInvoicesRefund(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IInvoices>> {
  noStore();

  const result = await fetchListDataWithPagi<IInvoices>(
    "/invoices",
    searchParams
  );

  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

export async function getInvoicesPending(
  searchParams: Record<string, string | number | boolean>
): Promise<ApiListResponse<IInvoices>> {
  noStore();

  const result = await fetchListDataWithPagi<IInvoices>(
    "/invoices",
    searchParams
  );
  if (!result.success) {
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
}

// form mẫu
export async function CreateRefund(data: any): Promise<Result<void>> {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.post("/invoices/update-invoice", data)
  );
  // console.log(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  console.log(result);
  return { success: true, data: undefined };
}
