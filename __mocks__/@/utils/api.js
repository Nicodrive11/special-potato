// Mock for @/utils/api
const apiService = {
  getUsers: jest.fn(() => Promise.resolve([])),
  createUser: jest.fn(() => Promise.resolve({})),
  updateUser: jest.fn(() => Promise.resolve({})),
  deleteUser: jest.fn(() => Promise.resolve({}))
}

export const User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com'
}

export default apiService