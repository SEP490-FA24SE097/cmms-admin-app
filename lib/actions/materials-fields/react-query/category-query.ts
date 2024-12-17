"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { ICategory } from "../type/category";
import { getCategory } from "../action/category-action";

// list material
export const useGetCategory = (
) => {
  return useQuery<ApiListResponse<ICategory>>({
    queryKey: ["CATEGORIES_LIST"],
    queryFn: () => getCategory(),
  });
};

