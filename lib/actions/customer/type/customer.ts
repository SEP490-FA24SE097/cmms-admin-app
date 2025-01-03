export type ICustomer = {
  id: string;
  currentDebt: number;
  fullName: string;
  email: string;
  phoneNumber: string;
};

export type Customer = {
  storeCreateName: string | null;
  createByName: string | null;
  customerType: string;
  customerStatus: string;
  currentDebt: number;
  totalSale: number;
  totalSaleAfterRefund: number;
  id: string;
  fullName: string;
  email: string;
  userName: string;
  password: string | null;
  dob: string | null;
  phoneNumber: string | null;
  province: string;
  district: string;
  ward: string;
  address: string;
  taxCode: string | null;
  note: string;
  status: number;
  storeId: string | null;
  type: number;
  creditLimit: number | null;
  createdById: string | null;
};

export type Data = {
  currentDebtTotal: number;
  totalSale: number;
  totalSaleAfterRefund: number;
  result: Customer[];
  pagination: Pagination;
};

export type Pagination = {
  total: number;
  perPage: number;
  currentPage: number;
};

export type IInvoiceDetail = {
  itemName: string | null;
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

export type IInvoice = {
  id: string;
  invoiceDate: string; 
  totalAmount: number;
  invoiceStatus: number;
  note: string | null;
  discount: number;
  salePrice: number;
  customerPaid: number | null;
  staffId: string | null;
  staffName: string | null;
  storeId: string;
  storeName: string | null;
  userVM: any | null; // Replace 'any' with a specific type if known
  sellPlace: number;
  buyIn: string;
  invoiceDetails: IInvoiceDetail[];
};

export type ITransaction = {
  id: string;
  transactionType: number;
  transactionTypeDisplay: string;
  amount: number;
  customerCurrentDebt: number | null;
  transactionDate: string; // ISO 8601 date string
  invoiceId: string;
  customerId: string;
  description: string;
  invoiceVM: IInvoice;
};
