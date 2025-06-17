// src/components/MetricCard.tsx
'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'indigo' | 'red' | 'yellow' | 'purple';
}

export default function MetricCard({ title, value, subtitle, icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
    blue: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
    indigo: 'bg-indigo-50 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-700',
    red: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
    yellow: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
    purple: 'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700'
  };

  return (
    <div className={`card border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
            {subtitle && (
              <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}