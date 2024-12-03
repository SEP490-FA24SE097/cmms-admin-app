"use client";
import HeaderSeler from "@/components/seller/header/page";
import { useState } from "react";
import SellerHome from "@/components/seller/home/page";
import OrderSellerPage from "@/components/seller/order-seller/page";
import { InvoiceProvider } from "@/context/invoice-context";
import { Button } from "@/components/ui/button";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaTruck } from "react-icons/fa";
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"banThuong" | "banNhanh">(
    "banThuong"
  );
  return (
    <InvoiceProvider>
      <div className="grid h-screen grid-cols-1 grid-rows-12 gap-0 bg-slate-100">
        <div>
          <HeaderSeler />
        </div>
        <div className="row-span-11 p-4">
          {activeTab === "banThuong" ? <SellerHome /> : <OrderSellerPage />}
        </div>
        <div className="row-start-13">
          <div className="pl-5 flex w-full h-full bg-white shadow-md">
            <Button
              variant="ghost"
              className={`flex py-7 gap-5 text-xl font-bold hover:text-blue-500 ${
                activeTab === "banThuong"
                  ? "text-blue-500 border-t-2 border-blue-500"
                  : ""
              }`}
              onClick={() => setActiveTab("banThuong")}
            >
              <AiOutlineThunderbolt size={25} />
              Bán thường
            </Button>
            <Button
              variant="ghost"
              className={`flex py-7 gap-5 text-xl font-bold hover:text-blue-500 ${
                activeTab === "banNhanh" ? "text-blue-500" : ""
              }`}
              onClick={() => setActiveTab("banNhanh")}
            >
              <FaTruck size={25} />
              Bán giao nhanh
            </Button>
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
}
