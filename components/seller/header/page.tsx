"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GoArrowSwitch } from "react-icons/go";
import { CiCircleRemove } from "react-icons/ci";
import { FaShoppingBag } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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

export default function HeaderSeler() {
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
  // const materials: Material[] = [
  //   {
  //     id: "aad387e7-df7e-4bca-b163-591f6b6abd06",
  //     materialId: "8fcded53-6a10-4219-a938-75f49fe645ec",
  //     materialCode: null,
  //     materialName: "vật liệu 2",
  //     materialImage:
  //       "https://sonongtho.com/wp-content/uploads/2017/10/S%C6%A1n-L%C3%B3t-Weathershield.png",
  //     variantId: "14eae9b8-18ca-444f-8561-855bc25b4b53",
  //     variantName: "vật liệu 2-biến thể 1",
  //     price: 100000,
  //     variantImage:
  //       "https://www.sondulux.net.vn/image/cache/catalog/san-pham/son-dulux-weathershield-colour-protect-01-800x800.jpg",
  //     quantity: 15,
  //     lastUpdateTime: "0001-01-01T00:00:00",
  //   },
  //   {
  //     id: "b37586fc-60a5-4dab-89c4-6be63a31f02c",
  //     materialId: "e356c732-8493-4ce1-beb4-44a78ab58a46",
  //     materialCode: null,
  //     materialName: "vật liệu 3",
  //     materialImage:
  //       "https://vlxdcantho.com/wp-content/uploads/2022/06/xi-mang-viet-nhat.jpg",
  //     variantId: null,
  //     variantName: null,
  //     variantImage: null,
  //     price: 200000,
  //     quantity: 10,
  //     lastUpdateTime: "0001-01-01T00:00:00",
  //   },
  //   {
  //     id: "22cc3bdf-2800-4bee-88d3-a6efae05a275",
  //     materialId: "8fcded53-6a10-4219-a938-75f49fe645ec",
  //     materialCode: null,
  //     materialName: "vật liệu 2",
  //     materialImage:
  //       "https://sonongtho.com/wp-content/uploads/2017/10/S%C6%A1n-L%C3%B3t-Weathershield.png",
  //     variantId: "f4b4cb78-5129-41ac-bacd-114a4280f9f0",
  //     variantName: "vật liệu 2-biến thể 2",
  //     price: 300000,
  //     variantImage:
  //       "https://thegioicongnghiep.com/image/vn/2022_01/son-nuoc-dulux-19yr-14629mau-do-5-lit-19yr-14629mau-do-dulux-1641288195.png",
  //     quantity: 15,
  //     lastUpdateTime: "0001-01-01T00:00:00",
  //   },
  // ];
  const {
    invoices,
    activeInvoiceIndex,
    setActiveInvoiceIndex,
    handleAddInvoice,
    handleSelectMaterial,
    handleRemoveInvoice,
  } = useInvoiceContext();

  const invoiceListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (invoiceListRef.current) {
      // Cuộn tới cuối danh sách hóa đơn
      invoiceListRef.current.scrollTo({
        left: invoiceListRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [invoices]); // Lắng nghe sự thay đổi của invoices

  const handleSelectInvoice = (index: number) => {
    setActiveInvoiceIndex(index);
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
      <div className="relative w-full">
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
          placeholder="Tìm hàng hóa"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />

        {showDropdown && (
          <ul className="absolute left-0 z-10 w-full p-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectMaterial(item)}
                  className="p-2 rounded-lg hover:bg-blue-100 cursor-pointer"
                >
                  <div className="max-w-md mx-auto">
                    {/* First Product */}
                    <div className="flex items-center rounded">
                      <img
                        alt="Blue protective workwear"
                        className="w-14 h-14 mr-4 object-cover"
                        src={item.variantImage || item.materialImage}
                      />
                      <div className="flex-1">
                        <div className="text-black font-semibold">
                          {item.variantName || item.materialName}
                        </div>
                        <div className="text-gray-600">{item.materialCode}</div>
                        <div className="text-gray-600">
                          Tồn: {item.quantity} | KH đặt: 0
                        </div>
                      </div>
                      <div className="text-blue-600 font-semibold">
                        {item.materialPrice.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "vnd",
                        })}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">Không có dữ liệu</li>
            )}
          </ul>
        )}
      </div>
      <div
        ref={invoiceListRef}
        className="flex overflow-hidden overflow-x-auto whitespace-nowrap 
    scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent"
      >
        {invoices.map((invoice, index) => (
          <Button
            key={index}
            className={`bg-transparent text-white font-bold ml-5 text-lg hover:bg-slate-200 hover:text-black shadow-none pb-2 flex items-center gap-2 ${
              activeInvoiceIndex === index ? "bg-white text-black" : ""
            }`}
            onClick={() => handleSelectInvoice(index)}
          >
            <GoArrowSwitch />
            {invoice.name}
            <div
              className="p-0 m-0 bg-transparent hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn chọn hóa đơn khi xóa
                // if (invoices.length === 1) {
                //   // Hiển thị toast nếu chỉ còn 1 hóa đơn
                //   toast({
                //     title: "Không thể xóa",
                //     description: "Bạn cần ít nhất một hóa đơn trong danh sách.",
                //     variant: "destructive", // Kiểu toast (ví dụ: destructive, default, subtle)
                //   });
                //   return;
                // }
                handleRemoveInvoice(index);
              }}
            >
              <CiCircleRemove
                size={20}
                className="cursor-pointer text-black hover:text-red-500"
              />
            </div>
          </Button>
        ))}

        <Button
          className="bg-green-500 text-white font-bold ml-2 text-lg hover:bg-green-600"
          onClick={handleAddInvoice}
        >
          <FaPlus />
        </Button>
      </div>

      <div className="flex items-center justify-end">
        <div className="ml-5 flex gap-2 items-center">
          <h1 className="text-white">{session?.user.user.phoneNumber}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-blue-900">
                <IoIosOptions size={30} className="text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Đăng xuất
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
