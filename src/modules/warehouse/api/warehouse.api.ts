import api from "@/core/http/client"
import type { Paginated } from "@/types/api"
import type { Warehouse } from "@/types/warehouse"

export function fetchWarehouse(
  page = 1,
  search = "",
  status = "all"
) {
  return api.get<Paginated<Warehouse>>(`/warehouses`,{
    params: {
      page,
      search,
      status
    }
  })
}