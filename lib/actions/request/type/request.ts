export type IRequest = {
  id: string;
  requestCode: string;
  store: string;
  storeId: string;
  material: string;
  materialCode: string | null;
  materialId: string;
  variant: string | null;
  variantId: string | null;
  status: string;
  quantity: number;
  lastUpdateTime: string;
};
