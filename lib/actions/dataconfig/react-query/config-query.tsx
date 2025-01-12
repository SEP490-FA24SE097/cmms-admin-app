"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { getShippingConfig } from "../action/config-action";
import { IShippingConfig } from "../type.tsx/config-type";

// list material
export const useShippingConfig = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IShippingConfig>>({
    queryKey: ["SHIPPING_CONFIG_LIST", searchParams],
    queryFn: () => getShippingConfig(searchParams),
  });
};

