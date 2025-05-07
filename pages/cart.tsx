import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import cartService, { Cart} from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

const CartPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [removePrompt, setRemovePrompt] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    fetchCart();
  }, [user, router]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load cart');
      } else {
        setError('Failed to load cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    setUpdatingItems({ ...updatingItems, [itemId]: true });
    try {
      const updatedCart = await cartService.updateCartItem(itemId, { quantity });
      setCart(updatedCart);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to update item');
      } else {
        setError('Failed to update item');
      }
    } finally {
      setUpdatingItems({ ...updatingItems, [itemId]: false });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItems({ ...updatingItems, [itemId]: true });
    try {
      const updatedCart = await cartService.removeCartItem(itemId);
      setCart(updatedCart);
      setRemovePrompt(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to remove item');
      } else {
        setError('Failed to remove item');
      }
    } finally {
      setUpdatingItems({ ...updatingItems, [itemId]: false });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Layout title="Cart | HandcraftBK">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <Layout title="Your Cart | HandcraftBK">
        <div className="container mx-auto px-4 py-10 min-h-[70vh]">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link
              href="/products"
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Cart | HandcraftBK">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {error && <div className="mb-4 bg-red-100 text-red-700 p-4 rounded">{error}</div>}

        {removePrompt && (
            <div
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'fixed',
            }} 
            className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Remove Item</h3>
              <p className="mb-6">Are you sure you want to remove this item from your cart?</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  onClick={() => setRemovePrompt(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleRemoveItem(removePrompt)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            {cart.cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col sm:flex-row">
                <div className="sm:w-1/4 mb-4 sm:mb-0">
                  <div className="relative h-32 w-32 sm:h-full sm:w-full mx-auto">
                    <Image
                      src={item.productVariant.image || '/images/default_product.png'}
                      alt={item.productVariant.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded"
                    />
                  </div>
                </div>

                <div className="sm:w-3/4 sm:ml-6 flex flex-col justify-between">
                    <div>
                    <p className="font-semibold text-lg">
                      {item.productVariant.productName}
                    </p>
                    <div className="text-gray-600 mb-4">{item.productVariant.title} - {formatPrice(item.productVariant.price)}/each</div>
                    </div>

                  <div className="flex flex-wrap justify-between items-end">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <button
                        className="w-8 h-8 border border-gray-300 rounded-l flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingItems[item.id]}
                      >
                        -
                      </button>
                      <div className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                        {updatingItems[item.id] ? (
                          <div className="h-4 w-4 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
                        ) : (
                          item.quantity
                        )}
                      </div>
                      <button
                        className="w-8 h-8 border border-gray-300 rounded-r flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={updatingItems[item.id]}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="font-semibold">{formatPrice(item.productVariant.price * item.quantity)}</div>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setRemovePrompt(item.id)}
                        disabled={updatingItems[item.id]}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Estimated Total</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="w-full block text-center bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition"
                style={{color: 'white'}}
              
              >
                Proceed to Checkout
              </Link>

              <div className="mt-4">
                <Link href="/products" className="text-primary hover:underline text-center w-full block">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
