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
  conversionUnitId: string;
  conversionUnitName: string;
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

export type IMaterialPost = {
  name: string;
  costPrice: number;
  salePrice: number;
  imagesFile: string[];
  weightValue: number;
  minStock: number;
  maxStock: number;
  description: string;
  basicUnitId: string;
  materialUnitDtoList: IimaterialUnitDtoList[];
  categoryId: string;
  brandId: string;
};

export type IimaterialUnitDtoList = {
  unitId: string;
  conversionRate: number;
  price: number;
};

export type IMaterialWarehouse = {
  id: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialImage: string;
  variantId: string;
  variantName: string;
  variantImage: string;
  brand: string;
  supplier: string | null; // Assuming supplier can be null
  quantity: number;
  minStock: number;
  maxStock: number;
  materialPrice: number;
  materialCostPrice: number;
  variantPrice: number;
  variantCostPrice: number | null;
  discount: number | null;
  afterDiscountPrice: number | null;
  lastUpdateTime: string;
  attributes: IMaterialAttributeWarehouse[];
};

export type IMaterialAttributeWarehouse = {
  name: string;
  value: string;
};

export type IUnit = {
  name: string;
};
