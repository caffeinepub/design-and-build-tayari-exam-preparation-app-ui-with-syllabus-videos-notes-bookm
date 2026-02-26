import { LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export default function AuthControls() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      onClick={handleAuth}
      disabled={disabled}
    >
      {isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </>
      )}
    </Button>
  );
}
