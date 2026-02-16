import { query } from '../db/pool';
import { Category } from '../types';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const result = await query(
      'SELECT * FROM categories ORDER BY name ASC'
    );
    return result.rows;
  }

  async findById(id: number): Promise<Category | null> {
    const result = await query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(name: string, color: string): Promise<Category> {
    const result = await query(
      'INSERT INTO categories (name, color) VALUES ($1, $2) RETURNING *',
      [name, color]
    );
    return result.rows[0];
  }

  async update(id: number, name: string, color: string): Promise<Category | null> {
    const result = await query(
      'UPDATE categories SET name = $1, color = $2 WHERE id = $3 RETURNING *',
      [name, color, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM categories WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}
