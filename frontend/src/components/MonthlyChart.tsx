import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { MonthlyTotal } from '../types';

interface MonthlyChartProps {
  data: MonthlyTotal[];
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      notation: 'compact',
    }).format(value);
  };

  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      name: `${item.month.slice(0, 3)} ${item.year}`,
      total: item.total,
      count: item.count,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={formatCurrency}
            tickLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
          />
          <Bar 
            dataKey="total" 
            fill="#0ea5e9" 
            radius={[8, 8, 0, 0]}
            name="Total"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
