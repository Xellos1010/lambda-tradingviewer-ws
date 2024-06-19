import { Product } from "./Product";


export interface ListProductsResponse {
  products: Product[];
  num_products: number;
}
