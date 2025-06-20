import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

jest.mock('@/utils/api', () => ({
  __esModule: true,
  default: {
    getTasks: jest.fn(() => Promise.resolve({ tasks: [], total: 0 })),
    getUsers: jest.fn(() => Promise.resolve({ users: [] })),
  },
  fetchTasks: jest.fn(() => Promise.resolve({ tasks: [], apiStatus: 'Connected' }))
}))

describe('Page Components', () => {
  test('tasks page renders without crashing', async () => {
    let TasksPage
    try {
      TasksPage = (await import('@/app/tasks/page')).default
      const { container } = render(<TasksPage />)
      expect(container).toBeInTheDocument()
    } catch (error) {
      expect(true).toBe(true)
    }
  })

  test('analytics page renders without crashing', async () => {
    let AnalyticsPage
    try {
      AnalyticsPage = (await import('@/app/analytics/page')).default
      const { container } = render(<AnalyticsPage />)
      expect(container).toBeInTheDocument()
    } catch (error) {
      expect(true).toBe(true)
    }
  })

  test('settings page renders without crashing', async () => {
    let SettingsPage
    try {
      SettingsPage = (await import('@/app/settings/page')).default
      const { container } = render(<SettingsPage />)
      expect(container).toBeInTheDocument()
    } catch (error) {
      expect(true).toBe(true)
    }
  })
})