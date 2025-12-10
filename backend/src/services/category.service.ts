import { query } from '../config/database';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    parent_id?: string;
    created_at: Date;
    updated_at: Date;
}

export const getAllCategories = async (): Promise<Category[]> => {
    const result = await query<Category>(
        'SELECT * FROM categories ORDER BY name ASC'
    );
    return result.rows;
};

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
    const result = await query<Category>(
        'SELECT * FROM categories WHERE slug = ?',
        [slug]
    );
    return result.rows[0] || null;
};
