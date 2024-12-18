"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { IMaterial, IMaterialWarehouse } from "../type/material-type";
import { getMaterialById, getMaterials, getMaterialsWarehouse } from "../action/material-action";

// list material
export const useGetMaterial = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IMaterial>>({
    queryKey: ["MATERIAL_LIST", searchParams],
    queryFn: () => getMaterials(searchParams),
  });
};

// obj material
export const useGetMaterialById = (id: string) => {
  return useQuery<ApiSingleResponse<IMaterial>>({
    queryKey: ["MATERIAL_OBJ", id],
    queryFn: () => getMaterialById(id),
  });
};


// obj material
// list material
export const useGetMaterialWarehouse = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<IMaterialWarehouse>>({
    queryKey: ["MATERIAL_WAREHOUSE_LIST", searchParams],
    queryFn: () => getMaterialsWarehouse(searchParams),
  });
};

