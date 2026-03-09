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