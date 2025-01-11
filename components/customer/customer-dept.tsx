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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useGetCustomerTransaction } from "@/lib/actions/customer/react-query/customer-query";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ITransaction } from "@/lib/actions/customer/type/customer";

export default function CustomerDept({ customerId }: any) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction>();
  const [searchParams, setSearchParams] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
    CustomerId: customerId,
  });
  const handleSelectTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
  };
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
      CustomerId: customerId,
    }));
  }, [customerId, currentPage]);

  const { data: transactions, isLoading: isLoadingTransaction } =
    useGetCustomerTransaction(searchParams);
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
  return (
    <div>
      {isLoadingTransaction ? (
        <div className="p-5 space-y-2">
          <Skeleton className="w-full h-[20px] rounded-full" />
          <Skeleton className="w-full h-[20px] rounded-full" />
        </div>
      ) : (
        <Table className="border">
          <TableCaption>Danh sách nợ cần thu của khách hàng.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Mã phiếu</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead className="text-right">Giá trị</TableHead>
              <TableHead className="w-[200px] text-right">
                Dư nợ khách hàng
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Dialog>
                    <DialogTrigger
                      onClick={() => handleSelectTransaction(item)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      {item.id}
                    </DialogTrigger>
                    <DialogContent className="max-w-[1000px] h-[500px]">
                      <DialogHeader>
                        <DialogTitle>Phiếu thu</DialogTitle>
                        <DialogDescription>
                          <div className="grid grid-cols-2 gap-4 mb-4 text-black">
                            <div>
                              <p className="font-semibold">Mã phiếu thu:</p>
                              <p>{item.id}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Chi nhánh:</p>
                              <div className="flex items-center">
                                <p>{item.invoiceVM.storeName}</p>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold">Thời gian:</p>
                              <div className="flex items-center">
                                <p>
                                  {formatDateTime(item.invoiceVM.invoiceDate)}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold">Phương thức:</p>
                              <p>{item.transactionTypeDisplay}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Khách hàng:</p>
                              <p>{item.invoiceVM.userVM?.fullName}</p>
                            </div>
                            <div>
                              <p className="font-semibold">Địa chỉ:</p>
                              <p>
                                {item.invoiceVM.shippingDetailVM?.address ||
                                  "Chưa xác nhận"}
                              </p>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="py-2 px-4 border-b">Ảnh</th>
                                  <th className="py-2 px-4 border-b">
                                    Tên sản phẩm
                                  </th>
                                  <th className="py-2 px-4 border-b">
                                    Giá bán
                                  </th>
                                  <th className="py-2 px-4 border-b">
                                    Số lượng
                                  </th>
                                  <th className="py-2 px-4 border-b">
                                    Tổng tiền
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="border max-h-[170px] overflow-hidden overflow-y-auto">
                                {item.invoiceVM.invoiceDetails.map(
                                  (invoice, index) => (
                                    <tr key={index}>
                                      <td className="py-2 px-4 border-b ">
                                        <img
                                          src={invoice.imageUrl || ""}
                                          className="h-10 w-10 object-cover"
                                          alt=""
                                        />
                                      </td>
                                      <td className="py-2 px-4 border-b">
                                        {invoice.itemName}
                                      </td>
                                      <td className="py-2 px-4 border-b">
                                        {invoice.salePrice.toLocaleString(
                                          "vi-VN"
                                        )}
                                      </td>
                                      <td className="py-2 px-4 border-b">
                                        {invoice.quantity}
                                      </td>
                                      <td className="py-2 px-4 border-b">
                                        {invoice.itemTotalPrice.toLocaleString(
                                          "vi-VN"
                                        )}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="flex justify-between mt-4">
                            <div>
                              <p className="font-semibold">
                                Phí vận chuyển:{" "}
                                <span className="text-black">
                                  {item.invoiceVM.shippingDetailVM?.shippingFee.toLocaleString(
                                    "vi-VN"
                                  )}
                                </span>
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold">
                                Tổng tiền thu:{" "}
                                <span className="text-black">
                                  {item.invoiceVM.salePrice.toLocaleString(
                                    "vi-VN"
                                  )}
                                </span>
                              </p>
                            </div>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{formatDateTime(item.transactionDate)}</TableCell>
                <TableCell>{item.transactionTypeDisplay}</TableCell>
                <TableCell className="text-right">
                  {item.amount.toLocaleString("vi-VN")}
                </TableCell>
                <TableCell className="text-right">
                  {(item.customerCurrentDebt ?? 0).toLocaleString("vi-VN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
