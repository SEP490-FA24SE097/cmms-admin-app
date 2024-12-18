"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IImport, IMaterialImport } from "../type/import-type";
import { getImports, getMaterialsImport } from "../action/import-action";
import { Material } from "../../material-store/type/material-store";

// list material
export const useGetImport = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IImport>>({
    queryKey: ["IMPORT_LIST", searchParams],
    queryFn: () => getImports(searchParams),
  });
};
export const useGetMaterialImport = () => {
  return useQuery<ApiListResponse<Material>>({
    queryKey: ["IMPORT_MATERIAL_LIST"],
    queryFn: () => getMaterialsImport(),
  });
};
