import { ExpenseRepository } from '../repositories/expenseRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { CreateExpenseDTO, UpdateExpenseDTO, ExpenseFilters } from '../types';

export class ExpenseService {
  private expenseRepo: ExpenseRepository;
  private categoryRepo: CategoryRepository;

  constructor() {
    this.expenseRepo = new ExpenseRepository();
    this.categoryRepo = new CategoryRepository();
  }

  async getAllExpenses(filters: ExpenseFilters) {
    return await this.expenseRepo.findAll(filters);
  }

  async getExpenseById(id: number) {
    const expense = await this.expenseRepo.findById(id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return expense;
  }

  async createExpense(data: CreateExpenseDTO) {
    if (data.category_id !== null) {
      const category = await this.categoryRepo.findById(data.category_id);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    return await this.expenseRepo.create(data);
  }

  async updateExpense(id: number, data: UpdateExpenseDTO) {
    const existingExpense = await this.expenseRepo.findById(id);
    if (!existingExpense) {
      throw new Error('Expense not found');
    }

    if (data.category_id !== undefined && data.category_id !== null) {
      const category = await this.categoryRepo.findById(data.category_id);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const updated = await this.expenseRepo.update(id, data);
    if (!updated) {
      throw new Error('Failed to update expense');
    }

    return updated;
  }

  async deleteExpense(id: number) {
    const deleted = await this.expenseRepo.delete(id);
    if (!deleted) {
      throw new Error('Expense not found');
    }
    return { message: 'Expense deleted successfully' };
  }

  async getMonthlyTotals(limit: number = 12) {
    return await this.expenseRepo.getMonthlyTotals(limit);
  }

  async getCategoryTotals(startDate?: string, endDate?: string) {
    return await this.expenseRepo.getCategoryTotals(startDate, endDate);
  }
}
