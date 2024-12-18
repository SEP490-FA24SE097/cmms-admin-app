export type ICusInvoices = {
  totalAmount: number;
  invoiceDate: string;
  invoices: IInvoices[];
};

export type IInvoices = {
  id: string;
  invoiceDate: string; // ISO Date string
  totalAmount: number;
  invoiceStatus: number;
  note: string | null;
  discount: number | null;
  salePrice: number;
  customerPaid: number;
  staffId: string;
  staffName: string;
  storeId: string;
  storeName: string;
  userVM: IUserVM;
  sellPlace: number;
  buyIn: string;
  invoiceDetails: IInvoiceDetails[];
  shippingDetailVM: IShippingDetailVM;
};

export type IUserVM = {
  id: string;
  fullName: string;
  email: string | null;
  dob: string; // ISO Date string
  phoneNumber: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  taxCode: string | null;
  note: string | null;
  status: number;
};

export type IInvoiceDetails = {
  itemName: string;
  imageUrl: string | null;
  inOrder: number | null;
  salePrice: number;
  itemTotalPrice: number;
  isChangeQuantity: boolean;
  inStock: number | null;
  quantity: number;
  materialId: string;
  variantId: string | null;
  storeId: string | null;
};

export type IShippingDetailVM = {
  id: string;
  address: string;
  phoneReceive: string;
  shipperName: string;
  shippingFee: number;
  shipperCode: string;
  shippingDate: string | null; // ISO Date string
  estimatedArrival: string; // ISO Date string
};
