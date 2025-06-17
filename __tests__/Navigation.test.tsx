// __tests__/Navigation.test.tsx (Fixed)
import React from 'react'
import { render, screen } from '@testing-library/react'
import Navigation from '@/components/Navigation'
import '@testing-library/jest-dom'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Navigation Component', () => {
  // Test 7: Navigation renders brand
  test('renders TaskFlow brand name', () => {
    render(<Navigation />)

    expect(screen.getByText('TaskFlow')).toBeInTheDocument()
  })

  // Test 8: Navigation links present (using getAllByText for duplicates)
  test('renders navigation links', () => {
    render(<Navigation />)

    expect(screen.getByRole('link', { name: /taskflow/i })).toBeInTheDocument()
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Tasks').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Analytics').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0)
  })

  // Test 9: Mobile menu button exists
  test('has mobile menu functionality', () => {
    render(<Navigation />)

    const mobileButton = screen.getByRole('button', { name: /toggle navigation menu/i })
    expect(mobileButton).toBeInTheDocument()
    expect(mobileButton).toHaveAttribute('aria-expanded', 'false')
  })
})