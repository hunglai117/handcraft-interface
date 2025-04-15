import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { CartProvider } from '../context/CartContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Discover handcrafted products for your home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CartProvider>
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
              <p className="text-primary font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </CartProvider>
    </>
  );
}

export default MyApp;
