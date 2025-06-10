'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchTasks, type Task } from '@/utils/api';
import apiService from '@/utils/api';
import { getPriorityColor, getStatusColor } from '@/utils/ui';
import StatsCards from '@/components/StatsCards';

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

// Component: Navigation (improvement #3 - componentized)
function Navigation() {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/tasks" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Tasks
            </Link>
            <Link href="/analytics" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Component: Status Banner (improvement #3 - componentized)
function StatusBanner({ status }: { status: string }) {
  if (!status) return null;

  const isSuccess = status.includes('✅');
  
  return (
    <div className={`mt-2 p-3 border rounded-md text-sm ${
      isSuccess 
        ? 'bg-green-100 border-green-400 text-green-700' 
        : 'bg-yellow-100 border-yellow-400 text-yellow-700'
    }`}>
      {status}
    </div>
  );
}

// Component: Hero Section (improvement #3 - componentized)
function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-4">
            Organize Your Work Like Never Before
          </h2>
          <p className="text-indigo-100 mb-6">
            Create, manage, and track your tasks with our powerful kanban board. 
            Stay productive and never miss a deadline.
          </p>
          <Link
            href="/tasks"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Tasks
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-64 h-48 bg-white bg-opacity-20 rounded-lg flex items-center justify-center relative">
            <Image
              src="/next.svg"
              alt="TaskFlow Kanban Board"
              width={100}
              height={40}
              className="opacity-75"
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className="absolute bottom-4 text-indigo-100 text-sm font-semibold">📋 Kanban Board</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component: Task Item (improvement #3 - componentized)
function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        {task.due_date && (
          <p className="text-sm text-gray-500 mt-1">Due: {new Date(task.due_date).toLocaleDateString()}</p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.task_status)}`}>
          {task.task_status.replace('-', ' ')}
        </span>
      </div>
    </div>
  );
}

// Component: Recent Tasks (improvement #3 - componentized)
function RecentTasks({ tasks, loading }: { tasks: Task[]; loading: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          <Link href="/tasks" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// API Connection Status Component
function ApiConnectionStatus({ status }: { status: string }) {
  const isConnected = status.includes('✅');
  
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">API Connection Status</h3>
          <p className="text-sm text-gray-600 mt-1">{status}</p>
        </div>
        <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string>('Connecting to API...');

  // Improvement #4: Use useMemo instead of useEffect for derived state
  const stats: Stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.task_status === 'completed').length,
    inProgress: tasks.filter(task => task.task_status === 'in-progress').length,
    pending: tasks.filter(task => task.task_status === 'pending').length
  }), [tasks]);

  useEffect(() => {
    // Enhanced task loading with proper API integration
    const loadTasks = async () => {
      try {
        setLoading(true);
        
        // Try the new API service first
        const response = await apiService.getTasks();
        setTasks(response.tasks || []);
        setApiStatus(`✅ Connected to TaskFlow API (${response.tasks?.length || 0} tasks loaded)`);
        
      } catch (error) {
        console.error('New API failed, trying legacy fetchTasks:', error);
        
        try {
          // Fallback to legacy fetchTasks function
          const { tasks: fetchedTasks, apiStatus: status } = await fetchTasks();
          setTasks(fetchedTasks);
          setApiStatus(status);
        } catch (legacyError) {
          console.error('All API methods failed:', legacyError);
          setApiStatus('❌ Failed to connect to API - using sample data');
          
          // Final fallback to sample data
          const sampleTasks: Task[] = [
            { 
              id: 1, 
              title: 'Connect to API', 
              description: 'Establish connection to backend API',
              task_status: 'in-progress', 
              priority: 'high', 
              due_date: '2025-06-15',
              created_date: '2025-06-01'
            },
            { 
              id: 2, 
              title: 'Create Components', 
              description: 'Build React components for tasks',
              task_status: 'pending', 
              priority: 'medium', 
              due_date: '2025-06-20',
              created_date: '2025-06-02'
            }
          ];
          setTasks(sampleTasks);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getTasks();
      setTasks(response.tasks || []);
      setApiStatus(`✅ Connected to TaskFlow API (${response.tasks?.length || 0} tasks loaded) - Refreshed at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      setApiStatus(`❌ Refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to TaskFlow
              </h1>
              <p className="text-gray-600">
                Manage your tasks efficiently with our intuitive kanban board system.
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
          <StatusBanner status={apiStatus} />
        </div>

        {/* API Connection Status */}
        <ApiConnectionStatus status={apiStatus} />

        <HeroSection />
        <StatsCards stats={stats} />
        <RecentTasks tasks={tasks} loading={loading} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 TaskFlow. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}