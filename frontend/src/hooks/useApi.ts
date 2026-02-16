import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi, categoriesApi } from '../services/api';
import type { CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilters } from '../types';

// Query Keys
export const queryKeys = {
  expenses: (filters?: ExpenseFilters) => ['expenses', filters] as const,
  expense: (id: number) => ['expense', id] as const,
  categories: ['categories'] as const,
  category: (id: number) => ['category', id] as const,
  monthlyTotals: (limit?: number) => ['monthlyTotals', limit] as const,
  categoryTotals: (startDate?: string, endDate?: string) => 
    ['categoryTotals', startDate, endDate] as const,
};

// Expenses Hooks
export const useExpenses = (filters?: ExpenseFilters) => {
  return useQuery({
    queryKey: queryKeys.expenses(filters),
    queryFn: () => expensesApi.getAll(filters),
  });
};

export const useExpense = (id: number) => {
  return useQuery({
    queryKey: queryKeys.expense(id),
    queryFn: () => expensesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDTO) => expensesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyTotals'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTotals'] });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExpenseDTO }) =>
      expensesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['monthlyTotals'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTotals'] });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => expensesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyTotals'] });
      queryClient.invalidateQueries({ queryKey: ['categoryTotals'] });
    },
  });
};

export const useMonthlyTotals = (limit: number = 12) => {
  return useQuery({
    queryKey: queryKeys.monthlyTotals(limit),
    queryFn: () => expensesApi.getMonthlyTotals(limit),
  });
};

export const useCategoryTotals = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: queryKeys.categoryTotals(startDate, endDate),
    queryFn: () => expensesApi.getCategoryTotals(startDate, endDate),
  });
};

// Categories Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => categoriesApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color: string }) =>
      categoriesApi.create(name, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, color }: { id: number; name: string; color: string }) =>
      categoriesApi.update(id, name, color),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.category(variables.id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
};
