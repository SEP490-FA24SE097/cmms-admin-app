"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";

import { IStaff } from "../type/staff-type";
import { getStaffs } from "../action/staff-action";

// list material
export const useGetStaff = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IStaff>>({
    queryKey: ["Staff_LIST", searchParams],
    queryFn: () => getStaffs(searchParams),
  });
};