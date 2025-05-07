import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { withAuth } from '@/utils/withAuth';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import cartService, { Cart, CartItem } from '@/services/cartService';
import { PaymentMethod, PlaceOrderDto } from '@/services/orderService';
import { formatPriceVND } from '@/utils';
import Image from 'next/image';
export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createOrder, verifyPromoCode } = useOrder();
  const [cart, setCart] = useState<Cart>({} as Cart);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string>('');
  const [promoValid, setPromoValid] = useState(false);
  const [checkingPromo, setCheckingPromo] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.VNPAY);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    fetchCart();
  }, [user, router]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();

      // Redirect to cart if empty
      if (!data.cartItems || data.cartItems.length === 0) {
        router.push('/cart');
        return;
      }

      setCart(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleVerifyPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setCheckingPromo(true);
    setPromoMessage('');
    setPromoValid(false);

    try {
      const result = await verifyPromoCode(promoCode);
      if (result && result.valid && result.promotion) {
        if(cart.subtotal < result.promotion.minimumOrderAmount) {
            setPromoMessage('Order subtotal must be greater than ' + formatPriceVND(result.promotion.minimumOrderAmount.toString()));
          setPromoValid(false);
          return;
        }
      }
      setPromoMessage(result.message || 'Promo code applied successfully!');
      setPromoValid(result.valid);
      setDiscount(result.promotion?.discountValue || 0);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setPromoMessage('Failed to verify code. Please try again.');
      setPromoValid(false);
    } finally {
      setCheckingPromo(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate shipping address
    const requiredFields: Array<keyof ShippingAddress> = ['fullName', 'phone', 'address', 'city', 'country'];

    const missingFields = requiredFields.filter(field => !shippingAddress[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    setProcessingOrder(true);
    setError('');

    try {
      const orderData: PlaceOrderDto = {
        paymentInfo: { paymentMethod },
        shippingInfo: shippingAddress,
        promotion: promoValid ? { code: promoCode } : undefined,
        items: cart.cartItems.map(item => item.id),
      };

      // Ensure promotion is only included if the subtotal meets the minimum order amount
      if (!promoValid ) {
        orderData.promotion = undefined;
      }

      const order = await createOrder(orderData);

      if (order) {
        // if (paymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
          // Redirect to order confirmation page
          router.push(order.paymentUrl || `/checkout/success?orderId=${order.id}`);
        // } else {
        //   // For online payment methods, redirect to payment gateway
        //   router.push(`/checkout/payment?orderId=${order.id}`);
        // }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Checkout">
        <div className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const calculateTotal = () => {
    if (!cart) return 0;
    const subtotal = cart.subtotal;
    return promoValid ? subtotal - (subtotal * discount) / 100 : subtotal;
  };

  return (
    <Layout title="Checkout">
      <div className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-heading mb-8">Checkout</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Shipping and Payment Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="fullName" className="block mb-1 font-medium">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={shippingAddress.fullName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block mb-1 font-medium">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block mb-1 font-medium">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="address" className="block mb-1 font-medium">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="city" className="block mb-1 font-medium">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="country" className="block mb-1 font-medium">
                          Country *
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="vnpay"
                        name="payment-method"
                        checked={paymentMethod === PaymentMethod.VNPAY}
                        onChange={() => setPaymentMethod(PaymentMethod.VNPAY)}
                        className="mr-2"
                      />
                      <label htmlFor="vnpay" className="font-medium">
                        VNPay
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
                  <h2 className="text-2xl font-semibold border-b pb-4">Order Summary</h2>

                  {/* Cart Items */}
                  <div className="space-y-4">
                    {cart?.cartItems?.map((item: CartItem) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-20 h-20 relative rounded overflow-hidden border">
                          {item.productVariant.image && (
                            <Image
                              src={item.productVariant.image}
                              alt={item.productVariant.title}
                              fill
                              className="object-cover"
                            />
                          )}
                          <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold shadow">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.productVariant.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatPriceVND((item.productVariant.price * item.quantity).toString())}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo Code */}
                  <div className="border-t pt-4">
                    <form onSubmit={handleVerifyPromoCode} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                        style={{ width:'80%' }}
                      />
                      <button
                        type="submit"
                        disabled={checkingPromo || !promoCode}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-50"
                      >
                        {checkingPromo ? 'Checking...' : 'Apply'}
                      </button>
                    </form>
                    {promoMessage && (
                      <p className={`mt-2 text-sm ${promoValid ? 'text-green-600' : 'text-red-600'}`}>{promoMessage}</p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 border-t pt-4 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPriceVND(cart.subtotal.toString())}</span>
                    </div>
                    {promoValid && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount</span>
                        <span>-{formatPriceVND(((cart.subtotal * discount) / 100).toString())}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPriceVND(calculateTotal().toString())}</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processingOrder || !cart}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark disabled:opacity-50 flex justify-center items-center font-semibold"
                  >
                    {processingOrder ? (
                      <>
                        <span className="inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                        Processing...
                      </>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(CheckoutPage);
