"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IDashboardResponse } from "../type/dashboard-type";
import { getDashboard } from "../action/dashboard-action";


// list material
export const useGetDashboard = (
  searchParams: any
) => {
  return useQuery<ApiListResponse<IDashboardResponse>>({
    queryKey: ["DASHBOAD_LIST", searchParams],
    queryFn: () => getDashboard(searchParams),
  });
};


