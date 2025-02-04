export type GetProductsType = { products: ProductType[] };
export type ProductType = {
  id: string;
  slug: string;
  caption: string;
  imageSrc: string;
  rate: number;
  price: number;
  discount?: number;
  weight?: string;
  description?: string;
};
