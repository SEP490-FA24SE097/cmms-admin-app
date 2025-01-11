import { IInvoices } from "@/lib/actions/invoices/type/invoice-type";
import React, { createContext, useContext, useRef, useState } from "react";

export interface ReturnInvoice {
  id: string;
  name: string;
  invoices: IInvoices; //
}

interface ReturnInvoiceContextType {
  returnInvoices: ReturnInvoice[];
  activeReturnInvoiceIndex: number;
  setActiveReturnInvoiceIndex: (index: number) => void;
  handleAddReturnInvoice: (item: IInvoices) => void;
  handleDeleteReturnInvoice: (id: string) => void;
  returnInvoiceListRef: React.RefObject<HTMLDivElement>;
}

const ReturnInvoiceContext = createContext<
  ReturnInvoiceContextType | undefined
>(undefined);

export const ReturnInvoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [returnInvoices, setReturnInvoices] = useState<ReturnInvoice[]>([]);
  const [activeReturnInvoiceIndex, setActiveReturnInvoiceIndex] =
    useState<number>(0);
  const returnInvoiceListRef = useRef<HTMLDivElement>(null);

  // Add new return invoice
  const handleAddReturnInvoice = (item: IInvoices) => {
    const newReturnInvoice = {
      id: `${Date.now()}`,
      name: `Trả hàng ${returnInvoices.length + 1}`,
      invoices: item, // Single item instead of an array
    };

    setReturnInvoices((prev) => [...prev, newReturnInvoice]);
    setActiveReturnInvoiceIndex(returnInvoices.length);
    setTimeout(() => {
      if (returnInvoiceListRef.current) {
        returnInvoiceListRef.current.scrollTo({
          left: returnInvoiceListRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 0);
  };
  const handleDeleteReturnInvoice = (id: string) => {
    setReturnInvoices((prev) => {
      const updatedInvoices = prev.filter((invoice) => invoice.id !== id);

      // Ensure the active index points to a valid invoice
      if (activeReturnInvoiceIndex >= updatedInvoices.length) {
        setActiveReturnInvoiceIndex(
          updatedInvoices.length > 0 ? updatedInvoices.length - 1 : 0
        );
      }

      return updatedInvoices;
    });
  };

  return (
    <ReturnInvoiceContext.Provider
      value={{
        returnInvoices,
        activeReturnInvoiceIndex,
        setActiveReturnInvoiceIndex,
        handleAddReturnInvoice,
        handleDeleteReturnInvoice,
        returnInvoiceListRef,
      }}
    >
      {children}
    </ReturnInvoiceContext.Provider>
  );
};

export const useReturnInvoiceContext = () => {
  const context = useContext(ReturnInvoiceContext);
  if (!context) {
    throw new Error(
      "useReturnInvoiceContext must be used within a ReturnInvoiceProvider"
    );
  }
  return context;
};
