'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  createdAt?: string;
  completedAt?: string;
}

interface Stats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string>('');
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from the API root first to see what's available
        console.log('Testing API connection...');
        
        const rootResponse = await fetch('https://sd-6310-2025-summer-express-app.onrender.com/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (rootResponse.ok) {
          const rootData = await rootResponse.text();
          console.log('API Root Response:', rootData);
          
          // Try different possible endpoints
          const endpoints = ['/tasks', '/api/tasks', '/todos', '/items', '/task'];
          let foundData = false;
          
          for (const endpoint of endpoints) {
            try {
              console.log(`Trying endpoint: ${endpoint}`);
              const response = await fetch(`https://sd-6310-2025-summer-express-app.onrender.com${endpoint}`);
              
              if (response.ok) {
                const data = await response.json();
                console.log(`Success with ${endpoint}:`, data);
                
                // Convert API data to our format
                let apiTasks: Task[] = [];
                
                if (Array.isArray(data)) {
                  apiTasks = data.map((item: any, index: number) => ({
                    id: item.id || index + 1,
                    title: item.title || item.name || `API Task ${index + 1}`,
                    description: item.description || '',
                    status: (item.status === 'completed' || item.status === 'done') ? 'completed' : 
                           (item.status === 'in-progress' || item.status === 'active') ? 'in-progress' : 'pending',
                    priority: item.priority || 'medium',
                    dueDate: item.dueDate || item.due,
                    createdAt: item.createdAt || new Date().toISOString().split('T')[0],
                  }));
                } else if (data.tasks || data.data) {
                  const items = data.tasks || data.data;
                  apiTasks = items.map((item: any, index: number) => ({
                    id: item.id || index + 1,
                    title: item.title || item.name || `API Task ${index + 1}`,
                    description: item.description || '',
                    status: (item.status === 'completed' || item.status === 'done') ? 'completed' : 
                           (item.status === 'in-progress' || item.status === 'active') ? 'in-progress' : 'pending',
                    priority: item.priority || 'medium',
                    dueDate: item.dueDate || item.due,
                    createdAt: item.createdAt || new Date().toISOString().split('T')[0],
                  }));
                }
                
                if (apiTasks.length > 0) {
                  setTasks(apiTasks);
                  setApiStatus(`✅ Connected to API: ${endpoint} (${apiTasks.length} items)`);
                  foundData = true;
                  break;
                }
              }
            } catch (err) {
              console.log(`Endpoint ${endpoint} failed:`, err);
            }
          }
          
          if (!foundData) {
            throw new Error('No working endpoints found');
          }
        } else {
          throw new Error('API server not responding');
        }
        
      } catch (error) {
        console.warn('API completely unavailable, using mock data:', error);
        setApiStatus('⚠️ API unavailable - showing sample data');
        
        // Use mock data as fallback
        const mockTasks: Task[] = [
          { id: 1, title: 'Design new homepage', status: 'in-progress', priority: 'high', dueDate: '2025-05-30' },
          { id: 2, title: 'Fix login bug', status: 'pending', priority: 'urgent', dueDate: '2025-05-26' },
          { id: 3, title: 'Update documentation', status: 'completed', priority: 'medium', dueDate: '2025-05-25' },
          { id: 4, title: 'Code review for API', status: 'pending', priority: 'high', dueDate: '2025-05-28' },
          { id: 5, title: 'Setup deployment pipeline', status: 'in-progress', priority: 'medium', dueDate: '2025-06-01' }
        ];
        
        setTasks(mockTasks);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate stats whenever tasks change
  useEffect(() => {
    const newStats: Stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      pending: tasks.filter(task => task.status === 'pending').length
    };
    setStats(newStats);
  }, [tasks]);

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
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

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to TaskFlow
          </h1>
          <p className="text-gray-600">
            Manage your tasks efficiently with our intuitive kanban board system.
          </p>
          {apiStatus && (
            <div className={`mt-2 p-3 border rounded-md text-sm ${
              apiStatus.includes('✅') 
                ? 'bg-green-100 border-green-400 text-green-700' 
                : 'bg-yellow-100 border-yellow-400 text-yellow-700'
            }`}>
              {apiStatus}
            </div>
          )}
        </div>

        {/* Hero Section */}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
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
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
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
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                ))}
              </div>
            )}
          </div>
        </div>
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