import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Use our logger for consistent logging
    import('@/lib/logger').then(({ logger }) => {
      logger.error('ErrorBoundary caught an error', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      }, 'ERROR_BOUNDARY');
    });
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isConfigError = this.state.error?.message?.includes('environment variable') || 
                           this.state.error?.message?.includes('VITE_SUPABASE');

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <Card className="max-w-lg w-full bg-gradient-card border-destructive/50">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-destructive">
                {isConfigError ? 'Configuration Error' : 'Something went wrong'}
              </CardTitle>
              <CardDescription>
                {isConfigError 
                  ? 'The application is missing required configuration. Please check your environment variables.'
                  : 'An unexpected error occurred. We apologize for the inconvenience.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {import.meta.env.DEV && this.state.error && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-mono text-muted-foreground break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              {isConfigError && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Required environment variables:
                  </p>
                  <code className="text-xs bg-background p-2 rounded block">
                    VITE_SUPABASE_URL=https://your-project.supabase.co<br />
                    VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
                  </code>
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <Button onClick={this.handleReset} variant="outline">
                  Try Again
                </Button>
                <Button onClick={this.handleReload} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
