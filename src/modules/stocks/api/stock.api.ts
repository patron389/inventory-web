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
