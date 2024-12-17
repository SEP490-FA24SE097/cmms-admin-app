"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IUnit } from "../type/unit";
import { getUnit } from "../action/unit-action";

// list material
export const useGetUnit = (
) => {
  return useQuery<ApiListResponse<IUnit>>({
    queryKey: ["UNITS_LIST"],
    queryFn: () => getUnit(),
  });
};

