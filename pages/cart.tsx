import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const shippingCost = subtotal > 100 ? 0 : 12.99;
  const tax = subtotal * 0.07; // 7% tax rate
  const total = subtotal + shippingCost + tax - couponDiscount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock coupon validation - in a real app, you would check against valid coupon codes
    if (couponCode.toLowerCase() === 'welcome10') {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.1); // 10% discount
    } else {
      alert('Invalid coupon code');
    }
  };

  return (
    <Layout title="Shopping Cart">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-heading text-h1 mb-8 text-center">Your Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-subtle">
                    <tr>
                      <th className="py-4 px-6 text-left">Product</th>
                      <th className="py-4 px-6 text-center">Price</th>
                      <th className="py-4 px-6 text-center">Quantity</th>
                      <th className="py-4 px-6 text-right">Subtotal</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.product.id} className="border-t border-gray-200">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="relative h-16 w-16 mr-4 flex-shrink-0">
                              <Image
                                src={item.product.image || '/images/placeholder.jpg'}
                                alt={item.product.name}
                                fill
                                className="object-cover rounded"
                              />
                            </div>
                            <div>
                              <Link href={`/product/${item.product.id}`} className="font-medium hover:text-primary">
                                {item.product.name}
                              </Link>
                              {item.product.category && (
                                <p className="text-gray-500 text-small">{item.product.category}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">${item.product.price.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <div className="flex border border-gray-300 rounded w-fit mx-auto">
                            <button
                              className="px-3 py-1 border-r border-gray-300 hover:bg-gray-100"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="w-12 text-center py-1">{item.quantity}</span>
                            <button
                              className="px-3 py-1 border-l border-gray-300 hover:bg-gray-100"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-gray-500 hover:text-red-600"
                            aria-label="Remove item"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-6">
                <Link href="/products" className="btn-secondary inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Continue Shopping
                </Link>

                <button onClick={clearCart} className="text-gray-500 hover:text-red-600 font-medium">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-heading text-h2 mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>
                      Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (10%)</span>
                      <span>-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mt-6">
                  <form onSubmit={handleApplyCoupon}>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-primary"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        disabled={couponApplied}
                      />
                      <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-r font-medium hover:bg-accent"
                        disabled={couponApplied || !couponCode}
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && <p className="text-green-600 text-small mt-2">Coupon applied successfully!</p>}
                  </form>
                </div>

                <button className="w-full btn-primary mt-6">Proceed to Checkout</button>

                <div className="mt-6 text-center">
                  <p className="text-small text-gray-500">Secure Checkout</p>
                  <div className="flex justify-center space-x-2 mt-2">
                    <span className="text-gray-400">
                      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="24" rx="4" fill="currentColor" />
                        <path d="M15.5152 15.8683H13.2303L14.4331 8.11719H16.718L15.5152 15.8683Z" fill="white" />
                        <path
                          d="M22.5363 8.3233C22.008 8.11683 21.158 7.875 20.1026 7.875C17.7924 7.875 16.1266 9.15469 16.1154 10.9611C16.0939 12.267 17.3227 13.0008 18.2397 13.425C19.1781 13.8594 19.4796 14.1389 19.4744 14.5286C19.4675 15.1252 18.7343 15.3975 18.0475 15.3975C17.0939 15.3975 16.5964 15.2475 15.8054 14.8883L15.502 14.7516L15.18 16.7127C15.8003 16.9772 16.9769 17.2103 18.1977 17.2214C20.663 17.2214 22.2975 15.9588 22.3138 14.0347C22.324 12.9605 21.6836 12.1394 20.2943 11.5094C19.4283 11.0925 18.8895 10.8108 18.8948 10.3911C18.8948 10.0119 19.331 9.61687 20.2644 9.61687C21.0263 9.60031 21.5646 9.78562 21.9765 9.98C22.2453 10.1019 22.4571 10.208 22.6115 10.208L22.5363 8.3233Z"
                          fill="white"
                        />
                        <path
                          d="M25.4166 13.0778C25.5848 12.6167 26.4165 10.2692 26.4165 10.2692C26.4009 10.297 26.6324 9.65742 26.7602 9.26328L26.8603 10.1681C26.8603 10.1681 27.3646 12.695 27.4443 13.0778C27.1772 13.0778 25.7287 13.0778 25.4166 13.0778ZM28.4882 8.11719H26.7257C26.2832 8.11719 25.9494 8.24406 25.7611 8.7614L22.7578 15.8683H25.2237C25.2237 15.8683 25.6857 14.6252 25.7699 14.4086C25.9977 14.4086 27.9579 14.4086 28.2482 14.4086C28.3126 14.68 28.5613 15.8683 28.5613 15.8683H30.763L28.4882 8.11719Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-400">
                      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="24" rx="4" fill="currentColor" />
                        <path
                          d="M22.2622 7.71875H17.7378C14.4286 7.71875 11.75 10.3974 11.75 13.7066V16.2816C11.75 19.5908 14.4286 22.2695 17.7378 22.2695H22.2622C25.5714 22.2695 28.25 19.5908 28.25 16.2816V13.7066C28.25 10.3974 25.5714 7.71875 22.2622 7.71875Z"
                          fill="#FF5F00"
                        />
                        <path
                          d="M17.7378 7.71875C14.4286 7.71875 11.75 10.3974 11.75 13.7066V16.2816C11.75 19.5908 14.4286 22.2695 17.7378 22.2695H20V7.71875H17.7378Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M28.25 13.7066V16.2816C28.25 19.5908 25.5714 22.2695 22.2622 22.2695H20V7.71875H22.2622C25.5714 7.71875 28.25 10.3974 28.25 13.7066Z"
                          fill="#FF9900"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-400">
                      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="24" rx="4" fill="currentColor" />
                        <path
                          d="M28.774 15.6844C28.774 15.6844 29.0448 14.1646 29.104 13.8527H27.1027C27.1027 13.8527 27.3271 15.3658 27.3271 15.6158C27.3271 15.8657 27.1346 16.1658 26.8751 16.1658C26.6155 16.1658 15.8329 16.1658 15.8329 16.1658C15.8329 16.1658 16.0809 14.9423 16.1561 14.7342H14.1357C14.1357 14.7342 13.8398 15.6463 13.769 15.9284C13.6983 16.2105 13.5912 16.8841 14.3148 16.8841H28.0701C28.0701 16.8841 28.774 16.8841 28.774 15.6844Z"
                          fill="#3C58BF"
                        />
                        <path
                          d="M29.104 13.8531C29.104 13.8531 27.5384 10.277 27.2841 9.69046C27.0298 9.10392 26.6951 7.875 24.7761 7.875C22.8571 7.875 14.886 7.875 14.886 7.875C14.886 7.875 14.1247 7.875 13.6295 8.59327C13.1343 9.31154 10.896 15.5061 10.896 15.5061C10.896 15.5061 10.625 16.1656 11.3486 16.1656C12.0722 16.1656 22.7818 16.1656 22.7818 16.1656C22.7818 16.1656 22.908 13.8531 22.7818 13.8531C22.6557 13.8531 16.1561 13.8531 16.1561 13.8531C16.1561 13.8531 16.0298 14.7344 16.1561 14.7344H27.1026C27.1026 14.7344 27.3429 13.8531 29.104 13.8531Z"
                          fill="white"
                        />
                        <path
                          d="M14.1357 14.7344H16.1561L16.9196 11.9844H14.899L14.1357 14.7344ZM18.1766 11.9844L17.4131 14.7344H19.4334L20.197 11.9844H18.1766ZM21.454 11.9844L20.6905 14.7344H22.7108L23.4744 11.9844H21.454ZM24.4949 11.9844L23.7313 14.7344H25.7518L26.5153 11.9844H24.4949Z"
                          fill="#3C58BF"
                        />
                        <path
                          d="M29.104 13.8531H27.1027L26.5154 11.9844H24.4951L25.7518 14.7344H16.1561L16.0706 14.9423C16.0706 14.9423 13.8398 15.6463 13.769 15.9284C13.6983 16.2105 13.5912 16.8841 14.3148 16.8841H28.0701C28.0701 16.8841 28.774 16.8841 28.774 15.6844C28.774 15.6844 29.0448 14.1646 29.104 13.8531Z"
                          fill="#293688"
                        />
                      </svg>
                    </span>
                    <span className="text-gray-400">
                      <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="24" rx="4" fill="currentColor" />
                        <path
                          d="M20 16.2344C21.767 16.2344 23.2 14.8014 23.2 13.0344C23.2 11.2674 21.767 9.83437 20 9.83437C18.233 9.83437 16.8 11.2674 16.8 13.0344C16.8 14.8014 18.233 16.2344 20 16.2344Z"
                          fill="#006FCF"
                        />
                        <path
                          d="M26.55 8.125H13.45C11.9 8.125 10.625 9.4 10.625 10.95V19.05C10.625 20.6 11.9 21.875 13.45 21.875H26.55C28.1 21.875 29.375 20.6 29.375 19.05V10.95C29.375 9.4 28.1 8.125 26.55 8.125ZM20 17.5C17.525 17.5 15.5 15.475 15.5 13C15.5 10.525 17.525 8.5 20 8.5C22.475 8.5 24.5 10.525 24.5 13C24.5 15.475 22.475 17.5 20 17.5Z"
                          fill="#006FCF"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="font-heading text-h2 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
