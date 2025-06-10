// src/utils/ui.ts
// UI utility functions for consistent styling across components

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent': return 'text-red-700 bg-red-100';
    case 'high': return 'text-orange-700 bg-orange-100';
    case 'medium': return 'text-yellow-700 bg-yellow-100';
    case 'low': return 'text-green-700 bg-green-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'text-green-700 bg-green-100';
    case 'in-progress': return 'text-blue-700 bg-blue-100';
    case 'pending': return 'text-gray-700 bg-gray-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

export const getPriorityColorBorder = (priority: string): string => {
  switch (priority) {
    case 'urgent': return 'border-l-red-500 bg-red-50';
    case 'high': return 'border-l-orange-500 bg-orange-50';
    case 'medium': return 'border-l-yellow-500 bg-yellow-50';
    case 'low': return 'border-l-green-500 bg-green-50';
    default: return 'border-l-gray-500 bg-gray-50';
  }
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'No date';
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString?: string): string => {
  if (!dateString) return 'No date';
  return new Date(dateString).toLocaleString();
};