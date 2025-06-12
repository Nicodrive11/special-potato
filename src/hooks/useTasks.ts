// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { Task, fetchTasks } from '@/utils/api';

export interface TaskFormData {
  title: string;
  description: string;
  priority: Task['priority'];
  task_status: Task['task_status'];
  due_date: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string>('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      // Use the existing fetchTasks function
      const { tasks: fetchedTasks, apiStatus: status } = await fetchTasks();
      setTasks(fetchedTasks);
      setApiStatus(status);
    } catch (error) {
      console.log('API unavailable, using mock data', error);
      setApiStatus('⚠️ TaskFlow API unavailable - showing sample data');
      
      // Mock data fallback
      const mockTasks: Task[] = [
        { 
          id: 1, 
          title: 'Design new homepage', 
          description: 'Create wireframes and mockups for the new homepage design',
          task_status: 'in-progress', 
          priority: 'high', 
          due_date: '2025-06-15',
          created_date: '2025-06-01'
        },
        { 
          id: 2, 
          title: 'Fix login bug', 
          description: 'Investigate and fix the authentication issue reported by users',
          task_status: 'pending', 
          priority: 'urgent', 
          due_date: '2025-06-10',
          created_date: '2025-06-02'
        },
        { 
          id: 3, 
          title: 'Update documentation', 
          description: 'Update API documentation with new endpoints',
          task_status: 'completed', 
          priority: 'medium', 
          due_date: '2025-06-08',
          created_date: '2025-05-30'
        },
        { 
          id: 4, 
          title: 'Code review for API', 
          description: 'Review pull request for new API features',
          task_status: 'pending', 
          priority: 'high', 
          due_date: '2025-06-12',
          created_date: '2025-06-03'
        }
      ];
      setTasks(mockTasks);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: TaskFormData): Promise<boolean> => {
    try {
      // For now, just add locally since we're using the existing API structure
      const newTask: Task = {
        ...taskData,
        id: Date.now(),
        created_date: new Date().toISOString().split('T')[0]
      };
      setTasks(prev => [...prev, newTask]);
      setApiStatus('✅ Task created successfully');
      return true;
    } catch (error) {
      console.error('Failed to create task:', error);
      setApiStatus('⚠️ Task creation failed');
      return false;
    }
  };

  const updateTaskStatus = async (taskId: number, newStatus: Task['task_status']): Promise<boolean> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return false;

    try {
      const updatedTask = { ...task, task_status: newStatus };
      setTasks(prev => 
        prev.map(t => t.id === taskId ? updatedTask : t)
      );
      setApiStatus(`✅ Task "${task.title}" moved to ${newStatus.replace('-', ' ')}`);
      return true;
    } catch (error) {
      console.error('API update failed:', error);
      setApiStatus(`⚠️ Task update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const deleteTask = async (taskId: number): Promise<boolean> => {
    try {
      setTasks(prev => prev.filter(task => task.id !== taskId));
      setApiStatus(`✅ Task deleted successfully`);
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      setApiStatus('⚠️ Task deletion failed');
      return false;
    }
  };

  const getTasksByStatus = (status: string): Task[] => {
    return tasks.filter(task => task.task_status === status);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    apiStatus,
    loadTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    getTasksByStatus
  };
};