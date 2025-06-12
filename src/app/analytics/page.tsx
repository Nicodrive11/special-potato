'use client';
 
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import InsightCard from '@/components/InsightCard';
import Loading from '@/components/Loading';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function AnalyticsPage() {
  const { analytics, loading, refreshAnalytics } = useAnalytics();

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getInsightMessage = (type: 'goal' | 'time' | 'weekly', value: number): string => {
    switch (type) {
      case 'goal':
        if (value >= 80) return ' Excellent work!';
        if (value >= 60) return ' Good progress!';
        return ' Room for improvement!';
      case 'time':
        if (value <= 3) return ' Very efficient!';
        if (value <= 7) return ' Good pace!';
        return ' Consider breaking down larger tasks.';
      case 'weekly':
        if (value >= 5) return ' High productivity!';
        if (value >= 2) return ' Steady progress!';
        return ' Consider planning more tasks.';
      default:
        return '';
    }
  };

  const metricCards = [
    {
      title: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      color: 'green' as const,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Avg. Completion',
      value: analytics.averageCompletionTime,
      subtitle: 'days',
      color: 'blue' as const,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Tasks This Week',
      value: analytics.tasksThisWeek,
      color: 'indigo' as const,
      icon: (
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Overdue Tasks',
      value: analytics.overdueTasks,
      color: 'red' as const,
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    }
  ];

  const insightCards = [
    {
      emoji: '🎯',
      title: 'Goal Achievement',
      description: `You're completing ${analytics.completionRate}% of your tasks.${getInsightMessage('goal', analytics.completionRate)}`,
      colorClass: 'bg-gradient-to-br from-green-50 to-green-100'
    },
    {
      emoji: '⏱️',
      title: 'Time Efficiency',
      description: `Average completion time is ${analytics.averageCompletionTime} days.${getInsightMessage('time', analytics.averageCompletionTime)}`,
      colorClass: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      emoji: '📈',
      title: 'Weekly Trend',
      description: `${analytics.tasksThisWeek} tasks created this week.${getInsightMessage('weekly', analytics.tasksThisWeek)}`,
      colorClass: 'bg-gradient-to-br from-purple-50 to-purple-100'
    }
  ];

  const summaryData = [
    { label: 'Total Tasks', value: analytics.totalTasks, color: 'text-gray-900' },
    { label: 'To Do', value: analytics.tasksByStatus.pending || 0, color: 'text-gray-600' },
    { label: 'In Progress', value: analytics.tasksByStatus['in-progress'] || 0, color: 'text-blue-600' },
    { label: 'Completed', value: analytics.tasksByStatus.completed || 0, color: 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Track your productivity and task completion metrics.
              </p>
            </div>
            <button
              onClick={refreshAnalytics}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && <Loading size="lg" text="Loading analytics data..." />}

        {!loading && (
          <>
            {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              color={metric.color}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard
            title="Tasks by Priority"
            data={analytics.tasksByPriority}
            total={analytics.totalTasks}
            getColor={getPriorityColor}
          />

          <ChartCard
            title="Tasks by Status"
            data={analytics.tasksByStatus}
            total={analytics.totalTasks}
            getColor={getStatusColor}
            formatLabel={(key) => key.replace('-', ' ')}
          />
        </div>

        {/* Productivity Insights */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Productivity Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insightCards.map((insight, index) => (
              <InsightCard
                key={index}
                emoji={insight.emoji}
                title={insight.title}
                description={insight.description}
                colorClass={insight.colorClass}
              />
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Task Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {summaryData.map((item, index) => (
              <div key={index}>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        {analytics.overdueTasks > 0 && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-lg font-semibold text-red-800 mb-2">Action Required</h4>
                <p className="text-red-700 mb-4">
                  You have {analytics.overdueTasks} overdue task{analytics.overdueTasks > 1 ? 's' : ''}. 
                  Consider reviewing and updating the due dates or completing these tasks soon.
                </p>
                <Link
                  href="/tasks"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  View Overdue Tasks
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}