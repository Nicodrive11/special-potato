// src/components/MetricCard.tsx
'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'indigo' | 'red' | 'yellow' | 'gray';
}

export default function MetricCard({ title, value, subtitle, icon, color }: MetricCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          text: 'text-green-600',
          bg: 'bg-green-100'
        };
      case 'blue':
        return {
          text: 'text-blue-600',
          bg: 'bg-blue-100'
        };
      case 'indigo':
        return {
          text: 'text-indigo-600',
          bg: 'bg-indigo-100'
        };
      case 'red':
        return {
          text: 'text-red-600',
          bg: 'bg-red-100'
        };
      case 'yellow':
        return {
          text: 'text-yellow-600',
          bg: 'bg-yellow-100'
        };
      default:
        return {
          text: 'text-gray-600',
          bg: 'bg-gray-100'
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses.text}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 ${colorClasses.bg} rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}