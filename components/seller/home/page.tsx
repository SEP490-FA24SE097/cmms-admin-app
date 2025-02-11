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
import CreateCustomer from "../add-customer/page";

export default function SellerHome() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [cusDept, setCusDept] = useState<number>(0); // Chuỗi nhập vào
  const [selectedName, setSelectedName] = useState<string>(""); // Chuỗi nhập vào
  const [keyword, setKeyword] = useState<string>(""); // Chuỗi nhập vào
  const [showDropdown, setShowDropdown] = useState(false); // Boolean
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const storeId = session?.user.user.storeId;

  const [searchParams, setSearchParams] = useState<
    Record<string, string | number | boolean>
  >({
    page: currentPage,
    itemPerPage: 15,
    storeId: storeId || "",
  });

  // Fetch material store list
  const { data: materialData, isLoading: isLoadingMaterialData } =
    useGetMaterialStore(searchParams);

  // Handle updating current page dynamically
  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      page: currentPage,
    }));
  }, [currentPage]);

  const totalPages = materialData?.totalPages || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const [searchCusParams, setSearchCusParams] = useState<
    Record<string, string | number | boolean>
  >({
    Email: keyword,
  });

  // Hook to fetch customers based on searchCusParams
  const { data: customers, isLoading: isLoadingCustomer } =
    useGetCustomer(searchCusParams);

  // Update searchCusParams when keyword changes
  useEffect(() => {
    setSearchCusParams((prev) => ({
      ...prev,
      Email: keyword,
    }));
  }, [keyword]);

  // Handle input change with debouncing to avoid rapid API calls
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setKeyword(value);
    setShowDropdown(!!value); // Show dropdown if there's input
  };

  const handleDeleteCus = () => {
    setSelectedName(""); // Set the input to the selected name
    setSelectedId(null); // Save the selected ID
    setSearchTerm("");
    setCusDept(0);
  };
  const handleSelectItem = (item: ICustomer) => {
    setSearchTerm(`${item.fullName} - ${item.email}`);
    setSelectedName(item.fullName); // Set the input to the selected name
    setKeyword(item.email);
    setCusDept(item.currentDebt);
    setSelectedId(item.id); // Save the selected ID
    setShowDropdown(false); // Hide the dropdown
  };

  const {
    invoices,
    activeInvoiceIndex,
    handleSelectMaterial,
    updateQuantity,
    handleQuantityChange,
    handleRemoveMaterial,
    handleRemoveInvoice,
  } = useInvoiceContext();

  const activeInvoice = invoices[activeInvoiceIndex];

  const calculateTotals = (invoice: Invoice) => {
    const totals = invoice?.materials.reduce(
      (acc, material) => {
        acc.totalQuantity += material.number;
        acc.totalPrice += material.materialPrice * material.number;
        return acc;
      },
      { totalQuantity: 0, totalPrice: 0 } // Initial values
    );

    return totals;
  };

  const discount = 0;
  const totals = calculateTotals(activeInvoice);
  const storeItem = activeInvoice?.materials.map((item, index) => ({
    materialId: item.materialId, // Assuming each item in materials represents a materialId
    quantity: item.number,
    variantId: item.variantId,
  }));

  const handlePaymentClick = async () => {
    // Kiểm tra nếu có mặt hàng vượt quá số lượng
    const isQuantityExceeded = activeInvoice?.materials.some(
      (item) => item.number > item.quantity - item.inOrderQuantity
    );
    if (storeItem.length === 0) {
      toast({
        title: "Không có sản phẩm",
        description: "Vui lòng hãy chọn sản phẩm",
        variant: "destructive",
      });
      return;
    }
    if (isQuantityExceeded) {
      toast({
        title: "Lỗi số lượng",
        description: "Một số mặt hàng có số lượng vượt quá giới hạn cho phép.",
        variant: "destructive",
      });
      return;
    }

    if (selectedId === null) {
      toast({
        title: "Vui lòng chọn khách hàng",
        description: "Vui lòng chọn khách hàng ở phần tìm kiếm người dùng!",
        variant: "destructive",
      });
      return;
    }

    const result = {
      totalAmount: totals?.totalPrice,
      salePrice: totals?.totalPrice - discount,
      customerPaid: totals?.totalPrice,
      invoiceType: 0,
      customerId: selectedId,
      storeItems: storeItem,
    };

    try {
      setIsLoadingPayment(true);
      const response = await createQuickPayment(result);

      if (response.data?.success) {
        toast({
          title: "Thanh toán đã được thực hiện thành công.",
          description: "Cảm ơn bạn vì đã chọn mua hàng ở chúng tôi!",
          style: {
            backgroundColor: "green",
            color: "white",
          },
        });

        handleRemoveInvoice(activeInvoiceIndex);
        setIsLoadingPayment(false);
      } else {
        toast({
          title: "Lỗi",
          description: "Đã xảy ra lỗi không xác định. Vui lòng thử lại.",
          variant: "destructive",
        });
        console.error("Unexpected Payment Response:", response);
        setIsLoadingPayment(false);
      }
    } catch (error) {
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
    <div className="grid h-full grid-cols-10 grid-rows-1">
      <div className="col-span-6 mr-1">
        <div className="grid h-full grid-cols-1 grid-rows-7 gap-4">
          <div className="row-span-6 p-1 space-y-[1px] overflow-hidden overflow-y-auto">
            {activeInvoice?.materials?.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-transparent hover:border-blue-500 flex flex-col justify-between w-full p-2 px-5 h-20 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <h2>{index + 1}</h2>
                    <button
                      onClick={() =>
                        handleRemoveMaterial(item.materialId, item.variantId)
                      }
                    >
                      <RiDeleteBin5Line size={20} />
                    </button>
                    <h2>{item.materialCode}</h2>
                    <h2 className="ml-5 capitalize">
                      {item.variantName || item.materialName}
                    </h2>
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
                          updateQuantity(item.materialId, item.variantId, false)
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
                        type="text"
                        value={item.number}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.materialId,
                            item.variantId,
                            e.target.value
                          )
                        }
                        className={`flex-shrink-0 border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center ${
                          item.number > item.quantity - item.inOrderQuantity
                            ? "text-red-500"
                            : "text-gray-900 dark:text-white"
                        }`}
                      />

                      {/* Nút tăng */}
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.materialId, item.variantId, true)
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
                        {item.materialPrice?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
                      </div>
                      <div className="font-bold">
                        {(item.materialPrice * item.number).toLocaleString(
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
                    Tổng tiền hàng: <span>{totals?.totalQuantity}</span>
                  </div>
                  <div className="font-bold">
                    {totals?.totalPrice.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "vnd",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-5 h-full bg-white col-start-7 rounded-lg shadow-lg">
        <div className="grid h-full grid-cols-1 grid-rows-8 gap-4 p-3">
          <div className="">
            <div className="flex justify-between items-center">
              <div className="relative w-[80%]">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                {/* Search Input */}
                <input
                  type="search"
                  id="search"
                  className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tìm khách hàng"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => searchTerm && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />

                {/* Dropdown */}
                {showDropdown && (
                  <ul className="absolute left-0 z-50 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {/* Check if customers data is loading */}
                    {isLoadingCustomer ? (
                      <li className="p-2 text-gray-500">Đang tải...</li>
                    ) : (customers?.data || []).length > 0 ? (
                      (customers?.data || []).map((item) => (
                        <li
                          key={item.id}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onMouseDown={() => handleSelectItem(item)}
                        >
                          {item.fullName} - {item.email}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">Không có dữ liệu</li>
                    )}
                  </ul>
                )}
              </div>
              <div>
                <CreateCustomer />
              </div>
              <div className="flex items-center">
                <Sheet>
                  <SheetTrigger>
                    <HoverCard openDelay={100} closeDelay={200}>
                      <HoverCardTrigger>
                        <div className="p-2 rounded-full hover:bg-blue-800">
                          <CiFilter size={22} />
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2 w-full px-5">
                        Lọc hàng hóa
                      </HoverCardContent>
                    </HoverCard>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Lọc hàng hóa</SheetTitle>
                      <SheetDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            {cusDept > 0 && (
              <h1>
                Nợ:{" "}
                <span className="text-red-500">
                  {cusDept.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "vnd",
                  })}
                </span>
              </h1>
            )}
          </div>
          <div className="row-span-6 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
              {materialData?.data?.map((product, index) => (
                <HoverCard key={index} openDelay={100} closeDelay={100}>
                  <HoverCardTrigger>
                    {" "}
                    <div
                      className="flex items-center px-2 py-1 rounded-md border border-transparent hover:border-blue-600 hover:border"
                      key={index}
                      onClick={() =>
                        handleSelectMaterial({
                          ...product,
                          inOrderQuantity: product.inOrderQuantity || 0,
                          number: 0,
                          variantPrice: product.variantPrice ?? 0,
                          materialPrice:
                            product.afterDiscountPrice ||
                            product.variantPrice ||
                            product.materialPrice,
                        })
                      }
                    >
                      <img
                        src={product.variantImage || product.materialImage}
                        alt={product.materialName}
                        className="w-14 h-14 object-cover "
                        width={60}
                        height={60}
                      />
                      <div className="ml-2 h-full justify-between flex flex-col">
                        <div className="text-[14px] line-clamp-2 text-ellipsis">
                          {product.variantName || product.materialName}
                        </div>
                        <div className="text-blue-600 font-bold">
                          {(
                            product.afterDiscountPrice ||
                            product.variantPrice ||
                            product.materialPrice
                          )?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "vnd",
                          })}
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-full">
                    Tồn kho: {product.quantity.toLocaleString("vi-VN")} - KH
                    đặt: {product.inOrderQuantity}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
            {!isLoadingMaterialData && (
              <div className="flex pt-3  justify-between items-center">
                <h1 className="flex justify-center">
                  {currentPage}/{materialData?.totalPages} có{" "}
                  {materialData?.total} sản phẩm
                </h1>
                <div className="flex gap-2 items-center">
                  <div className="flex text-sm">
                    <h1>Khách hàng: &nbsp;</h1>
                    <div>
                      {selectedName ? (
                        <h1 className="text-blue-500 underline">
                          {selectedName}
                        </h1>
                      ) : (
                        <h1 className="text-red-500">Chưa chọn</h1>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button onClick={handleDeleteCus} variant="ghost">
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="row-start-8">
            <div className="flex items-center justify-between">
              <div>
                <Pagination>
                  <PaginationContent>
                    {/* Previous Page */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          currentPage > 1 && handlePageChange(currentPage - 1)
                        }
                        aria-disabled={currentPage === 1}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Current Page */}
                    <PaginationItem>
                      <PaginationLink className="cursor-pointer">
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>

                    {/* Next Page */}
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
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <div>
                {isLoadingPayment ? (
                  <Button disabled className="px-16 py-7 text-2xl  font-bold">
                    <Loader2 className="animate-spin" />
                    Đang tải...
                  </Button>
                ) : (
                  <Button
                    onClick={handlePaymentClick}
                    className=" bg-blue-600 px-20 py-7 text-2xl font-bold text-white hover:bg-blue-700"
                  >
                    Thanh toán
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
