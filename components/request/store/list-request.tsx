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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "lucide-react";
import { useGetSuplier } from "@/lib/actions/supplier/react-query/supplier-query";
import {
  useGetImport,
  useGetMaterialImport,
} from "@/lib/actions/import/react-quert/import-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useGetRequestStore } from "@/lib/actions/request/query-action/request-quert";
import { Material } from "@/lib/actions/material-store/type/material-store";
import { useToast } from "@/hooks/use-toast";
import {
  CancelRequest,
  ConfirmRequest,
  CreateRequest,
} from "@/lib/actions/request/action/request-action";
import { useQueryClient } from "@tanstack/react-query";
import { IMaterialWarehouse } from "@/lib/actions/materials/type/material-type";
import { useGetMaterialWarehouse } from "@/lib/actions/materials/react-query/material-query";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusDetails = (status: string) => {
  switch (status) {
    case "Processing":
      return { label: "Đang xử lý", color: "orange" };
    case "Canceled":
      return { label: "Đã hủy", color: "red" };
    case "Approved":
      return { label: "Đã phê duyệt", color: "green" };
    case "Confirmed":
      return { label: "Đã xác nhận", color: "blue" };
    default:
      return { label: "Không xác định", color: "gray" };
  }
};

export default function ListRequestStore() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
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
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  const [searchParamsS, setSearchParamS] = useState({
    page: 1,
    itemPerPage: 10,
  });

  useEffect(() => {
    setSearchParamS((prev) => ({
      ...prev,
      materialName: searchTerm,
    }));
  }, [searchTerm]);
  // Fetch material store list
  const { data: materialsList, isLoading: isLoadingMaterialData } =
    useGetMaterialWarehouse(searchParamsS);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(value.trim() !== "");
  };

  const [currentPage, setCurrentPage] = useState(1);
  const storeId = session?.user.user.storeId || "";
  const [searchParams, setSearchParams] = useState({
    page: currentPage,
    itemPerPage: 10,
    storeId: storeId,
  });
  const [quantity, setQuantity] = useState<number>(1);

  // Handler to update quantity, ensuring it's non-negative
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(0); // Allow resetting to 0 if the input is cleared
    }
  };

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
      storeId: storeId,
    }));
  }, [storeId, currentPage]);

  const [selectedMaterial, setSelectedMaterial] =
    useState<IMaterialWarehouse | null>(null);
  const handleSelectMaterial = (material: IMaterialWarehouse) => {
    setSelectedMaterial(material);
  };
  const { data: suppliers, isLoading: isLoadingSuplier } = useGetSuplier();
  const { data: request, isLoading: isLoadingRequest } =
    useGetRequestStore(searchParams);
  const totalPages = request?.totalPages || 1;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMaterial) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn sản phẩm!!!",
        variant: "destructive",
      });
      return;
    }

    const data = {
      storeId: storeId,
      materialId: selectedMaterial?.materialId,
      variantId: selectedMaterial?.variantId || null,
      quantity: quantity,
    };

    try {
      setIsLoadingCreate(true);
      const response = await CreateRequest(data);
      if (response.success) {
        toast({
          title: "Thành công.",
          description: "Tạo phiếu nhập thành công!!",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        setIsLoadingCreate(false);
        setOpen(false);
        queryClient.invalidateQueries({
          queryKey: ["Request_STORE_LIST", searchParams],
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
        setIsLoadingCreate(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Lỗi",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
      setIsLoadingCreate(false);
    }
  };
  const handleCancel = async (requestId: string | null | undefined) => {
    if (!requestId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mã yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    const data = { requestId };

    try {
      const response = await CancelRequest(data);
      if (response.success) {
        toast({
          title: "Đã xóa thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        queryClient.invalidateQueries({
          queryKey: ["Request_STORE_LIST", searchParams],
        });
      } else {
        toast({
          title: "Lỗi",
          description:
            response.error || "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Lỗi",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
    }
  };
  const handleConfirm = async (requestId: string | null | undefined) => {
    if (!requestId) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mã yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      requestId: requestId,
      isConfirmed: true,
    };

    try {
      const response = await ConfirmRequest(data);
      if (response.success) {
        toast({
          title: "Xác nhận thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        queryClient.invalidateQueries({
          queryKey: ["Request_STORE_LIST", searchParams],
        });
      } else {
        toast({
          title: "Lỗi",
          description:
            response.error || "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Lỗi",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
    }
  };
  return (
    <div className="w-[80%] mx-auto mt-5">
      <div className="flex justify-between gap-4">
        <div className="text-2xl font-bold">Danh sách yêu cầu</div>
        <div className="">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                <FaPlus /> Tạo yêu cầu
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tạo yêu cầu nhập hàng</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="relative w-[100%]">
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
                      className="block w-full p-3 ps-10 text-md text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tìm hàng hóa theo tên"
                      value={searchTerm}
                      onChange={handleInputChange}
                      onFocus={() => searchTerm && setShowDropdown(true)}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 200)
                      }
                    />

                    {showDropdown && (
                      <ul className="absolute left-0 z-10 w-full p-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {isLoadingMaterialData ? (
                          <div>
                            <Skeleton className="h-[50px] w-full rounded-xl" />
                          </div>
                        ) : materialsList?.data.length === 0 ? (
                          <li className="p-2 text-gray-500">
                            Không có dữ liệu
                          </li>
                        ) : (
                          materialsList?.data.map((item, index) => (
                            <li
                              key={index}
                              onClick={() => handleSelectMaterial(item)}
                              className="p-2 rounded-lg hover:bg-blue-100 cursor-pointer"
                            >
                              <div className="max-w-md mx-auto">
                                {/* First Product */}
                                <div className="flex items-center rounded">
                                  <img
                                    alt="Blue protective workwear"
                                    className="w-14 h-14 mr-4 object-cover"
                                    src={
                                      item.variantImage || item.materialImage
                                    }
                                  />
                                  <div className="flex-1">
                                    <div className="text-black font-semibold">
                                      {item.variantName || item.materialName}
                                    </div>
                                    <div className="text-gray-600">
                                      {item.materialCode}
                                    </div>
                                    <div className="text-gray-600">
                                      Tồn: {item.quantity} | KH đặt: 0
                                    </div>
                                  </div>
                                  <div className="text-blue-600 font-semibold">
                                    {(
                                      item.variantPrice || item.materialPrice
                                    ).toLocaleString("vi-VN", {
                                      style: "currency",
                                      currency: "vnd",
                                    })}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                  {selectedMaterial === null ? (
                    ""
                  ) : (
                    <div>
                      <div className="flex items-center mt-5 border p-3 rounded">
                        <img
                          alt="Blue protective workwear"
                          className="w-14 h-14 mr-4 object-cover"
                          src={
                            selectedMaterial.variantImage ||
                            selectedMaterial.materialImage
                          }
                        />
                        <div className="flex-1">
                          <div className="text-black font-semibold">
                            {selectedMaterial.variantName ||
                              selectedMaterial.materialName}
                          </div>
                          <div className="text-gray-600">
                            {selectedMaterial.materialCode}
                          </div>
                        </div>
                        <div className="text-blue-600 font-semibold">
                          {(
                            selectedMaterial.variantPrice ||
                            selectedMaterial.materialPrice
                          ).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "vnd",
                          })}
                        </div>
                      </div>
                      <div className="mt-5 flex items-center text-black">
                        <h1 className="mr-3">Nhập số lượng:</h1>
                        <input
                          type="number"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="border rounded p-2 w-20"
                          min="0" // Prevent negative input using HTML attributes
                        />
                      </div>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Gửi yêu cầu
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        <div className="col-span-4">
          <Table className="bg-white rounded-sm border ">
            <TableHeader className="bg-blue-200">
              <TableRow className="hover:bg-blue-200">
                <TableHead className="w-[100px] text-black font-bold">
                  Mã
                </TableHead>
                <TableHead className="text-black font-bold">
                  Trạng thái
                </TableHead>
                <TableHead className="text-black font-bold">
                  Tên sản phẩm
                </TableHead>
                <TableHead className="text-right text-black font-bold">
                  Số lượng
                </TableHead>
                <TableHead className="text-right text-black font-bold">
                  Ngày gửi
                </TableHead>
                <TableHead className="text-right text-black font-bold"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {request?.data.map((item) => {
                const { label, color } = getStatusDetails(item.status);

                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.requestCode}
                    </TableCell>
                    <TableCell style={{ color }}>{label}</TableCell>
                    <TableCell>{item.variant || item.material}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity.toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDateTime(item.lastUpdateTime)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === "Processing" && (
                        <AlertDialog>
                          <AlertDialogTrigger>
                            <Button variant="destructive">Hủy</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắc muốn xóa?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancel(item.id)}
                                className="bg-red-500"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {item.status === "Approved" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="bg-green-500 hover:bg-green-600 text-white">
                              Xác nhận
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắc muốn xác nhận?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleConfirm(item.id)}
                                className="bg-green-500"
                              >
                                Xác nhận
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

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

            <div className="ml-5">Có {request?.total} kết quả tìm kiếm</div>
          </div>
        </div>
      </div>
    </div>
  );
}
