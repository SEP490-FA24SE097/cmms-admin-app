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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { useGetImport } from "@/lib/actions/import/react-quert/import-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useGetInvoicePending } from "@/lib/actions/invoices/react-query/invoice-quert";
import { IInvoices } from "@/lib/actions/invoices/type/invoice-type";
import { useGetShipper } from "@/lib/actions/shipper/react-query/shipper-query";
import { useToast } from "@/hooks/use-toast";
import { createQuickPayment } from "@/lib/actions/quick-payment/quick-payment";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
export default function OrderPending() {
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoices | null>(
    null
  );

  const handleViewInvoice = (customer: IInvoices) => {
    setSelectedInvoice(customer);
  };
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

  const { data: shippers, isLoading: isLoadingShipper } = useGetShipper();
  const [selectedShipper, setSelectedShipper] = useState({
    id: "",
    fullName: "",
  });
  const handleShipChange = (value: any) => {
    const selectedShipObject = shippers?.data.find((item) => item.id === value);
    setSelectedShipper(selectedShipObject || { id: "", fullName: "" }); // Handle potential missing store
  };
  const [currentPage, setCurrentPage] = useState(0);

  const [searchParams, setSearchParams] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
    InvoiceStatus: 0,
    "defaultSearch.sortBy": "invoiceDate",
    "defaultSearch.isAscending": false,
  });
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      "defaultSearch.currentPage": currentPage,
    }));
  }, [currentPage]);

  const { data: suppliers, isLoading: isLoadingSuplier } = useGetSuplier();
  const { data: orderPendings, isLoading: isLoadingOrderPending } =
    useGetInvoicePending(searchParams);
  const totalPages = orderPendings?.totalPages || 0;
  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Update state when selectedInvoice changes
  useEffect(() => {
    if (selectedInvoice) {
      setPhone(selectedInvoice.shippingDetailVM.phoneReceive || ""); // Use empty string if null
      setAddress(selectedInvoice.shippingDetailVM.address || ""); // Use empty string if null
    }
  }, [selectedInvoice]);

  // Handle changes in the phone input
  const handlePhoneChange = (event: any) => {
    setPhone(event.target.value);
  };

  // Handle changes in the address input
  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  };
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const handlePaymentClick = async () => {
    if (!selectedShipper.id) {
      toast({
        title: "Vui lòng chọn shipper",
        description: "Hãy chọn shipper",
        variant: "destructive",
      });
      return;
    }

    const result = {
      address: address,
      phoneReceive: phone,
      salePrice: selectedInvoice?.salePrice,
      discount: selectedInvoice?.discount,
      totalAmount: selectedInvoice?.totalAmount,
      customerPaid: selectedInvoice?.customerPaid,
      invoiceId: selectedInvoice?.id,
      shipperId: selectedShipper.id,
      invoiceType: 1,
    };

    // If validation passes, proceed with the API call
    try {
      setIsLoadingPayment(true);
      const response = await createQuickPayment(result);

      // Check if the response indicates success
      if (response.data?.success) {
        toast({
          title: "Cập nhật thành công",
          description: "Đã cập nhật đơn hàng thành công!",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });
        setPhone("");
        setIsLoadingPayment(false);
        queryClient.invalidateQueries({
          queryKey: ["INVOICE_PENDING_LIST", searchParams],
        });
      } else {
        // Handle cases where the response indicates failure
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
        setIsLoadingPayment(false);
        console.error("Unexpected Payment Response:", response);
      }
    } catch (error) {
      // Handle network or unexpected errors
      toast({
        title: "Lỗi",
        description: "Thanh toán thất bại. Vui lòng thử lại.",
        variant: "destructive",
      });
      setIsLoadingPayment(false);
      console.error("Payment failed with exception:", error);
    }
  };

  return (
    <div className="w-[80%] mx-auto mt-5">
      <div className="flex justify-center p-5">
        <div className="text-2xl font-bold">Đơn hàng đang chờ xử lý</div>
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
            <div className="grid grid-cols-4 grid-rows-1 gap-4 bg-blue-100 p-3 font-bold">
              <div>Mã đơn hàng</div>
              <div>Thời gian dự kiến</div>
              <div className="">Tên người mua</div>
              <div className="">Tổng tiền</div>
            </div>
            {orderPendings?.data.map((item, index) => (
              <Accordion type="single" collapsible key={item.id}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    showIcon={false}
                    className={`grid grid-cols-4 grid-rows-1  gap-4 p-3 ${
                      index % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div>{item.id}</div>
                    <div>{formatDateTime(item.invoiceDate)}</div>

                    <div className="">{item.userVM.fullName}</div>
                    <div className="">
                      {item.totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "vnd",
                      })}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="p-5 border bg-white">
                      <h1 className="font-bold text-xl">Thông tin chi tiết</h1>
                      <div className="grid grid-cols-3 grid-rows-1 gap-4 mt-5">
                        <div className="col-span-2 space-y-3">
                          <div className="flex gap-10 items-center">
                            <div className="flex-1 flex gap-5 border-b p-2">
                              <div className="flex gap-5">
                                <div>Mã nhập hàng:</div>
                                <div className="font-bold">{item.id}</div>
                              </div>
                            </div>
                            <div className="flex-1 flex gap-5 border-b p-2">
                              <div className="flex gap-5">
                                <div>Tên khách hàng:</div>
                                <div className="capitalize">
                                  {item.userVM.fullName}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-10 items-center">
                            <div className="flex-1 flex gap-5 border-b p-2">
                              <div className="flex gap-5">
                                <div>Thời gian đặt:</div>
                                <div> {formatDateTime(item.invoiceDate)}</div>
                              </div>
                            </div>
                            <div className="flex-1 flex gap-5 border-b p-2">
                              <div className="flex gap-5">
                                <div>Dự kiến giao:</div>
                                <div className="">
                                  {formatDateTime(
                                    item.shippingDetailVM.estimatedArrival
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-10 items-center">
                            <div className="w-full flex gap-5 border-b p-2">
                              <div>Địa chỉ giao hàng:</div>
                              <div className="">
                                {item.shippingDetailVM.address}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-10 items-center">
                            <div className="flex w-full gap-5 border-b p-2">
                              <div>Ghi chú:</div>
                              <div>{item.note}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-start-3 pr-5 space-y-5">
                          <div className="flex gap-5 justify-end">
                            <h1>Tổng tiền hàng:</h1>
                            <h1>
                              {item.totalAmount?.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "vnd",
                              })}
                            </h1>
                          </div>
                          <div className="flex gap-5 justify-end">
                            <h1>Giảm giá:</h1>
                            <h1>
                              {item.discount?.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "vnd",
                              })}
                            </h1>
                          </div>
                          <div className="flex gap-5 justify-end">
                            <h1>Phí vận chuyển:</h1>
                            <h1>
                              {item.shippingDetailVM.shippingFee?.toLocaleString(
                                "vi-VN",
                                {
                                  style: "currency",
                                  currency: "vnd",
                                }
                              )}
                            </h1>
                          </div>
                          <div className="flex gap-5 justify-end">
                            <h1 className="font-bold text-xl">Tổng cộng:</h1>
                            <h1 className="font-bold text-xl">
                              {item.salePrice?.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "vnd",
                              })}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Table className="border">
                          <TableHeader className="bg-blue-200 pointer-events-none">
                            <TableRow>
                              <TableHead className="w-[100px]">
                                Hỉnh ảnh
                              </TableHead>
                              <TableHead className="w-[300px]">
                                Tên sản phẩm
                              </TableHead>
                              <TableHead className="text-center">
                                Số lượng
                              </TableHead>
                              <TableHead className="text-center">
                                Giá bán
                              </TableHead>
                              <TableHead className="text-center">
                                Thành tiền
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {item.invoiceDetails?.map((detail) => (
                              <TableRow key={detail.materialId}>
                                <TableCell>
                                  {detail.imageUrl ? (
                                    <img
                                      src={detail.imageUrl}
                                      className="h-14 w-14 object-cover"
                                      alt="image"
                                    />
                                  ) : (
                                    <span>No image available</span> // or any fallback content
                                  )}
                                </TableCell>
                                <TableCell className="w-[300px] capitalize">
                                  {detail.itemName}
                                </TableCell>
                                <TableCell className="text-center">
                                  {detail.quantity}
                                </TableCell>
                                <TableCell className="text-center">
                                  {detail.salePrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "vnd",
                                  })}
                                </TableCell>
                                <TableCell className="text-center">
                                  {detail.itemTotalPrice.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "vnd",
                                    }
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => handleViewInvoice(item)}
                              className="bg-blue-500"
                            >
                              Cập nhật đơn hàng
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Cập nhật thông tin đơn hàng
                              </DialogTitle>
                              <DialogDescription className="text-black">
                                <div className="flex gap-5 items-center">
                                  <h1 className="">Số điện thoại: </h1>
                                  <input
                                    className="border p-2"
                                    type="text"
                                    value={phone}
                                    onChange={handlePhoneChange} // Update state on change
                                    name="phone"
                                    id="phone"
                                  />
                                </div>
                                <div className="mt-5 items-center">
                                  <h1 className="">Địa chỉ:</h1>
                                  <input
                                    className="w-full mt-5 p-2 border"
                                    type="text"
                                    value={address || ""}
                                    onChange={handleAddressChange} // Update state on change
                                    name="address"
                                    id="address"
                                  />
                                </div>
                                <div>
                                  <h1 className="mt-5">
                                    Chọn nhân viên giao hàng
                                  </h1>
                                  <div className="mt-5">
                                    <Select
                                      onValueChange={handleShipChange}
                                      value={selectedShipper.id}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Nhân viên giao hàng">
                                          {shippers?.data === null
                                            ? "Đang tải..."
                                            : selectedShipper.fullName ||
                                              "Nhân viên giao hàng"}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {shippers?.data?.map((item) => (
                                            <SelectItem
                                              key={item.id}
                                              value={item.id}
                                            >
                                              {item.fullName}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    <div className="flex justify-end mt-5 ">
                                      {isLoadingPayment ? (
                                        <Button
                                          className="text-2xl font-bold w-full py-10"
                                          disabled
                                        >
                                          <Loader2 className="animate-spin" />
                                          Đang tải...
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={handlePaymentClick}
                                          className="text-2xl font-bold w-full py-10 bg-blue-500 text-white hover:bg-blue-700"
                                        >
                                          Xử lý
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
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
                      currentPage > 0 && handlePageChange(currentPage - 1)
                    }
                    aria-disabled={currentPage === 0}
                    className={
                      currentPage === 0
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  >
                    Previous
                  </PaginationPrevious>
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
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
                      currentPage < totalPages - 1 &&
                      handlePageChange(currentPage + 1)
                    }
                    aria-disabled={currentPage === totalPages - 1}
                    className={
                      currentPage === totalPages - 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  >
                    Next
                  </PaginationNext>
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="ml-5">
              Có {orderPendings?.total} kết quả tìm kiếm
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
