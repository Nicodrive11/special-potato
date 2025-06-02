'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchTasks, type Task } from '@/utils/api';
import { getPriorityColor, getStatusColor } from '@/utils/ui';

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

// Component: Individual Stat Card (improvement #3 - componentized)
function StatCard({ title, value, color, icon }: {
  title: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Component: Stats Cards (improvement #3 - componentized)
function StatsCards({ stats }: { stats: Stats }) {
  const statItems = [
    {
      title: 'Total Tasks',
      value: stats.total,
      color: 'blue',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Completed',
      value: stats.completed,
      color: 'green',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      color: 'blue',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Pending',
      value: stats.pending,
      color: 'yellow',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          color={item.color}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

// Component: Task Item (improvement #3 - componentized)
function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{task.title}</h4>
        {task.dueDate && (
          <p className="text-sm text-gray-500 mt-1">Due: {task.dueDate}</p>
        )}
      </div>
      <div className="flex items-center space-x-3">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status}
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

// Main Dashboard Component
export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string>('');

  // Improvement #4: Use useMemo instead of useEffect for derived state
  const stats: Stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    pending: tasks.filter(task => task.status === 'pending').length
  }), [tasks]);

  useEffect(() => {
    // Improvement #2: Moved fetchTasks function to utils/api.ts
    const loadTasks = async () => {
      try {
        setLoading(true);
        // Improvement #1: fetchTasks now uses Promise.all for concurrent requests
        const { tasks: fetchedTasks, apiStatus: status } = await fetchTasks();
        setTasks(fetchedTasks);
        setApiStatus(status);
      } catch (error) {
        console.error('Failed to load tasks:', error);
        setApiStatus('❌ Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to TaskFlow
          </h1>
          <p className="text-gray-600">
            Manage your tasks efficiently with our intuitive kanban board system.
          </p>
          <StatusBanner status={apiStatus} />
        </div>

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