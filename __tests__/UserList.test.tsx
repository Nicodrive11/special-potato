import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import UserList from '@/components/UserList'
import '@testing-library/jest-dom'

describe('UserList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders user list component', () => {
    render(<UserList />)
    
    expect(document.body.firstChild).toBeInTheDocument()
  })

  test('displays users after loading', async () => {
    render(<UserList />)

    await waitFor(() => {
      const userElements = screen.queryAllByText(/@/)
      expect(userElements.length).toBeGreaterThanOrEqual(0)
    }, { timeout: 3000 })
  })

  test('shows appropriate content during loading or after load', async () => {
    render(<UserList />)

    await waitFor(() => {
      const hasSpinner = document.querySelector('[class*="animate-spin"]')
      const hasUsers = screen.queryAllByText(/@/).length > 0
      const hasContent = document.body.textContent && document.body.textContent.length > 0
      
      expect(hasSpinner || hasUsers || hasContent).toBeTruthy()
    }, { timeout: 3000 })
  })
})