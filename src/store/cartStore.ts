// Shopping cart store using API service
import { Product } from '../data/mockData';
import { cartService } from '../services/cartService';
import { logger } from '../utils/logger';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number; // Price at time of adding to cart
  size?: string;
  color?: string;
  subtotal?: number;
  addedAt: number; // Timestamp when item was added to cart
}





// Cache for cart data
let cartCache: CartItem[] | null = null;
let cartCacheTime = 0;
const CACHE_DURATION = 5000; // 5 seconds

// Get cart from API with localStorage fallback
export const getCart = async (): Promise<CartItem[]> => {
  // Return cached cart if still valid
  if (cartCache !== null && Date.now() - cartCacheTime < CACHE_DURATION) {
    return cartCache;
  }

  try {
    const apiCart = await cartService.getCart();
    // Transform API response to our internal format
    cartCache = apiCart.items.map(item => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      unitPrice: item.price,
      size: item.size,
      color: item.color,
      subtotal: item.subtotal,
      addedAt: Date.now(), // Timestamp when fetched from API
    }));
    cartCacheTime = Date.now();
    return cartCache || [];
  } catch (error) {
    logger.log('API not available, using localStorage for cart');
    // Fallback to localStorage
    const stored = localStorage.getItem('bluewud_cart');
    cartCache = stored ? JSON.parse(stored) : [];
    cartCacheTime = Date.now();
    return cartCache || [];
  }
};

// Clear cart cache
const clearCartCache = () => {
  cartCache = null;
  cartCacheTime = 0;
};

// Add item to cart with validation
export const addToCart = async (
  product: Product,
  size: string,
  color: string,
  quantity: number = 1
): Promise<{ success: boolean; item?: CartItem; message?: string }> => {
  try {
    // Prepare data for API
    const addToCartData = {
      productId: product._id,
      quantity,
      selectedSize: size,
      selectedColor: color,
    };

    const apiCart = await cartService.addToCart(addToCartData);

    // Find the added item in the response
    const addedItem = apiCart.items.find(
      item =>
        item.productId === product._id &&
        item.size === size &&
        item.color === color
    );

    if (addedItem) {
      const transformedItem: CartItem = {
        id: addedItem.id,
        productId: addedItem.productId,
        variantId: addedItem.variantId,
        name: addedItem.name,
        image: addedItem.image,
        quantity: addedItem.quantity,
        unitPrice: addedItem.price,
        size: addedItem.size,
        color: addedItem.color,
        subtotal: addedItem.subtotal,
        addedAt: Date.now(),
      };

      return { success: true, item: transformedItem };
    } else {
      return { success: false, message: 'Failed to add item to cart' };
    }
  } catch (error: any) {
    logger.log('API not available, using localStorage for cart');
    // Fallback to localStorage
    try {
      const cart = await getCart();
      const existingItemIndex = cart.findIndex(
        item =>
          item.productId === product._id &&
          item.size === size &&
          item.color === color
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        cart[existingItemIndex].quantity += quantity;
        cart[existingItemIndex].subtotal = cart[existingItemIndex].unitPrice * cart[existingItemIndex].quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: product._id,
          name: product.name,
          image: product.thumbnail,
          quantity,
          unitPrice: product.price,
          size,
          color,
          subtotal: product.price * quantity,
          addedAt: Date.now(),
        };
        cart.push(newItem);
      }

      localStorage.setItem('bluewud_cart', JSON.stringify(cart));
      clearCartCache(); // Invalidate cache
      return { success: true, item: cart[existingItemIndex >= 0 ? existingItemIndex : cart.length - 1] };
    } catch (localError) {
      console.error('Error with localStorage cart:', localError);
      return { success: false, message: 'Failed to add item to cart' };
    }
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId: string): Promise<void> => {
  try {
    await cartService.removeCartItem(cartItemId);
    clearCartCache();
  } catch (error) {
    console.error('Error removing item from cart:', error);
    // Still clear cache on error to force refresh
    clearCartCache();
    throw error;
  }
};

// Update item quantity with validation
export const updateCartItemQuantity = async (cartItemId: string, quantity: number): Promise<{ success: boolean; message?: string }> => {
  try {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return { success: true };
    }

    // Prepare data for API - we'll need to get the current item to know size/color
    const cart = await getCart();
    const cartItem = cart.find(item => item.id === cartItemId);

    if (!cartItem) {
      return { success: false, message: 'Item not found in cart' };
    }

    const updateData = {
      quantity,
      selectedSize: cartItem.size,
      selectedColor: cartItem.color,
    };

    const updatedCart = await cartService.updateCartItem(cartItemId, updateData);
    clearCartCache();

    // Find the updated item in the response
    const updatedItem = updatedCart.items.find(item => item.id === cartItemId);

    if (updatedItem) {
      return { success: true };
    } else {
      return { success: false, message: 'Failed to update item in cart' };
    }
  } catch (error: any) {
    console.error('Error updating cart item quantity:', error);
    let message = 'Failed to update item quantity';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return { success: false, message };
  }
};

// Clear entire cart
export const clearCart = async (): Promise<void> => {
  try {
    await cartService.clearCart();
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Get cart total
export const getCartTotal = async (): Promise<number> => {
  try {
    const apiCart = await cartService.getCart();
    return apiCart.total;
  } catch (error) {
    console.error('Error getting cart total:', error);
    return 0;
  }
};

// Get cart item count (total quantity across all items)
export const getCartItemCount = async (): Promise<number> => {
  try {
    const apiCart = await cartService.getCart();
    return apiCart.itemCount;
  } catch (error) {
    console.error('Error getting cart item count:', error);
    return 0;
  }
};

// Get cart items count (unique items)
export const getCartItemsCount = async (): Promise<number> => {
  try {
    const cart = await getCart();
    return cart.length;
  } catch (error) {
    console.error('Error getting cart items count:', error);
    return 0;
  }
};

// Apply coupon to cart
export const applyCoupon = async (couponCode: string): Promise<{ success: boolean; message?: string }> => {
  try {
    await cartService.applyCoupon(couponCode);
    return { success: true };
  } catch (error: any) {
    console.error('Error applying coupon:', error);
    let message = 'Failed to apply coupon';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return { success: false, message };
  }
};

