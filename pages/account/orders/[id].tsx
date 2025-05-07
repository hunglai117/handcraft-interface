import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { withAuth } from '@/utils/withAuth';
import orderService, { Order, OrderStatus, PaymentStatus } from '@/services/orderService';
import { formatPriceVND } from '@/utils';
import { useAuth } from '@/contexts/AuthContext';

function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id && typeof id === 'string') {
      setLoading(true);
      orderService
        .getOrder(id)
        .then(res => {
          setOrder(res);
          setError(null);
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch(err => {
          setError('Unable to load order. Please try again later.');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;

    setCancelLoading(true);
    try {
      await orderService.cancelOrder(order.id);
      const updatedOrder = await orderService.getOrder(order.id);
      setOrder(updatedOrder);
      setShowCancelConfirm(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Failed to cancel the order. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      ready_to_ship: { color: 'bg-orange-100 text-orange-800', label: 'Ready to Ship' },
      on_hold: { color: 'bg-gray-100 text-gray-800', label: 'On Hold' },
      out_for_delivery: { color: 'bg-teal-100 text-teal-800', label: 'Out for Delivery' },
      refund_requested: { color: 'bg-pink-100 text-pink-800', label: 'Refund Requested' },
      refunded: { color: 'bg-blue-100 text-blue-800', label: 'Refunded' },
      partially_refunded: { color: 'bg-gray-100 text-gray-800', label: 'Partially Refunded' },
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[status].color}`}>
        {statusMap[status].label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusMap: Record<PaymentStatus, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Unpaid' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      failed: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      refunded: { color: 'bg-blue-100 text-blue-800', label: 'Refunded' },
      partially_refunded: { color: 'bg-gray-100 text-gray-800', label: 'Partially Refunded' },
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[status].color}`}>
        {statusMap[status].label}
      </span>
    );
  };

  const canCancelOrder =
    order &&
    [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(order.orderStatus) &&
    order.paymentStatus !== PaymentStatus.COMPLETED;

  const needsPayment =
    order &&
    order.orderStatus === OrderStatus.PENDING &&
    order.paymentStatus === PaymentStatus.PENDING &&
    !!order.paymentUrl;

  return (
    <Layout title="Order Details">
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <Link href="/account/orders" className="text-primary hover:underline flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to order list
              </Link>
            </div>

            <h1 className="text-3xl font-heading mb-8">Order Details</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            {loading ? (
              <div className="flex justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : order ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    {/* <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p> */}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">{getOrderStatusBadge(order.orderStatus)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-medium mb-4">Summary</h2>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">{formatPriceVND(order.totalAmount.toString())}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">Free</p>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <p className="text-lg font-bold">Total</p>
                    <p className="text-lg font-bold">{formatPriceVND(order.totalAmount.toString())}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
                  <p className="mb-1">{user?.fullName}</p>
                  <p className="mb-1">{order.shippingInfo.phone}</p>
                  <p className="mb-1">
                    {order.shippingInfo.address} - {order.shippingInfo.city} - {order.shippingInfo.country}
                  </p>
                </div>

                {/* Actions */}
                <div className="p-6 flex flex-wrap gap-4">
                  {canCancelOrder && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Cancel Order
                    </button>
                  )}
                  {needsPayment && order.paymentUrl && (
                    <Link
                      href={order.paymentUrl as string}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded text-center"
                    >
                      Pay Now
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">Order not found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      {showCancelConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Cancel Order</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                No
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center"
              >
                {cancelLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                    Processing...
                  </>
                ) : (
                  'Confirm Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default withAuth(OrderDetailPage);
