import { ProductVariant } from '@/lib/types/product.type';
import { get, post, put } from './api';

const PREFIX_PATH = '/orders';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  READY_TO_SHIP = 'ready_to_ship',
  ON_HOLD = 'on_hold',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUND_REQUESTED = 'refund_requested',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  VNPAY = 'vnpay',
  PAYPAL = 'paypal',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  productVariant: ProductVariant;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderPromotion {
  id: string;
  orderId: string;
  promotionId?: string;
  discountAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  shippingInfo: ShippingInfo;
  orderItems: OrderItem[];
  orderPromotions?: OrderPromotion[];
  paymentUrl?: string;
}

export interface ShippingInfo {
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface PlaceOrderDto {
  shippingInfo: ShippingInfo;
  promotion?: {
    code: string;
  };
  paymentInfo: {
    paymentMethod: PaymentMethod;
  };
  notes?: string;
  items: string[]; // Cart item IDs
}

export interface PaginatedOrderResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const orderService = {
  // Get all orders for the current user with pagination
  getOrders: (page = 1, limit = 10) => get<PaginatedOrderResponse>(`${PREFIX_PATH}?page=${page}&limit=${limit}`),

  // Get a specific order by ID
  getOrder: (orderId: string) => get<Order>(`${PREFIX_PATH}/${orderId}`),

  // Place a new order
  placeOrder: (orderData: PlaceOrderDto) => post<Order>(`${PREFIX_PATH}`, orderData),

  // Cancel an order
  cancelOrder: (orderId: string) => put<Order>(`${PREFIX_PATH}/${orderId}/cancel`),
};

export default orderService;
