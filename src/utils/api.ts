// src/utils/api.ts
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

const API_BASE_URL = 'https://sd-6310-2025-summer-express-app.onrender.com';

// Helper functions to map API data to our format
const mapStatus = (status: string): 'pending' | 'in-progress' | 'completed' => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('complete') || statusLower.includes('done') || statusLower === 'finished') {
    return 'completed';
  }
  if (statusLower.includes('progress') || statusLower.includes('active') || statusLower === 'working') {
    return 'in-progress';
  }
  return 'pending';
};

const mapPriority = (priority: string): 'low' | 'medium' | 'high' | 'urgent' => {
  const priorityLower = priority.toLowerCase();
  if (priorityLower.includes('urgent') || priorityLower.includes('critical')) return 'urgent';
  if (priorityLower.includes('high') || priorityLower.includes('important')) return 'high';
  if (priorityLower.includes('low')) return 'low';
  return 'medium';
};

const convertApiDataToTasks = (data: any): Task[] => {
  if (Array.isArray(data)) {
    return data.map((item: any, index: number) => ({
      id: item.id || index + 1,
      title: item.title || item.name || `API Task ${index + 1}`,
      description: item.description || '',
      status: mapStatus(item.status || 'pending'),
      priority: mapPriority(item.priority || 'medium'),
      dueDate: item.dueDate || item.due,
      createdAt: item.createdAt || new Date().toISOString().split('T')[0],
    }));
  } else if (data.tasks || data.data) {
    const items = data.tasks || data.data;
    return items.map((item: any, index: number) => ({
      id: item.id || index + 1,
      title: item.title || item.name || `API Task ${index + 1}`,
      description: item.description || '',
      status: mapStatus(item.status || 'pending'),
      priority: mapPriority(item.priority || 'medium'),
      dueDate: item.dueDate || item.due,
      createdAt: item.createdAt || new Date().toISOString().split('T')[0],
    }));
  }
  return [];
};

// Improved fetchTasks using Promise.all for concurrent requests
export const fetchTasks = async (): Promise<{ tasks: Task[]; apiStatus: string }> => {
  try {
    // First check if API is available
    const rootResponse = await fetch(`${API_BASE_URL}/`);
    if (!rootResponse.ok) {
      throw new Error('API server not responding');
    }

    const endpoints = ['/tasks', '/api/tasks', '/todos', '/items', '/task'];
    
    // Create all fetch promises
    const fetchPromises = endpoints.map(endpoint => 
      fetch(`${API_BASE_URL}${endpoint}`)
        .then(response => ({
          endpoint,
          response,
          success: response.ok
        }))
        .catch(() => ({
          endpoint,
          response: null,
          success: false
        }))
    );

    // Execute all requests concurrently
    const results = await Promise.all(fetchPromises);
    
    // Find the first successful response
    for (const result of results) {
      if (result.success && result.response) {
        try {
          const data = await result.response.json();
          const tasks = convertApiDataToTasks(data);
          
          if (tasks.length > 0) {
            return {
              tasks,
              apiStatus: `✅ Connected to API: ${result.endpoint} (${tasks.length} items)`
            };
          }
        } catch (parseError) {
          console.log(`Failed to parse data from ${result.endpoint}:`, parseError);
        }
      }
    }
    
    throw new Error('No working endpoints found');
    
  } catch (error) {
    console.warn('API completely unavailable, using mock data:', error);
    
    // Mock data fallback
    const mockTasks: Task[] = [
      { id: 1, title: 'Design new homepage', status: 'in-progress', priority: 'high', dueDate: '2025-05-30' },
      { id: 2, title: 'Fix login bug', status: 'pending', priority: 'urgent', dueDate: '2025-05-26' },
      { id: 3, title: 'Update documentation', status: 'completed', priority: 'medium', dueDate: '2025-05-25' },
      { id: 4, title: 'Code review for API', status: 'pending', priority: 'high', dueDate: '2025-05-28' },
      { id: 5, title: 'Setup deployment pipeline', status: 'in-progress', priority: 'medium', dueDate: '2025-06-01' }
    ];
    
    return {
      tasks: mockTasks,
      apiStatus: '⚠️ API unavailable - showing sample data'
    };
  }
};

export type { Task };