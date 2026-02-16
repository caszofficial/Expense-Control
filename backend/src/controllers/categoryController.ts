import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { createCategorySchema } from '../validators/schemas';
import { asyncHandler } from '../middleware/errorHandler';

const categoryService = new CategoryService();

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();

  res.json({
    status: 'success',
    data: categories,
  });
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const category = await categoryService.getCategoryById(id);

  res.json({
    status: 'success',
    data: category,
  });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, color } = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(name, color);

  res.status(201).json({
    status: 'success',
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, color } = createCategorySchema.parse(req.body);
  const category = await categoryService.updateCategory(id, name, color);

  res.json({
    status: 'success',
    data: category,
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result = await categoryService.deleteCategory(id);

  res.json({
    status: 'success',
    data: result,
  });
});
