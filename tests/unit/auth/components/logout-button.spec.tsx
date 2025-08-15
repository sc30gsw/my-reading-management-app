import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, test, expect, beforeEach } from 'vitest'
import { LogoutButton } from '~/features/auth/components/logout-button'

// useLogoutフックのモック
vi.mock('~/features/auth/hooks/use-logout')

describe('LogoutButton', () => {
  const mockHandleLogout = vi.fn()

  const defaultMockReturn = {
    isPending: false,
    handleLogout: mockHandleLogout,
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    const { useLogout } = await import('~/features/auth/hooks/use-logout')
    vi.mocked(useLogout).mockReturnValue(defaultMockReturn)
  })

  describe('レンダリング', () => {
    test('ログアウトボタンが正しく表示される', () => {
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
      expect(logoutButton).toBeInTheDocument()
      expect(logoutButton).toHaveAttribute('type', 'button')
      expect(logoutButton).toHaveAttribute('data-testid', 'logout-button')
      expect(logoutButton).not.toBeDisabled()
    })

    test('ボタンのスタイルが正しく適用される', () => {
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
      expect(logoutButton).toHaveClass('cursor-pointer')
      expect(logoutButton).toHaveClass('disabled:cursor-not-allowed')
    })
  })

  describe('ローディング状態', () => {
    test('isPendingがtrueの時、ローディング表示とボタン無効化', async () => {
      const mockReturnWithPending = {
        ...defaultMockReturn,
        isPending: true,
      }
      const { useLogout } = await import('~/features/auth/hooks/use-logout')
      vi.mocked(useLogout).mockReturnValue(mockReturnWithPending)

      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button')
      expect(logoutButton).toBeDisabled()
      expect(logoutButton).toHaveTextContent('ログアウト中...')

      // ローディングスピナーの存在確認
      const loadingText = screen.getByText('ログアウト中...')
      expect(loadingText).toBeInTheDocument()
    })

    test('isPendingがfalseの時、通常の表示', () => {
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
      expect(logoutButton).not.toBeDisabled()
      expect(logoutButton).toHaveTextContent('ログアウト')

      // ローディングテキストが表示されていないことを確認
      expect(screen.queryByText('ログアウト中...')).toBeNull()
    })
  })

  describe('ユーザーインタラクション', () => {
    test('ボタンクリックでhandleLogoutが呼ばれる', async () => {
      const user = userEvent.setup()
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })

      await user.click(logoutButton)

      expect(mockHandleLogout).toHaveBeenCalledTimes(1)
    })

    test('isPendingがtrueの時、ボタンが無効化されてクリックできない', async () => {
      const user = userEvent.setup()
      const mockReturnWithPending = {
        ...defaultMockReturn,
        isPending: true,
      }
      const { useLogout } = await import('~/features/auth/hooks/use-logout')
      vi.mocked(useLogout).mockReturnValue(mockReturnWithPending)

      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button')
      expect(logoutButton).toBeDisabled()

      await user.click(logoutButton)

      // ボタンが無効化されているため、handleLogoutが呼ばれない
      expect(mockHandleLogout).not.toHaveBeenCalled()
    })

    test('複数回クリックした時のhandleLogout呼び出し', async () => {
      const user = userEvent.setup()
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })

      // 複数回クリック
      await user.click(logoutButton)
      await user.click(logoutButton)
      await user.click(logoutButton)

      expect(mockHandleLogout).toHaveBeenCalledTimes(3)
    })
  })

  describe('アクセシビリティ', () => {
    test('適切なrole属性が設定されている', () => {
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button')
      expect(logoutButton).toBeInTheDocument()
    })

    test('data-testid属性が設定されている', () => {
      render(<LogoutButton />)

      const logoutButton = screen.getByTestId('logout-button')
      expect(logoutButton).toBeInTheDocument()
    })

    test('ボタンのタイプがbuttonに設定されている', () => {
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button')
      expect(logoutButton).toHaveAttribute('type', 'button')
    })
  })

  describe('キーボードナビゲーション', () => {
    test('Enterキーでボタンが実行される', async () => {
      const user = userEvent.setup()
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
      logoutButton.focus()

      await user.keyboard('{Enter}')

      expect(mockHandleLogout).toHaveBeenCalledTimes(1)
    })

    test('Spaceキーでボタンが実行される', async () => {
      const user = userEvent.setup()
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
      logoutButton.focus()

      await user.keyboard(' ')

      expect(mockHandleLogout).toHaveBeenCalledTimes(1)
    })

    test('フォーカス状態の確認', async () => {
      const user = userEvent.setup()
      render(<LogoutButton />)

      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })

      // タブキーでフォーカス
      await user.tab()

      expect(logoutButton).toHaveFocus()
    })
  })
})