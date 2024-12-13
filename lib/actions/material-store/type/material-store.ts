export type Material = {
  id: string;
  materialId: string;
  materialCode: string | null;
  materialName: string;
  materialImage: string;
  variantId: string | null;
  variantName: string | null;
  variantImage: string | null;
  quantity: number;
  materialPrice: number;
  variantPrice: number;
  attributes: IAttributes[];
  lastUpdateTime: string;
};
export type IAttributes = {
  name: string;
  value: string;
};
