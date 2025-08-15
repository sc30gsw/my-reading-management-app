import { useForm, useInputControl } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { act, renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useToggle } from 'react-use'
import { toast } from 'sonner'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { signUpAction } from '~/features/auth/actions/sign-up-action'
import { ERROR_MESSAGE } from '~/features/auth/constants/validation'
import { useSignUp } from '~/features/auth/hooks/use-sign-up'
import { withCallbacks } from '~/utils/with-callback'

// Mock dependencies
vi.mock('next/navigation')
vi.mock('sonner')
vi.mock('~/features/auth/actions/sign-up-action')
vi.mock('~/utils/with-callback')
vi.mock('react')
vi.mock('react-use')
vi.mock('@conform-to/react')
vi.mock('@conform-to/zod/v4')

describe('useSignUp', () => {
  const mockPush = vi.fn()
  const mockToastSuccess = vi.fn()
  const mockToastError = vi.fn()
  const mockSignUpAction = vi.fn()
  const mockWithCallbacks = vi.fn()
  const mockUseActionState = vi.fn()
  const mockUseToggle = vi.fn()
  const mockUseForm = vi.fn()
  const mockUseInputControl = vi.fn()
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
    vi.mocked(signUpAction).mockImplementation(mockSignUpAction)
    vi.mocked(withCallbacks).mockImplementation(mockWithCallbacks)

    // Setup React hooks mocks
    vi.mocked(useActionState).mockImplementation(mockUseActionState)
    vi.mocked(useToggle).mockImplementation(mockUseToggle)
    vi.mocked(useForm).mockImplementation(mockUseForm)
    vi.mocked(useInputControl).mockImplementation(mockUseInputControl)
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
      name: { name: 'name', value: '' },
      email: { name: 'email', value: '' },
      password: { name: 'password', value: '' },
    }
    const mockToggle = vi.fn()
    const mockPassword = { value: 'test-password' }

    mockUseActionState.mockReturnValue([null, mockAction, false])
    mockUseToggle.mockReturnValue([false, mockToggle])
    mockUseForm.mockReturnValue([mockForm, mockFields])
    mockUseInputControl.mockReturnValue(mockPassword)
    mockWithCallbacks.mockReturnValue(mockAction)
    mockGetZodConstraint.mockReturnValue({})

    const { result } = renderHook(() => useSignUp())

    expect(result.current).toEqual({
      lastResult: null,
      action: mockAction,
      isPending: false,
      showPassword: false,
      toggle: mockToggle,
      form: mockForm,
      fields: mockFields,
      password: mockPassword,
    })
  })

  test('should handle successful sign up', () => {
    const mockAction = vi.fn()

    mockWithCallbacks.mockImplementation((action, callbacks) => {
      callbacks.onSuccess()
      return action
    })
    mockUseActionState.mockReturnValue([null, mockAction, false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, {}])
    mockUseInputControl.mockReturnValue({})

    renderHook(() => useSignUp())

    expect(mockWithCallbacks).toHaveBeenCalledWith(
      signUpAction,
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    )

    // Trigger success callback
    const callbacks = mockWithCallbacks.mock.calls[0][1]
    callbacks.onSuccess()

    expect(mockToastSuccess).toHaveBeenCalledWith(
      'アカウント作成に成功しました。',
      expect.objectContaining({
        position: 'top-center',
      }),
    )
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  test('should handle sign up error with custom message', () => {
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
    mockUseInputControl.mockReturnValue({})

    renderHook(() => useSignUp())

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

  test('should handle sign up error with default message', () => {
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
    mockUseInputControl.mockReturnValue({})

    renderHook(() => useSignUp())

    // Trigger error callback
    const callbacks = mockWithCallbacks.mock.calls[0][1]
    callbacks.onError(errorResult)

    expect(mockToastError).toHaveBeenCalledWith(
      ERROR_MESSAGE.FAILED_SIGN_UP,
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
    mockUseInputControl.mockReturnValue({})
    mockWithCallbacks.mockReturnValue(vi.fn())

    const { result } = renderHook(() => useSignUp())

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
    mockUseInputControl.mockReturnValue({})
    mockWithCallbacks.mockReturnValue(mockAction)

    const { result } = renderHook(() => useSignUp())

    expect(result.current.isPending).toBe(true)
  })

  test('should configure form validation correctly', () => {
    const mockLastResult = { error: 'test error' }
    const mockConstraint = { email: { required: true } }

    mockUseActionState.mockReturnValue([mockLastResult, vi.fn(), false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockGetZodConstraint.mockReturnValue(mockConstraint)
    mockUseForm.mockReturnValue([{}, {}])
    mockUseInputControl.mockReturnValue({})
    mockWithCallbacks.mockReturnValue(vi.fn())

    renderHook(() => useSignUp())

    expect(mockUseForm).toHaveBeenCalledWith(
      expect.objectContaining({
        lastResult: mockLastResult,
        constraint: mockConstraint,
        onValidate: expect.any(Function),
        defaultValue: {
          name: '',
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
    mockUseInputControl.mockReturnValue({})
    mockWithCallbacks.mockReturnValue(vi.fn())

    renderHook(() => useSignUp())

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

  test('should use input control for password field', () => {
    const mockFields = {
      password: { name: 'password', value: 'test-password' },
    }
    const mockPasswordControl = { value: 'controlled-password' }

    mockUseActionState.mockReturnValue([null, vi.fn(), false])
    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, mockFields])
    mockUseInputControl.mockReturnValue(mockPasswordControl)
    mockWithCallbacks.mockReturnValue(vi.fn())

    const { result } = renderHook(() => useSignUp())

    expect(mockUseInputControl).toHaveBeenCalledWith(mockFields.password)
    expect(result.current.password).toBe(mockPasswordControl)
  })

  test('should return all expected values in correct structure', () => {
    const mockLastResult = { success: true }
    const mockAction = vi.fn()
    const mockForm = { id: 'signup-form' }
    const mockFields = {
      name: { name: 'name' },
      email: { name: 'email' },
      password: { name: 'password' },
    }
    const mockPassword = { value: 'password123' }
    const mockToggle = vi.fn()

    mockUseActionState.mockReturnValue([mockLastResult, mockAction, true])
    mockUseToggle.mockReturnValue([true, mockToggle])
    mockUseForm.mockReturnValue([mockForm, mockFields])
    mockUseInputControl.mockReturnValue(mockPassword)
    mockWithCallbacks.mockReturnValue(mockAction)

    const { result } = renderHook(() => useSignUp())

    expect(result.current).toEqual({
      lastResult: mockLastResult,
      action: mockAction,
      isPending: true,
      showPassword: true,
      toggle: mockToggle,
      form: mockForm,
      fields: mockFields,
      password: mockPassword,
    })
  })

  test('should handle action state changes', () => {
    const initialResult = { initial: true }
    const updatedResult = { updated: true }
    const mockAction = vi.fn()

    mockUseActionState
      .mockReturnValueOnce([initialResult, mockAction, false])
      .mockReturnValueOnce([updatedResult, mockAction, true])

    mockUseToggle.mockReturnValue([false, vi.fn()])
    mockUseForm.mockReturnValue([{}, {}])
    mockUseInputControl.mockReturnValue({})
    mockWithCallbacks.mockReturnValue(mockAction)

    const { result, rerender } = renderHook(() => useSignUp())

    expect(result.current.lastResult).toBe(initialResult)
    expect(result.current.isPending).toBe(false)

    rerender()

    expect(result.current.lastResult).toBe(updatedResult)
    expect(result.current.isPending).toBe(true)
  })
})
