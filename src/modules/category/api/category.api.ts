import api from "@/core/http/client"
import type { Paginated } from "@/types/api"
import type { Category } from "@/types/category"

export function fetchCategory(
  page = 1,
  search = "",
  status = "all"
) {
  return api.get<Paginated<Category>>(`/categories`,{
    params: {
      page,
      search,
      status
    }
  })
}

export function createCategory(payload: {
  name: string;}) {
  return api.post("/categories", payload);
}
export function updateCategory( 
id:number,
payload: {
  name: string;}) {
  return api.put(`/categories/${id}`, payload);
}
