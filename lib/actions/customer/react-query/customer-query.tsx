"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { ICustomer } from "../type/customer";
import { getCustomers } from "../action/customer-action";

// list material
export const useGetCustomer = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<ICustomer>>({
    queryKey: ["CUSTOMER_LIST", searchParams],
    queryFn: () => getCustomers(searchParams),
  });
};
