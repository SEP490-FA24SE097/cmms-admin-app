"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoArrowSwitch } from "react-icons/go";
import { CiCircleRemove } from "react-icons/ci";
import { FaShoppingBag } from "react-icons/fa";
import { IoIosOptions } from "react-icons/io";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderSeler() {
  const [searchTerm, setSearchTerm] = useState<string>(""); // Chuỗi nhập vào
  const [filteredData, setFilteredData] = useState<string[]>([]); // Mảng chuỗi
  const [showDropdown, setShowDropdown] = useState<boolean>(false); // Boolean

  const data: string[] = [
    "Sản phẩm 1",
    "Sản phẩm 2",
    "Sản phẩm 3",
    "Sản phẩm 4",
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
  return (
    <nav className="flex p-2 bg-blue-600 justify-between">
      <div className="flex">
        <div className="relative w-[500px]">
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
          <Button className="bg-white text-black font-bold ml-5 text-lg hover:bg-white pb-2">
            <GoArrowSwitch />
            Hóa đơn 1
            <CiCircleRemove />
          </Button>
          <Button className="bg-white text-black ml-5 text-lg hover:bg-white pb-2">
            <GoArrowSwitch />
            Hóa đơn 2
            <CiCircleRemove />
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        <HoverCard openDelay={100} closeDelay={200}>
          <HoverCardTrigger>
            <Button variant="ghost" className="hover:bg-blue-900">
              <FaShoppingBag className="text-white" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-2 w-full px-5">
            Xử lý đặt hàng
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={100} closeDelay={200}>
          <HoverCardTrigger>
            <Button variant="ghost" className="hover:bg-blue-900">
              <FaShoppingBag className="text-white" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-2 w-full px-5">
            Xử lý đặt hàng
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={100} closeDelay={200}>
          <HoverCardTrigger>
            <Button variant="ghost" className="hover:bg-blue-900">
              <FaShoppingBag className="text-white" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-2 w-full px-5">
            Xử lý đặt hàng
          </HoverCardContent>
        </HoverCard>
        <HoverCard openDelay={100} closeDelay={200}>
          <HoverCardTrigger>
            <Button variant="ghost" className="hover:bg-blue-900">
              <FaShoppingBag className="text-white" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="p-2 w-full px-5">
            Xử lý đặt hàng
          </HoverCardContent>
        </HoverCard>
        <div className="ml-5 flex gap-2 items-center">
          <h1 className="text-white">0123457678</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hover:bg-blue-900">
                <IoIosOptions className="text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
