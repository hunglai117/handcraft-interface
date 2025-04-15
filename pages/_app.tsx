import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useState, useEffect } from "react";
import Head from "next/head";
import { CartProvider } from "../contexts/CartContext";
import { AuthProvider } from "../contexts/AuthContext";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { registered } = router.query;
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);

  useEffect(() => {
    // Simulate loading time for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Show registration success message if redirected from registration
  useEffect(() => {
    if (registered === 'true') {
      setShowRegistrationSuccess(true);
      // Remove the query parameter from URL
      router.replace('/login', undefined, { shallow: true });
      
      // Auto hide the message after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowRegistrationSuccess(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }
  }, [registered, router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Discover handcrafted products for your home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
        <CartProvider>
          {isLoading ? (
            <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                <p className="text-primary font-medium">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {showRegistrationSuccess && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-md shadow-md z-50 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Account created successfully! You can now log in.
                  <button 
                    onClick={() => setShowRegistrationSuccess(false)}
                    className="ml-4 text-green-800 hover:text-green-900"
                  >
                    ✕
                  </button>
                </div>
              )}
              <Component {...pageProps} />
            </>
          )}
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
