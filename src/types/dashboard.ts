/**
 * Represents stock breakdown per warehouse
 */
export interface WarehouseStockSummary {
  warehouse: string;
  total_quantity: number;   // ideally backend should return number
  total_products: number;
}

export interface DashboardSummary {
  total_products: number;
  total_warehouses: number;
  total_stock_quantity: number;
  low_stock_items: number;
  stock_per_warehouse: WarehouseStockSummary[];
}