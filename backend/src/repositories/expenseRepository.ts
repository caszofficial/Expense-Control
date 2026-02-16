import { query } from '../db/pool';
import {
  Expense,
  ExpenseWithCategory,
  CreateExpenseDTO,
  UpdateExpenseDTO,
  ExpenseFilters,
  MonthlyTotal,
  CategoryTotal,
} from '../types';

export class ExpenseRepository {
  async findAll(filters: ExpenseFilters = {}): Promise<ExpenseWithCategory[]> {
    let sql = `
      SELECT 
        e.*,
        c.name as category_name,
        c.color as category_color
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (filters.category_id !== undefined) {
      sql += ` AND e.category_id = $${paramCount}`;
      params.push(filters.category_id);
      paramCount++;
    }

    if (filters.start_date) {
      sql += ` AND e.date >= $${paramCount}`;
      params.push(filters.start_date);
      paramCount++;
    }

    if (filters.end_date) {
      sql += ` AND e.date <= $${paramCount}`;
      params.push(filters.end_date);
      paramCount++;
    }

    if (filters.min_amount !== undefined) {
      sql += ` AND e.amount >= $${paramCount}`;
      params.push(filters.min_amount);
      paramCount++;
    }

    if (filters.max_amount !== undefined) {
      sql += ` AND e.amount <= $${paramCount}`;
      params.push(filters.max_amount);
      paramCount++;
    }

    sql += ' ORDER BY e.date DESC, e.created_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  async findById(id: number): Promise<ExpenseWithCategory | null> {
    const result = await query(
      `
      SELECT 
        e.*,
        c.name as category_name,
        c.color as category_color
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = $1
      `,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateExpenseDTO): Promise<Expense> {
    const result = await query(
      `
      INSERT INTO expenses (description, amount, category_id, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [data.description, data.amount, data.category_id, data.date]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateExpenseDTO): Promise<Expense | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }

    if (data.amount !== undefined) {
      fields.push(`amount = $${paramCount}`);
      values.push(data.amount);
      paramCount++;
    }

    if (data.category_id !== undefined) {
      fields.push(`category_id = $${paramCount}`);
      values.push(data.category_id);
      paramCount++;
    }

    if (data.date !== undefined) {
      fields.push(`date = $${paramCount}`);
      values.push(data.date);
      paramCount++;
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    const result = await query(
      `
      UPDATE expenses
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
      `,
      values
    );

    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM expenses WHERE id = $1 RETURNING id', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  async getMonthlyTotals(limit: number = 12): Promise<MonthlyTotal[]> {
    const result = await query(
      `
      SELECT 
        TO_CHAR(date, 'Month') as month,
        EXTRACT(YEAR FROM date) as year,
        SUM(amount) as total,
        COUNT(*) as count
      FROM expenses
      GROUP BY TO_CHAR(date, 'Month'), EXTRACT(YEAR FROM date), DATE_TRUNC('month', date)
      ORDER BY DATE_TRUNC('month', date) DESC
      LIMIT $1
      `,
      [limit]
    );
    
    return result.rows.map(row => ({
      month: row.month.trim(),
      year: parseInt(row.year),
      total: parseFloat(row.total),
      count: parseInt(row.count),
    }));
  }

  async getCategoryTotals(startDate?: string, endDate?: string): Promise<CategoryTotal[]> {
    let sql = `
      SELECT 
        c.id as category_id,
        COALESCE(c.name, 'Sin categoría') as category_name,
        COALESCE(c.color, '#6b7280') as category_color,
        SUM(e.amount) as total,
        COUNT(e.id) as count,
        (SUM(e.amount) * 100.0 / (SELECT SUM(amount) FROM expenses WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (startDate) {
      sql += ` AND date >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      sql += ` AND date <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    sql += `)) as percentage
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE 1=1
    `;

    if (startDate) {
      sql += ` AND e.date >= $${params.indexOf(startDate) + 1}`;
    }

    if (endDate) {
      sql += ` AND e.date <= $${params.indexOf(endDate) + 1}`;
    }

    sql += `
      GROUP BY c.id, c.name, c.color
      ORDER BY total DESC
    `;

    const result = await query(sql, params);
    
    return result.rows.map(row => ({
      category_id: row.category_id,
      category_name: row.category_name,
      category_color: row.category_color,
      total: parseFloat(row.total),
      count: parseInt(row.count),
      percentage: parseFloat(row.percentage || 0),
    }));
  }
}
