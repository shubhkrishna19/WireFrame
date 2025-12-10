import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as dataStore from '../store/dataStore';
import { Category, Product } from '../data/mockData';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required'),
  price: z.number().min(0, 'Price must be positive'),
  originalPrice: z.number().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  images: z.string().min(1, 'At least one image URL is required'),
  thumbnail: z.string().min(1, 'Thumbnail URL is required'),
  sizes: z.string().min(1, 'Sizes are required'),
  colors: z.string().min(1, 'Colors are required'),
  stock: z.number().min(0, 'Stock must be 0 or more'),
  sku: z.string().min(1, 'SKU is required'),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  tags: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  fitType: z.string().optional(), // Changed to string for furniture (was enum for clothing)
  customBottomText: z.string().max(50, 'Custom bottom text must be 50 characters or less').optional(),
  customStockText: z.string().max(30, 'Custom stock text must be 30 characters or less').optional(),
  displayTags: z.string().optional(), // Comma-separated tags to display (max 2)
  showDiscount: z.boolean().optional(),
  discountDisplayText: z.string().max(20, 'Discount display text must be 20 characters or less').optional(),
  // Specifications
  fabric: z.string().optional(),
  fabricComposition: z.string().optional(),
  gsm: z.number().optional(),
  weight: z.string().optional(),
  fit: z.string().optional(),
  pattern: z.string().optional(),
  sleeveLength: z.string().optional(),
  neckType: z.string().optional(),
  collarType: z.string().optional(),
  closure: z.string().optional(),
  pockets: z.string().optional(),
  careInstructions: z.string().optional(),
  countryOfOrigin: z.string().optional(),
  season: z.string().optional(),
  occasion: z.string().optional(),
  material: z.string().optional(),
  breathable: z.boolean().optional(),
  stretchable: z.boolean().optional(),
  wrinkleFree: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onProductAdded: () => void;
  editingProductId?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, editingProductId }) => {
  const [activeSection, setActiveSection] = useState<'basic' | 'pricing' | 'images' | 'specifications'>('basic');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({}); // color -> base64 image - unused for now
  const [colorImages, setColorImages] = useState<Record<string, string[]>>({}); // color -> array of image URLs

  // State for async loaded data
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);


  // Load categories and editing product
  useEffect(() => {
    const loadData = async () => {

      try {
        // Load categories
        const cats = await dataStore.getCategories();
        setCategories(cats || []);

        // Load editing product if editingProductId is provided
        if (editingProductId) {
          const product = await dataStore.getProductById(editingProductId);
          setEditingProduct(product || null);
        } else {
          setEditingProduct(null);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setCategories([]);
        setEditingProduct(null);
      } finally {

      }
    };

    loadData();
  }, [editingProductId]);

  // Initialize colorImages from editingProduct
  useEffect(() => {
    if (editingProduct?.colorImages) {
      setColorImages(editingProduct.colorImages);
    }
  }, [editingProduct]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    // reset, // unused for now
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: editingProduct ? {
      name: editingProduct.name,
      slug: editingProduct.slug,
      description: editingProduct.description,
      categoryId: editingProduct.categoryId,
      brand: editingProduct.brand,
      price: editingProduct.price,
      originalPrice: editingProduct.originalPrice,
      discountPercentage: editingProduct.discountPercentage,
      images: editingProduct.images.join('\n'),
      thumbnail: editingProduct.thumbnail,
      sizes: editingProduct.sizes.join(','),
      colors: editingProduct.colors.join(','),
      stock: editingProduct.stock,
      sku: editingProduct.sku,
      rating: editingProduct.rating,
      reviewCount: editingProduct.reviewCount,
      tags: editingProduct.tags.join(','),
      isActive: editingProduct.isActive,
      isFeatured: editingProduct.isFeatured,
      fitType: editingProduct.fitType,
      customBottomText: editingProduct.customBottomText,
      customStockText: editingProduct.customStockText,
      displayTags: editingProduct.displayTags?.join(',') || '',
      showDiscount: editingProduct.showDiscount !== false, // Default to true if not set
      discountDisplayText: editingProduct.discountDisplayText || '',
      fabric: editingProduct.specifications?.fabric,
      fabricComposition: editingProduct.specifications?.fabricComposition,
      gsm: editingProduct.specifications?.gsm,
      weight: editingProduct.specifications?.weight ?? undefined,
      fit: editingProduct.specifications?.fit,
      pattern: editingProduct.specifications?.pattern,
      sleeveLength: editingProduct.specifications?.sleeveLength,
      neckType: editingProduct.specifications?.neckType,
      collarType: editingProduct.specifications?.collarType,
      closure: editingProduct.specifications?.closure,
      pockets: editingProduct.specifications?.pockets,
      careInstructions: editingProduct.specifications?.careInstructions?.join('\n'),
      countryOfOrigin: editingProduct.specifications?.countryOfOrigin,
      season: editingProduct.specifications?.season,
      occasion: editingProduct.specifications?.occasion,
      material: editingProduct.specifications?.material,
      breathable: editingProduct.specifications?.breathable,
      stretchable: editingProduct.specifications?.stretchable,
      wrinkleFree: editingProduct.specifications?.wrinkleFree,
    } : {
      isActive: true,
      isFeatured: false,
      rating: 0,
      reviewCount: 0,
      discountPercentage: 0,
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    if (!watch('slug')) {
      setValue('slug', generateSlug(name));
    }
  };

  // Image upload handler for thumbnail
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setValue('thumbnail', base64);
    };
    reader.readAsDataURL(file);
  };



  // Remove color image
  const removeColorImage = (color: string, index: number) => {
    setColorImages(prev => {
      const newImages = [...(prev[color] || [])];
      newImages.splice(index, 1);
      return { ...prev, [color]: newImages };
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse arrays from strings
      const images = data.images.split(',').map(img => img.trim()).filter(Boolean);
      const sizes = data.sizes.split(',').map(s => s.trim()).filter(Boolean);
      const colors = data.colors.split(',').map(c => c.trim()).filter(Boolean);
      const tags = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const displayTags = data.displayTags ? data.displayTags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 2) : []; // Max 2 tags
      const careInstructions = data.careInstructions
        ? data.careInstructions.split('\n').map(i => i.trim()).filter(Boolean)
        : [];

      // If editing, check if slug changed and conflicts with another product
      if (!editingProductId) {
        const existing = await dataStore.getProductBySlug(data.slug);
        if (existing) {
          setError('A product with this slug already exists. Please change the slug.');
          setIsLoading(false);
          return;
        }
      } else {
        // When editing, allow same slug if it's the same product
        const existing = await dataStore.getProductBySlug(data.slug);
        if (existing && existing._id !== editingProductId) {
          setError('A product with this slug already exists. Please change the slug.');
          setIsLoading(false);
          return;
        }
      }

      // Create product object
      const productData = {
        name: data.name,
        slug: data.slug,
        description: data.description,
        categoryId: data.categoryId,
        brand: data.brand,
        price: data.price,
        originalPrice: data.originalPrice,
        discountPercentage: data.discountPercentage,
        images,
        thumbnail: data.thumbnail,
        sizes,
        colors,
        stock: data.stock,
        sku: data.sku,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        tags,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        fitType: data.fitType,
        customBottomText: data.customBottomText,
        customStockText: data.customStockText,
        displayTags: displayTags.length > 0 ? displayTags : undefined,
        showDiscount: data.showDiscount !== false, // Default to true
        discountDisplayText: data.discountDisplayText,
        colorImages: Object.keys(colorImages).length > 0 ? colorImages : undefined,
        updatedAt: Date.now(),
        specifications: {
          fabric: data.fabric,
          fabricComposition: data.fabricComposition,
          gsm: data.gsm,
          weight: data.weight,
          fit: data.fit,
          pattern: data.pattern,
          sleeveLength: data.sleeveLength,
          neckType: data.neckType,
          collarType: data.collarType,
          closure: data.closure,
          pockets: data.pockets,
          careInstructions: careInstructions.length > 0 ? careInstructions : undefined,
          countryOfOrigin: data.countryOfOrigin,
          season: data.season,
          occasion: data.occasion,
          material: data.material,
          breathable: data.breathable,
          stretchable: data.stretchable,
          wrinkleFree: data.wrinkleFree,
        },
      };

      if (editingProductId) {
        // Update existing product
        dataStore.updateProduct(editingProductId, productData);
        setSuccess('Product updated successfully!');
      } else {
        // Add new product
        const newProduct = {
          ...productData,
          _id: `prod-${Date.now()}`,
          createdAt: Date.now(),
        };
        dataStore.addProduct(newProduct);
        setSuccess('Product added successfully!');
      }

      setTimeout(() => {
        onProductAdded();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Section Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          {(['basic', 'pricing', 'images', 'specifications'] as const).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${activeSection === section
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {section}
            </button>
          ))}
        </nav>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        aria-label={editingProduct ? 'Edit product form' : 'Create product form'}
        noValidate
      >
        {/* Basic Information */}
        {activeSection === 'basic' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                {...register('name')}
                onChange={handleNameChange}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="e.g., Rivodz King Size Bed with Storage"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
              </label>
              <input
                {...register('slug')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.slug ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="e.g., classic-white-tshirt-men"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Auto-generated from name, but you can edit it</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Detailed product description..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  {...register('categoryId')}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.categoryId ? 'border-red-300' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand *
                </label>
                <input
                  {...register('brand')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.brand ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="e.g., Bluewud"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  {...register('sku')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.sku ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="e.g., MUL-TSH-001"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock *
                </label>
                <input
                  {...register('stock', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.stock ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sizes (comma-separated) *
              </label>
              <input
                {...register('sizes')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.sizes ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="e.g., S, M, L, XL, XXL"
              />
              {errors.sizes && (
                <p className="mt-1 text-sm text-red-600">{errors.sizes.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colors (comma-separated hex codes) *
              </label>
              <input
                {...register('colors')}
                type="text"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.colors ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="e.g., #FFFFFF, #000000, #1E40AF, #DC2626"
              />
              {errors.colors && (
                <p className="mt-1 text-sm text-red-600">{errors.colors.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                {...register('tags')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., casual, cotton, summer"
              />
              <p className="mt-1 text-xs text-gray-500">All available tags for this product</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Tags on Card (Select max 2 tags to show on product card)
              </label>
              <input
                {...register('displayTags')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Relaxed Fit, Premium (comma-separated, max 2)"
              />
              <p className="mt-1 text-xs text-gray-500">
                Select up to 2 tags from your tags list above. These will appear on the product card (excluding Popular badge and discount badge which are separate).
              </p>
              {watch('tags') && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {watch('tags')?.split(',').filter(Boolean).map((tag: string) => {
                    const tagName = tag.trim();
                    const currentDisplayTags = watch('displayTags')?.split(',').filter(Boolean).map(t => t.trim()) || [];
                    const isSelected = currentDisplayTags.includes(tagName);
                    const canSelect = currentDisplayTags.length < 2 || isSelected;

                    return (
                      <button
                        key={tagName}
                        type="button"
                        onClick={() => {
                          const current = watch('displayTags')?.split(',').filter(Boolean).map(t => t.trim()) || [];
                          if (isSelected) {
                            setValue('displayTags', current.filter(t => t !== tagName).join(','));
                          } else if (canSelect) {
                            setValue('displayTags', [...current, tagName].slice(0, 2).join(','));
                          }
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded transition-all ${isSelected
                          ? 'bg-primary-600 text-white'
                          : canSelect
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        disabled={!canSelect}
                      >
                        {tagName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Fit Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Oversized', 'Slim Fit', 'Classic', 'Regular Fit', 'Relaxed Fit', 'Athletic Fit', 'Formal Fit', 'Skinny Fit'].map((fit) => (
                    <label key={fit} className="flex items-center p-3 border-2 border-gray-200 rounded-creative hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-all">
                      <input
                        {...register('fitType')}
                        type="radio"
                        value={fit}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm font-semibold text-gray-700">{fit}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    {...register('isActive')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...register('isFeatured')}
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-700">Featured</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Pricing */}
        {activeSection === 'pricing' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (â‚¹) *
                </label>
                <input
                  {...register('price', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.price ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="599"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (â‚¹)
                </label>
                <input
                  {...register('originalPrice', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="899"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage (%)
                </label>
                <input
                  {...register('discountPercentage', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="33"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (0-5)
                </label>
                <input
                  {...register('rating', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="4.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Count
              </label>
              <input
                {...register('reviewCount', { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="128"
              />
            </div>

            {/* Discount Display Customization */}
            {watch('discountPercentage') && watch('discountPercentage')! > 0 && (
              <div className="border-t pt-4 space-y-4 mt-4">
                <h4 className="text-md font-semibold text-gray-900">Discount Badge Display</h4>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      {...register('showDiscount')}
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-700">Show discount badge on product card</span>
                  </label>
                </div>

                {watch('showDiscount') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Discount Display Text (Optional)
                    </label>
                    <input
                      {...register('discountDisplayText')}
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={`e.g., SAVE ${watch('discountPercentage')}% or -${watch('discountPercentage')}%`}
                      maxLength={20}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Custom text for discount badge. Leave empty to use default: -{watch('discountPercentage')}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Images */}
        {activeSection === 'images' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image *
              </label>
              <div className="flex gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <input
                  {...register('thumbnail')}
                  type="url"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.thumbnail ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Or enter thumbnail URL..."
                />
              </div>
              {errors.thumbnail && (
                <p className="mt-1 text-sm text-red-600">{errors.thumbnail.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Upload an image or enter a URL</p>
            </div>

            {/* General Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images *
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    Array.from(e.target.files || []).forEach(file => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const base64 = event.target?.result as string;
                        const currentImages = watch('images') || '';
                        const newImages = currentImages ? `${currentImages}\n${base64}` : base64;
                        setValue('images', newImages);
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <textarea
                  {...register('images')}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.images ? 'border-red-300' : 'border-gray-300'
                    }`}
                  placeholder="Or enter image URLs (one per line or comma-separated)..."
                />
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Upload images or enter URLs (one per line or comma-separated)</p>
            </div>

            {/* Color-Specific Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color-Specific Images (Multiple images per color)
              </label>
              <div className="space-y-4">
                {watch('colors')?.split(',').filter(Boolean).map((color: string) => {
                  const colorName = color.trim();
                  const images = colorImages[colorName] || [];

                  const moveImage = (fromIndex: number, toIndex: number) => {
                    if (fromIndex === toIndex) return;
                    setColorImages(prev => {
                      const newImages = [...(prev[colorName] || [])];
                      const [moved] = newImages.splice(fromIndex, 1);
                      newImages.splice(toIndex, 0, moved);
                      return { ...prev, [colorName]: newImages };
                    });
                  };

                  return (
                    <div key={colorName} className="border border-gray-300 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{colorName}</h4>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            Array.from(e.target.files || []).forEach(file => {
                              // Validate file
                              if (!file.type.startsWith('image/')) {
                                setError('Please upload image files only');
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                setError('Image size must be less than 5MB');
                                return;
                              }

                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64 = event.target?.result as string;
                                setColorImages(prev => ({
                                  ...prev,
                                  [colorName]: [...(prev[colorName] || []), base64]
                                }));
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                          className="text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} alt={`${colorName} ${idx + 1}`} className="w-full h-24 object-cover rounded border border-gray-300" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded flex items-center justify-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, idx - 1)}
                                  className="bg-white/90 hover:bg-white text-gray-800 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Move left"
                                  aria-label={`Move ${colorName} image ${idx + 1} left`}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                              )}
                              {idx < images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, idx + 1)}
                                  className="bg-white/90 hover:bg-white text-gray-800 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Move right"
                                  aria-label={`Move ${colorName} image ${idx + 1} right`}
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeColorImage(colorName, idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              aria-label={`Remove ${colorName} image ${idx + 1}`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              {idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                      {images.length === 0 && (
                        <p className="text-xs text-gray-500 mt-2">No images uploaded for this color yet. Drag and drop or click to upload.</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {!watch('colors') && (
                <p className="text-sm text-gray-500">Add colors in the Basic Information section first</p>
              )}
            </div>

            {/* Customizable Text Fields */}
            <div className="border-t pt-4 space-y-4">
              <h4 className="text-md font-semibold text-gray-900">Product Card Bottom Text (Manual Selection)</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bottom Left Text (e.g., "100% Cotton", "Premium Quality", "Merino Wool")
                </label>
                <input
                  {...register('customBottomText')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 100% Cotton"
                  maxLength={50}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Manual text selection for bottom left of product card. If empty, will show fabric type from specifications.
                </p>
                {watch('fabric') && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 mb-1">Available from specifications:</p>
                    <button
                      type="button"
                      onClick={() => setValue('customBottomText', watch('fabric') || '')}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                    >
                      Use: {watch('fabric')}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bottom Right Text (e.g., "In Stock", "Limited Edition", "Pre-Order", "New Arrival")
                </label>
                <input
                  {...register('customStockText')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., In Stock"
                  maxLength={30}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Manual text selection for bottom right of product card. If empty, will show default stock status (In Stock / Low Stock).
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['In Stock', 'Limited Edition', 'Pre-Order', 'New Arrival', 'Best Seller', 'Sale'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setValue('customStockText', option)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specifications */}
        {activeSection === 'specifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric
                </label>
                <input
                  {...register('fabric')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 100% Organic Cotton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric Composition
                </label>
                <input
                  {...register('fabricComposition')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 100% Cotton"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSM (Grams per Square Meter)
                </label>
                <input
                  {...register('gsm', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="180"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  {...register('weight')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 180 GSM"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fit
                </label>
                <input
                  {...register('fit')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Regular Fit, Slim Fit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pattern
                </label>
                <input
                  {...register('pattern')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Solid, Floral, Striped"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sleeve Length
                </label>
                <input
                  {...register('sleeveLength')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Short Sleeve, Long Sleeve"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Neck Type
                </label>
                <input
                  {...register('neckType')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Round Neck, V-Neck"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collar Type
                </label>
                <input
                  {...register('collarType')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Ribbed Collar, Polo Collar"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closure
                </label>
                <input
                  {...register('closure')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Pullover, Button, Zipper"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pockets
              </label>
              <input
                {...register('pockets')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 5 Pockets (2 Front, 2 Back, 1 Coin)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country of Origin
                </label>
                <input
                  {...register('countryOfOrigin')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., India"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season
                </label>
                <input
                  {...register('season')}
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., All Season, Summer, Winter"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Occasion
              </label>
              <input
                {...register('occasion')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Casual, Formal, Party"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <input
                {...register('material')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Cotton, Denim, Polyester"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Care Instructions (one per line)
              </label>
              <textarea
                {...register('careInstructions')}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Machine wash cold&#10;Do not bleach&#10;Tumble dry low&#10;Iron on low heat"
              />
            </div>

            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  {...register('breathable')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Breathable</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register('stretchable')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Stretchable</span>
              </label>
              <label className="flex items-center">
                <input
                  {...register('wrinkleFree')}
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Wrinkle Free</span>
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setActiveSection(activeSection === 'basic' ? 'pricing' : activeSection === 'pricing' ? 'images' : 'specifications');
              }}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {activeSection === 'basic' && 'Next: Pricing â†’'}
              {activeSection === 'pricing' && 'Next: Images â†’'}
              {activeSection === 'images' && 'Next: Specifications â†’'}
              {activeSection === 'specifications' && 'â† Back to Images'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Product...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};


