import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useQueries';
import { Loader2 } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched } = useIsAdmin();

  // Wait for both identity initialization and admin check to complete
  if (isInitializing || isAdminLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to access the admin panel.
          </p>
          <p className="text-sm text-muted-foreground">
            Please log in using the login button in the navigation.
          </p>
        </div>
      </div>
    );
  }

  // Check if user has admin privileges
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access the admin panel.
          </p>
          <p className="text-sm text-muted-foreground">
            Only administrators can access this area.
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and is an admin - render children
  return <>{children}</>;
}
