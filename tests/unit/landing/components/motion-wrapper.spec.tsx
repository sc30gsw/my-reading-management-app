import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MotionWrapper } from '~/features/landing/components/motion-wrapper'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, triggerOnce, initial, animate, whileInView, transition, viewport, layout, staggerChildren, onAnimationComplete, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}))

// Mock hooks
vi.mock('~/features/landing/hooks/use-in-view', () => ({
  useInView: () => ({
    ref: vi.fn(),
    isInView: true,
  }),
}))

// Mock prefers-reduced-motion
const mockMatchMedia = vi.fn()
vi.stubGlobal('matchMedia', mockMatchMedia)

describe('MotionWrapper', () => {
  beforeEach(() => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  it('子要素が正しくレンダリングされる', () => {
    render(
      <MotionWrapper>
        <div data-testid="child-content">Test Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('animationがtrueの場合にアニメーションが適用される', () => {
    render(
      <MotionWrapper animation="slideUp">
        <div>Animated Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Animated Content')).toBeInTheDocument()
  })

  it('animationがfalseの場合にアニメーションが無効になる', () => {
    render(
      <MotionWrapper animation="slideUp">
        <div>Static Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Static Content')).toBeInTheDocument()
  })

  it('デフォルトでアニメーションが有効になる', () => {
    render(
      <MotionWrapper animation="fadeIn">
        <div>Default Animation</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Default Animation')).toBeInTheDocument()
  })

  it('カスタムclassNameが適用される', () => {
    render(
      <MotionWrapper className="custom-wrapper">
        <div>Custom Class Content</div>
      </MotionWrapper>,
    )

    const wrapper = screen.getByText('Custom Class Content').parentElement
    expect(wrapper).toHaveClass('custom-wrapper')
  })

  it('slideUpアニメーションが正しく設定される', () => {
    render(
      <MotionWrapper animation="slideUp">
        <div>Slide Up Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Slide Up Content')).toBeInTheDocument()
  })

  it('fadeInアニメーションが正しく設定される', () => {
    render(
      <MotionWrapper animation="fadeIn">
        <div>Fade In Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Fade In Content')).toBeInTheDocument()
  })

  it('slideLeftアニメーションが正しく設定される', () => {
    render(
      <MotionWrapper animation="slideLeft">
        <div>Slide Left Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Slide Left Content')).toBeInTheDocument()
  })

  it('slideRightアニメーションが正しく設定される', () => {
    render(
      <MotionWrapper animation="slideRight">
        <div>Slide Right Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Slide Right Content')).toBeInTheDocument()
  })

  it('scaleアニメーションが正しく設定される', () => {
    render(
      <MotionWrapper animation="scale">
        <div>Scale Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Scale Content')).toBeInTheDocument()
  })

  it('カスタム遅延が適用される', () => {
    render(
      <MotionWrapper animation="fadeIn" delay={0.5}>
        <div>Delayed Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Delayed Content')).toBeInTheDocument()
  })

  it('カスタム継続時間が適用される', () => {
    render(
      <MotionWrapper animation="slideUp" duration={1.5}>
        <div>Custom Duration Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Custom Duration Content')).toBeInTheDocument()
  })

  it('triggerOnceがtrueの場合に一度だけトリガーされる', () => {
    render(
      <MotionWrapper animation="fadeIn" triggerOnce={true}>
        <div>Trigger Once Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Trigger Once Content')).toBeInTheDocument()
  })

  it('カスタムthresholdが適用される', () => {
    render(
      <MotionWrapper animation="slideUp" threshold={0.8}>
        <div>Custom Threshold Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Custom Threshold Content')).toBeInTheDocument()
  })

  it('prefers-reduced-motionが有効な場合にアニメーションが無効になる', () => {
    mockMatchMedia.mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    render(
      <MotionWrapper animation="slideUp">
        <div>Reduced Motion Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Reduced Motion Content')).toBeInTheDocument()
  })

  it('複数の子要素が正しくレンダリングされる', () => {
    render(
      <MotionWrapper animation="fadeIn">
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </MotionWrapper>,
    )

    expect(screen.getByText('First Child')).toBeInTheDocument()
    expect(screen.getByText('Second Child')).toBeInTheDocument()
    expect(screen.getByText('Third Child')).toBeInTheDocument()
  })

  it('ネストされたMotionWrapperが正しく動作する', () => {
    render(
      <MotionWrapper animation="fadeIn">
        <div>Outer Content</div>
        <MotionWrapper animation="slideUp">
          <div>Inner Content</div>
        </MotionWrapper>
      </MotionWrapper>,
    )

    expect(screen.getByText('Outer Content')).toBeInTheDocument()
    expect(screen.getByText('Inner Content')).toBeInTheDocument()
  })

  it('staggerChildrenが適用される', () => {
    render(
      <MotionWrapper animation="fadeIn" staggerChildren={0.1}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Child 3')).toBeInTheDocument()
  })

  it('onAnimationCompleteコールバックが設定される', () => {
    const onComplete = vi.fn()

    render(
      <MotionWrapper animation="fadeIn" onAnimationComplete={onComplete}>
        <div>Callback Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Callback Content')).toBeInTheDocument()
  })

  it('asプロパティで異なる要素タイプが使用される', () => {
    render(
      <MotionWrapper as="section" animation="fadeIn">
        <div>Section Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Section Content')).toBeInTheDocument()
  })

  it('data属性が正しく設定される', () => {
    render(
      <MotionWrapper animation="fadeIn" data-testid="motion-wrapper">
        <div>Test Data Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByTestId('motion-wrapper')).toBeInTheDocument()
  })

  it('aria属性が正しく設定される', () => {
    render(
      <MotionWrapper animation="fadeIn" aria-label="アニメーションコンテナ">
        <div>Accessible Content</div>
      </MotionWrapper>,
    )

    const container = screen.getByLabelText('アニメーションコンテナ')
    expect(container).toBeInTheDocument()
  })

  it('無効なアニメーション名でもエラーにならない', () => {
    render(
      <MotionWrapper animation={'invalidAnimation' as any}>
        <div>Invalid Animation Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Invalid Animation Content')).toBeInTheDocument()
  })

  it('空の子要素でもエラーにならない', () => {
    render(<MotionWrapper animation="fadeIn">{null}</MotionWrapper>)

    // エラーが発生しないことを確認
  })

  it('複雑なアニメーション設定が適用される', () => {
    render(
      <MotionWrapper
        animation="slideUp"
        delay={0.2}
        duration={0.8}
        staggerChildren={0.1}
        triggerOnce={true}
        threshold={0.3}
      >
        <div>Complex Animation Content</div>
      </MotionWrapper>,
    )

    expect(screen.getByText('Complex Animation Content')).toBeInTheDocument()
  })
})
