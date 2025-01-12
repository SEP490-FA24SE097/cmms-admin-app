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
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useShippingConfig } from "@/lib/actions/dataconfig/react-query/config-query";
import { CreateConfigShip } from "@/lib/actions/dataconfig/action/config-action";

export default function ListConfigAdmin() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  const [formData, setFormData] = useState({
    baseFee: 0,
    first5KmFree: 0,
    additionalKmFee: 0,
    first10KgFee: 0,
    additionalKgFee: 0,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = Number(value);

    // Đảm bảo giá trị không nhỏ hơn 0
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue < 0 ? 0 : numericValue,
    }));
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
  const [searchParamsS, setSearchParamS] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
  });

  useEffect(() => {
    setSearchParamS((prev) => ({
      ...prev,
      "defaultSearch.currentPage": currentPage,
    }));
  }, [currentPage]);

  const { data: shipConfigs, isLoading: isLoadingShipconfig } =
    useShippingConfig(searchParamsS);

  const totalPages = shipConfigs?.totalPages || 1;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const isInvalid = Object.values(formData).every((value) => value === 0);

    if (isInvalid) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập giá trị lớn hơn 0 cho tất cả các trường!",
        variant: "destructive",
      });
      return;
    }

    const data = {
      baseFee: formData.baseFee,
      first5KmFree: formData.first5KmFree,
      additionalKmFee: formData.additionalKmFee,
      first10KgFee: formData.first10KgFee,
      additionalKgFee: formData.additionalKgFee,
    };

    try {
      setIsLoadingCreate(true);
      const response = await CreateConfigShip(data);
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
          queryKey: ["SHIPPING_CONFIG_LIST", searchParamsS],
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

  return (
    <div className="w-[80%] mx-auto mt-5">
      <div className="flex justify-between gap-4">
        <div className="text-2xl font-bold">Danh sách yêu cầu</div>
        <div className="">
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button className="bg-blue-500 text-white hover:bg-blue-600">
                <FaPlus /> Tạo giá ship
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tạo giá Vận chuyển</AlertDialogTitle>
                <AlertDialogDescription>
                  <div>
                    <div className="mb-4 flex gap-5 items-center">
                      <label className="block w-[150px] text-black">
                        Giá Cơ bản:
                      </label>
                      <input
                        name="baseFee"
                        value={formData.baseFee}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                        type="number"
                      />
                    </div>
                    <div className="mb-4 flex gap-5 items-center">
                      <label className="block w-[150px] text-black">
                        Giá 5Km đầu:
                      </label>
                      <input
                        name="first5KmFree"
                        value={formData.first5KmFree}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                        type="number"
                      />
                    </div>
                    <div className="mb-4 flex gap-5 items-center">
                      <label className="block w-[150px] text-black">
                        Giá những km sau:
                      </label>
                      <input
                        name="additionalKmFee"
                        value={formData.additionalKmFee}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                        type="number"
                      />
                    </div>
                    <div className="mb-4 flex gap-5 items-center">
                      <label className="block w-[150px] text-black">
                        Giá 10kg Đầu:
                      </label>
                      <input
                        name="first10KgFee"
                        value={formData.first10KgFee}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                        type="number"
                      />
                    </div>
                    <div className="mb-4 flex gap-5 items-center">
                      <label className="block w-[150px] text-black">
                        Giá những kg sau:
                      </label>
                      <input
                        name="additionalKgFee"
                        value={formData.additionalKgFee}
                        onChange={handleInputChange}
                        className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                        type="number"
                      />
                    </div>
                  </div>
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
        </div>
        <div className="col-span-4">
          <Table className="bg-white rounded-sm border ">
            <TableHeader className="bg-blue-200">
              <TableRow className="hover:bg-blue-200">
                <TableHead className="w-[100px] text-black font-bold">
                  STT
                </TableHead>
                <TableHead className="text-black font-bold">5Km đầu</TableHead>
                <TableHead className="text-black font-bold">
                  Km bổ sung
                </TableHead>
                <TableHead className=" text-black font-bold">
                  10Kg đầu
                </TableHead>
                <TableHead className="text-right text-black font-bold">
                  Kg bổ sung
                </TableHead>
                <TableHead className="text-right text-black font-bold">
                  Thời gian
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipConfigs?.data.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item.first5KmFree.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {(item.additionalKmFee || 0).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {(item.first10KgFee || 0).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {(item.additionalKgFee || 0).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatDateTime(item.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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

            <div className="ml-5">Có {shipConfigs?.total} kết quả tìm kiếm</div>
          </div>
        </div>
      </div>
    </div>
  );
}
