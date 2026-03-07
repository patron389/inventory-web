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

export function createWarehouse(payload: {
  name: string
  code: string
  location: string
  contact_person: string
  contact_phone: string
  contact_email: string
  description: string
}) {
  return api.post("/warehouses", payload)
}
export function updateWarehouse(
  id:number,
  payload: {
  name: string
  code: string
  location: string
  contact_person: string
  contact_phone: string
  contact_email: string
  description: string
}) {
  return api.put(`/warehouses/${id}`, payload)
}
