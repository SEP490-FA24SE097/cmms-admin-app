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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useGetInvoiceRefund } from "@/lib/actions/invoices/react-query/invoice-quert";
import { useReturnInvoiceContext } from "@/context/refund-context";
export default function ListRefund() {
  const {
    returnInvoices,
    activeReturnInvoiceIndex,
    setActiveReturnInvoiceIndex,
    handleAddReturnInvoice,
    handleRemoveReturnInvoice,
    handleQuantityChange,
    updateQuantity,
    handleRemoveInvoice,
  } = useReturnInvoiceContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState({
    page: currentPage,
    itemPerPage: 10,
  });
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  const { data: refunds, isLoading: isLoadingRefund } =
    useGetInvoiceRefund(searchParams);
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <HiOutlineReceiptRefund />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[1200px] bg-white">
          <DialogHeader>
            <DialogTitle>Chọn hóa đơn trả hàng</DialogTitle>
            <DialogDescription>
              <div className="grid grid-cols-5 grid-rows-1 gap-4">
                <div>1</div>
                <div className="col-span-4">
                  {" "}
                  <div className="mt-3">
                    <Table className="border">
                      <TableHeader className="bg-blue-200 pointer-events-none">
                        <TableRow>
                          <TableHead className="w-[100px] font-bold">
                            Mã hàng
                          </TableHead>
                          <TableHead className="w-[200px] font-bold">
                            Tên hàng
                          </TableHead>
                          <TableHead className="font-bold text-center">
                            Số lượng
                          </TableHead>
                          <TableHead className="font-bold text-center">
                            Đơn giá
                          </TableHead>
                          <TableHead className="font-bold text-center">
                            Giảm giá
                          </TableHead>
                          <TableHead className="font-bold text-center">
                            Giá nhập
                          </TableHead>
                          <TableHead className="font-bold text-right">
                            Thành tiền
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {refunds?.data.map?.((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell className="font-medium">
                              {detail.id}
                            </TableCell>
                            <TableCell className="w-[200px]">
                              {detail.staffName}
                            </TableCell>
                            <TableCell className="text-center">
                              {detail.invoiceStatus}
                            </TableCell>
                            <TableCell className="text-center">
                              {detail.totalAmount.toLocaleString("vi-VN")}
                            </TableCell>
                            <TableCell className="text-center">
                              {detail.totalAmount.toLocaleString("vi-VN")}
                            </TableCell>
                            <TableCell className="text-center">
                              {detail.totalAmount.toLocaleString("vi-VN")}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                onClick={() => handleAddReturnInvoice(detail)}
                              >
                                Nút
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
