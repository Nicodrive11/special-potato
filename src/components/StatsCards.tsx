// src/components/StatsCards.tsx
'use client';

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statItems = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: (
        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'indigo',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: (
        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: (
        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'gray',
      bgColor: 'bg-gray-50 dark:bg-gray-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="stats-card">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              {item.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {item.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {item.value}
              </p>
            </div>
          </div>
          
          {/* Progress bar for completed tasks */}
          {item.title === 'Completed' && stats.total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Completion Rate</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Trend indicator */}
          {item.title === 'In Progress' && (
            <div className="mt-4 flex items-center text-xs text-blue-600 dark:text-blue-400">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>Active work</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}