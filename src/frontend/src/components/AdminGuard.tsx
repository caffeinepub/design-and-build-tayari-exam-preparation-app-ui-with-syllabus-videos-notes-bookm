import { ReactNode } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsAdmin } from '@/hooks/useQueries';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  // Show loading state
  if (!identity || isAdminLoading) {
    return (
      <div className="min-h-screen app-page-bg flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </Card>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!identity) {
    return (
      <div className="min-h-screen app-page-bg flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Authentication Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please log in to access the admin panel.
          </p>
          <Button
            onClick={login}
            disabled={loginStatus === 'logging-in'}
            className="w-full"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
          </Button>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen app-page-bg flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            You do not have permission to access the admin panel.
          </p>
        </Card>
      </div>
    );
  }

  // Render children if admin
  return <>{children}</>;
}
