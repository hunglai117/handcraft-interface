import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options = { requireAuth: true, redirectTo: '/login' }
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (options.requireAuth && !user) {
          router.replace(options.redirectTo);
        }
      }
    }, [user, isLoading, router]);

    // Show nothing while loading or redirecting
    if (isLoading || (options.requireAuth && !user)) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-primary font-medium">Loading...</p>
          </div>
        </div>
      );
    }

    // Render the component with all props passed through
    return <Component {...props} />;
  };
}
