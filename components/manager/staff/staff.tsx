import { useGetInvoicePending } from "@/lib/actions/invoices/react-query/invoice-quert";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
type StaffId = {
  id: string; // The type of `id` can be adjusted based on your requirements
};
export default function SaleStaff({ id }: StaffId) {
  const [currentPage, setCurrentPage] = useState(0);

  const [searchParams, setSearchParams] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      "defaultSearch.currentPage": currentPage,
      StaffId: id,
    }));
  }, [currentPage]);

  const { data: saleStaffs, isLoading: isLoadingSaleStaffs } =
    useGetInvoicePending(searchParams);

  const totalPages = saleStaffs?.totalPages || 0;
  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= totalPages - 1) {
      setCurrentPage(page);
    }
  };
  return (
    <div>
      {isLoadingSaleStaffs ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full " />
        </div>
      ) : (
        <div>
          {saleStaffs?.data.map((item, index) => (
            <div>{item.totalAmount}</div>
          ))}
        </div>
      )}
    </div>
  );
}
