"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { IBrand } from "../type/brand-type";
import { getBrands } from "../action/brand-action";

export const useGetBrand = () => {
  return useQuery<ApiListResponse<IBrand>>({
    queryKey: ["BRAND_LIST"],
    queryFn: () => getBrands(),
  });
};
