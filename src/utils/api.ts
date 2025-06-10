export interface Task {
  id: number;
  title: string;
  description?: string;
  task_status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  assigned_to?: number;
  created_by?: number;
  assigned_to_name?: string;
  created_by_name?: string;
  created_date?: string;
  updated_date?: string;
  completed_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  avatar_url?: string;
  created_date?: string;
  updated_date?: string;
  task_statistics?: {
    total_tasks: number;
    completed_tasks: number;
    in_progress_tasks: number;
    pending_tasks: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Task API methods
  async getTasks(filters?: {
    task_status?: string;
    priority?: string;
    assigned_to?: number;
    limit?: number;
    offset?: number;
  }): Promise<{ message: string; tasks: Task[] }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return this.request<{ message: string; tasks: Task[] }>(endpoint);
  }

  async getTask(id: number): Promise<{ message: string; task: Task }> {
    return this.request<{ message: string; task: Task }>(`/tasks/${id}`);
  }

  async createTask(task: {
    title: string;
    description?: string;
    task_status?: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    due_date?: string;
    assigned_to?: number;
    created_by?: number;
  }): Promise<{ message: string; task: Task }> {
    return this.request<{ message: string; task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<{ message: string; task: Task }> {
    // Use PATCH for partial updates (more appropriate for status changes)
    return this.request<{ message: string; task: Task }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async updateTaskComplete(id: number, completeTask: Task): Promise<{ message: string; task: Task }> {
    // Use PUT for complete task replacement
    return this.request<{ message: string; task: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(completeTask),
    });
  }

  async deleteTask(id: number): Promise<{ message: string; task: Task }> {
    return this.request<{ message: string; task: Task }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // User API methods
  async getUsers(filters?: {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ message: string; users: User[]; pagination: any }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return this.request<{ message: string; users: User[]; pagination: any }>(endpoint);
  }

  async getUser(id: number): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}`);
  }

  async createUser(user: {
    name: string;
    email: string;
    role?: 'user' | 'admin' | 'manager';
    avatar_url?: string;
  }): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(id: number, updates: Partial<User>): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteUser(id: number): Promise<{ message: string; user: User }> {
    return this.request<{ message: string; user: User }>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserTasks(userId: number, filters?: {
    task_status?: string;
    priority?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ message: string; user: User; tasks: Task[]; total_tasks: number }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users/${userId}/tasks?${queryString}` : `/users/${userId}/tasks`;
    
    return this.request<{ message: string; user: User; tasks: Task[]; total_tasks: number }>(endpoint);
  }
}

// Legacy function for backward compatibility (updated to work with new API)
export const fetchTasks = async (): Promise<{ tasks: Task[]; apiStatus: string }> => {
  try {
    const apiService = new ApiService();
    const response = await apiService.getTasks();
    
    return {
      tasks: response.tasks || [],
      apiStatus: `✅ Connected to TaskFlow API (${response.tasks?.length || 0} tasks loaded)`
    };
  } catch (error) {
    console.warn('TaskFlow API unavailable, using mock data:', error);
    
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
      }
    ];
    
    return {
      tasks: mockTasks,
      apiStatus: '⚠️ TaskFlow API unavailable - showing sample data'
    };
  }
};

const apiService = new ApiService();
export default apiService;