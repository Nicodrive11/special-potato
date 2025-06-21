import { useState, useEffect } from 'react';

export interface Task {
  id: number;
  title: string;
  description?: string;
  task_status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_date: string;
  updated_date?: string;
  assigned_to?: string;
  tags?: string[];
}

const STORAGE_KEY = 'taskflow_tasks';

// Initial sample tasks
const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Setup Development Environment',
    description: 'Configure development tools and dependencies',
    task_status: 'completed',
    priority: 'high',
    due_date: '2025-06-10',
    created_date: '2025-06-01'
  },
  {
    id: 2,
    title: 'Design Database Schema',
    description: 'Create tables and relationships for the application',
    task_status: 'in-progress',
    priority: 'high',
    due_date: '2025-06-20',
    created_date: '2025-06-05'
  },
  {
    id: 3,
    title: 'Implement Authentication',
    description: 'Add user login and registration functionality',
    task_status: 'pending',
    priority: 'medium',
    due_date: '2025-06-25',
    created_date: '2025-06-08'
  },
  {
    id: 4,
    title: 'Create API Documentation',
    description: 'Document all API endpoints and usage examples',
    task_status: 'pending',
    priority: 'low',
    due_date: '2025-07-01',
    created_date: '2025-06-10'
  },
  {
    id: 5,
    title: 'Write Unit Tests',
    description: 'Add comprehensive test coverage for all components',
    task_status: 'pending',
    priority: 'medium',
    due_date: '2025-06-30',
    created_date: '2025-06-12'
  }
];

export function useLocalTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        // If no saved tasks, use initial tasks
        setTasks(initialTasks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
      }
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      setTasks(initialTasks);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
      }
    }
  }, [tasks, loading]);

  // Create a new task
  const createTask = (taskData: Omit<Task, 'id' | 'created_date'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(), // Simple ID generation
      created_date: new Date().toISOString().split('T')[0],
      updated_date: new Date().toISOString().split('T')[0]
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  // Update an existing task
  const updateTask = (id: number, updates: Partial<Task>) => {
    const updatedTask = {
      ...updates,
      updated_date: new Date().toISOString().split('T')[0]
    };

    let updatedTaskResult: Task | undefined;
    setTasks(prev => {
      const newTasks = prev.map(task => {
        if (task.id === id) {
          updatedTaskResult = { ...task, ...updatedTask };
          return updatedTaskResult;
        }
        return task;
      });
      return newTasks;
    });

    return updatedTaskResult;
  };

  // Update task status (for drag & drop)
  const updateTaskStatus = (id: number, newStatus: Task['task_status']) => {
    return updateTask(id, { task_status: newStatus });
  };

  // Delete a task
  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Get tasks by status
  const getTasksByStatus = (status: Task['task_status']) => {
    return tasks.filter(task => task.task_status === status);
  };

  // Get tasks by priority
  const getTasksByPriority = (priority: Task['priority']) => {
    return tasks.filter(task => task.priority === priority);
  };

  // Get a single task by ID
  const getTaskById = (id: number) => {
    return tasks.find(task => task.id === id);
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Reset to initial tasks
  const resetTasks = () => {
    setTasks(initialTasks);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
  };

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.task_status === 'completed').length;
    const inProgress = tasks.filter(task => task.task_status === 'in-progress').length;
    const pending = tasks.filter(task => task.task_status === 'pending').length;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  // Get overdue tasks
  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < now && 
      task.task_status !== 'completed'
    );
  };

  // Get tasks created this week
  const getTasksThisWeek = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return tasks.filter(task => 
      new Date(task.created_date) >= oneWeekAgo
    );
  };

  return {
    // State
    tasks,
    loading,
    
    // CRUD operations
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    
    // Query functions
    getTasksByStatus,
    getTasksByPriority,
    getTaskById,
    
    // Utility functions
    clearAllTasks,
    resetTasks,
    getTaskStats,
    getOverdueTasks,
    getTasksThisWeek
  };
}