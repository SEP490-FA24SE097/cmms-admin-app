export type IShippingDetails = {
  id: string;
  address: string;
  phoneReceive: string;
  transactionPaymentType: number | null;
  transactionPayment: string | null;
  shippingDate: string | null; // ISO date format
  estimatedArrival: string; // ISO date format
  shipperName: string;
  shipperCode: string;
  invoice: Invoice;
};

interface UserVM {
  id: string;
  fullName: string;
  email: string;
  dob: string; // ISO date format
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  taxCode: string | null;
  note: string;
  status: number;
}

// Define types for invoiceDetails
interface InvoiceDetail {
  itemName: string;
  imageUrl: string;
  inOrder: any | null; // Change `any` to the specific type if known
  salePrice: number;
  itemTotalPrice: number;
  isChangeQuantity: boolean;
  inStock: any | null; // Change `any` to the specific type if known
  quantity: number;
  materialId: string;
  variantId: string | null;
  storeId: string;
}

// Define types for invoice
interface Invoice {
  id: string;
  invoiceDate: string; // ISO date format
  totalAmount: number;
  invoiceStatus: number;
  note: string;
  discount: number | null;
  salePrice: number;
  customerPaid: number | null;
  staffId: string;
  staffName: string;
  needToPay: number | null;
  storeId: string;
  storeName: string | null;
  userVM: UserVM;
  sellPlace: number;
  buyIn: string;
  invoiceDetails: InvoiceDetail[];
}
