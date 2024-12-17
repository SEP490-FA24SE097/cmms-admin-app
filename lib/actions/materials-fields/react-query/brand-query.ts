"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "../type/category";
import { getBrand } from "../action/brand-action";
import { IBrand } from "../type/brand";

// list material
export const useGetBrand = (
) => {
  return useQuery<ApiListResponse<IBrand>>({
    queryKey: ["BRANDS_LIST"],
    queryFn: () => getBrand(),
  });
};

