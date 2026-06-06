export interface Stock {
  id: number;

  product_id: number;
  product_name: string;
  sku: string;

  price: number;

  brand_name: string;
  brand_image: string | null;

  category: string;

  warehouse_id: number;

  quantity: number;

  stock_status: string;
}

export interface StockLedger {
    id:number,
    warehouse: string,
    product: string,
    sku: string,
    type: string,
    quantity: number,
    reference: number,
    performed_by: string,
}
export interface StockTransfer {
    id:number,
    from_warehouse_name: string,
    to_warehouse_name: string,
    product_name: string,
    user_name: string,
    quantity: number,
    status: string,
}