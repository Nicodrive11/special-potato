import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

describe('Integration Tests', () => {
  // Test 10: User event simulation
  test('user event setup works correctly', async () => {
    const user = userEvent.setup()
    
    render(
      <div>
        <button>Click me</button>
        <p>Hello World</p>
      </div>
    )

    const button = screen.getByRole('button', { name: 'Click me' })
    const text = screen.getByText('Hello World')
    
    expect(button).toBeInTheDocument()
    expect(text).toBeInTheDocument()
    
    // Test user event functionality
    await user.click(button)
    // This test passes if no error is thrown
  })

  // Test 11: Multiple query types
  test('uses different React Testing Library queries', () => {
    render(
      <div>
        <h1>Main Title</h1>
        <button aria-label="Close dialog">×</button>
        <input placeholder="Enter text" />
        <span data-testid="status-indicator">Active</span>
      </div>
    )

    // Test different query methods as required
    expect(screen.getByRole('heading', { name: 'Main Title' })).toBeInTheDocument()
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    expect(screen.getByTestId('status-indicator')).toBeInTheDocument()
    expect(screen.queryByText('Active')).toBeInTheDocument()
  })

  // Test 12: Async testing capability
  test('handles async operations', async () => {
    render(
      <div>
        <p>Loading...</p>
      </div>
    )

    // Use findByText for async content (even though this is synchronous)
    const loadingText = await screen.findByText('Loading...')
    expect(loadingText).toBeInTheDocument()
  })
})