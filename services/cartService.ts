import { get, post, put, del } from './api';
import { Product, ProductVariant } from './productService';

const PREFIX_PATH = '/cart';

export interface CartItem {
  id: string;
  cartId: string;
  productVariantId: string;
  productVariant: ProductVariant;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  cartItems: CartItem[];
  totalItems: number;
  subtotal: number;
}

export interface AddToCartRequest {
  productVariantId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

const cartService = {
  // Get the current user's cart
  getCart: () => get<Cart>(PREFIX_PATH),

  // Add a new item to the cart
  addToCart: (item: AddToCartRequest) => post<Cart>(`${PREFIX_PATH}/items`, item),

  // Update the quantity of an item in the cart
  updateCartItem: (itemId: string, data: UpdateCartItemRequest) => put<Cart>(`${PREFIX_PATH}/items/${itemId}`, data),

  // Remove an item from the cart
  removeCartItem: (itemId: string) => del<Cart>(`${PREFIX_PATH}/items/${itemId}`),

  // Clear the entire cart
  clearCart: () => del<Cart>(PREFIX_PATH),
};

export default cartService;
