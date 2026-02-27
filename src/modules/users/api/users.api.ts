import api from "@/core/http/client";
import type { Paginated } from "@/types/api";
import type { User, Role } from "@/types/user";

/**
 * Fetch paginated users from backend
 * 
 * page → current page number
 */
export function fetchUsers(page = 1) {
  return api.get<Paginated<User>>(`/users?page=${page}`);
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
  password: string;
  role: string;
}) {
  return api.post("/users", payload);
}