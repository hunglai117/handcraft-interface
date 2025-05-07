import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const { login, user, isLoading, error } = useAuth();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const success = await login(credentials.email, credentials.password);
      if (success) {
        router.push('/'); // Redirect to home page after successful login
      } else {
        setLoginError(error || 'Invalid credentials');
      }
    } catch {
      setLoginError('An unexpected error occurred');
    }
  };

  // Show loading state during initial auth check
  if (isLoading && !error) {
    return (
      <Layout title="Login">
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-primary font-medium">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Login">
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="font-heading text-h1 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your HandcraftBK account</p>
            </div>

            {(loginError || error) && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{loginError || error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="font-medium">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-primary text-small hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="mr-2 cursor-pointer"
                  />
                  <label htmlFor="remember" className="text-small text-gray-600 cursor-pointer">
                    Remember me
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer btn-primary w-full flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <span className="cursor-pointer inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-5.8-4.698-10.5-10.498-10.5s-10.498 4.7-10.498 10.5c0 5.237 3.824 9.581 8.817 10.373v-7.337h-2.654v-3.036h2.654v-2.315c0-2.623 1.563-4.074 3.957-4.074 1.146 0 2.345.205 2.345.205v2.584h-1.32c-1.303 0-1.71.809-1.71 1.638v1.962h2.912l-.465 3.036h-2.447v7.337c4.993-.792 8.817-5.136 8.817-10.373z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
