export interface Product {
  id: number;
  name: string;
  sku: string;
  category_id: number;
  brand_id: number;
  unit: string;
  price: number;
  description: string;
  is_active: boolean;
}