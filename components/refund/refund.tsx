"use client";

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { Button } from "@/components/ui/button";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { Textarea } from "@/components/ui/textarea";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Invoice, useInvoiceContext } from "@/context/invoice-context";
import { Material } from "@/lib/actions/material-store/type/material-store";
import { useGetMaterialStore } from "@/lib/actions/material-store/react-query/material-store-qurey";
import { useSession } from "next-auth/react";
import { createQuickPayment } from "@/lib/actions/quick-payment/quick-payment";
import { ICustomer } from "@/lib/actions/customer/type/customer";
import { useGetCustomer } from "@/lib/actions/customer/react-query/customer-query";
import { useReturnInvoiceContext } from "@/context/refund-context";
import { number } from "zod";
interface StoreItem {
  materialId: string;
  quantity: number;
  number: number;
  variantId: string | null;
  img: string | null;
  name: string;
  salePrice: number;
}
export default function RefundHome() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [keyword, setKeyword] = useState<string>(""); // Chuỗi nhập vào

  const [currentPage, setCurrentPage] = useState(1);
  const storeId = session?.user.user.storeId;

  const [searchParams, setSearchParams] = useState<
    Record<string, string | number | boolean>
  >({
    page: currentPage,
    itemPerPage: 15,
    storeId: storeId || "",
  });



  // Handle updating current page dynamically
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
    setSearchCusParams((prev) => ({
      ...prev,
      Email: keyword,
    }));
  }, [currentPage, keyword]);

  const [searchCusParams, setSearchCusParams] = useState<
    Record<string, string | number | boolean>
  >({
    Email: keyword,
  });

  const {
    returnInvoices,
    activeReturnInvoiceIndex,
    setActiveReturnInvoiceIndex,
    handleAddReturnInvoice,
  } = useReturnInvoiceContext();

  const activeInvoice = returnInvoices[activeReturnInvoiceIndex];
  const [storeItem, setStoreItem] = useState<StoreItem[]>([]);

  useEffect(() => {
    if (activeInvoice?.invoices?.invoiceDetails) {
      const items: StoreItem[] = activeInvoice.invoices.invoiceDetails.map(
        (item) => ({
          materialId: item.materialId,
          quantity: 0,
          number: item.quantity,
          variantId: item.variantId,
          img: item.imageUrl,
          name: item.itemName,
          salePrice: item.salePrice,
        })
      );
      setStoreItem(items);
    }
  }, [activeInvoice]);

  const handleDeleteQuantity = (
    materialId: string,
    variantId: string | null
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: 0 }
          : item
      )
    );
  };
  const handleIncreaseQuantity = (
    materialId: string,
    variantId: string | null
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.number) }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (
    materialId: string,
    variantId: string | null
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
          : item
      )
    );
  };
  const handleUpdateQuantity = (
    materialId: string,
    variantId: string | null,
    value: number
  ) => {
    setStoreItem((prevItems) =>
      prevItems.map((item) =>
        item.materialId === materialId && item.variantId === variantId
          ? { ...item, quantity: Math.max(0, Math.min(value, item.number)) }
          : item
      )
    );
  };

  useEffect(() => {
    console.log("Updated storeItem:", storeItem);
  }, [storeItem]);

  return (
    <div className="grid h-full grid-cols-10 grid-rows-1">
      <div className="col-span-6 mr-1">
        <div className="grid h-full grid-cols-1 grid-rows-7 gap-4">
          <div className="row-span-6 p-1 space-y-[1px] overflow-hidden overflow-y-auto">
            {storeItem?.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-transparent hover:border-blue-500 flex flex-col justify-between w-full p-2 px-5 h-20 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <h2>{index + 1}</h2>
                    <button
                      onClick={() =>
                        handleDeleteQuantity(item.materialId, item.variantId)
                      }
                    >
                      <RiDeleteBin5Line size={20} />
                    </button>
                    <img
                      src={item.img || ""}
                      className="h-10 w-10 object-cover"
                      alt=""
                    />
                    <h2 className="ml-5 capitalize">{item.name}</h2>
                  </div>
                  <div className="p-1 hover:p-1 hover:rounded-full hover:bg-slate-300">
                    <PiDotsThreeOutlineVerticalFill size={20} />
                  </div>
                </div>

                <div className="grid grid-cols-5 grid-rows-1 gap-4">
                  <div className="col-span-2">
                    <div className="flex justify-center items-center">
                      {/* Nút giảm */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDecreaseQuantity(
                            item.materialId,
                            item.variantId
                          )
                        }
                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                      >
                        <svg
                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 2"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M1 1h16"
                          />
                        </svg>
                      </button>
                      {/* Hiển thị số lượng */}
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value, 10) || 0; // Đảm bảo giá trị là số
                          handleUpdateQuantity(
                            item.materialId,
                            item.variantId,
                            newValue
                          );
                        }}
                        className={`flex-shrink-0 border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center ${
                          item.quantity > item.number
                            ? "text-red-500"
                            : "text-gray-900 dark:text-white"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleIncreaseQuantity(
                            item.materialId,
                            item.variantId
                          )
                        }
                        className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                      >
                        <svg
                          className="w-2.5 h-2.5 text-gray-900 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 18 18"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 1v16M1 9h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="col-span-3 col-start-3">
                    <div className="flex gap-10 justify-center items-center">
                      <div className="w-32 border-b text-end">
                        {item.salePrice?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
                      </div>
                      <div className="font-bold">
                        {(item.salePrice * item.quantity).toLocaleString(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "vnd",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row-start-7">
            <div className="bg-white h-full rounded-lg shadow-lg grid grid-cols-5 grid-rows-1 gap-4">
              <div className="col-span-3 ml-2 my-auto">
                <Textarea placeholder="Nhập ghi chú vào đây" />
              </div>
              <div className="col-span-2 h-full col-start-4">
                <div className="flex justify-end h-full items-center gap-10 mx-5">
                  <div>
                    {/* Tổng tiền hàng: <span>{Item.?.totalQuantity}</span> */}
                  </div>
                  <div className="font-bold">
                    {/* {totals?.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-5 h-full bg-white col-start-7 rounded-lg shadow-lg"></div>
    </div>
  );
}
