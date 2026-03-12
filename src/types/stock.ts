export interface Stock {
    id:number,
    product_id: number,
    product_name: string,
    brand: string,
    category: string,
    quantity: number,
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