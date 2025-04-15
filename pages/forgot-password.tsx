import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Mock API call - replace with actual reset password logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Forgot Password">
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
              <h1 className="font-heading text-h1 mb-2">Forgot Password</h1>
              <p className="text-gray-600">
                {!isSubmitted
                  ? "Enter your email address and we'll send you a link to reset your password."
                  : "Check your email for password reset instructions."}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                      Sending...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <svg
                  className="w-16 h-16 text-green-600 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-green-600 font-medium mb-4">Email sent successfully!</p>
                <p className="text-gray-600 mb-6">
                  If an account exists with the email <strong>{email}</strong>, you will receive
                  password reset instructions shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline"
                >
                  Try another email
                </button>
              </div>
            )}

            <div className="text-center mt-6">
              <Link href="/login" className="text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
