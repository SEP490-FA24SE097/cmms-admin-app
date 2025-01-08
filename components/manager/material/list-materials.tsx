"use client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { useGetSuplier } from "@/lib/actions/supplier/react-query/supplier-query";
import { useGetImport } from "@/lib/actions/import/react-quert/import-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetMaterialWarehouse } from "@/lib/actions/materials/react-query/material-query";
import AddMaterials from "./add-materials";
import { RxUpdate } from "react-icons/rx";
export default function ListMaterials() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [openM, setOpenM] = useState(false);
  const [selectedSupplier, setSelectSuplier] = useState({ id: "", name: "" });
  const handleSupllierChange = (value: any) => {
    const selectedStoreObject = suppliers?.data.find(
      (item) => item.id === value
    );
    setSelectSuplier(selectedStoreObject || { id: "", name: "" }); // Handle potential missing store
  };
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const formatDateTime = (timeStamp: any) => {
    if (!timeStamp) return ""; // Kiểm tra giá trị null hoặc undefined
    const date = new Date(timeStamp);

    // Định dạng ngày tháng năm và giờ phút
    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useState({
    page: currentPage,
    itemPerPage: 10,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
      supplierId: selectedSupplier.id,
    }));
  }, [selectedSupplier.id, currentPage]);

  const { data: suppliers, isLoading: isLoadingSuplier } = useGetSuplier();
  const { data: materialsWarehouse, isLoading: isLoadingMaterialsWarehouse } =
    useGetMaterialWarehouse(searchParams);
  const totalPages = materialsWarehouse?.totalPages || 1;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="w-[90%] mx-auto mt-5">
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="text-2xl font-bold">Quản lý kho</div>
        <div className="col-span-4">
          <div className="flex justify-between">
            <div className="relative w-[40%]">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="search"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tìm mã phiếu"
                // value={searchTerm}
                // onChange={handleInputChange}
                // onFocus={() => searchTerm && setShowDropdown(true)}
                // onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
            </div>
            <div className="flex gap-5">
              <Dialog open={openM} onOpenChange={setOpenM}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white hover:bg-blue-600">
                    <FaPlus /> Tạo sản phẩm mới
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-[1000px] h-[90vh]">
                  <DialogOverlay
                    className="bg-white p-5  overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2
                          [&::-webkit-scrollbar-track]:rounded-full
                          [&::-webkit-scrollbar-track]:bg-gray-100
                          [&::-webkit-scrollbar-thumb]:rounded-full
                          [&::-webkit-scrollbar-thumb]:bg-gray-300
                          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 rounded-lg"
                  >
                    <DialogTitle>Thêm hàng hóa</DialogTitle>

                    <AddMaterials setOpenM={setOpenM} />
                  </DialogOverlay>
                </DialogContent>
              </Dialog>
              <Link href="materials/update-material">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  <RxUpdate /> Cập nhật vật liệu
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 grid-rows-1 gap-4 mt-5">
        <div className="space-y-5">
          <div className="bg-white shadow-lg p-5 rounded-xl">
            <h1 className="font-bold">Thời gian</h1>
            <div className="flex flex-col gap-1 mt-2">
              <h1 className="w-full">Từ ngày:</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[200px] pl-3 text-left font-normal"
                  >
                    <span>
                      {fromDate ? formatDate(fromDate) : "Chọn ngày bắt đầu"}
                    </span>
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate || undefined}
                    onSelect={(day) => setFromDate(day || null)} // Xử lý undefined
                    disabled={(date) =>
                      date > new Date() || date < new Date("2000-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <h1 className="w-full">Đến ngày:</h1>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-[200px] pl-3 text-left font-normal"
                  >
                    <span>
                      {toDate ? formatDate(toDate) : "Chọn ngày kết thúc"}
                    </span>
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate || undefined}
                    onSelect={(day) => setToDate(day || null)} // Xử lý undefined
                    disabled={
                      (date) => (fromDate ? date < fromDate : false) // Nếu fromDate là null, không cần disable
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="bg-white shadow-lg p-5 rounded-xl">
            <h1 className="font-bold">Nhà cung cấp</h1>
            <div className="mt-5">
              <Select
                onValueChange={handleSupllierChange}
                value={selectedSupplier.id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers?.data.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="col-span-4 ">
          <div className="border h-auto">
            <div className="grid grid-cols-8 grid-rows-1 gap-4 bg-blue-100 p-3 font-bold">
              <div>Mã hàng</div>
              <div className="col-span-2">Tên sản phẩm</div>
              <div className="col-start-4">Giá bán</div>
              <div className="col-start-5">Giá vốn</div>
              <div className="col-start-6">Tồn kho</div>
              <div className="col-start-7">Khách đặt</div>
              <div className="col-start-8">Thời gian tạo</div>
            </div>
            {materialsWarehouse?.data.map((item, index) => (
              <Accordion type="single" collapsible key={item.id}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    showIcon={false}
                    className={`grid grid-cols-8 grid-rows-1  gap-4 p-3 ${
                      index % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={item.materialImage}
                        className="h-10 w-10"
                        alt=""
                      />
                      <h1>{item.materialCode}</h1>
                    </div>
                    <div className="col-span-2 capitalize">
                      {item.variantName || item.materialName}
                    </div>

                    <div className="col-start-4">
                      {item.materialCostPrice?.toLocaleString("vi-VN")}
                    </div>
                    <div className="col-start-5">
                      {item.materialPrice?.toLocaleString("vi-VN")}
                    </div>
                    <div className="col-start-6">
                      {item.quantity.toLocaleString("vi-VN")}
                    </div>
                    <div className="col-start-7">{item.quantity}</div>
                    <div className="col-start-8">
                      {formatDateTime(item.lastUpdateTime)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="pt-2 border bg-white ">                   
                      <h1 className="text-2xl font-bold text-blue-500 ml-5">
                        {item.variantName || item.materialName}
                      </h1>
                      <div className="grid grid-cols-5 grid-rows-1 gap-4 p-2">
                        <div className="col-span-2">
                          <img
                            src={item.variantImage || item.materialImage}
                            className="h-80 w-80 object-cover ml-5"
                            alt=""
                          />
                        </div>
                        <div className="col-span-3 col-start-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="mb-2 font-bold">
                                <span className="font-bold">Mã hàng:</span>{" "}
                                {item.materialCode}
                              </div>

                              <div className="mb-2">
                                <span className="font-bold">Nhóm hàng:</span>{" "}
                                {item.parentCategory}
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">Loại hàng:</span>{" "}
                                {item.category}
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">Thương hiệu:</span>{" "}
                                {item.brand}
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">Định mức tồn:</span>{" "}
                                {item.minStock} ➤ {item.maxStock}
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">Giá bán:</span>{" "}
                                {(
                                  item.variantCostPrice ||
                                  item.materialCostPrice
                                ).toLocaleString("vi-VN")}
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">Giá vốn:</span>{" "}
                                {(
                                  item.variantPrice || item.materialPrice
                                ).toLocaleString("vi-VN")}
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">Trọng lượng:</span>{" "}
                                {item.weight.toLocaleString("vi-VN")} kg
                              </div>
                            </div>
                            <div>
                              <div className="mb-2">
                                <span className="font-bold">Mô tả</span>
                                <div className="border-b border-gray-300"></div>
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">
                                  Ghi chú đặt hàng
                                </span>
                                <div className="border-b border-gray-300"></div>
                              </div>
                              <div className="mb-2">
                                <span className="font-bold">Nhà cung cấp</span>
                                <div className="border-b border-gray-300"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
          <div className="mt-5 flex items-center">
            <Pagination className={cn("justify-start w-auto mx-0")}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  ></PaginationPrevious>
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  ></PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="ml-5">
              Có {materialsWarehouse?.total} kết quả tìm kiếm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
