export type ICategory = {
    id: string;
    name: string;
    subCategories: ISubCategory[];
};

export type ISubCategory = {
    id: string;
    name: string;
};