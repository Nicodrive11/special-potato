// src/components/ChartCard.tsx
'use client';

interface ChartCardProps {
  title: string;
  data: Record<string, number>;
  total: number;
  getColor: (key: string) => string;
  formatLabel?: (key: string) => string;
}

export default function ChartCard({ 
  title, 
  data, 
  total, 
  getColor, 
  formatLabel = (key) => key 
}: ChartCardProps) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    label: formatLabel(key),
    value,
    percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    color: getColor(key)
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold brand-text">
        {title}
      </h3>
      
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center flex-1">
              <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {item.label}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.value}
              </span>
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color} transition-all duration-300`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium brand-text text-right">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {total === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No data available</p>
        </div>
      )}
    </div>
  );
}