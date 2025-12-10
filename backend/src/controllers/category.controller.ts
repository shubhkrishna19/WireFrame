import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { sendSuccess } from '../utils/response.util';
import { asyncHandler } from '../middleware/error.middleware';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    sendSuccess(res, categories);
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);

    if (!category) {
        res.status(404).json({
            success: false,
            message: 'Category not found'
        });
        return;
    }

    sendSuccess(res, category);
});
