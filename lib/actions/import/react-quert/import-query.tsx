"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IImport } from "../type/import-type";
import { getImports } from "../action/import-action";

// list material
export const useGetImport = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IImport>>({
    queryKey: ["IMPORT_LIST", searchParams],
    queryFn: () => getImports(searchParams),
  });
};
