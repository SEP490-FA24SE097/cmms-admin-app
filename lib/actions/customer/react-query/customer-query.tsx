"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { Data, ICustomer, ITransaction } from "../type/customer";
import {
  getAllCustomer,
  getCustomers,
  getCustomerTransaction,
} from "../action/customer-action";

// list material
export const useGetCustomer = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<ICustomer>>({
    queryKey: ["CUSTOMER_LIST", searchParams],
    queryFn: () => getCustomers(searchParams),
  });
};

export const useGetAllCustomer = (searchParams: any) => {
  return useQuery<ApiSingleResponse<Data>>({
    queryKey: ["ALL_CUSTOMER", searchParams],
    queryFn: () => getAllCustomer(searchParams),
  });
};

export const useGetCustomerTransaction = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<ITransaction>>({
    queryKey: ["CUSTOMER_TRANSACTION_LIST", searchParams],
    queryFn: () => getCustomerTransaction(searchParams),
  });
};
