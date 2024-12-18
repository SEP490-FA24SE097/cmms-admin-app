"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IRequest } from "../type/request";
import { getRequestStore } from "../action/request-action";

// list material
export const useGetRequestStore = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IRequest>>({
    queryKey: ["Request_STORE_LIST", searchParams],
    queryFn: () => getRequestStore(searchParams),
  });
};
