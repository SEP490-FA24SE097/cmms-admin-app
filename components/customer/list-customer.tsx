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
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CalendarIcon, Loader2 } from "lucide-react";
import { useGetSuplier } from "@/lib/actions/supplier/react-query/supplier-query";
import { RxUpdate } from "react-icons/rx";
import { FaLock } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllCustomer } from "@/lib/actions/customer/react-query/customer-query";
import CustomerDept from "./customer-dept";
import UpdateCustomer from "./update-customer";
import { UpdateStatusCustomer } from "@/lib/actions/customer/action/customer-action";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CreateCustomer from "../seller/add-customer/page";
import { useSession } from "next-auth/react";

export default function CustomerList() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const [currentPage, setCurrentPage] = useState(0);
  const StoreId = session?.user.user.storeId || null;
  const [searchParams, setSearchParams] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      "defaultSearch.currentPage": currentPage,
      StoreId: StoreId,
    }));
  }, [StoreId, currentPage]);

  const { data: suppliers, isLoading: isLoadingSuplier } = useGetSuplier();
  const { data: customers, isLoading: isLoadingCustomer } =
    useGetAllCustomer(searchParams);

  const totalPages = Math.max(
    0,
    Math.ceil(
      (customers?.data?.pagination?.total || 0) /
        (customers?.data?.pagination?.perPage || 1)
    )
  );
  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= totalPages - 1) {
      setCurrentPage(page);
    }
  };

  const handleUpdateStatus = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await UpdateStatusCustomer(id);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đơn vị mới đã được tạo thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["ALL_CUSTOMER"],
        });
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi kết nối đến server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const result = await UpdateStatusCustomer(id);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đơn vị mới đã được tạo thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["ALL_CUSTOMER"],
        });
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi kết nối đến server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[90%] mx-auto mt-5">
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="text-2xl font-bold">Khách hàng</div>
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

            <div className="items-center flex">
              <CreateCustomer isManager={true} />
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
            <div className="grid grid-cols-6 grid-rows-1 gap-4 bg-blue-100 p-3 font-bold">
              <div>Mã Khách hàng</div>
              <div>Tên khách hàng</div>
              <div className="text-center">Số điện thoai</div>
              <div className="text-center">Nợ hiện tại</div>
              <div className="text-right">Tổng bán</div>
              <div className="text-right">Tổng bán trừ trả hàng</div>
            </div>
            <div className="grid grid-cols-6 grid-rows-1 gap-4 bg-yellow-50 p-3 font-bold">
              <div></div>
              <div></div>
              <div className="text-center"></div>
              <div className="text-center">
                {customers?.data?.currentDebtTotal.toLocaleString("vi-VN")}
              </div>
              <div className="text-right">
                {customers?.data?.totalSale.toLocaleString("vi-VN")}
              </div>
              <div className="text-right">
                {customers?.data?.totalSaleAfterRefund.toLocaleString("vi-VN")}
              </div>
            </div>
            {isLoadingCustomer && (
              <div className=" mt-2 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full " />
              </div>
            )}
            {customers?.data?.result.map((item, index) => (
              <Accordion type="single" collapsible key={item.id}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    showIcon={false}
                    className={`grid grid-cols-6 grid-rows-1 gap-4 p-3 ${
                      index % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div>{item.id}</div>
                    <div>{item.fullName}</div>

                    <div className="text-center">{item.phoneNumber}</div>
                    <div className="text-center">
                      {item.currentDebt.toLocaleString("vi-VN")}
                    </div>
                    <div className="text-right">
                      {item.totalSale.toLocaleString("vi-VN")}
                    </div>
                    <div className="text-right">
                      {item.totalSaleAfterRefund.toLocaleString("vi-VN")}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="p-5 border bg-white">
                      <Tabs defaultValue="info" className="w-full">
                        <TabsList>
                          <TabsTrigger value="info">
                            Thông tin chi tiết
                          </TabsTrigger>
                          <TabsTrigger value="dept">
                            Nợ cần thu từ khách hàng
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent className="py-2 space-y-5" value="info">
                          <div className="grid grid-cols-3 grid-rows-1 gap-10">
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Mã khách hàng:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.id}
                              </h1>
                            </div>
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Tên khách hàng:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.fullName}
                              </h1>
                            </div>
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Số điện thoại:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.phoneNumber || "Chưa có"}
                              </h1>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 grid-rows-1 gap-10">
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Email:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.email}
                              </h1>
                            </div>
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Mã số thuế:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.taxCode || "Chưa có"}
                              </h1>
                            </div>
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Trạng thái:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.customerStatus}
                              </h1>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 grid-rows-1 gap-10">
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Ngày sinh:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.dob}
                              </h1>
                            </div>
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Tạo bởi:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.createByName}
                              </h1>
                            </div>
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 border-b pb-2">
                              <h1 className="col-span-2">Nhóm KH:</h1>
                              <h1 className="col-span-3 col-start-3 font-bold">
                                {item.customerType}
                              </h1>
                            </div>
                          </div>
                          <div className="flex gap-5 border-b pb-2">
                            <h1>Địa chỉ:</h1>
                            <h1 className="font-semibold">
                              {item.address}, {item.ward}, {item.district},{" "}
                              {item.province}
                            </h1>
                          </div>
                          <div className="flex justify-end gap-5">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="bg-green-500 text-white hover:bg-green-600">
                                  <RxUpdate /> Cập nhật
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[1000px] h-[420px]">
                                <DialogOverlay className="bg-white p-5 rounded-lg">
                                  <UpdateCustomer item={item} />
                                </DialogOverlay>
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                {item.customerStatus === "Ngừng hoạt động" ? (
                                  <Button className="bg-green-500 text-white hover:bg-green-600">
                                    <FaLock /> Mở hoạt động
                                  </Button>
                                ) : (
                                  <Button variant="destructive">
                                    <FaLock /> Ngừng hoạt động
                                  </Button>
                                )}
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cập nhật trạng thái
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc muốn cập nhật trạng thái của
                                    người dùng này không?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  {isLoading ? (
                                    <Button className="" disabled>
                                      <Loader2 className="animate-spin" />
                                      Đang xử lý
                                    </Button>
                                  ) : (
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleUpdateStatus(item.id)
                                      }
                                    >
                                      Cập nhật
                                    </AlertDialogAction>
                                  )}
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {/* <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <IoTrashBin /> Xóa
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog> */}
                          </div>
                        </TabsContent>
                        <TabsContent value="dept">
                          <CustomerDept customerId={item.id} />
                        </TabsContent>
                      </Tabs>
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
                      currentPage > 0 && handlePageChange(currentPage - 1)
                    }
                    aria-disabled={currentPage === 0}
                    className={
                      currentPage === 0
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  ></PaginationPrevious>
                </PaginationItem>
                {[...Array(totalPages || 0)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index}
                      onClick={() => handlePageChange(index)}
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
              Có {customers?.data?.pagination?.total} kết quả tìm kiếm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
