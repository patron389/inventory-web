import api from "@/core/http/client"
import type { Paginated } from "@/types/api"
import type { Product } from "@/types/product.type"

export function fetchProducts(
  page = 1,
  search = "",
  status = "all"
) {
  return api.get<Paginated<Product>>(`/products`,{
    params: {
      page,
      search,
      status
    }
  })
}

export function createProduct(payload: {
  name: string
  category_id: number
  brand_id: number
  sku: string
  unit: string
  description: string
  price: number
}) {
  return api.post("/products", payload)
}

export function updateProduct(
  id: number,
  payload: {
    name: string
    category_id: number
    brand_id: number
    sku: string
    unit: string
    description: string
    price: number
  }
) {
  return api.put(`/products/${id}`, payload)
}

export function deleteProduct(id: number) {
  return api.delete(`/products/${id}`)
}