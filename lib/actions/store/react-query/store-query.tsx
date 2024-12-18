"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IStore } from "../type/store-type";
import { getStores } from "../action/store-action";

// list material
export const useGetStore = () => {
  return useQuery<ApiListResponse<IStore>>({
    queryKey: ["STORE_LIST"],
    queryFn: () => getStores(),
  });
};
