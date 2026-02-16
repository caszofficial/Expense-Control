import axios from 'axios';
import type {
  Expense,
  Category,
  MonthlyTotal,
  CategoryTotal,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseFilters,
  ApiResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error making request');
    }
  }
);

// Expenses API
export const expensesApi = {
  getAll: async (filters?: ExpenseFilters): Promise<Expense[]> => {
    const { data } = await api.get<ApiResponse<Expense[]>>('/expenses', {
      params: filters,
    });
    return data.data || [];
  },

  getById: async (id: number): Promise<Expense> => {
    const { data } = await api.get<ApiResponse<Expense>>(`/expenses/${id}`);
    if (!data.data) throw new Error('Expense not found');
    return data.data;
  },

  create: async (expense: CreateExpenseDTO): Promise<Expense> => {
    const { data } = await api.post<ApiResponse<Expense>>('/expenses', expense);
    if (!data.data) throw new Error('Failed to create expense');
    return data.data;
  },

  update: async (id: number, expense: UpdateExpenseDTO): Promise<Expense> => {
    const { data } = await api.patch<ApiResponse<Expense>>(`/expenses/${id}`, expense);
    if (!data.data) throw new Error('Failed to update expense');
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  getMonthlyTotals: async (limit: number = 12): Promise<MonthlyTotal[]> => {
    const { data } = await api.get<ApiResponse<MonthlyTotal[]>>('/expenses/stats/monthly', {
      params: { limit },
    });
    return data.data || [];
  },

  getCategoryTotals: async (startDate?: string, endDate?: string): Promise<CategoryTotal[]> => {
    const { data } = await api.get<ApiResponse<CategoryTotal[]>>('/expenses/stats/categories', {
      params: { start_date: startDate, end_date: endDate },
    });
    return data.data || [];
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data || [];
  },

  getById: async (id: number): Promise<Category> => {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    if (!data.data) throw new Error('Category not found');
    return data.data;
  },

  create: async (name: string, color: string): Promise<Category> => {
    const { data } = await api.post<ApiResponse<Category>>('/categories', { name, color });
    if (!data.data) throw new Error('Failed to create category');
    return data.data;
  },

  update: async (id: number, name: string, color: string): Promise<Category> => {
    const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name, color });
    if (!data.data) throw new Error('Failed to update category');
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
