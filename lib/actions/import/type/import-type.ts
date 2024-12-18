export type IImport = {
  id: string;
  timeStamp: string;
  supplierName: string;
  importCode: string;
  status: string;
  note: string;
  totalQuantity: number;
  totalProduct: number;
  totalPice: number;
  totalDiscount: number;
  totalDue: number;
  importDetails: IImportDetail[];
};

export type IImportDetail = {
  materialCode: string;
  name: string;
  materialId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  unitDiscount: number;
  unitImportPrice: number;
  priceAfterDiscount: number;
  note: string;
};

export type IMaterialImport = {
  materialId: string; // ID của vật liệu
  materialName: string; // Tên của vật liệu
  salePrice: number; // Giá bán
  costPrice: number; // Giá gốc
  image: string; // URL hình ảnh
  variantId: string | null; // ID của biến thể (có thể là null)
  sku: string | null; // SKU (Stock Keeping Unit) (có thể là null)
  variantImage: string | null; // Hình ảnh của biến thể (có thể là null)
  variantSalePrice: number | null; // Giá bán của biến thể (có thể là null)
  variantCostPrice: number | null;
};
