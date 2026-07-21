import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

/* ── Colour palette ────────────────────────────────────── */
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

/* ── Shared skeleton ──────────────────────────────────── */
function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="animate-pulse flex flex-col gap-4 w-full" style={{ height }}>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────── */
function EmptyChartState({ height = 280, message = 'No data available yet' }: { height?: number; message?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
      style={{ height }}
    >
      <BarChart2 size={32} className="opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

/* ── Shared wrapper ───────────────────────────────────── */
function ChartWrapper({
  title,
  children,
  loading = false,
  error,
  onRetry,
  height = 280,
  isEmpty = false,
}: {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  height?: number;
  isEmpty?: boolean;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 backdrop-blur-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {loading ? (
        <ChartSkeleton height={height} />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3" style={{ height }}>
          <p className="text-sm text-red-400">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      ) : isEmpty ? (
        <EmptyChartState height={height} />
      ) : (
        <div style={{ width: '100%', height }}>{children}</div>
      )}
    </div>
  );
}


/* ── Revenue Timeline (Area) ─────────────────────────── */
export function RevenueChart({
  data,
  loading,
  error,
  onRetry,
}: {
  data: { date: string; revenue: number }[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const chartId = React.useId();
  return (
    <ChartWrapper title="Revenue Trend" loading={loading} error={error} onRetry={onRetry} isEmpty={!data || data.length === 0}>
      <ResponsiveContainer>
        <AreaChart id={chartId} data={data}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
            formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
          />
          <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── Order Status (Pie) ──────────────────────────────── */
export function OrderStatusChart({
  data,
  loading,
  error,
  onRetry,
}: {
  data: { status: string; count: number }[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const chartId = React.useId();
  return (
    <ChartWrapper title="Order Status Distribution" loading={loading} error={error} onRetry={onRetry} height={260} isEmpty={!data || data.length === 0}>
      <ResponsiveContainer>
        <PieChart id={chartId}>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── User Growth (Bar) ────────────────────────────────── */
export function UserGrowthChart({
  data,
  loading,
  error,
  onRetry,
}: {
  data: { month: string; farmers: number; buyers: number }[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const chartId = React.useId();
  return (
    <ChartWrapper title="User Growth" loading={loading} error={error} onRetry={onRetry} isEmpty={!data || data.length === 0}>
      <ResponsiveContainer>
        <BarChart id={chartId} data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="farmers" fill="#22c55e" radius={[4, 4, 0, 0]} name="Farmers" />
          <Bar dataKey="buyers" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Buyers" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── Auction Stats (Bar) ──────────────────────────────── */
export function AuctionChart({
  data,
  loading,
  error,
  onRetry,
}: {
  data: { live: number; closed: number; cancelled: number; totalBids: number };
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const chartData = data
    ? [
        { name: 'Live', value: data.live },
        { name: 'Closed', value: data.closed },
        { name: 'Cancelled', value: data.cancelled },
        { name: 'Total Bids', value: data.totalBids },
      ]
    : [];

  const chartId = React.useId();
  return (
    <ChartWrapper title="Auction Activity" loading={loading} error={error} onRetry={onRetry} height={260} isEmpty={!chartData || chartData.length === 0 || chartData.every(d => d.value === 0)}>
      <ResponsiveContainer>
        <BarChart id={chartId} data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={80} />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

/* ── Top Products (Horizontal Bar) ───────────────────── */
export function TopProductsChart({
  data,
  loading,
  error,
  onRetry,
}: {
  data: { product: { name: string }; totalQuantitySold: number }[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const chartData = (data || []).slice(0, 8).map((d) => ({
    name: d.product?.name?.substring(0, 20) || 'Unknown',
    sold: d.totalQuantitySold,
  }));

  const chartId = React.useId();
  return (
    <ChartWrapper title="Top Products" loading={loading} error={error} onRetry={onRetry} isEmpty={!chartData || chartData.length === 0}>
      <ResponsiveContainer>
        <BarChart id={chartId} data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={120} />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
          />
          <Bar dataKey="sold" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Units Sold" />
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}
