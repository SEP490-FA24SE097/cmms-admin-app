"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { ISupplier } from "../type/supplier-type";
import { getSuppliers } from "../action/supplier-action";

// list material
export const useGetSuplier = () => {
  return useQuery<ApiListResponse<ISupplier>>({
    queryKey: ["SUPPLIER_LIST"],
    queryFn: () => getSuppliers(),
  });
};
