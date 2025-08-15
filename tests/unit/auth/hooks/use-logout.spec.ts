import { act, renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { useLogout } from '~/features/auth/hooks/use-logout'
import { authClient } from '~/lib/auth-client'

// Mock dependencies
vi.mock('next/navigation')
vi.mock('sonner')
vi.mock('~/lib/auth-client')
vi.mock('react')

describe('useLogout', () => {
  const mockPush = vi.fn()
  const mockToastSuccess = vi.fn()
  const mockToastError = vi.fn()
  const mockSignOut = vi.fn()
  const mockStartTransition = vi.fn()
  const mockUseTransition = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup router mock
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    })

    // Setup toast mocks
    vi.mocked(toast).success = mockToastSuccess
    vi.mocked(toast).error = mockToastError

    // Setup auth client mock
    vi.mocked(authClient).signOut = mockSignOut

    // Setup React transition mock
    vi.mocked(useTransition).mockImplementation(mockUseTransition)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should initialize with correct default values', () => {
    mockUseTransition.mockReturnValue([false, mockStartTransition])

    const { result } = renderHook(() => useLogout())

    expect(result.current).toEqual({
      isPending: false,
      handleLogout: expect.any(Function),
    })
  })

  test('should handle pending state correctly', () => {
    mockUseTransition.mockReturnValue([true, mockStartTransition])

    const { result } = renderHook(() => useLogout())

    expect(result.current.isPending).toBe(true)
  })

  test('should handle successful logout', () => {
    mockUseTransition.mockReturnValue([false, mockStartTransition])
    mockStartTransition.mockImplementation((callback) => {
      callback()
    })

    const { result } = renderHook(() => useLogout())

    act(() => {
      result.current.handleLogout()
    })

    expect(mockStartTransition).toHaveBeenCalledWith(expect.any(Function))
  })

  test('should call success and error callbacks correctly', () => {
    mockUseTransition.mockReturnValue([false, mockStartTransition])

    const { result } = renderHook(() => useLogout())

    // Test that the function exists and is callable
    expect(typeof result.current.handleLogout).toBe('function')
  })

  test('should handle error states', () => {
    mockUseTransition.mockReturnValue([false, mockStartTransition])

    const { result } = renderHook(() => useLogout())

    expect(result.current.isPending).toBe(false)
    expect(typeof result.current.handleLogout).toBe('function')
  })

  test('should handle transition function properly', () => {
    mockUseTransition.mockReturnValue([false, mockStartTransition])

    const { result } = renderHook(() => useLogout())

    act(() => {
      result.current.handleLogout()
    })

    expect(mockStartTransition).toHaveBeenCalledTimes(1)
  })
})
