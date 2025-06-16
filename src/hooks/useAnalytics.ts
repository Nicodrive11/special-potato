// src/hooks/useAnalytics.ts
'use client';

import { useState, useEffect } from 'react';
import apiService from '@/utils/api';

interface AnalyticsData {
  totalTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksThisWeek: number;
  overdueTasks: number;
  tasksByStatus: {
    pending: number;
    'in-progress': number;
    completed: number;
  };
  tasksByPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

const defaultAnalytics: AnalyticsData = {
  totalTasks: 0,
  completionRate: 0,
  averageCompletionTime: 0,
  tasksThisWeek: 0,
  overdueTasks: 0,
  tasksByStatus: {
    pending: 0,
    'in-progress': 0,
    completed: 0
  },
  tasksByPriority: {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0
  }
};

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(defaultAnalytics);
  const [loading, setLoading] = useState(true);

  const calculateAnalytics = async () => {
    try {
      setLoading(true);
      const { tasks } = await apiService.getTasks();
      
      // Calculate basic metrics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.task_status === 'completed').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      // Calculate average completion time (simplified - using random data for demo)
      const averageCompletionTime = Math.round(Math.random() * 7) + 1; // 1-8 days
      
      // Calculate tasks this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const tasksThisWeek = tasks.filter(task => 
        new Date(task.created_date) >= oneWeekAgo
      ).length;
      
      // Calculate overdue tasks
      const now = new Date();
      const overdueTasks = tasks.filter(task => 
        task.due_date && new Date(task.due_date) < now && task.task_status !== 'completed'
      ).length;
      
      // Group by status
      const tasksByStatus = {
        pending: tasks.filter(task => task.task_status === 'pending').length,
        'in-progress': tasks.filter(task => task.task_status === 'in-progress').length,
        completed: tasks.filter(task => task.task_status === 'completed').length
      };
      
      // Group by priority
      const tasksByPriority = {
        low: tasks.filter(task => task.priority === 'low').length,
        medium: tasks.filter(task => task.priority === 'medium').length,
        high: tasks.filter(task => task.priority === 'high').length,
        urgent: tasks.filter(task => task.priority === 'urgent').length
      };
      
      setAnalytics({
        totalTasks,
        completionRate,
        averageCompletionTime,
        tasksThisWeek,
        overdueTasks,
        tasksByStatus,
        tasksByPriority
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
      // Keep default analytics on error
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = () => {
    calculateAnalytics();
  };

  useEffect(() => {
    calculateAnalytics();
  }, []);

  return {
    analytics,
    loading,
    refreshAnalytics
  };
}