"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoArrowSwitch } from "react-icons/go";
import { CiCircleRemove } from "react-icons/ci";

import { IoIosOptions } from "react-icons/io";
import { HiOutlineReceiptRefund } from "react-icons/hi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useInvoiceContext } from "@/context/invoice-context";
import { signOut, useSession } from "next-auth/react";
import { Material } from "@/lib/actions/material-store/type/material-store";
import { useGetMaterialStore } from "@/lib/actions/material-store/react-query/material-store-qurey";
import { useRouter } from "nextjs-toploader/app";
import { useReturnInvoiceContext } from "@/context/refund-context";
import ListRefund from "./list-refund";

export default function HeaderRefund() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [filteredData, setFilteredData] = useState<Material[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  const { toast } = useToast();
  const storeId = session?.user.user.storeId;
  const [searchParams, setSearchParams] = useState<
    Record<string, string | number | boolean>
  >({
    materialName: searchTerm,
    storeId: storeId || "",
  });

  // Fetch material store list
  const { data: materials, isLoading: isLoadingMaterialData } =
    useGetMaterialStore(searchParams);

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      materialName: searchTerm,
    }));
  }, [searchTerm]);

  const {
    returnInvoices,
    activeReturnInvoiceIndex,
    setActiveReturnInvoiceIndex,
    handleAddReturnInvoice,
    handleDeleteReturnInvoice,
  } = useReturnInvoiceContext();

  const invoiceListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (invoiceListRef.current) {
      // Cuộn tới cuối danh sách hóa đơn
      invoiceListRef.current.scrollTo({
        left: invoiceListRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [returnInvoices]); // Lắng nghe sự thay đổi của invoices

  const handleSelectInvoice = (index: number) => {
    setActiveReturnInvoiceIndex(index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter data and handle undefined case
    const filtered = (materials?.data || []).filter((item) =>
      item.materialName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
    setShowDropdown(value.trim() !== "");
  };
  return (
    <nav className="grid grid-cols-3 grid-rows-1 gap-4 p-2 bg-blue-600 justify-between">
      <div
        ref={invoiceListRef}
        className="flex overflow-hidden overflow-x-auto whitespace-nowrap 
    scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
      >
        {returnInvoices.map((invoice, index) => (
          <Button
            key={index}
            className={`bg-transparent text-white font-bold ml-5 text-lg hover:bg-slate-200 hover:text-black shadow-none pb-2 flex items-center gap-2 ${
              activeReturnInvoiceIndex === index ? "bg-white text-black" : ""
            }`}
            onClick={() => handleSelectInvoice(index)}
          >
            <GoArrowSwitch />
            {invoice.name}
            <div
              className="p-0 m-0 bg-transparent hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteReturnInvoice(invoice.id);
              }}
            >
              <CiCircleRemove
                size={20}
                className="cursor-pointer text-black hover:text-red-500"
              />
            </div>
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-end">
        <div>
          <ListRefund />
        </div>
        <div className="ml-5 flex gap-2 items-center">
          <h1 className="text-white">{session?.user.user.phoneNumber}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-blue-900">
                <IoIosOptions size={30} className="text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push("/order-pending")}>
                Quản lý đơn chờ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
