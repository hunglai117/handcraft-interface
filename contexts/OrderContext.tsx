import { createContext, useState, useContext, ReactNode } from 'react';
import orderService, { Order, OrderStatus, PlaceOrderDto } from '@/services/orderService';
import { useAuth } from './AuthContext';
import promotionService, { Promotion } from '@/services/promotionService';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  fetchUserOrders: (page?: number) => Promise<void>;
  fetchOrderDetails: (orderId: string) => Promise<void>;
  createOrder: (orderData: PlaceOrderDto) => Promise<Order | null>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  // createPaymentUrl: (orderId: string) => Promise<string | null>;
  verifyPromoCode: (code: string) => Promise<{valid:boolean, promotion?:Promotion, message?:string}>;
  clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const { user } = useAuth();

  const fetchUserOrders = async (page: number = 1): Promise<void> => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await orderService.getOrders(page);
      setOrders(response.items);
      setPagination({
        currentPage: response.page,
        totalPages: response.totalPages,
        totalItems: response.total,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: string): Promise<void> => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const order = await orderService.getOrder(orderId);
      setCurrentOrder(order);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: PlaceOrderDto): Promise<Order | null> => {
    if (!user) return null;

    setLoading(true);
    setError(null);

    try {
      const newOrder = await orderService.placeOrder(orderData);
      setCurrentOrder(newOrder);
      return newOrder;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    if (!user) return false;

    setLoading(true);
    setError(null);

    try {
      await orderService.cancelOrder(orderId);

      // Update local state
      if (currentOrder && currentOrder.id === orderId) {
        setCurrentOrder({
          ...currentOrder,
          orderStatus: OrderStatus.CANCELLED,
        });
      }

      // Update in orders list if found
      setOrders(prevOrders =>
        prevOrders.map(order => (order.id === orderId ? { ...order, orderStatus: OrderStatus.CANCELLED } : order))
      );

      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // const createPaymentUrl = async (orderId: string): Promise<string | null> => {
  //   if (!user) return null;

  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const { paymentUrl } = await orderService.createPaymentUrl(orderId);
  //     return paymentUrl;
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to create payment URL');
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const verifyPromoCode = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await promotionService.validateCode(code);
      return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to verify promotion code');
      return { valid: false, discount: 0, message: err.message || 'Invalid code' };
    } finally {
      setLoading(false);
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        pagination,
        fetchUserOrders,
        fetchOrderDetails,
        createOrder,
        cancelOrder,
        // createPaymentUrl,
        verifyPromoCode,
        clearCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
