"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { getShipping } from "../action/delivery";
import { IShippingDetails } from "../type/delivery-type";

// list material
export const useShippoing = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IShippingDetails>>({
    queryKey: ["SHIPPING_LIST", searchParams],
    queryFn: () => getShipping(searchParams),
  });
};

