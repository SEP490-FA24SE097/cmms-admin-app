"use client";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
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
import { GiConfirmed } from "react-icons/gi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { CalendarIcon, Loader2 } from "lucide-react";
import { useGetSuplier } from "@/lib/actions/supplier/react-query/supplier-query";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RxUpdate } from "react-icons/rx";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useGetNotes } from "@/lib/actions/notes/react-query/note-query";
import { UpdateTracking } from "@/lib/actions/notes/action/note-action";

export default function ListNotes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [loadingS, setLoadingS] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [selectMaterialId, setSelectMaterialId] = useState("");
  const [selectVariantId, setSelectVariantId] = useState("");
  const [quantityInReality, setQuantityInReality] = useState(0);
  const [selectedSupplier, setSelectSuplier] = useState({ id: "", name: "" });
  const handleSupllierChange = (value: any) => {
    const selectedStoreObject = suppliers?.data.find(
      (item) => item.id === value
    );
    setSelectSuplier(selectedStoreObject || { id: "", name: "" });
  };
  const handleChangeQuantity = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Number(event.target.value));
    setQuantityInReality(value);
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
  const StoreId = session?.user.user.storeId || "";
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
  const { data: notes, isLoading: isLoadingNote } = useGetNotes(searchParams);
  const totalPages = notes?.totalPages || 1;
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleUpdateStock = async (quantitySystem: number) => {
    if (!quantityInReality) {
      toast({
        title: "Lỗi",
        description: "Không được để trống.",
        variant: "destructive",
      });
      return;
    }
    const data = {
      storeId: StoreId || null,
      materialId: selectMaterialId,
      quantityInSystem: quantitySystem,
      quantityInReality: quantityInReality,
      ...(selectVariantId && { variantId: selectVariantId }),
    };

    setLoadingS(true);

    try {
      const result = await UpdateTracking(data);
      if (result.success) {
        toast({
          title: "Thành công",
          description: "Cập nhật định mức thành công.",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        queryClient.invalidateQueries({
          queryKey: ["NOTE_LIST"],
        });
        setOpenS(false);
      } else {
        toast({
          title: "Lỗi",
          description: result.error || "Có lỗi xảy ra khi cập nhật định mức.",
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
      setLoadingS(false);
    }
  };
  return (
    <div className="w-[90%] mx-auto mt-5">
      <div className="grid grid-cols-5 grid-rows-1 gap-4">
        <div className="text-2xl font-bold">Quản lý phiếu</div>
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
              <Dialog>
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
                  </DialogOverlay>
                </DialogContent>
              </Dialog>
              <Link href="/manage/materials/update-material">
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
        <div className="col-span-4">
          <div className="border h-auto shadow-lg">
            <div className="grid grid-cols-4 grid-rows-1 gap-4 bg-blue-100 p-3 font-bold">
              <div>Mã phiếu</div>
              <div>Loại phiếu</div>
              <div>Số lượng</div>
              <div>Thời gian</div>
            </div>
            {notes?.data.map((item, index) => (
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    showIcon={false}
                    className={`grid grid-cols-4 grid-rows-1 gap-4 p-3 ${
                      index % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    {" "}
                    <div>{item.noteCode}</div>
                    <div>{item.type}</div>
                    <div>{item.totalQuantity}</div>
                    <div>{formatDateTime(item.timeStamp)}</div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="p-2 border bg-white ">
                      <h1 className="my-2 font-bold text-xl">
                        Thông tin chi tiết
                      </h1>
                      <div className="grid grid-cols-2 grid-rows-1 p-2 gap-4">
                        <div className="flex gap-2 border-b pb-2">
                          <h1 className="font-bold">Mã phiếu</h1>
                          <h1>{item.noteCode}</h1>
                        </div>
                        <div className="flex gap-2 border-b pb-2">
                          <h1 className="font-bold">Mô tả:</h1>
                          <h1>{item.reasonDescription}</h1>
                        </div>
                      </div>
                      <div>
                        <Table className="border">
                          <TableHeader className="bg-blue-200">
                            <TableRow>
                              <TableHead className="w-[100px]">STT</TableHead>
                              <TableHead>Loại phiếu</TableHead>
                              <TableHead>Tên</TableHead>
                              <TableHead className="text-right">
                                Số lượng
                              </TableHead>
                              <TableHead className="text-right">
                                Số lượng
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {item.details.map((detail, index) => (
                              <TableRow key={detail.id}>
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell>{item.type}</TableCell>
                                <TableCell>
                                  {detail.sku || detail.materialName}
                                </TableCell>
                                <TableCell className="text-right">
                                  {detail.quantity.toLocaleString("vi-VN")}
                                </TableCell>
                                <TableCell className="text-right">
                                  <AlertDialog
                                    open={openS}
                                    onOpenChange={setOpenS}
                                  >
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        onClick={() => {
                                          setSelectMaterialId(
                                            detail.materialId
                                          );
                                          setSelectVariantId(
                                            detail.variantId || ""
                                          );
                                        }}
                                        className="text-blue-500 hover:text-blue-600"
                                      >
                                        <GiConfirmed size={25} />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Cập nhật định mức
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="space-y-5">
                                          <div className="flex gap-2 text-black items-center">
                                            <h1 className="w-40 font-bold">
                                              Số lượng trên hệ thống:
                                            </h1>
                                            <Input
                                              type=""
                                              readOnly
                                              value={detail.quantity ?? ""}
                                            />
                                          </div>
                                          <div className="flex gap-2 text-black items-center">
                                            <h1 className="w-40 font-bold">
                                              Số lượng nhận thực tế:
                                            </h1>
                                            <Input
                                              type="number"
                                              placeholder="Nhập định mức tối đa"
                                              value={quantityInReality ?? ""} // Use an empty string if discount is undefined
                                              onChange={handleChangeQuantity}
                                            />
                                          </div>
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Hủy
                                        </AlertDialogCancel>
                                        {loadingS ? (
                                          <Button>
                                            <Loader2 /> Đang xử lý...
                                          </Button>
                                        ) : (
                                          <Button
                                            onClick={() =>
                                              handleUpdateStock(detail.quantity)
                                            }
                                          >
                                            Xác nhận
                                          </Button>
                                        )}
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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

            <div className="ml-5">Có {notes?.total} kết quả tìm kiếm</div>
          </div>
        </div>
      </div>
    </div>
  );
}
