export type IMaterial = {
  material: IMaterialChild;
  variants: IVariants[];
};

export type IMaterialChild = {
  id: string;
  name: string;
  barCode: number;
  category: string;
  unit: string;
  supplier: string;
  description: string;
  salePrice: number;
  minStock: number;
  brand: string;
  isRewardEligible: boolean;
  imageUrl: string;
  subImages: ISubimage[];
};

export type IVariants = {
  variantId: string;
  sku: string;
  price: number;
  image: string;
  attributes: IAttribute[];
};

export type IAttribute = {
  name: string;
  value: string;
};
export type ISubimage = {
  materialId: string;
  subImageUrl: string;
};
