export type IShipper = {
  storeName: string;
  storeId: string;
  id: string;
  fullName: string;
  email: string;
  dob: string; // Consider using Date type if you will parse it
  phoneNumber: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  taxCode: string | null; // taxCode can be null
  note: string;
  status: number; // Assuming status is a number (e.g., 1 for active)
};

export type IShipPrice = {
  shippingFee: number;
  totalWeight: number;
  shippingDistance: number;
  message: string;
};
