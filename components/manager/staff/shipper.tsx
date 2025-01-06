import { useGetInvoicePending } from "@/lib/actions/invoices/react-query/invoice-quert";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaEye } from "react-icons/fa6";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useShippoing } from "@/lib/actions/delivery/react-query/delivery-query";
import { cn } from "@/lib/utils";

type StaffId = {
  id: string; // The type of `id` can be adjusted based on your requirements
};
const getInvoiceStatus = (
  status: number
): { text: string; className: string } => {
  switch (status) {
    case 0:
      return { text: "Đang chờ", className: "text-yellow-600" }; // Màu vàng
    case 1:
      return { text: "Đã phê duyệt", className: "text-blue-600" }; // Màu xanh
    case 2:
      return { text: "Đang vận chuyển", className: "text-orange-600" }; // Màu cam
    case 3:
      return { text: "Hoàn tất", className: "text-green-600" }; // Màu xanh lá
    case 4:
      return { text: "Hủy", className: "text-red-600" }; // Màu đỏ
    case 5:
      return { text: "Hoàn tiền", className: "text-purple-600" }; // Màu tím
    case 6:
      return { text: "Không nhận hàng", className: "text-red-600" }; // Màu đỏ
    default:
      return { text: "Không xác định", className: "text-gray-600" }; // Màu xám
  }
};
export default function ShipperStaff({ id }: StaffId) {
  const [currentPage, setCurrentPage] = useState(0);

  const [searchParams, setSearchParams] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
  });
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
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      "defaultSearch.currentPage": currentPage,
      ShipperId: id,
    }));
  }, [currentPage]);

  const { data: saleStaffs, isLoading: isLoadingSaleStaffs } =
    useShippoing(searchParams);

  const totalPages = saleStaffs?.totalPages || 0;
  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= totalPages - 1) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {isLoadingSaleStaffs ? (
        <div className="space-y-2 bg-white p-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full " />
        </div>
      ) : (
        <div className="bg-white p-2">
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Mã đơn hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saleStaffs?.data.map((item, index) => {
                const { text, className } = getInvoiceStatus(
                  item.invoice.invoiceStatus
                );

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {item.invoice.id}
                    </TableCell>
                    <TableCell>
                      <span className={className}>{text}</span>{" "}
                      {/* Hiển thị trạng thái */}
                    </TableCell>
                    <TableCell>{item.invoice.userVM.fullName}</TableCell>
                    <TableCell>
                      {item.invoice.totalAmount.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                    <TableCell>
                      {(item.invoice.discount || 0).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                    <TableCell>
                      {(item.invoice.salePrice || 0).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger>
                          <FaEye />
                        </DialogTrigger>
                        <DialogContent className="max-w-[800px]">
                          <DialogHeader>
                            <DialogTitle>Thông tin chi tiết?</DialogTitle>
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <p>
                                    <strong>Mã đặt hàng:</strong>{" "}
                                    {item.invoice.id}
                                  </p>
                                  <p>
                                    <strong>Khách hàng:</strong>{" "}
                                    {item.invoice.userVM.fullName}
                                  </p>
                                  <p>
                                    <strong>Tổng tiền:</strong>{" "}
                                    {item.invoice.totalAmount.toLocaleString(
                                      "vi-VN",
                                      {
                                        style: "currency",
                                        currency: "vnd",
                                      }
                                    )}
                                  </p>
                                  <p>
                                    <strong>Trạng thái:</strong>{" "}
                                    <span className={className}>{text}</span>
                                  </p>
                                  <p>
                                    <strong>Ngày đã giao:</strong>{" "}
                                    {item.shippingDate
                                      ? formatDateTime(item?.shippingDate)
                                      : "Chưa giao hàng"}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <p>
                                    <strong>Nhận hàng tại:</strong>{" "}
                                    {item.invoice.storeId} -{" "}
                                    {item.invoice.storeName}
                                  </p>
                                  <p>
                                    <strong>Thời gian:</strong>{" "}
                                    {formatDateTime(item.invoice.invoiceDate)}
                                  </p>
                                  <p>
                                    <strong>Ngày giao dự kiến:</strong>{" "}
                                    {formatDateTime(item?.estimatedArrival)}
                                  </p>
                                  <p>
                                    <strong>Mua tại:</strong>{" "}
                                    {item.invoice.buyIn}
                                  </p>
                                </div>
                              </div>
                              <div className="border rounded max-h-[250px] overflow-y-auto overflow-hidden">
                                <table className="min-w-full bg-white">
                                  <thead>
                                    <tr className="bg-blue-100">
                                      <th className="py-2 px-4 border-b text-center">
                                        Hình ảnh
                                      </th>
                                      <th className="py-2 px-4 border-b text-center">
                                        Tên hàng
                                      </th>
                                      <th className="py-2 px-4 border-b text-center">
                                        Số lượng
                                      </th>
                                      <th className="py-2 px-4 border-b text-center">
                                        Giá bán
                                      </th>
                                      <th className="py-2 px-4 border-b text-center">
                                        Thành tiền
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item.invoice.invoiceDetails.map(
                                      (product, index) => (
                                        <tr
                                          key={index}
                                          className="h-9 bg-green-100"
                                        >
                                          <td className="py-2 px-4 border-b text-center">
                                            <img
                                              src={product.imageUrl || ""}
                                              className="w-10 h-10 object-cover mx-auto"
                                              alt=""
                                            />
                                          </td>
                                          <td className="py-2 px-4 border-b text-center">
                                            {product.itemName}
                                          </td>
                                          <td className="py-2 px-4 border-b text-center">
                                            {product.quantity}
                                          </td>
                                          <td className="py-2 px-4 border-b text-center">
                                            {product.salePrice.toLocaleString(
                                              "vi-VN",
                                              {
                                                style: "currency",
                                                currency: "vnd",
                                              }
                                            )}
                                          </td>
                                          <td className="py-2 px-4 border-b text-center">
                                            {product.itemTotalPrice.toLocaleString(
                                              "vi-VN",
                                              {
                                                style: "currency",
                                                currency: "vnd",
                                              }
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <div className="mt-4">
                                <div className="flex gap-10">
                                  <p>
                                    <strong>Tổng tiền hàng:</strong>{" "}
                                    {item.invoice.totalAmount.toLocaleString(
                                      "vi-VN",
                                      {
                                        style: "currency",
                                        currency: "vnd",
                                      }
                                    )}
                                  </p>
                                  <p>
                                    <strong>Giảm giá:</strong>{" "}
                                    {item.invoice.discount !== null
                                      ? item.invoice.discount.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "vnd",
                                          }
                                        )
                                      : "0 ₫"}
                                  </p>
                                  <p>
                                    <strong>Khác hàng đã trả trước:</strong>{" "}
                                    {item.invoice.customerPaid !== null
                                      ? item.invoice.customerPaid.toLocaleString(
                                          "vi-VN",
                                          {
                                            style: "currency",
                                            currency: "vnd",
                                          }
                                        )
                                      : "0 ₫"}
                                  </p>
                                </div>
                                <p>
                                  <strong>Tiền cần thu:</strong>{" "}
                                  {item.invoice.needToPay !== null
                                    ? item.invoice.needToPay.toLocaleString(
                                        "vi-VN",
                                        {
                                          style: "currency",
                                          currency: "vnd",
                                        }
                                      )
                                    : "0"}
                                </p>
                              </div>
                            </div>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="my-2 flex items-center">
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
              Có {saleStaffs?.total} kết quả tìm kiếm
            </div>
          </div>
        </div>
      )}
     
    </div>
    
  );
}
