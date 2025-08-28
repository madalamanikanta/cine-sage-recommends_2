import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ErrorStateProps {
  title?: string
  description?: string
  error?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading this content.",
  error,
  onRetry,
  className = ""
}: ErrorStateProps) {
  return (
    <Card className={`border-destructive/20 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="mb-6 p-4 bg-destructive/10 rounded-full">
          <AlertTriangle className="h-12 w-12 text-destructive" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        
        {error && (
          <Alert variant="destructive" className="mb-6 max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm font-mono">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
