import { useGetStaff } from "@/lib/actions/staff/react-quert/staff-quert";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import SaleStaff from "./staff";
import ShipperStaff from "./shipper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffDetails from "./detail-staff";

type ManagerListProps = {
  id: number; // The type of `id` can be adjusted based on your requirements
};

export default function ManagerList({ id }: ManagerListProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const [searchParams, setSearchParams] = useState({
    "defaultSearch.currentPage": currentPage,
    "defaultSearch.perPage": 10,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      "defaultSearch.currentPage": currentPage,
      RoleStaff: id,
    }));
  }, [, currentPage]);

  const { data: staffs, isLoading: isLoadingStaffs } =
    useGetStaff(searchParams);

  const totalPages = staffs?.totalPages || 0;
  const handlePageChange = (page: number) => {
    if (page >= 0 && page <= totalPages - 1) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {isLoadingStaffs ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full " />
        </div>
      ) : (
        <div className="border h-auto">
          <div className="grid grid-cols-6 grid-rows-1 gap-4 bg-blue-100 p-3 font-bold">
            <div>Mã nhân viên</div>
            <div>Tên nhân viên</div>
            <div>Ngày sinh</div>
            <div>Email</div>
            <div className="col-span-2 col-start-5">Cửa hàng</div>
          </div>

          {staffs?.data.map((item, index) => (
            <>
              <Accordion type="single" collapsible key={item.id}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    showIcon={false}
                    className={`grid grid-cols-6 grid-rows-1 border-b gap-4 p-3 ${
                      index % 2 !== 0 ? "bg-slate-100" : "bg-white"
                    }`}
                  >
                    <div>{item.id}</div>
                    <div>{item.fullName}</div>
                    <div>{item.dob}</div>
                    <div className="break-words max-w-full">{item.email}</div>
                    <div className="col-span-2 col-start-5">
                      {item.storeName}
                    </div>
                  </AccordionTrigger>
                  {id === 3 && (
                    <AccordionContent className="pb-0">
                      <div className="p-5 border bg-white">
                        <Tabs defaultValue="info" className="w-full">
                          <TabsList>
                            <TabsTrigger value="info">
                              Thông tin chi tiết
                            </TabsTrigger>
                            <TabsTrigger value="inoice">
                              Thông tin hóa đơn
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent className="py-2 space-y-5" value="info">
                            <StaffDetails id={item.id} />
                          </TabsContent>
                          <TabsContent value="inoice">
                            <SaleStaff id={item.id} />
                          </TabsContent>
                        </Tabs>
                      </div>
                    </AccordionContent>
                  )}
                  {id === 6 && (
                    <AccordionContent className="pb-0">
                      <div className="p-5 border bg-white">
                        <Tabs defaultValue="info" className="w-full">
                          <TabsList>
                            <TabsTrigger value="info">
                              Thông tin chi tiết
                            </TabsTrigger>
                            <TabsTrigger value="inoice">
                              Thông tin hóa đơn
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent className="py-2 space-y-5" value="info">
                            <StaffDetails id={item.id} />
                          </TabsContent>
                          <TabsContent value="inoice">
                            <ShipperStaff id={item.id} />
                          </TabsContent>
                        </Tabs>
                      </div>
                    </AccordionContent>
                  )}
                </AccordionItem>
              </Accordion>
            </>
          ))}
        </div>
      )}
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
                  currentPage < totalPages && handlePageChange(currentPage + 1)
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

        <div className="ml-5">Có {staffs?.total} kết quả tìm kiếm</div>
      </div>
    </>
  );
}
