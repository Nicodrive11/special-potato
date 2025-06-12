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
  formatLabel = (key) => key.replace('-', ' ') 
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {title}
      </h3>
      
      <div className="space-y-4">
        {Object.entries(data).map(([key, count]) => {
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
          
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded ${getColor(key)}`}></div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {formatLabel(key)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getColor(key)}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count} ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}