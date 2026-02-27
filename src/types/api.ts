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
  data: T[];

  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };

  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

