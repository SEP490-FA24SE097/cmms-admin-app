"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import {
  Result,
  ApiListResponse,
  ApiSingleResponse,
  apiRequest,
  fetchListData,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
export interface PaymentResponse {
  success: boolean;
  message: string;
}
export async function createQuickPayment(
  data: any
): Promise<ApiSingleResponse<PaymentResponse>> {
  noStore();
  const result = await apiRequest(() =>
    axiosAuth.post("/invoices/create-invoice", data)
  );


  if (!result.success) {
    return { data: null, error: result.error || undefined };
  }

  // Ensure the response data conforms to the expected structure
  return {
    data: result.data as PaymentResponse, // Type assertion if you are sure about the structure
    error: undefined,
  };
}
