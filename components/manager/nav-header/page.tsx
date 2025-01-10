"use client";
import { useRole } from "@/providers/role-context";
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
  const { role } = useRole();

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
                    {role === "Senior_Management" ? (
                      <div>
                        <Link
                          href="/manage/materials"
                          className="px-4 py-2 text-white hover:bg-blue-700 flex items-center"
                        >
                          <RiGridLine className="mr-2 size-4" />
                          Danh mục
                        </Link>
                        <Link
                          href="/manage/materials/update-material"
                          className="px-4 py-2 text-white hover:bg-blue-700 flex items-center"
                        >
                          <FaClipboardCheck className="mr-2 size-4" />
                          Cập nhật
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <Link
                          href="/store-material"
                          className="px-4 py-2 text-white hover:bg-blue-700 flex items-center"
                        >
                          <RiGridLine className="mr-2 size-4" />
                          Danh mục
                        </Link>
                        <Link
                          href="/order-pending"
                          className="px-4 py-2 text-white hover:bg-blue-700 flex items-center"
                        >
                          <RiGridLine className="mr-2 size-4" />
                          Đơn hàng chờ
                        </Link>
                      </div>
                    )}
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
                    {role === "Senior_Management" ? (
                      <div>
                        <Link href="/admin-request">
                          <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                            <FaBoxArchive className="mr-2 size-4" />
                            Xử lý yêu cầu
                          </div>
                        </Link>
                        <Link href="/notes">
                          <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                            <FaBoxArchive className="mr-2 size-4" />
                            Ghi chú xuất nhập
                          </div>
                        </Link>
                      </div>
                    ) : (
                      <div>
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
                        <Link href="/notes">
                          <div className="px-4 py-2 text-white hover:bg-blue-700 flex items-center">
                            <FaBoxArchive className="mr-2 size-4" />
                            Ghi chú xuất nhập
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* customer */}
              <div className="relative">
                <Link href="/customer">
                  <button
                    className={`text-white hover:bg-blue-700 px-8 py-3 text-sm font-medium flex justify-between items-center `}
                  >
                    <FaBoxArchive className="mr-2 size-4" />
                    Khách hàng
                  </button>
                </Link>
              </div>

              {/* supplier */}
              <div className="relative">
                {role === "Senior_Management" && (
                  <Link href="/manage/supplier">
                    <button
                      className={`text-white hover:bg-blue-700 px-8 py-3 text-sm font-medium flex justify-between items-center `}
                    >
                      <FaBoxArchive className="mr-2 size-4" />
                      Nhà cung cấp
                    </button>
                  </Link>
                )}
              </div>
              {["Senior_Management", "Store_Manager"].includes(role) && (
                <div className="relative">
                  <Link href="/manage/staff">
                    <button
                      className={`text-white hover:bg-blue-700 px-8 py-3 text-sm font-medium flex justify-between items-center `}
                    >
                      <FaBoxArchive className="mr-2 size-4" />
                      Nhân viên
                    </button>
                  </Link>
                </div>
              )}
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
