"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IShipper, IShipPrice } from "../type/shipper-type";
import { getShippers } from "../action/shipper-action";

// list material
export const useGetShipper = () => {
  return useQuery<ApiListResponse<IShipper>>({
    queryKey: ["SHIPPER_LIST"],
    queryFn: () => getShippers(),
  });
};
