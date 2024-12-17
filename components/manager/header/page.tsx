"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { IoIosOptions, IoMdSettings } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function ManagerHeader() {
  const { data: session } = useSession();
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
    <div className="bg-white">
      <div className="flex justify-between w-[80%] mx-auto">
        <div className="px-3 py-3 text-2xl font-bold text-blue-700">CMMS</div>
        <div className="">
          <div className="bg-blue-600 items-center flex">
            <div
              onMouseEnter={() => handleMouseEnter("settings")}
              onMouseLeave={() => handleMouseLeave("settings")}
              className={`relative flex px-3 py-4  ${
                dropdownOpen.settings ? "bg-blue-700" : ""
              }`}
            >
              <IoMdSettings className="size-4" />
              {dropdownOpen.settings && (
                <div
                  className="absolute bg-white shadow-lg w-60 z-9 right-0 top-full"
                  onMouseEnter={() => handleMouseEnter("settings")}
                  onMouseLeave={() => handleMouseLeave("settings")}
                >
                  <div className="px-4 py-2 text-black hover:bg-gray-100 flex items-center">
                    Quản lí người dùng
                  </div>
                  <div className="px-4 py-2 text-black hover:bg-gray-100  flex items-center">
                    Quản lí chi nhánh
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <h1 className="text-white">{session?.user.user.phoneNumber}</h1>
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
                  <DropdownMenuItem onClick={() => signOut()}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
