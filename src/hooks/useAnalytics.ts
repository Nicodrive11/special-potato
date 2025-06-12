// src/hooks/useAnalytics.ts
import { useState, useEffect } from 'react';

export interface Analytics {
  totalTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksThisWeek: number;
  overdueTasks: number;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalTasks: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    tasksByPriority: {},
    tasksByStatus: {},
    tasksThisWeek: 0,
    overdueTasks: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call
        // const response = await apiService.getAnalytics();
        // setAnalytics(response.data);
        
        // Mock data for now
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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setAnalytics(mockAnalytics);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const refreshAnalytics = async () => {
    setLoading(true);
    // Simulate refresh with updated data
    setTimeout(() => {
      setAnalytics(prev => ({
        ...prev,
        tasksThisWeek: prev.tasksThisWeek + 1,
        totalTasks: prev.totalTasks + 1
      }));
      setLoading(false);
    }, 300);
  };

  return {
    analytics,
    loading,
    refreshAnalytics
  };
};