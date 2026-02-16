import { Router } from 'express';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getMonthlyTotals,
  getCategoryTotals,
} from '../controllers/expenseController';

const router = Router();

router.get('/', getExpenses);
router.get('/stats/monthly', getMonthlyTotals);
router.get('/stats/categories', getCategoryTotals);
router.get('/:id', getExpense);
router.post('/', createExpense);
router.patch('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
