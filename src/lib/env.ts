// Environment variable validation and configuration
export interface AppConfig {
  supabase: {
    url: string;
    publishableKey: string;
    projectId?: string;
  };
  app: {
    nodeEnv: string;
    apiBaseUrl?: string;
    enableAnalytics: boolean;
    enableDebug: boolean;
  };
}

// Validate and parse environment variables
function validateEnvVar(name: string, value: string | undefined, required = true): string {
  if (!value && required) {
    throw new Error(
      `Missing required environment variable: ${name}. Please check your .env file and ensure it's properly configured.`
    );
  }
  return value || '';
}

function validateUrl(name: string, value: string): string {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error(
      `Invalid URL format for ${name}: ${value}. Please provide a valid URL.`
    );
  }
}

function parseBoolean(value: string | undefined, defaultValue = false): boolean {
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

// Create and validate configuration
export const config: AppConfig = (() => {
  try {
    const supabaseUrl = validateEnvVar('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL);
    const supabaseKey = validateEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
    
    return {
      supabase: {
        url: validateUrl('VITE_SUPABASE_URL', supabaseUrl),
        publishableKey: supabaseKey,
        projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
      },
      app: {
        nodeEnv: import.meta.env.NODE_ENV || 'development',
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        enableAnalytics: parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS),
        enableDebug: parseBoolean(import.meta.env.VITE_ENABLE_DEBUG),
      },
    };
  } catch (error) {
    console.error('❌ Environment Configuration Error:', error);
    
    // Show user-friendly error in development
    if (import.meta.env.DEV) {
      const errorDiv = document.createElement('div');
      errorDiv.innerHTML = `
        <div style="
          position: fixed; 
          top: 0; 
          left: 0; 
          right: 0; 
          bottom: 0; 
          background: #1a1a1a; 
          color: #ff6b6b; 
          padding: 2rem; 
          font-family: monospace; 
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        ">
          <h1 style="color: #ff6b6b; margin-bottom: 1rem;">⚠️ Configuration Error</h1>
          <p style="margin-bottom: 1rem; max-width: 600px; text-align: center;">
            ${error instanceof Error ? error.message : 'Unknown configuration error'}
          </p>
          <p style="color: #ffd93d; margin-bottom: 1rem;">
            Please check your .env file and ensure all required variables are set.
          </p>
          <div style="background: #2a2a2a; padding: 1rem; border-radius: 4px; margin-top: 1rem;">
            <p style="color: #4ecdc4; margin-bottom: 0.5rem;">Required variables:</p>
            <code style="color: #white;">
              VITE_SUPABASE_URL=https://your-project.supabase.co<br>
              VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
            </code>
          </div>
        </div>
      `;
      document.body.appendChild(errorDiv);
    }
    
    throw error;
  }
})();

// Export individual values for convenience
export const {
  supabase: { url: SUPABASE_URL, publishableKey: SUPABASE_PUBLISHABLE_KEY },
  app: { nodeEnv: NODE_ENV, enableDebug: ENABLE_DEBUG }
} = config;
