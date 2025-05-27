'use client';
 
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Remove unused Task interface since it's not used in this component
interface Analytics {
  totalTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksThisWeek: number;
  overdueTasks: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalTasks: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    tasksByPriority: {},
    tasksByStatus: {},
    tasksThisWeek: 0,
    overdueTasks: 0
  });

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: Analytics = {
      totalTasks: 8,
      completionRate: 75,
      averageCompletionTime: 3,
      tasksByPriority: {
        urgent: 2,
        high: 3,
        medium: 2,
        low: 1
      },
      tasksByStatus: {
        pending: 2,
        'in-progress': 2,
        completed: 4
      },
      tasksThisWeek: 5,
      overdueTasks: 1
    };
    setAnalytics(mockAnalytics);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <span className="text-xl font-bold text-gray-900">TaskFlow</span>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/tasks" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Tasks
              </Link>
              <Link href="/analytics" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                Analytics
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your productivity and task completion metrics.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-green-600">{analytics.completionRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
                <p className="text-3xl font-bold text-blue-600">{analytics.averageCompletionTime}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tasks This Week</p>
                <p className="text-3xl font-bold text-indigo-600">{analytics.tasksThisWeek}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                <p className="text-3xl font-bold text-red-600">{analytics.overdueTasks}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Tasks by Priority */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Tasks by Priority
            </h3>
            
            <div className="space-y-4">
              {Object.entries(analytics.tasksByPriority).map(([priority, count]) => {
                const percentage = analytics.totalTasks > 0 
                  ? Math.round((count / analytics.totalTasks) * 100) 
                  : 0;
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${getPriorityColor(priority)}`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPriorityColor(priority)}`}
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

          {/* Tasks by Status */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Tasks by Status
            </h3>
            
            <div className="space-y-4">
              {Object.entries(analytics.tasksByStatus).map(([status, count]) => {
                const percentage = analytics.totalTasks > 0 
                  ? Math.round((count / analytics.totalTasks) * 100) 
                  : 0;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${getStatusColor(status)}`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getStatusColor(status)}`}
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
        </div>

        {/* Productivity Insights */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Productivity Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-semibold text-gray-900 mb-2">Goal Achievement</h4>
              <p className="text-sm text-gray-600">
                You&apos;re completing {analytics.completionRate}% of your tasks. 
                {analytics.completionRate >= 80 ? ' Excellent work!' : 
                 analytics.completionRate >= 60 ? ' Good progress!' : 
                 ' Room for improvement!'}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl mb-2">⏱️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Time Efficiency</h4>
              <p className="text-sm text-gray-600">
                Average completion time is {analytics.averageCompletionTime} days. 
                {analytics.averageCompletionTime <= 3 ? ' Very efficient!' : 
                 analytics.averageCompletionTime <= 7 ? ' Good pace!' : 
                 ' Consider breaking down larger tasks.'}
              </p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <h4 className="font-semibold text-gray-900 mb-2">Weekly Trend</h4>
              <p className="text-sm text-gray-600">
                {analytics.tasksThisWeek} tasks created this week. 
                {analytics.tasksThisWeek >= 5 ? ' High productivity!' : 
                 analytics.tasksThisWeek >= 2 ? ' Steady progress!' : 
                 ' Consider planning more tasks.'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Task Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalTasks}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{analytics.tasksByStatus.pending || 0}</p>
              <p className="text-sm text-gray-600">To Do</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{analytics.tasksByStatus['in-progress'] || 0}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{analytics.tasksByStatus.completed || 0}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
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