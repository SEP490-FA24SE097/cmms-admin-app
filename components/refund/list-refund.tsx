import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FaCalendarAlt } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useGetInvoiceRefund } from "@/lib/actions/invoices/react-query/invoice-quert";
import { useReturnInvoiceContext } from "@/context/refund-context";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
export default function ListRefund() {
  const {
    returnInvoices,
    activeReturnInvoiceIndex,
    setActiveReturnInvoiceIndex,
    handleAddReturnInvoice,
  } = useReturnInvoiceContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDate2, setSelectedDate2] = useState<Date | null>(null);

  const handleChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const handleChange2 = (date: Date | null) => {
    setSelectedDate2(date);
  };
  const [nameCus, setNameCus] = useState("");
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameCus(e.target.value);
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
  const [searchParams, setSearchParams] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      "defaultSearch.currentPage": currentPage,
      CustomerName: nameCus,
      FromDate: selectedDate ? format(selectedDate, "MM/dd/yyyy") : null,
      ToDate: selectedDate2 ? format(selectedDate2, "MM/dd/yyyy") : null,
    }));
  }, [currentPage, nameCus, selectedDate, selectedDate2]);

  const { data: refunds, isLoading: isLoadingRefund } =
    useGetInvoiceRefund(searchParams);

  const totalPages = refunds?.totalPages || 0;
  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= totalPages - 1) {
      setCurrentPage(page);
    }
  };
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="hover:bg-blue-500 text-white">
            <HiOutlineReceiptRefund size={25} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[1200px] bg-slate-100">
          <DialogHeader>
            <DialogTitle>Chọn hóa đơn trả hàng</DialogTitle>
            <DialogDescription>
              <div className="grid grid-cols-5 grid-rows-1 gap-4">
                <div className="space-y-5">
                  <div className="bg-white shadow-xl rounded-md mt-3 p-2 text-black">
                    <h1 className="font-bold text-xl">Tìm kiếm</h1>
                    <div className="mt-3">
                      <input
                        type="text"
                        className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none"
                        placeholder="Tên khách hàng"
                        value={nameCus}
                        onChange={handleChangeName}
                      />
                    </div>
                  </div>
                  <div className="bg-white shadow-xl rounded-md mt-3 p-2 text-black">
                    <h1 className="font-bold text-xl">Thời gian</h1>
                    <div className="mt-3 space-y-2">
                      <div>
                        <h1>Từ ngày:</h1>
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleChange}
                          dateFormat="dd/MM/yyyy" // Định dạng ngày
                          locale={vi} // Sử dụng ngôn ngữ tiếng Việt
                          className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none "
                          placeholderText="Chọn ngày"
                        />
                      </div>
                      <div>
                        <h1>Đến ngày ngày:</h1>
                        <DatePicker
                          selected={selectedDate2}
                          onChange={handleChange2}
                          dateFormat="dd/MM/yyyy" // Định dạng ngày
                          locale={vi} // Sử dụng ngôn ngữ tiếng Việt
                          className="w-full border-b-2 border-gray-300 focus:border-green-500 outline-none "
                          placeholderText="Chọn ngày"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-4">
                  {" "}
                  <div className="mt-3">
                    <Table className="border bg-white shadow-lg">
                      <TableHeader className="bg-blue-200 pointer-events-none">
                        <TableRow>
                          <TableHead className="w-[100px] font-bold">
                            Mã hóa đơn
                          </TableHead>
                          <TableHead className="font-bold">Thời gian</TableHead>
                          <TableHead className="font-bold ">
                            Nhân viên
                          </TableHead>
                          <TableHead className="font-bold ">
                            Khách hàng
                          </TableHead>
                          <TableHead className="font-bold text-center">
                            Tổng cộng
                          </TableHead>
                          <TableHead className="font-bold text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoadingRefund && (
                          <div className="w-full h-full flex justify-center items-center">
                            <Loader2 />
                          </div>
                        )}
                        {refunds?.data.map?.((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell className="font-medium">
                              {detail.id}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(detail.invoiceDate)}
                            </TableCell>
                            <TableCell>{detail.staffName || ""}</TableCell>
                            <TableCell>{detail.userVM.fullName}</TableCell>
                            <TableCell className="text-center">
                              {detail.totalAmount.toLocaleString("vi-VN")}
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                onClick={() => handleAddReturnInvoice(detail)}
                              >
                                Chọn
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center items-center">
                <Pagination className={cn("justify-center w-auto mx-0")}>
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

                <div className="ml-5">Có {refunds?.total} kết quả tìm kiếm</div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
