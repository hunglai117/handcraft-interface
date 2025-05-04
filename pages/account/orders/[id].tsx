import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { withAuth } from '@/utils/withAuth';
import { useOrder } from '@/contexts/OrderContext';
import { OrderStatus, PaymentStatus, PaymentMethod } from '@/services/orderService';
import { formatPriceVND } from '@/utils';

function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { currentOrder, loading, error, fetchOrderDetails, cancelOrder, createPaymentUrl } = useOrder();
  const [cancelLoading, setCancelLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchOrderDetails(id);
    }
  }, [id, fetchOrderDetails]);

  const handleCancelOrder = async () => {
    if (!currentOrder) return;

    setCancelLoading(true);
    const success = await cancelOrder(currentOrder.id);
    setCancelLoading(false);

    if (success) {
      setShowCancelConfirm(false);
    }
  };

  const handleCreatePayment = async () => {
    if (!currentOrder) return;

    setPaymentLoading(true);
    const paymentUrl = await createPaymentUrl(currentOrder.id);
    setPaymentLoading(false);

    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string; label: string }> = {
      [OrderStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      [OrderStatus.PROCESSING]: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      [OrderStatus.SHIPPED]: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      [OrderStatus.DELIVERED]: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      [OrderStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      [OrderStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      [OrderStatus.PAID]: { color: 'bg-green-100 text-green-800', label: 'Paid' },
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[status].color}`}>
        {statusMap[status].label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusMap: Record<PaymentStatus, { color: string; label: string }> = {
      [PaymentStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      [PaymentStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      [PaymentStatus.FAILED]: { color: 'bg-red-100 text-red-800', label: 'Failed' },
      [PaymentStatus.REFUNDED]: { color: 'bg-blue-100 text-blue-800', label: 'Refunded' },
      [PaymentStatus.PARTIALLY_REFUNDED]: { color: 'bg-gray-100 text-gray-800', label: 'Partially Refunded' },
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[status].color}`}>
        {statusMap[status].label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const methodMap: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH_ON_DELIVERY]: 'Cash on Delivery',
      [PaymentMethod.BANK_TRANSFER]: 'Bank Transfer',
      [PaymentMethod.CREDIT_CARD]: 'Credit Card',
      [PaymentMethod.VNPAY]: 'VNPay',
    };

    return methodMap[method];
  };

  const canCancelOrder =
    currentOrder &&
    [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(currentOrder.orderStatus) &&
    currentOrder.paymentStatus !== PaymentStatus.COMPLETED;

  const needsPayment =
    currentOrder &&
    currentOrder.paymentMethod !== PaymentMethod.CASH_ON_DELIVERY &&
    currentOrder.paymentStatus === PaymentStatus.PENDING;

  return (
    <Layout title="Order Details">
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6">
              <Link href="/account/orders" className="text-primary hover:underline flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Orders
              </Link>
            </div>

            <h1 className="text-3xl font-heading mb-8">Order Details</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            {loading ? (
              <div className="flex justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : currentOrder ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">#{currentOrder.id.substring(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date Placed</p>
                      <p className="font-medium">{new Date(currentOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Status</p>
                      <div className="mt-1">{getOrderStatusBadge(currentOrder.orderStatus)}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <div className="mt-1">{getPaymentStatusBadge(currentOrder.paymentStatus)}</div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-medium mb-4">Items</h2>
                  <div className="divide-y divide-gray-200">
                    {currentOrder.orderItems.map(item => (
                      <div key={item.id} className="py-4 flex flex-wrap md:flex-nowrap">
                        <div className="md:w-24 w-full flex-shrink-0 mb-4 md:mb-0">
                          {item.productVariant.images && item.productVariant.images[0] && (
                            <div className="relative h-24 w-24 rounded overflow-hidden">
                              <Image
                                src={item.productVariant.images[0]}
                                alt={item.productVariant.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <div className="md:ml-6 flex-grow">
                          <h3 className="text-lg font-medium">{item.productVariant.name}</h3>
                          <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="w-full md:w-auto mt-2 md:mt-0">
                          <p className="font-medium text-right">{formatPriceVND(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-medium mb-4">Summary</h2>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">{formatPriceVND(currentOrder.totalPrice)}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">Free</p>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <p className="text-lg font-bold">Total</p>
                    <p className="text-lg font-bold">{formatPriceVND(currentOrder.totalPrice)}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                  <p>{getPaymentMethodLabel(currentOrder.paymentMethod)}</p>
                </div>

                {/* Shipping Address */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-medium mb-4">Shipping Address</h2>
                  <p className="mb-1">{currentOrder.shippingAddress.fullName}</p>
                  <p className="mb-1">{currentOrder.shippingAddress.phone}</p>
                  <p className="mb-1">{currentOrder.shippingAddress.address}</p>
                  <p className="mb-1">
                    {currentOrder.shippingAddress.city}
                    {currentOrder.shippingAddress.state && `, ${currentOrder.shippingAddress.state}`}
                    {currentOrder.shippingAddress.zipCode && ` ${currentOrder.shippingAddress.zipCode}`}
                  </p>
                  <p>{currentOrder.shippingAddress.country}</p>
                </div>

                {/* Action buttons */}
                <div className="p-6 flex flex-wrap gap-4">
                  {canCancelOrder && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                    >
                      Cancel Order
                    </button>
                  )}

                  {needsPayment && (
                    <button
                      onClick={handleCreatePayment}
                      disabled={paymentLoading}
                      className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded flex items-center"
                    >
                      {paymentLoading ? (
                        <>
                          <span className="inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        'Pay Now'
                      )}
                    </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-medium mb-4">Cancel Order</h3>
            <p className="mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                No, Keep Order
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
                  'Yes, Cancel Order'
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
