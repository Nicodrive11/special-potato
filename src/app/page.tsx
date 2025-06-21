'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocalTasks, Task } from '@/hooks/useLocalTasks';
import { getPriorityColor, getStatusColor } from '@/utils/ui';
import StatsCards from '@/components/StatsCards';
import Navigation from '@/components/Navigation';

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

function HeroSection() {
  return (
    <div className="bg-hero-gradient rounded-xl p-8 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Organize Your Work Like Never Before
          </h2>
          <p className="text-indigo-100 dark:text-purple-100 mb-6">
            Create, manage, and track your tasks with our powerful kanban board. 
            Stay productive and never miss a deadline.
          </p>
          <Link
            href="/tasks"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 dark:text-purple-600 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-100 transition-colors"
          >
            View All Tasks
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="w-40 h-40 bg-white bg-opacity-20 dark:bg-black dark:bg-opacity-20 rounded-lg flex items-center justify-center relative">
            <Image
              src="/next.svg"
              alt="TaskFlow Kanban Board"
              width={100}
              height={40}
              className="opacity-75 scale-75"
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className="absolute bottom-4 text-indigo-100 dark:text-purple-100 text-sm font-semibold"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h4>
        {task.due_date && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Due: {new Date(task.due_date).toLocaleDateString()}</p>
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

function RecentTasks({ tasks, loading }: { tasks: Task[]; loading: boolean }) {
  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold brand-text">Recent Tasks</h3>
          <Link href="/tasks" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
            View All
          </Link>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.slice(0, 3).map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No tasks yet</p>
                <Link href="/tasks" className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
                  Create your first task
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LocalStorageStatus({ taskCount }: { taskCount: number }) {
  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold brand-text">Local Storage Status</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            📁 {taskCount} tasks stored locally in your browser
          </p>
        </div>
        <div className="w-4 h-4 rounded-full bg-green-500"></div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { 
    tasks, 
    loading, 
    getTaskStats
  } = useLocalTasks();

  const stats: Stats = useMemo(() => {
    const taskStats = getTaskStats();
    return {
      total: taskStats.total,
      completed: taskStats.completed,
      inProgress: taskStats.inProgress,
      pending: taskStats.pending
    };
  }, [getTaskStats]);

  const handleClearAllTasks = () => {
    if (confirm('This will delete all tasks permanently. Are you sure?')) {
      clearAllTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary transition-colors duration-300">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome to TaskFlow
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your tasks efficiently with our intuitive kanban board system.
              </p>
            </div>
          </div>
        </div>

        <LocalStorageStatus taskCount={tasks.length} />

        <HeroSection />
        <StatsCards stats={stats} />
        <RecentTasks tasks={tasks} loading={loading} />
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>&copy; 2025 TaskFlow. Built with Next.js and Tailwind CSS.</p>
            <p className="mt-1">📁 All data stored locally in your browser</p>
          </div>
        </div>
      </footer>
    </div>
  );
}