import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '@/integrations/supabase/test-connection';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export function SupabaseConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      setLoading(true);
      const result = await testSupabaseConnection();
      setIsConnected(result);
      setLoading(false);
    };

    checkConnection();
  }, []);

  if (loading) {
    return (
      <Alert>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Testing Database Connection</AlertTitle>
        </div>
        <AlertDescription>Please wait...</AlertDescription>
      </Alert>
    );
  }

  if (isConnected) {
    return (
      <Alert variant="default" className="border-green-500 bg-green-500/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle>Database Connected</AlertTitle>
        </div>
        <AlertDescription>Successfully connected to Supabase!</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <div className="flex items-center gap-2">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
      </div>
      <AlertDescription>
        Failed to connect to the database. Please check your configuration.
      </AlertDescription>
    </Alert>
  );
}
