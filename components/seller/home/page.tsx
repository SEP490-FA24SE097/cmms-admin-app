"use client";
import HeaderSeler from "@/components/seller/header/page";
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useInvoiceContext } from "@/context/invoice-context";

export default function SellerHome() {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [filteredData, setFilteredData] = useState<string[]>([]); // Mảng chuỗi
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean
  interface Material {
    id: string;
    materialId: string;
    materialCode: string | null;
    materialName: string;
    materialImage: string;
    variantId: string | null;
    variantName: string | null;
    price: number;
    variantImage: string | null;
    quantity: number;
    lastUpdateTime: string;
  }

  // Gán kiểu cho materials
  const materials: Material[] = [
    {
      id: "aad387e7-df7e-4bca-b163-591f6b6abd06",
      materialId: "8fcded53-6a10-4219-a938-75f49fe645ec",
      materialCode: null,
      materialName: "vật liệu 2",
      materialImage:
        "https://sonongtho.com/wp-content/uploads/2017/10/S%C6%A1n-L%C3%B3t-Weathershield.png",
      variantId: "14eae9b8-18ca-444f-8561-855bc25b4b53",
      variantName: "vật liệu 2-biến thể 1",
      price: 100000,
      variantImage:
        "https://www.sondulux.net.vn/image/cache/catalog/san-pham/son-dulux-weathershield-colour-protect-01-800x800.jpg",
      quantity: 15,
      lastUpdateTime: "0001-01-01T00:00:00",
    },
    {
      id: "b37586fc-60a5-4dab-89c4-6be63a31f02c",
      materialId: "e356c732-8493-4ce1-beb4-44a78ab58a46",
      materialCode: null,
      materialName: "vật liệu 3",
      materialImage:
        "https://vlxdcantho.com/wp-content/uploads/2022/06/xi-mang-viet-nhat.jpg",
      variantId: null,
      variantName: null,
      variantImage: null,
      price: 200000,
      quantity: 10,
      lastUpdateTime: "0001-01-01T00:00:00",
    },
    {
      id: "22cc3bdf-2800-4bee-88d3-a6efae05a275",
      materialId: "8fcded53-6a10-4219-a938-75f49fe645ec",
      materialCode: null,
      materialName: "vật liệu 2",
      materialImage:
        "https://sonongtho.com/wp-content/uploads/2017/10/S%C6%A1n-L%C3%B3t-Weathershield.png",
      variantId: "f4b4cb78-5129-41ac-bacd-114a4280f9f0",
      variantName: "vật liệu 2-biến thể 2",
      price: 300000,
      variantImage:
        "https://thegioicongnghiep.com/image/vn/2022_01/son-nuoc-dulux-19yr-14629mau-do-5-lit-19yr-14629mau-do-dulux-1641288195.png",
      quantity: 15,
      lastUpdateTime: "0001-01-01T00:00:00",
    },
  ];
  const data: string[] = [
    "Khách hàng 1",
    "Khách hàng 2",
    "Khách hàng 3",
    "Khách hàng 4",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      const filtered = data.filter((item) =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const {
    invoices,
    activeInvoiceIndex,
    handleSelectMaterial,
    updateQuantity,
    handleQuantityChange,
    handleRemoveMaterial,
  } = useInvoiceContext();

  const activeInvoice = invoices[activeInvoiceIndex];
  const result = activeInvoice.materials.map(material => ({
    materialId: material.materialId,
    variantId: material.variantId
  }));
 console.log(result);
  return (
    <div className="grid h-full grid-cols-10 grid-rows-1">
      <div className="col-span-6 mr-1">
        <div className="grid h-full grid-cols-1 grid-rows-7 gap-4">
          <div className="row-span-6 p-1 space-y-[1px] overflow-hidden overflow-y-auto">
            {activeInvoice?.materials?.map((item, index) => (
              <div
                key={item.id}
                className="bg-white border border-transparent hover:border-blue-500 flex flex-col justify-between w-full p-2 px-5 h-20 rounded-lg shadow-lg"
              >
                <div className="flex justify-between">
                  <div className="flex gap-5">
                    <h2>{index + 1}</h2>
                    <button onClick={() => handleRemoveMaterial(item.id)}>
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
                        onClick={() => updateQuantity(item.id, false)}
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
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, e.target.value)
                        }
                        className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center"
                      />

                      {/* Nút tăng */}
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, true)}
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
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
                      </div>
                      <div className="font-bold">
                        {(item.price * item.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
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
                    Tổng tiền hàng: <span>2</span>
                  </div>
                  <div className="font-bold">100000d</div>
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
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
                {showDropdown && (
                  <ul className="absolute left-0 z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-blue-100 cursor-pointer"
                          onMouseDown={() => setSearchTerm(item)}
                        >
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">Không có dữ liệu</li>
                    )}
                  </ul>
                )}
              </div>
              <div>
                <HoverCard openDelay={100} closeDelay={200}>
                  <HoverCardTrigger>
                    <Button variant="ghost" className="">
                      <FaPlus size={22} />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="p-2 w-full px-5">
                    Thêm tài khoản
                  </HoverCardContent>
                </HoverCard>
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
          </div>
          <div className="row-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
              {materials?.map((product, index) => (
                <div
                  className="flex items-center px-2 py-1 rounded-md border border-transparent hover:border-blue-600 hover:border"
                  key={index}
                  onClick={() => handleSelectMaterial(product)}
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
                      {product.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "vnd",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="row-start-8">
            <div className="flex items-center justify-between">
              <div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              <div>
                <Button className=" bg-blue-600 px-20 py-7 text-2xl font-bold text-white hover:bg-blue-700">
                  Thanh toán
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
