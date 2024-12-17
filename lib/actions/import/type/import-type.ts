export type IImport = {
  id: string;
  timeStamp: string;
  supplierName: string;
  status: string;
  note: string;
  totalQuantity: number;
  totalProduct: number;
  totalPice: number;
  totalDiscount: number;
  totalDue: number;
  totalPaid: number;
  importDetails: IImportDetail[];
};

export type IImportDetail = {
  materialId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  unitDiscount: number;
  discountPrice: number;
  priceAfterDiscount: number;
  note: string;
};
