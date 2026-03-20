import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Scale, AlertTriangle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setLoading(false);
    }
    // On success, Supabase will redirect to /auth/callback
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      toast({ 
        title: 'Demo Mode', 
        description: 'Authentication is not available in demo mode. Please contact the administrator.', 
        variant: 'destructive' 
      });
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Logged in successfully' });
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to manage your law firm profile</CardDescription>
        </CardHeader>
        <CardContent>
          {!isConfigured && (
            <>
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Demo mode: Authentication is currently unavailable.
              </AlertDescription>
            </Alert>
          <div className="mb-4">
            <Button
              type="button"
              className="w-full"
              onClick={handleGoogle}
              disabled={loading || !isConfigured}
            >
              {loading ? 'Redirecting…' : 'Continue with Google'}
            </Button>
          </div>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          </>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !isConfigured}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <Link to="/reset-password" className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
