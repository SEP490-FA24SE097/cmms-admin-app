'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useGetMaterial } from "@/lib/actions/materials/react-query/material-query";


export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<
Record<string, string | number | boolean>
>({
page: currentPage,
itemPerPage: 4,
brandId: "",
categoryId: "",
lowerPrice: "",
upperPrice: "",
});
const { data, isLoading } = useGetMaterial(searchParams);
console.log(data);
  return (
    <Button>Button</Button>
  );
}
