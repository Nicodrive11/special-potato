'use client';

import { useState } from 'react';
import { Task } from '@/utils/api';
import Navigation from '@/components/Navigation';
import KanbanColumn from '@/components/KanbanColumn';
import TaskFormModal, { TaskFormData } from '@/components/TaskFormModal';
import Loading from '@/components/Loading';
import { useTasks } from '@/hooks/useTasks';

export default function TasksPage() {
  const {
    tasks,
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

  const columns = [
    { id: 'pending', title: 'To Do', color: 'bg-gray-100' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100' }
  ];

  const handleAddTask = async (taskData: TaskFormData) => {
    await createTask(taskData);
    setShowAddTask(false);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.task_status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    await updateTaskStatus(draggedTask.id, targetStatus as Task['task_status']);
    setDraggedTask(null);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    await deleteTask(taskId);
  };

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
              <div className={`mt-2 p-2 rounded text-sm ${
                apiStatus.includes('✅') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {apiStatus}
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={loadTasks}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={getTasksByStatus(column.id)}
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