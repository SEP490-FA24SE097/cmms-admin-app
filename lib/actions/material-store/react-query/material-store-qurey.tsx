  "use client";

  import {
    ApiListResponse,
    ApiSingleResponse,
  } from "@/lib/api/api-handler/generic";
  import { useQuery } from "@tanstack/react-query";
  import { Material } from "../type/material-store";
  import { getMaterialsStore } from "../action/material-store-action";


  // list material
  export const useGetMaterialStore = (
    searchParams: Record<string, string | number | boolean>
  ) => {
    return useQuery<ApiListResponse<Material>>({
      queryKey: ["MATERIAL_STORE_LIST", searchParams],
      queryFn: () => getMaterialsStore(searchParams),
    });
  };
