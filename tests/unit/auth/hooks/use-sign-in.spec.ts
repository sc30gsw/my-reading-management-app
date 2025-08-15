import { useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { act, renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useToggle } from 'react-use'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { signInAction } from '~/features/auth/actions/sign-in-action'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'
import { useSignIn } from '~/features/auth/hooks/use-sign-in'
import { withCallbacks } from '~/utils/with-callback'

// Mock dependencies
vi.mock('next/navigation')
vi.mock('sonner')
vi.mock('~/features/auth/actions/sign-in-action')
vi.mock('~/utils/with-callback')
vi.mock('react')
vi.mock('react-use')
vi.mock('@conform-to/react')
vi.mock('@conform-to/zod/v4')

describe('useSignIn', () => {
  const mockPush = vi.fn()
  const mockToastSuccess = vi.fn()
  const mockToastError = vi.fn()
  const mockSignInAction = vi.fn()
  const mockWithCallbacks = vi.fn()
  const mockUseActionState = vi.fn()
  const mockUseToggle = vi.fn()
  const mockUseForm = vi.fn()
  const mockGetZodConstraint = vi.fn()
  const mockParseWithZod = vi.fn()

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

    // Setup action mocks
    vi.mocked(signInAction).mockImplementation(mockSignInAction)
    vi.mocked(withCallbacks).mockImplementation(mockWithCallbacks)

    // Setup React hooks mocks
    vi.mocked(useActionState).mockImplementation(mockUseActionState)
    vi.mocked(useToggle).mockImplementation(mockUseToggle)
    vi.mocked(useForm).mockImplementation(mockUseForm)
    vi.mocked(getZodConstraint).mockImplementation(mockGetZodConstraint)
    vi.mocked(parseWithZod).mockImplementation(mockParseWithZod)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should initialize with correct default values', () => {
    // Setup mocks
    const mockAction = vi.fn()
    const mockForm = { id: 'form', onSubmit: vi.fn() }
    const mockFields = {
      email: { name: 'email', value: '' },
      password: { name: 'password', value: '' },
    }
    const mockToggle = vi.fn()

    mockUseActionState.mockReturnValue([null, mockAction, false])
    mockUseToggle.mockReturnValue([false, mockToggle])
    mockUseForm.mockReturnValue([mockForm, mockFields])
    mockWithCallbacks.mockReturnValue(mockAction)
    mockGetZodConstraint.mockReturnValue({})

    const { result } = renderHook(() => useSignIn())

    expect(result.current).toEqual({
      action: mockAction,
      form: mockForm,
      fields: mockFields,
      isPending: false,
      showPassword: false,
      toggle: mockToggle,
      lastResult: null,
    })
  })

  test('should handle successful sign in', () => {
    const mockAction = vi.fn()

    mockWithCallbacks.mockImplementation((action, callbacks) => {
      callbacks.onSuccess()
      return action
    })
    mockUseActionState.mockReturnValue([null, mockAction, false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, {}])

    renderHook(() => useSignIn())

    expect(mockWithCallbacks).toHaveBeenCalledWith(
      signInAction,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    )

    // Trigger success callback
    const callbacks = mockWithCallbacks.mock.calls[0][1]
    callbacks.onSuccess()

    expect(mockToastSuccess).toHaveBeenCalledWith(
      'ログインに成功しました。',
      expect.objectContaining({
        position: 'top-center',
      }),
    )
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  test('should handle sign in error with custom message', () => {
    const mockAction = vi.fn()
    const errorResult = {
      error: { message: 'Custom error message' },
    }

    mockWithCallbacks.mockImplementation((action, callbacks) => {
      callbacks.onError(errorResult)
      return action
    })
    mockUseActionState.mockReturnValue([null, mockAction, false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, {}])

    renderHook(() => useSignIn())

    // Trigger error callback
    const callbacks = mockWithCallbacks.mock.calls[0][1]
    callbacks.onError(errorResult)

    expect(mockToastError).toHaveBeenCalledWith(
      'Custom error message',
      expect.objectContaining({
        position: 'top-center',
      }),
    )
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('should handle sign in error with default message', () => {
    const mockAction = vi.fn()
    const errorResult = {
      error: {},
    }

    mockWithCallbacks.mockImplementation((action, callbacks) => {
      callbacks.onError(errorResult)
      return action
    })
    mockUseActionState.mockReturnValue([null, mockAction, false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, {}])

    renderHook(() => useSignIn())

    // Trigger error callback
    const callbacks = mockWithCallbacks.mock.calls[0][1]
    callbacks.onError(errorResult)

    expect(mockToastError).toHaveBeenCalledWith(
      ERROR_MESSAGE.FAILED_SIGN_IN,
      expect.objectContaining({
        position: 'top-center',
      }),
    )
  })

  test('should toggle password visibility', () => {
    const mockToggle = vi.fn()

    mockUseActionState.mockReturnValue([null, vi.fn(), false])
    mockUseToggle.mockReturnValue([false, mockToggle])
    mockUseForm.mockReturnValue([{}, {}])
    mockWithCallbacks.mockReturnValue(vi.fn())

    const { result } = renderHook(() => useSignIn())

    act(() => {
      result.current.toggle()
    })

    expect(mockToggle).toHaveBeenCalled()
  })

  test('should handle pending state', () => {
    const mockAction = vi.fn()

    mockUseActionState.mockReturnValue([null, mockAction, true])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, {}])
    mockWithCallbacks.mockReturnValue(mockAction)

    const { result } = renderHook(() => useSignIn())

    expect(result.current.isPending).toBe(true)
  })

  test('should configure form validation correctly', () => {
    const mockLastResult = { error: 'test error' }
    const mockConstraint = { email: { required: true } }

    mockUseActionState.mockReturnValue([mockLastResult, vi.fn(), false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockGetZodConstraint.mockReturnValue(mockConstraint)
    mockUseForm.mockReturnValue([{}, {}])
    mockWithCallbacks.mockReturnValue(vi.fn())

    renderHook(() => useSignIn())

    expect(mockUseForm).toHaveBeenCalledWith(
      expect.objectContaining({
        lastResult: mockLastResult,
        constraint: mockConstraint,
        onValidate: expect.any(Function),
        defaultValue: {
          email: '',
          password: '',
        },
      }),
    )
  })

  test('should validate form data with Zod schema', () => {
    const mockFormData = new FormData()
    const mockValidationResult = { success: true }

    mockParseWithZod.mockReturnValue(mockValidationResult)
    mockUseActionState.mockReturnValue([null, vi.fn(), false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, {}])
    mockWithCallbacks.mockReturnValue(vi.fn())

    renderHook(() => useSignIn())

    // Get the onValidate function from useForm call
    const onValidate = mockUseForm.mock.calls[0][0].onValidate
    const result = onValidate({ formData: mockFormData })

    expect(mockParseWithZod).toHaveBeenCalledWith(
      mockFormData,
      expect.objectContaining({
        schema: expect.any(Object),
      }),
    )
    expect(result).toBe(mockValidationResult)
  })
})
