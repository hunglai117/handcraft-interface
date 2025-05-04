import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { withAuth } from '@/utils/withAuth';
import { useOrder } from '@/contexts/OrderContext';
import { useCart } from '@/contexts/CartContext';
import { formatPriceVND } from '@/utils';

function OrderSuccessPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const { currentOrder, fetchOrderDetails, loading, error } = useOrder();
  const { clearCart } = useCart();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (orderId && typeof orderId === 'string') {
      fetchOrderDetails(orderId);

      // Clear the cart after successful order
      clearCart();

      setIsLoaded(true);
    }
  }, [orderId, fetchOrderDetails, clearCart]);

  if (!isLoaded || loading) {
    return (
      <Layout title="Order Confirmed">
        <div className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Order Error">
        <div className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="inline-block mx-auto mb-6">
                  <svg
                    className="w-16 h-16 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h1 className="text-3xl font-heading mb-4">Order Error</h1>
                <p className="text-gray-600 mb-8">{error}</p>
                <Link
                  href="/account/orders"
                  className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark"
                >
                  View My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentOrder) {
    return (
      <Layout title="Order Not Found">
        <div className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="inline-block mx-auto mb-6">
                  <svg
                    className="w-16 h-16 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-heading mb-4">Order Not Found</h1>
                <p className="text-gray-600 mb-8">We couldn't find the order you're looking for.</p>
                <Link
                  href="/account/orders"
                  className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark"
                >
                  View My Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Order Confirmed">
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="inline-block mx-auto mb-6 bg-green-100 rounded-full p-3">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-3xl font-heading mb-2">Order Confirmed!</h1>
              <p className="text-xl mb-6">Thank you for your purchase</p>

              <div className="mb-8 text-left border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-gray-500">Order Number</p>
                    <p className="font-medium">#{currentOrder.id.substring(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">Order Date</p>
                    <p className="font-medium">{new Date(currentOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-bold">{formatPriceVND(currentOrder.totalPrice)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Payment Method</p>
                    <p>{currentOrder.paymentMethod.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-8">
                We've sent a confirmation email to your registered email address with all the details of your order.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href={`/account/orders/${currentOrder.id}`}
                  className="bg-primary text-white px-6 py-3 rounded hover:bg-primary-dark"
                >
                  View Order Details
                </Link>
                <Link href="/products" className="border border-gray-300 px-6 py-3 rounded hover:bg-gray-50">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(OrderSuccessPage);
