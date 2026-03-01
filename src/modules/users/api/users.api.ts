import api from "@/core/http/client";
import type { Paginated } from "@/types/api";
import type { User, Role } from "@/types/user";

/**
 * Fetch paginated users from backend
 * 
 * page → current page number
 */
export function fetchUsers(
  page = 1,
  search = "",
  status = "all"
) {
  return api.get(`/users`, {
    params: {
      page,
      search,
      status
    }
  })
}
export function fetchRoles() {
  return api.get<{ data: Role[] }>("/roles");
}


/**
 * Create new user
 */
export function createUser(payload: {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_no: string;
  password: string;
  role: string;
}) {
  return api.post("/users", payload);
}

/**
 * Update existing user
 */
export function updateUser(
  id: number,
  payload: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_no: string;
    is_active: boolean;
    role: string;
  }
) {
  return api.put(`/users/${id}`, payload);
}