import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the API service before importing the component
jest.mock('@/utils/api', () => ({
  __esModule: true,
  default: {
    getUsers: jest.fn(() => Promise.resolve([])),
    createUser: jest.fn(() => Promise.resolve({})),
    updateUser: jest.fn(() => Promise.resolve({})),
    deleteUser: jest.fn(() => Promise.resolve({}))
  },
  User: {}
}))

import UserList from '../src/components/UserList'

describe('UserList Component', () => {
  // Test 15: Basic rendering test
  test('renders without crashing', () => {
    render(<UserList />)
    expect(document.body).toBeInTheDocument()
  })

  // Test 16: Check if component mounts successfully  
  test('mounts successfully', () => {
    const { container } = render(<UserList />)
    expect(container).toBeTruthy()
  })
})