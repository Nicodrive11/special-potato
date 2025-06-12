'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/utils/api';
import Navigation from '@/components/Navigation';
import KanbanColumn from '@/components/KanbanColumn';
import TaskFormModal from '@/components/TaskFormModal';
import Loading from '@/components/Loading';
import { useTasks, TaskFormData } from '@/hooks/useTasks';

const VALID_STATUSES = ['pending', 'in-progress', 'completed'] as const;
type ValidStatus = typeof VALID_STATUSES[number];

export default function TasksPage() {
  const {
    loading,
    apiStatus,
    loadTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
    getTasksByStatus
  } = useTasks();

  const [showAddTask, setShowAddTask] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on mount only
  useEffect(() => {
    let mounted = true;

    const fetchTasks = async () => {
      try {
        if (mounted) {
          await loadTasks();
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load tasks');
          console.error('Failed to load tasks:', err);
        }
      }
    };

    fetchTasks();

    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run on mount

  const columns = [
    { id: 'pending' as ValidStatus, title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress' as ValidStatus, title: 'In Progress', color: 'bg-blue-100' },
    { id: 'completed' as ValidStatus, title: 'Completed', color: 'bg-green-100' }
  ];

  const handleAddTask = useCallback(async (taskData: TaskFormData) => {
    try {
      setError(null);
      await createTask(taskData);
      setShowAddTask(false);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Failed to create task:', err);
    }
  }, [createTask]);

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // Add data for keyboard accessibility fallback
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.task_status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    // Validate target status
    if (!VALID_STATUSES.includes(targetStatus as ValidStatus)) {
      setError('Invalid status');
      setDraggedTask(null);
      return;
    }

    try {
      setError(null);
      await updateTaskStatus(draggedTask.id, targetStatus as Task['task_status']);
      setDraggedTask(null);
    } catch (err) {
      setError('Failed to update task status');
      console.error('Failed to update task status:', err);
      setDraggedTask(null);
    }
  }, [draggedTask, updateTaskStatus]);

  const handleDeleteTask = useCallback(async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      setError(null);
      await deleteTask(taskId);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Failed to delete task:', err);
    }
  }, [deleteTask]);

  const handleRefresh = useCallback(async () => {
    try {
      setError(null);
      await loadTasks();
    } catch (err) {
      setError('Failed to refresh tasks');
      console.error('Failed to refresh tasks:', err);
    }
  }, [loadTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Management
            </h1>
            <p className="text-gray-600">
              Drag and drop tasks between columns to update their status.
            </p>
            {apiStatus && (
              <div 
                className={`mt-2 p-2 rounded text-sm ${
                  apiStatus.includes('✅') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}
                role="status"
                aria-live="polite"
              >
                {apiStatus}
              </div>
            )}
            {error && (
              <div 
                className="mt-2 p-2 rounded text-sm bg-red-100 text-red-700"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              aria-label={loading ? 'Refreshing tasks' : 'Refresh tasks'}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              aria-label="Add new task"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>
        </div>

        {/* Task Form Modal */}
        <TaskFormModal
          isOpen={showAddTask}
          onClose={() => setShowAddTask(false)}
          onSubmit={handleAddTask}
        />

        {/* Loading State */}
        {loading && <Loading text="Loading tasks..." />}

        {/* Kanban Board */}
        {!loading && (
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            role="region"
            aria-label="Task board"
          >
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={getTasksByStatus(column.id) || []}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDeleteTask={handleDeleteTask}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}