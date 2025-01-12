"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { FaUserCircle } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "nextjs-toploader/app";
import { useRole } from "@/providers/role-context";
export default function ManagerHeader() {
  const router = useRouter();
  const { role } = useRole();
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
        <div className="flex items-center">
          <div className="flex items-center hover:bg-slate-200 px-2 rounded-lg text-black font-bold">
            <h1>{session?.user.user.phoneNumber}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-slate-200 hover:border-none"
                >
                  <FaUserCircle size={25} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {role === "Senior_Management" && (
                  <DropdownMenuItem>Điều chỉnh giá</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
