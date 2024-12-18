"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { ICusInvoices, IInvoices } from "../type/invoice-type";
import { getInvoices, getInvoicesPending } from "../action/invoice-action";

// list material
export const useGetInvoice = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<ICusInvoices>>({
    queryKey: ["INVOICE_LIST", searchParams],
    queryFn: () => getInvoices(searchParams),
  });
};
export const useGetInvoicePending = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IInvoices>>({
    queryKey: ["INVOICE_PENDING_LIST", searchParams],
    queryFn: () => getInvoicesPending(searchParams),
  });
};
