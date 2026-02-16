import { Request, Response } from 'express';
import { ExpenseService } from '../services/expenseService';
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseFiltersSchema,
} from '../validators/schemas';
import { asyncHandler } from '../middleware/errorHandler';

const expenseService = new ExpenseService();

export const getExpenses = asyncHandler(async (req: Request, res: Response) => {
  const filters = expenseFiltersSchema.parse(req.query);
  const expenses = await expenseService.getAllExpenses(filters);

  res.json({
    status: 'success',
    data: expenses,
  });
});

export const getExpense = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const expense = await expenseService.getExpenseById(id);

  res.json({
    status: 'success',
    data: expense,
  });
});

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const data = createExpenseSchema.parse(req.body);
  const expense = await expenseService.createExpense(data);

  res.status(201).json({
    status: 'success',
    data: expense,
  });
});

export const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = updateExpenseSchema.parse(req.body);
  const expense = await expenseService.updateExpense(id, data);

  res.json({
    status: 'success',
    data: expense,
  });
});

export const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await expenseService.deleteExpense(id);

  res.json({
    status: 'success',
    data: result,
  });
});

export const getMonthlyTotals = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
  const totals = await expenseService.getMonthlyTotals(limit);

  res.json({
    status: 'success',
    data: totals,
  });
});

export const getCategoryTotals = asyncHandler(async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;
  const totals = await expenseService.getCategoryTotals(
    start_date as string,
    end_date as string
  );

  res.json({
    status: 'success',
    data: totals,
  });
});
