import api from "@/core/http/client"
import type { Paginated } from "@/types/api"
import type { Brand } from "@/types/brand"

export function fetchBrands(
  page = 1,
  search = "",
  status = "all"
) {
  return api.get<Paginated<Brand>>(`/brands`,{
    params: {
      page,
      search,
      status
    }
  })
}

export const createBrand = (data: FormData) => {
  return api.post("/brands", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// export const updateBrand = (id: number, data: FormData) => {
//   return api.put(`/brands/${id}`, data, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
// };
export const updateBrand = (id: number, data: FormData) => {
  data.append("_method", "PUT");

  return api.post(`/brands/${id}`, data);
};
// export function deleteProduct(id: number) {
//   return api.delete(`/products/${id}`)
// }