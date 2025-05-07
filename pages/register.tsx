import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const router = useRouter();
  const { register, user, isLoading, error } = useAuth();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setRegisterError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      const success = await register({
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      });

      if (success) {
        router.push('/login?registered=true');
      } else {
        setRegisterError(error || 'Registration failed');
      }
    } catch {
      setRegisterError('An unexpected error occurred');
    }
  };

  // Show loading state during initial auth check
  if (isLoading && !error) {
    return (
      <Layout title="Create Account">
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
    <Layout title="Create Account">
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="font-heading text-h1 mb-2">Create an Account</h1>
              <p className="text-gray-600">Join HandcraftBK to discover unique handcrafted products</p>
            </div>

            {(registerError || error) && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{registerError || error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2 font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                  minLength={8}
                />
                <p className="text-small text-gray-500 mt-1">Must be at least 8 characters long</p>
              </div>

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block mb-2 font-medium">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="mb-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor="agreeTerms" className="text-small text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
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
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
