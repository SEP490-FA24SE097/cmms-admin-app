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
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { SubmitRequest } from "@/lib/actions/request/action/request-action";
import { useQueryClient } from "@tanstack/react-query";
import { IRequest } from "@/lib/actions/request/type/request";
import { useGetStore } from "@/lib/actions/store/react-query/store-query";

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

export default function ListRequestAdmin() {
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
  const [filteredData, setFilteredData] = useState<Material[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  const { data: materialsList, isLoading: isLoadingMaterialData } =
    useGetMaterialImport();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter data and handle undefined case
    const filtered = (materialsList?.data || []).filter((item) =>
      item.materialName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
    setShowDropdown(value.trim() !== "");
  };
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams, setSearchParams] = useState({
    page: currentPage,
    itemPerPage: 10,
  });
  const [quantity, setQuantity] = useState<number>(1);

  // Handler to update quantity, ensuring it's non-negative

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null);
  const { data: stores, isLoading: isLoadingStore } = useGetStore();
  const filteredStores = stores?.data?.filter(
    (store) => store.id !== selectedRequest?.storeId
  );
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
  const [isLoadingCreate1, setIsLoadingCreate1] = useState(false);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [selectedStore, setSelectedStore] = useState({ id: "", name: "" });
  const handleSelectRequest = (request: IRequest) => {
    setSelectedRequest(request);
  };
  const [where, setWhere] = useState("kho");
  const handleValueChangeWhre = (value: string) => {
    setWhere(value);
  };
  const handleStoreChange = (value: any) => {
    const selectedStoreObject = stores?.data.find((item) => item.id === value);
    setSelectedStore(selectedStoreObject || { id: "", name: "" }); // Handle potential missing store
  };
  const handleCancel = async () => {
    if (!selectedRequest) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mã yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      fromStoreId: selectedRequest.storeId,
      requestId: selectedRequest.id,
      isApproved: false,
    };

    try {
      setIsLoadingCreate1(true);
      const response = await SubmitRequest(data);
      if (response.success) {
        toast({
          title: "Đã xóa thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        setOpen1(false);
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
      setIsLoadingCreate1(false);
    }
  };
  useEffect(() => {
    if (where === "kho") {
      setSelectedStore({
        id: "",
        name: "",
      });
    }
  }, [where]);
  const handleSubmit = async () => {
    if (!selectedRequest) {
      setIsLoadingCreate(true);
      toast({
        title: "Lỗi",
        description: "Không tìm thấy mã yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }
    const data = {
      fromStoreId: selectedStore.id || null,
      requestId: selectedRequest.id,
      isApproved: true,
    };
    console.log(data);
    try {
      const response = await SubmitRequest(data);
      if (response.success) {
        toast({
          title: "Cập nhật thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        setOpen(false);
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
      setIsLoadingCreate(false);
    }
  };
  return (
    <div className="w-[80%] mx-auto mt-5">
      <div className="flex gap-4">
        <div className="text-2xl font-bold">Danh sách yêu cầu</div>
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
          <Table className="bg-white rounded-sm shadow-lg border">
            <TableHeader className="bg-blue-200">
              <TableRow className="hover:bg-blue-200">
                <TableHead className="w-[100px] font-bold">Mã</TableHead>
                <TableHead className="font-bold">Trạng thái</TableHead>
                <TableHead className="font-bold">Tên sản phẩm</TableHead>
                <TableHead className="font-bold">Chi nhánh</TableHead>
                <TableHead className="text-right font-bold">Ngày gửi</TableHead>
                <TableHead className="text-right font-bold">SL</TableHead>
                <TableHead className="text-right font-bold"></TableHead>
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
                    <TableCell>{item.store}</TableCell>
                    <TableCell className="text-right">
                      {formatDateTime(item.lastUpdateTime)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status !== "Processing" ? (
                        ""
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogTrigger>
                              <Button
                                onClick={() => handleSelectRequest(item)}
                                className="bg-green-500 text-white hover:bg-green-600"
                              >
                                Chấp nhận
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  <div className="space-y-5">
                                    <div className="flex justify-between items-center gap-5">
                                      <h1>Nhập hàng cho: </h1>
                                      <Select
                                        onValueChange={handleValueChangeWhre}
                                        value={where}
                                      >
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Nhập tại" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="kho">
                                              Kho tổng
                                            </SelectItem>
                                            <SelectItem value="store">
                                              Cửa hàng
                                            </SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {where === "store" && (
                                      <div className="flex justify-between items-center gap-5">
                                        <h1>Cửa hàng: </h1>
                                        <Select
                                          onValueChange={handleStoreChange}
                                          value={selectedStore.id}
                                        >
                                          <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Cửa hàng">
                                              {filteredStores === null
                                                ? "Đang tải..."
                                                : selectedStore.name ||
                                                  "Chọn cửa hàng"}
                                            </SelectValue>
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              {filteredStores?.map((item) => (
                                                <SelectItem
                                                  key={item.id}
                                                  value={item.id}
                                                >
                                                  {item.name}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleSubmit()}
                                  className="bg-blue-500"
                                >
                                  Cập nhật
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog open={open1} onOpenChange={setOpen1}>
                            <AlertDialogTrigger>
                              <Button
                                onClick={() => handleSelectRequest(item)}
                                variant="destructive"
                              >
                                Hủy
                              </Button>
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
                                  onClick={() => handleCancel()}
                                  className="bg-red-500"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
