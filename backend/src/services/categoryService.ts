import { CategoryRepository } from '../repositories/categoryRepository';

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async getAllCategories() {
    return await this.categoryRepo.findAll();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(name: string, color: string) {
    return await this.categoryRepo.create(name, color);
  }

  async updateCategory(id: number, name: string, color: string) {
    const updated = await this.categoryRepo.update(id, name, color);
    if (!updated) {
      throw new Error('Category not found');
    }
    return updated;
  }

  async deleteCategory(id: number) {
    const deleted = await this.categoryRepo.delete(id);
    if (!deleted) {
      throw new Error('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
