import React, { createContext, useContext, useRef, useState } from "react";

interface Material {
  id: string;
  materialId: string;
  materialCode: string | null;
  materialName: string;
  materialImage: string;
  variantId: string | null;
  variantName: string | null;
  variantImage: string | null;
  quantity: number;
  number: number;
  inOrderQuantity: number;
  materialPrice: number;
  variantPrice: number;
  attributes: IAttributes[];
  lastUpdateTime: string;
}
interface IAttributes {
  name: string;
  value: string;
}
export interface Invoice {
  id: string; // Unique identifier for the invoice
  name: string; // Name of the invoice
  materials: Material[]; // List of selected materials for this invoice
}

interface InvoiceContextType {
  invoices: Invoice[];
  activeInvoiceIndex: number;
  setActiveInvoiceIndex: (index: number) => void;
  handleAddInvoice: () => void;
  handleRemoveInvoice: (index: number) => void;
  handleSelectMaterial: (material: Material) => void;
  handleQuantityChange: (
    materialId: string,
    variantId: string | null,
    value: string
  ) => void;
  updateQuantity: (
    materialId: string,
    variantId: string | null,
    increment: boolean
  ) => void;
  handleRemoveMaterial: (materialId: string, variantId: string | null) => void;
  invoiceListRef: React.RefObject<HTMLDivElement>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "1", name: "Hóa đơn 1", materials: [] },
  ]);
  const [activeInvoiceIndex, setActiveInvoiceIndex] = useState<number>(0);
  const invoiceListRef = useRef<HTMLDivElement>(null);
  // Add new invoice
  const handleAddInvoice = () => {
    const newInvoice = {
      id: `${Date.now()}`,
      name: `Hóa đơn ${invoices.length + 1}`,
      materials: [],
    };

    setInvoices((prev) => [...prev, newInvoice]);
    setActiveInvoiceIndex(invoices.length); // Switch to the new invoice
    setTimeout(() => {
      if (invoiceListRef.current) {
        invoiceListRef.current.scrollTo({
          left: invoiceListRef.current.scrollWidth,
          behavior: "smooth",
        });
      }
    }, 0);
  };

  // Remove invoice
  const handleRemoveInvoice = (index: number) => {
    setInvoices((prev) => prev.filter((_, i) => i !== index));
    if (activeInvoiceIndex >= index) {
      setActiveInvoiceIndex(Math.max(activeInvoiceIndex - 1, 0)); // Adjust active index
    }
  };

  // Get active invoice
  const activeInvoice = invoices[activeInvoiceIndex];

  // Add or update material in the active invoice
  const handleSelectMaterial = (material: Material) => {
    setInvoices((prev) =>
      prev.map((invoice, index) => {
        if (index !== activeInvoiceIndex) return invoice;

        // Tìm chỉ số của material dựa trên cả `materialId` và `variantId`
        const existingMaterialIndex = invoice.materials.findIndex(
          (item) =>
            item.materialId === material.materialId &&
            item.variantId === material.variantId
        );

        if (existingMaterialIndex !== -1) {
          // Nếu đã tồn tại, tăng số lượng `number`
          const updatedMaterials = [...invoice.materials];
          updatedMaterials[existingMaterialIndex] = {
            ...updatedMaterials[existingMaterialIndex],
            number: updatedMaterials[existingMaterialIndex].number + 1,
          };
          return { ...invoice, materials: updatedMaterials };
        }

        // Nếu chưa tồn tại, thêm material mới
        return {
          ...invoice,
          materials: [{ ...material, number: 1 }, ...invoice.materials],
        };
      })
    );
  };

  // Change material quantity
  const handleQuantityChange = (
    materialId: string,
    variantId: string | null,
    value: string
  ) => {
    const parsedValue = parseInt(value, 10);

    if (!isNaN(parsedValue) && parsedValue >= 1) {
      setInvoices((prev) =>
        prev.map((invoice, index) =>
          index === activeInvoiceIndex
            ? {
                ...invoice,
                materials: invoice.materials.map((item) =>
                  item.materialId === materialId && item.variantId === variantId
                    ? { ...item, number: parsedValue }
                    : item
                ),
              }
            : invoice
        )
      );
    }
  };

  const updateQuantity = (
    materialId: string,
    variantId: string | null,
    increment: boolean
  ) => {
    setInvoices((prev) =>
      prev.map((invoice, index) =>
        index === activeInvoiceIndex
          ? {
              ...invoice,
              materials: invoice.materials.map((item) =>
                item.materialId === materialId && item.variantId === variantId
                  ? {
                      ...item,
                      number: increment
                        ? item.number + 1
                        : Math.max(item.number - 1, 1),
                    }
                  : item
              ),
            }
          : invoice
      )
    );
  };

  const handleRemoveMaterial = (
    materialId: string,
    variantId: string | null
  ) => {
    setInvoices((prev) =>
      prev.map((invoice, index) =>
        index === activeInvoiceIndex
          ? {
              ...invoice,
              materials: invoice.materials.filter(
                (item) =>
                  !(
                    item.materialId === materialId &&
                    item.variantId === variantId
                  )
              ),
            }
          : invoice
      )
    );
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        activeInvoiceIndex,
        setActiveInvoiceIndex,
        handleAddInvoice,
        handleRemoveInvoice,
        handleSelectMaterial,
        handleQuantityChange,
        updateQuantity,
        handleRemoveMaterial,
        invoiceListRef,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoiceContext must be used within an InvoiceProvider");
  }
  return context;
};
