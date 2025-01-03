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
                          <div className="grid grid-cols-3 grid-rows-1 gap-4 mt-2 text-black">
                            <div className="grid grid-cols-5 grid-rows-1 gap-4 font-bold">
                              <div className="col-span-2">Mã phiếu thu:</div>
                              <div className="col-span-3 col-start-3">
                                {selectedTransaction?.id}
                              </div>
                            </div>
                            <div>2</div>
                            <div>3</div>
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
