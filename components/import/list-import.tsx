"use client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
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

export default function ImportList() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

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

  const { data: suppliers, isLoading: isLoadingSuplier } = useGetSuplier();
  const { data: imports, isLoading: isLoadingImport } =
    useGetImport(searchParams);
  const totalPages = imports?.totalPages || 1;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="w-[80%] mx-auto mt-5">
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="text-2xl font-bold">Phiếu nhập hàng</div>
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
            <div className="">
              <Link href="/import/create-import">
                <Button className="bg-blue-500 text-white hover:bg-blue-600">
                  <FaPlus /> Nhập hàng
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
            <div className="flex items-center mt-2">
              <h1 className="w-12">Từ :</h1>
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

            <div className="flex items-center mt-2">
              <h1 className="w-12">Đến :</h1>
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
              <Select>
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
              <div>Mã nhập hàng</div>
              <div>Thời gian</div>
              <div className="col-span-4">Nhà cung cấp</div>
              <div className="col-start-7">Cần trả NCC</div>
              <div className="col-start-8">Trạng thái</div>
            </div>
            {imports?.data.map((item, index) => (
              <Accordion type="single" collapsible key={item.id}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    className={`grid grid-cols-8 grid-rows-1  gap-4 p-3 ${
                      index % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div>{item.id}</div>
                    <div>{formatDateTime(item.timeStamp)}</div>

                    <div className="col-span-4 capitalize">
                      {item.supplierName}
                    </div>
                    <div className="col-start-7">{item.totalDue}</div>
                    <div className="col-start-8 capitalize">{item.status}</div>
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
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

            <div className="ml-5">Có {imports?.total} kết quả tìm kiếm</div>
          </div>
        </div>
      </div>
    </div>
  );
}
