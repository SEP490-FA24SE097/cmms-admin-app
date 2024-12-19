"use client";
import Link from "next/link";
import * as React from "react";
import {
  FaBoxArchive,
  FaEye,
  FaArrowRightArrowLeft,
  FaBasketShopping,
  FaUserTie,
  FaClipboardCheck,
} from "react-icons/fa6";

import { RiGridLine } from "react-icons/ri";
export default function NavHeader() {
  const [dropdownOpen, setDropdownOpen] = React.useState<{
    [key: string]: boolean;
  }>({
    services: false,
    about: false,
    contact: false,
  });
  const handleMouseEnter = (menu: string) => {
    setDropdownOpen((prev) => ({ ...prev, [menu]: true }));
  };

  const handleMouseLeave = (menu: string) => {
    setDropdownOpen((prev) => ({ ...prev, [menu]: false }));
  };
  return (
    <div className="flex bg-blue-500 justify-between w-[100%] items-center">
      <div className="relative flex items-center justify-between w-[80%] mx-auto">
        <div className="flex items-center justify-center sm:items-stretch sm:justify-start">
          <div className="hidden sm:block">
            {/* <div className="flex space-x-4"> */}
            <div className="flex">
              <div className="text-white hover:bg-blue-700  px-8 py-3 text-sm font-medium flex  justify-between items-center">
                <FaEye className="mr-2 size-5" />
                Tổng Quan
              </div>
              {/* Materials */}
              <div className="relative">
                <button
                  onMouseEnter={() => handleMouseEnter("material")}
                  onMouseLeave={() => handleMouseLeave("material")}
                  className={`text-white hover:bg-blue-700  px-8 py-3 text-sm font-medium flex  justify-between items-center ${
                    dropdownOpen.material ? "bg-blue-700" : ""
                  }`}
                >
                  <FaBoxArchive className="mr-2 size-5" />
                  Hàng hóa
                </button>
                {dropdownOpen.material && (
                  <div
                    className="absolute bg-blue-500 shadow-lg w-60 z-10"
                    onMouseEnter={() => handleMouseEnter("material")}
                    onMouseLeave={() => handleMouseLeave("material")}
                  >
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <RiGridLine className="mr-2 size-4" />
                      Danh mục
                    </div>
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <FaClipboardCheck className="mr-2 size-4" />
                      Kiểm kho
                    </div>
                  </div>
                )}
              </div>

              {/* transaction */}
              <div className="relative">
                <button
                  onMouseEnter={() => handleMouseEnter("transaction")}
                  onMouseLeave={() => handleMouseLeave("transaction")}
                  className={`text-white hover:bg-blue-700  px-8 py-3 text-sm font-medium flex  justify-between items-center ${
                    dropdownOpen.transaction ? "bg-blue-700" : ""
                  }`}
                >
                  <FaArrowRightArrowLeft className="mr-2 size-4" />
                  Giao dịch
                </button>
                {dropdownOpen.transaction && (
                  <div
                    className="absolute bg-blue-500 shadow-lg w-60 z-10"
                    onMouseEnter={() => handleMouseEnter("transaction")}
                    onMouseLeave={() => handleMouseLeave("transaction")}
                  >
                    <Link href="/store-request">
                      <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                        <FaBoxArchive className="mr-2 size-4" />
                        Gửi yêu cầu
                      </div>
                    </Link>
                    <Link href="/import">
                      <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                        <FaBoxArchive className="mr-2 size-4" />
                        Nhập hàng
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* customer */}
              <div className="relative">
                <button
                  onMouseEnter={() => handleMouseEnter("customer")}
                  onMouseLeave={() => handleMouseLeave("customer")}
                  className={`text-white hover:bg-blue-700  px-8 py-3 text-sm font-medium flex  justify-between items-center ${
                    dropdownOpen.customer ? "bg-blue-700" : ""
                  }`}
                >
                  <FaBoxArchive className="mr-2 size-4" />
                  Khách hàng
                </button>
                {dropdownOpen.customer && (
                  <div
                    className="absolute bg-blue-500 shadow-lg w-60 z-10"
                    onMouseEnter={() => handleMouseEnter("customer")}
                    onMouseLeave={() => handleMouseLeave("customer")}
                  >
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <FaBoxArchive className="mr-2 size-4" />
                      Danh mục
                    </div>
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <FaBoxArchive className="mr-2 size-4" />
                      Kiểm kho
                    </div>
                  </div>
                )}
              </div>

              {/* supplier */}
              <div className="relative">
                <button
                  onMouseEnter={() => handleMouseEnter("supplier")}
                  onMouseLeave={() => handleMouseLeave("supplier")}
                  className={`text-white hover:bg-blue-700  px-8 py-3 text-sm font-medium flex  justify-between items-center ${
                    dropdownOpen.supplier ? "bg-blue-700" : ""
                  }`}
                >
                  <FaBoxArchive className="mr-2 size-4" />
                  Nhà cung cấp
                </button>
                {dropdownOpen.supplier && (
                  <div
                    className="absolute bg-blue-500 shadow-lg w-48 z-10"
                    onMouseEnter={() => handleMouseEnter("supplier")}
                    onMouseLeave={() => handleMouseLeave("supplier")}
                  >
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <FaBoxArchive className="mr-2 size-4" />
                      Danh mục
                    </div>
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <FaBoxArchive className="mr-2 size-4" />
                      Kiểm kho
                    </div>
                  </div>
                )}
              </div>

              {/* Materials */}
              <div className="relative">
                <button
                  onMouseEnter={() => handleMouseEnter("services")}
                  onMouseLeave={() => handleMouseLeave("services")}
                  className={`text-white hover:bg-blue-700  px-8 py-3 text-sm font-medium flex  justify-between items-center ${
                    dropdownOpen.services ? "bg-blue-700" : ""
                  }`}
                >
                  <FaBoxArchive className="mr-2 size-4" />
                  Nhân viên
                </button>
                {dropdownOpen.services && (
                  <div
                    className="absolute bg-blue-500 shadow-lg w-48 z-10"
                    onMouseEnter={() => handleMouseEnter("services")}
                    onMouseLeave={() => handleMouseLeave("services")}
                  >
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <FaBoxArchive className="mr-2 size-4" />
                      Danh mục
                    </div>
                    <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                      <FaBoxArchive className="mr-2 size-4" />
                      Kiểm kho
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <Link href="/home">
            <div className="text-white bg-blue-700  px-8 py-3 text-sm font-medium flex cursor-pointer justify-between items-center">
              <FaBasketShopping className="mr-2 size-4" />
              Bán hàng
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
