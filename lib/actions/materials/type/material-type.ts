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
  weightValue: number;
  salePrice: number;
  costPrice: number;
  materialCode: string;
  minStock: number;
  brand: string;
  discount: number | null;
  afterDiscountPrice: number | null;
  isRewardEligible: boolean;
  imageUrl: string;
  isActive: boolean;
  subImages: ISubimage[];
};

export type IVariants = {
  variantId: string;
  sku: string;
  price: number;
  costPrice: number;
  image: string;
  conversionUnitId: string;
  discount: number | null;
  afterDiscountPrice: number | null;
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
  weight: number;
  supplier: string | null; // Assuming supplier can be null
  quantity: number;
  minStock: number;
  maxStock: number;
  materialPrice: number;
  materialCostPrice: number;
  variantPrice: number;
  parentCategory: string;
  category: string;
  variantCostPrice: number | null;
  discount: string | null;
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
