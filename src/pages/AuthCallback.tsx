import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, loading, isConfigured } = useAuth();

  useEffect(() => {
    // When Supabase finishes OAuth, the session will be restored and `user` will be set.
    if (!isConfigured) {
      navigate('/');
      return;
    }
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate, isConfigured]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Signing you in…</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-2 text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Please wait</span>
        </CardContent>
      </Card>
    </div>
  );
}
