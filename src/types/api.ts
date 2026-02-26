// Standard success wrapper from backend
export interface ApiResponse<T> {
  data: T
  message?: string
}

// Standard Laravel validation error shape
export interface ValidationErrors {
  [field: string]: string[]
}

// This is the ONLY error shape the frontend will ever see
export interface ApiError {
  message: string;      // Human readable message
  status: number;       // HTTP status code
  errors?: ValidationErrors; // Optional validation errors
}

// Generic pagination contract
export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

