"use client";

import {
  ApiListResponse,
  ApiSingleResponse,
} from "@/lib/api/api-handler/generic";
import { useQuery } from "@tanstack/react-query";
import { INote } from "../type/note-type";
import { getNotes } from "../action/note-action";

// list material
export const useGetNotes = (
  searchParams: Record<string, string | number | boolean>
) => {
  return useQuery<ApiListResponse<INote>>({
    queryKey: ["NOTE_LIST", searchParams],
    queryFn: () => getNotes(searchParams),
  });
};
