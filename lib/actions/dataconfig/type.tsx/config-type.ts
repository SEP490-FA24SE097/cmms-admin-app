export type IShippingConfig = {
  id: string;
  baseFee: number;
  first5KmFree: number;
  additionalKmFee: number | null;
  first10KgFee: number | null;
  additionalKgFee: number | null;
  lastUpdated: string;
  createdAt: string;
};
