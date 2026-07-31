import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/axios.js';
import { Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const HealthCheck: React.FC = () => {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<HealthResponse>({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/health'),
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-heading">System Health</h2>
              <p className="text-sm text-muted-foreground">Backend API status & telemetry</p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center space-x-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="mt-6 border-t pt-6">
          {isLoading && (
            <div className="py-8 text-center text-muted-foreground">
              Loading system health...
            </div>
          )}

          {isError && (
            <div className="flex items-center space-x-3 rounded-xl bg-destructive/10 p-4 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Backend Connection Error</p>
                <p className="text-xs">{(error as Error).message}</p>
              </div>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-green-500/10 p-4 text-green-600 dark:text-green-400">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">{data.message}</span>
                </div>
                <span className="rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-bold uppercase">
                  Online
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl bg-muted/50 p-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Environment
                  </span>
                  <p className="mt-1 font-mono font-medium text-foreground">{data.environment}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Uptime
                  </span>
                  <p className="mt-1 font-mono font-medium text-foreground">
                    {data.uptime.toFixed(2)} seconds
                  </p>
                </div>
                <div className="col-span-2 rounded-xl bg-muted/50 p-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    Server Timestamp
                  </span>
                  <p className="mt-1 font-mono font-medium text-foreground">{data.timestamp}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
