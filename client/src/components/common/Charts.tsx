import React from 'react';

export interface BarChartItem {
  date: string;
  revenue: number;
  count?: number;
}

interface BarChartProps {
  data?: BarChartItem[];
  title?: string;
}

const DEFAULT_DAYS: BarChartItem[] = [
  { date: 'Mon', revenue: 0, count: 0 },
  { date: 'Tue', revenue: 0, count: 0 },
  { date: 'Wed', revenue: 0, count: 0 },
  { date: 'Thu', revenue: 0, count: 0 },
  { date: 'Fri', revenue: 0, count: 0 },
  { date: 'Sat', revenue: 0, count: 0 },
  { date: 'Sun', revenue: 0, count: 0 },
];

export const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const chartData = data && data.length > 0 ? data : DEFAULT_DAYS;
  const revenues = chartData.map((d) => Number(d.revenue) || 0);
  const maxRevenue = Math.max(...revenues, 50);

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      {title && <h3 className="text-base font-bold font-heading mb-6">{title}</h3>}
      
      <div className="flex h-64 items-end justify-between space-x-2 pt-6 pb-2 border-b border-border/50">
        {chartData.map((item, index) => {
          const rev = Number(item.revenue) || 0;
          const count = Number(item.count) || 0;
          const heightPercent = maxRevenue > 0 ? (rev / maxRevenue) * 100 : 0;
          
          return (
            <div key={index} className="group relative flex flex-1 flex-col items-center h-full justify-end">
              {/* Tooltip */}
              <div className="absolute -top-12 hidden rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1.5 text-center text-[11px] font-extrabold shadow-xl group-hover:block z-30 pointer-events-none whitespace-nowrap">
                <div>${rev.toFixed(2)}</div>
                <div className="text-[10px] opacity-80 font-medium">{count} order(s)</div>
              </div>

              {/* Bar */}
              <div className="w-full flex items-end justify-center px-1 h-full">
                <div
                  style={{ height: `${Math.max(heightPercent, rev > 0 ? 12 : 4)}%` }}
                  className={`w-full rounded-t-xl transition-all duration-300 ${
                    rev > 0
                      ? 'bg-gradient-to-t from-primary/80 via-primary to-orange-400 group-hover:from-primary group-hover:to-orange-500 shadow-md'
                      : 'bg-muted/60 group-hover:bg-muted'
                  }`}
                />
              </div>

              {/* Date Label */}
              <span className="mt-3 text-[11px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
                {item.date}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export interface StatusPieItem {
  status: string;
  count: number;
}

interface StatusPieProps {
  data?: StatusPieItem[];
  title?: string;
}

export const StatusPie: React.FC<StatusPieProps> = ({ data = [], title }) => {
  const total = data.reduce((sum, item) => sum + (Number(item.count) || 0), 0) || 1;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: 'bg-emerald-500',
      preparing: 'bg-amber-500',
      out_for_delivery: 'bg-purple-500',
      placed: 'bg-blue-500',
      confirmed: 'bg-indigo-500',
      cancelled: 'bg-rose-500',
    };
    return colors[status] || 'bg-muted';
  };

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      {title && <h3 className="text-base font-bold font-heading mb-6">{title}</h3>}
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-xs text-muted-foreground py-4 text-center">No status data available yet</p>
        ) : (
          data.map((item) => {
            const count = Number(item.count) || 0;
            const percent = Math.round((count / total) * 100);
            return (
              <div key={item.status} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="capitalize text-foreground">{item.status.replace(/_/g, ' ')}</span>
                  <span className="font-mono text-muted-foreground">
                    {count} ({percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    style={{ width: `${percent}%` }}
                    className={`h-full ${getStatusColor(item.status)} transition-all duration-500 rounded-full`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
