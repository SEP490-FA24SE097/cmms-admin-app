"use client";

import { useEffect, useState } from "react";
import RefundHome from "@/components/refund/refund";
import { Button } from "@/components/ui/button";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
import { useRole } from "@/providers/role-context";
import { useRouter } from "nextjs-toploader/app";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ReturnInvoiceProvider } from "@/context/refund-context";
import HeaderRefund from "@/components/refund/header";
import { InvoiceProvider } from "@/context/invoice-context"; // Import đúng context provider

export default function HomePage() {
  const router = useRouter();
  const { role } = useRole();
  const { data: session } = useSession();

  useEffect(() => {
    // Redirect to login if session.user is not available
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Redirect to /auth for invalid roles
    if (role && (role === "Customer" || role === "Shipper_Store")) {
      router.push("/unauthorized");
    }
  }, [session, role, router]);

  return (
      <ReturnInvoiceProvider>
        <div className="grid h-screen grid-cols-1 grid-rows-12 gap-0 bg-slate-100">
          <div>
            <HeaderRefund />
          </div>
          <div className="row-span-11 p-4">
            <RefundHome />
          </div>
          <div className="row-start-13">
            <div className="pl-5 w-full h-full bg-white shadow-md flex justify-between">
              <div className="flex gap-5">
                <Button
                  variant="ghost"
                  className={`flex py-7 gap-5 text-xl font-bold hover:text-blue-500               
                     text-blue-500 border-t-2 border-blue-500           
                }`}
                >
                  <AiOutlineThunderbolt size={25} /> Hoàn trả
                </Button>
              </div>
              <div className="pr-5">
                <Link href="/home">
                  <Button
                    variant="ghost"
                    className={`flex py-7 gap-5 text-xl font-bold hover:text-blue-500 `}
                  >
                    <AiOutlineThunderbolt size={25} />
                    Bán hàng
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ReturnInvoiceProvider>

  );
}
