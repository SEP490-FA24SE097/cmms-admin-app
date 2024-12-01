"use client";
import HeaderSeler from "@/components/seller/header/page";
import { useState } from "react";
import SellerHome from "@/components/seller/home/page";
import { InvoiceProvider } from "@/context/invoice-context";

export default function HomePage() {
  return (
    <InvoiceProvider>
      <div className="grid h-screen grid-cols-1 grid-rows-12 gap-0 bg-slate-100">
        <div>
          <HeaderSeler />
        </div>
        <div className="row-span-11 p-4">
          <SellerHome />
        </div>
        <div className="row-start-13">
          <HeaderSeler />
        </div>
      </div>
    </InvoiceProvider>
  );
}
