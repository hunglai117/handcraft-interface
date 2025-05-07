import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { withAuth } from '@/utils/withAuth';
import { useOrder } from '@/contexts/OrderContext';
import { OrderStatus } from '@/services/orderService';
import { formatPriceVND } from '@/utils';

function OrdersPage() {
  const { orders, loading, error, pagination, fetchUserOrders } = useOrder();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUserOrders(currentPage);
  }, [currentPage]);

  const getOrderStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, { color: string; label: string }> = {
      [OrderStatus.PENDING]: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      [OrderStatus.PROCESSING]: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      [OrderStatus.SHIPPED]: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      [OrderStatus.DELIVERED]: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      [OrderStatus.CANCELLED]: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
      [OrderStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      [OrderStatus.PAID]: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      [OrderStatus.READY_TO_SHIP]: { color: 'bg-indigo-100 text-indigo-800', label: 'Ready to Ship' },
      [OrderStatus.ON_HOLD]: { color: 'bg-gray-100 text-gray-800', label: 'On Hold' },
      [OrderStatus.OUT_FOR_DELIVERY]: { color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
      [OrderStatus.REFUNDED]: { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
      [OrderStatus.PARTIALLY_REFUNDED]: { color: 'bg-gray-100 text-gray-800', label: 'Partially Refunded' },
      [OrderStatus.REFUND_REQUESTED]: { color: 'bg-yellow-50 text-yellow-700', label: 'Refund Requested' },
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusMap[status]?.color || ''}`}>
        {statusMap[status]?.label || status}
      </span>
    );
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === i ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
          disabled={currentPage === pagination.totalPages}
          className="mx-1 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <Layout title="My Orders">
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-heading mb-8">My Orders</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            {loading ? (
              <div className="flex justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Link href="/products" legacyBehavior>
                  <a className="inline-block bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">
                    Browse Products
                  </a>
                </Link>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map(order => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <Link href={`/account/orders/${order.id}`} legacyBehavior>
                              <a className="text-primary hover:text-primary-dark hover:underline hover:bg-gray-100 px-2 py-1 rounded">
                              #{order.id.substring(0, 8)}
                              </a>
                            </Link>
                            </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {/* {new Date(order.).toLocaleDateString()} */}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatPriceVND(order.totalAmount.toString())}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getOrderStatusBadge(order.orderStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/account/orders/${order.id}`} legacyBehavior>
                              <a className="text-primary hover:text-primary-dark">View Details</a>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination?.totalPages > 1 && renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(OrdersPage);
