'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Loading from '@/components/Loading';
import { Task, useLocalTasks } from '@/hooks/useLocalTasks';
import { getPriorityColor, getStatusColor } from '@/utils/ui';

type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

interface KanbanColumn {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export default function TasksPage() {
  const { 
    tasks, 
    loading, 
    createTask, 
    updateTask,
    updateTaskStatus, 
    deleteTask,
    getTasksByStatus,
    resetTasks,
    clearAllTasks
  } = useLocalTasks();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const handleResetTasks = () => {
    if (confirm('This will reset all tasks to the initial sample data. Are you sure?')) {
      resetTasks();
    }
  };

  const handleClearAllTasks = () => {
    if (confirm('This will delete all tasks permanently. Are you sure?')) {
      clearAllTasks();
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowCreateModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const handleStatusChange = (taskId: number, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedTask && draggedTask.task_status !== columnId) {
      handleStatusChange(draggedTask.id, columnId);
    }
    setDraggedTask(null);
  };

  const columns: KanbanColumn[] = [
    {
      id: 'pending',
      title: 'To Do',
      tasks: getTasksByStatus('pending')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: getTasksByStatus('in-progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: getTasksByStatus('completed')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          {/* Mobile layout: stacked */}
          <div className="block sm:hidden">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your tasks with our kanban board system. Drag and drop to change status.
              </p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                📁 Data stored locally in your browser • {tasks.length} total tasks
              </div>
            </div>
            
            {/* Mobile buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreateTask}
                className="btn-primary w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Task
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleResetTasks}
                  disabled={loading}
                  className="btn-secondary disabled:opacity-50 text-sm flex-1"
                  title="Reset to sample data"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
                
                <button
                  onClick={handleClearAllTasks}
                  disabled={loading}
                  className="btn-secondary disabled:opacity-50 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex-1"
                  title="Clear all tasks"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Desktop layout: side by side */}
          <div className="hidden sm:flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your tasks with our kanban board system. Drag and drop to change status.
              </p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                📁 Data stored locally in your browser • {tasks.length} total tasks
              </div>
            </div>
            
            {/* Desktop buttons */}
            <div className="flex space-x-3 flex-shrink-0 ml-6">
              <button
                onClick={handleCreateTask}
                className="btn-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Task
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleResetTasks}
                  disabled={loading}
                  className="btn-secondary disabled:opacity-50 text-sm"
                  title="Reset to sample data"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Data
                </button>
                
                <button
                  onClick={handleClearAllTasks}
                  disabled={loading}
                  className="btn-secondary disabled:opacity-50 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Clear all tasks"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && <Loading size="lg" text="Loading tasks..." />}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div 
                key={column.id} 
                className={`kanban-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold brand-text">
                    {column.title}
                  </h3>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-sm font-medium">
                    {column.tasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => handleEditTask(task)}
                      onDelete={() => handleDeleteTask(task.id)}
                      onStatusChange={(newStatus) => handleStatusChange(task.id, newStatus)}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedTask?.id === task.id}
                    />
                  ))}

                  {column.tasks.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                      {dragOverColumn === column.id && (
                        <p className="text-sm mt-2 text-indigo-600 dark:text-indigo-400 font-medium">
                          Drop task here
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreateModal && (
          <TaskModal
            task={editingTask}
            onClose={() => {
              setShowCreateModal(false);
              setEditingTask(null);
            }}
            onSave={(taskData) => {
              if (editingTask) {
                // Update existing task
                updateTask(editingTask.id, taskData);
              } else {
                // Create new task
                createTask(taskData);
              }
              setShowCreateModal(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging: boolean;
}

function TaskCard({ task, onEdit, onDelete, onStatusChange, onDragStart, onDragEnd, isDragging }: TaskCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.task_status !== 'completed';

  return (
    <div 
      className={`task-card ${isOverdue ? 'border-l-red-500' : ''} ${isDragging ? 'dragging' : ''}`}
      draggable={true}
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium brand-text flex-1 pr-2">
          {task.title}
        </h4>
        <div className="flex items-center space-x-1">
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                <div className="py-1">
                  <button
                    onClick={() => { onEdit(); setShowDropdown(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => { onDelete(); setShowDropdown(false); }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.task_status)}`}>
            {task.task_status.replace('-', ' ')}
          </span>
        </div>
      </div>

      {task.due_date && (
        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : ''}>
            Due: {formatDate(task.due_date)}
          </span>
        </div>
      )}

      <div className="mt-3 flex space-x-1">
        {(['pending', 'in-progress', 'completed'] as TaskStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            disabled={task.task_status === status}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              task.task_status === status
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 cursor-not-allowed'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
            title={`Move to ${status.replace('-', ' ')}`}
          >
            {status === 'pending' && '📋'}
            {status === 'in-progress' && '⏳'}
            {status === 'completed' && '✅'}
          </button>
        ))}
      </div>
    </div>
  );
}

interface TaskModalProps {
  task?: Task | null;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'created_date' | 'updated_date'>) => void;
}

function TaskModal({ task, onClose, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    task_status: 'pending' as TaskStatus,
    due_date: ''
  });

  // Update form data when task prop changes (for editing)
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        task_status: task.task_status || 'pending',
        due_date: task.due_date || ''
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        task_status: 'pending',
        due_date: ''
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold brand-text">
            {task ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium brand-text mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium brand-text mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium brand-text mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="input-field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium brand-text mb-1">
                Status
              </label>
              <select
                value={formData.task_status}
                onChange={(e) => setFormData({ ...formData, task_status: e.target.value as TaskStatus })}
                className="input-field"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium brand-text mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}