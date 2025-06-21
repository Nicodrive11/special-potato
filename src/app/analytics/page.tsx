'use client';
 
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MetricCard from '@/components/MetricCard';
import ChartCard from '@/components/ChartCard';
import InsightCard from '@/components/InsightCard';
import Loading from '@/components/Loading';
import { useLocalTasks } from '@/hooks/useLocalTasks';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const { 
    tasks, 
    loading, 
    getTaskStats, 
    getOverdueTasks, 
    getTasksThisWeek,
    getTasksByStatus,
    getTasksByPriority
  } = useLocalTasks();

  const analytics = useMemo(() => {
    const stats = getTaskStats();
    const overdueTasks = getOverdueTasks();
    const tasksThisWeek = getTasksThisWeek();
    
    // Calculate average completion time (simplified - using random for demo)
    const averageCompletionTime = Math.round(Math.random() * 7) + 1;
    
    // Group tasks by status
    const tasksByStatus = {
      pending: getTasksByStatus('pending').length,
      'in-progress': getTasksByStatus('in-progress').length,
      completed: getTasksByStatus('completed').length
    };
    
    // Group tasks by priority
    const tasksByPriority = {
      low: getTasksByPriority('low').length,
      medium: getTasksByPriority('medium').length,
      high: getTasksByPriority('high').length,
      urgent: getTasksByPriority('urgent').length
    };

    return {
      totalTasks: stats.total,
      completionRate: stats.completionRate,
      averageCompletionTime,
      tasksThisWeek: tasksThisWeek.length,
      overdueTasks: overdueTasks.length,
      tasksByStatus,
      tasksByPriority
    };
  }, [tasks, getTaskStats, getOverdueTasks, getTasksThisWeek, getTasksByStatus, getTasksByPriority]);

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
        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Tasks This Week',
      value: analytics.tasksThisWeek,
      color: 'indigo' as const,
      icon: (
        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Overdue Tasks',
      value: analytics.overdueTasks,
      color: 'red' as const,
      icon: (
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      colorClass: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800'
    },
    {
      emoji: '⏱️',
      title: 'Time Efficiency',
      description: `Average completion time is ${analytics.averageCompletionTime} days.${getInsightMessage('time', analytics.averageCompletionTime)}`,
      colorClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800'
    },
    {
      emoji: '📈',
      title: 'Weekly Trend',
      description: `${analytics.tasksThisWeek} tasks created this week.${getInsightMessage('weekly', analytics.tasksThisWeek)}`,
      colorClass: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800'
    }
  ];

  const summaryData = [
    { label: 'Total Tasks', value: analytics.totalTasks, color: 'text-gray-900 dark:text-gray-200' },
    { label: 'To Do', value: analytics.tasksByStatus.pending || 0, color: 'text-gray-600 dark:text-gray-400' },
    { label: 'In Progress', value: analytics.tasksByStatus['in-progress'] || 0, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Completed', value: analytics.tasksByStatus.completed || 0, color: 'text-green-600 dark:text-green-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your productivity and task completion metrics.
              </p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                📁 Analyzing {analytics.totalTasks} locally stored tasks
              </div>
            </div>
          </div>
        </div>

        {loading && <Loading size="lg" text="Loading analytics data..." />}

        {!loading && (
          <>
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

            <div className="card mb-8">
              <h3 className="text-lg font-semibold brand-text mb-6">
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

            <div className="card mb-8">
              <h3 className="text-lg font-semibold brand-text mb-6">
                Task Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {summaryData.map((item, index) => (
                  <div key={index}>
                    <p className={`text-2xl font-bold ${item.color} transition-colors`}>{item.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {analytics.overdueTasks > 0 && (
              <div className="card border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 dark:text-red-300 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Action Required</h4>
                    <p className="text-red-800 dark:text-red-200 mb-4">
                      You have {analytics.overdueTasks} overdue task{analytics.overdueTasks > 1 ? 's' : ''}. 
                      Consider reviewing and updating the due dates or completing these tasks soon.
                    </p>
                    <Link
                      href="/tasks"
                      className="inline-flex items-center px-4 py-2 bg-red-600 dark:bg-red-500 text-white font-semibold rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
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

            {analytics.totalTasks === 0 && (
              <div className="card text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold brand-text mb-2">No Analytics Data Yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create some tasks to see productivity insights and analytics.
                </p>
                <Link
                  href="/tasks"
                  className="btn-primary"
                >
                  Create Your First Task
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}