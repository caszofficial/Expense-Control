export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category_id: number | null;
  date: string;
  category_name?: string;
  category_color?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyTotal {
  month: string;
  year: number;
  total: number;
  count: number;
}

export interface CategoryTotal {
  category_id: number | null;
  category_name: string;
  category_color: string;
  total: number;
  count: number;
  percentage: number;
}

export interface CreateExpenseDTO {
  description: string;
  amount: number;
  category_id: number | null;
  date: string;
}

export interface UpdateExpenseDTO {
  description?: string;
  amount?: number;
  category_id?: number | null;
  date?: string;
}

export interface ExpenseFilters {
  category_id?: number;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}
