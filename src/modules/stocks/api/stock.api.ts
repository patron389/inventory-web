import api from "@/core/http/client"
import type { Paginated } from "@/types/api"
import type { Stock } from "@/types/stock"

export function fetchStocks(
  page = 1,
  search = "",
  warehouse = 1
) {
  return api.get<Paginated<Stock>>(`/stocks`,{
    params: {
      page,
      search,
      warehouse_id: warehouse
    }
  })
}
export function fetchStockLedger(
  page = 1,
  search = "",
) {
  return api.get<Paginated<Stock>>(`/stock-movements`,{
    params: {
      page,
      search,
    }
  })
}
export const addStock = (data: any) => {
  return api.post("/stocks/add", data)
}

export const deductStock = (data: any) => {
  return api.post("/stocks/deduct", data)
}