// src/utils/api.ts

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

// Add User interface for testing compatibility
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page?: number;
  limit?: number;
}

// Legacy fetchTasks function for backward compatibility
export async function fetchTasks(): Promise<{ tasks: Task[]; apiStatus: string }> {
  try {
    // This would be your actual API endpoint
    // For now, we'll return sample data
    const sampleTasks: Task[] = [
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
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      tasks: sampleTasks,
      apiStatus: '✅ Connected to sample data API (4 tasks loaded)'
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      tasks: [],
      apiStatus: '❌ Failed to fetch tasks'
    };
  }
}

// API service class (your existing implementation with additions for testing)
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getTasks(): Promise<TasksResponse> {
    try {
      // For now, return sample data since we don't have a real API
      const sampleTasks: Task[] = [
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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        tasks: sampleTasks,
        total: sampleTasks.length
      };
    } catch (error) {
      console.error('Error in getTasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  }

  async getTask(id: number): Promise<Task | null> {
    try {
      const { tasks } = await this.getTasks();
      return tasks.find(task => task.id === id) || null;
    } catch (error) {
      console.error('Error in getTask:', error);
      throw new Error('Failed to fetch task');
    }
  }

  async createTask(task: Omit<Task, 'id' | 'created_date'>): Promise<Task> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      const newTask: Task = {
        ...task,
        id: Date.now(), // Simple ID generation for demo
        created_date: new Date().toISOString()
      };

      return newTask;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw new Error('Failed to create task');
    }
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));

      const existingTask = await this.getTask(id);
      if (!existingTask) {
        throw new Error('Task not found');
      }

      const updatedTask: Task = {
        ...existingTask,
        ...updates,
        updated_date: new Date().toISOString()
      };

      return updatedTask;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw new Error('Failed to update task');
    }
  }

  async deleteTask(id: number): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      return true;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw new Error('Failed to delete task');
    }
  }

  // Added User methods for testing compatibility
  async getUsers(): Promise<{ users: User[] }> {
    try {
      // Sample users for testing
      const sampleUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return { users: sampleUsers };
    } catch (error) {
      console.error('Error in getUsers:', error);
      throw new Error('Failed to fetch users');
    }
  }

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const newUser: User = {
        ...user,
        id: Date.now()
      };

      return newUser;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<User> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const updatedUser: User = {
        id,
        name: 'Updated User',
        email: 'updated@example.com',
        ...user
      };

      return updatedUser;
    } catch (error) {
      console.error('Error in updateUser:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      // Deletion successful
    } catch (error) {
      console.error('Error in deleteUser:', error);
      throw new Error('Failed to delete user');
    }
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;