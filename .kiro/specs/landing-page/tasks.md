# ランディングページ実装タスク

## 基盤構築

- [x] 1. ランディングページ型定義作成（インターフェース定義は禁止）
  - `src/types/landing.ts`ファイルを作成し、LandingStats、Feature、Testimonial、FAQItem、ValueProposition型を定義
  - 各コンポーネントのPropsインターフェースを型定義
  - Zod スキーマによるランタイム検証スキーマを追加
  - TypeScript strict modeでの型安全性を確保
  - _Requirements: すべての要件に型安全性が必要_

- [x] 2. モックデータと定数の実装
  - `src/lib/landing/data.ts`ファイルを作成し、統計データ、機能リスト、証言、FAQ項目の模擬データを実装
  - `src/lib/landing/constants.ts`ファイルを作成し、ランディングページの定数（メッセージ、URL、設定値）を定義
  - 各データの型安全性を確保し、実際のコンテンツに即したリアルなデータを作成
  - デフォルトexportとnamed exportを適切に使い分け
  - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1_

- [x] 3. ランディングページユーティリティとhooks
  - `src/lib/landing/utils.ts`ファイルを作成し、アニメーション設定、フォーマット関数、ヘルパー関数を実装
  - `src/hooks/landing/`ディレクトリを作成し、useInView、useCountAnimation、useScrollPosition等のカスタムhooksを実装
  - Framer Motionのバリアント設定とアニメーション設定を定義
  - パフォーマンス最適化のためのメモ化とデバウンス処理を含める
  - _Requirements: 2.4, 4.3, 9.4_

## 静的コンポーネント

- [x] 4. HeroSectionコンポーネント実装
  - `src/components/features/landing/HeroSection.tsx`を作成し、メインコピー、説明文、CTAボタンを含むヒーローセクションを実装
  - shadcn/ui ButtonコンポーネントとNext.js Linkを使用してCTAボタンを実装
  - Tailwind CSSクラスによるレスポンシブデザインを適用
  - 画像最適化のためのNext.js Imageコンポーネント統合（ヒーロー画像用）
  - _Requirements: 1.1, 1.2, 1.3, 8.1_

- [x] 5. FeaturesSectionコンポーネント実装
  - `src/components/features/landing/FeaturesSection.tsx`を作成し、3つの主要機能を表示するグリッドレイアウトを実装
  - `src/components/features/landing/FeatureCard.tsx`を作成し、機能名、説明、アイコンを表示するカードコンポーネントを実装
  - メンタルマップ機能の強調表示（highlighted propsによる特別スタイリング）
  - Lucide Reactアイコンの統合とアイコンマッピング
  - _Requirements: 2.1, 2.2, 2.3, 8.2_

- [x] 6. ValuePropositionSectionコンポーネント実装
  - `src/components/features/landing/ValuePropositionSection.tsx`を作成し、Before/After形式での価値提案表示を実装
  - 3つの価値（読書の質向上、学習効果最大化、成長の記録）を明確に表示
  - 統計データ表示のための`StatisticsDisplay`子コンポーネントを実装
  - 視覚的なアイコンと図表による理解促進要素を追加
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 7. PricingSectionコンポーネント実装
  - `src/components/features/landing/PricingSection.tsx`を作成し、料金体系（無料プラン強調）を表示
  - プラン比較テーブルまたはカード形式のレイアウト実装
  - 「無料で始める」ボタンの視覚的強調とCTA統合
  - 各プランの機能一覧と制限の明確な表示
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

## 動的コンポーネント

- [x] 8. SocialProofSectionコンポーネント実装
  - `src/components/features/landing/SocialProofSection.tsx`を作成し、統計表示とレビューカルーセルを実装
  - `src/components/features/landing/TestimonialCarousel.tsx`を作成し、ユーザーレビューのカルーセル機能を実装
  - 統計数値のカウントアップアニメーション（useCountAnimationフック使用）
  - 星評価表示とアバター画像の最適化
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 9. FAQSectionコンポーネント実装
  - `src/components/features/landing/FAQSection.tsx`を作成し、アコーディオン形式のFAQ表示を実装
  - `src/components/features/landing/FAQSearch.tsx`を作成し、FAQ検索機能を実装
  - shadcn/ui AccordionコンポーネントまたはCollapsibleを使用したスムーズな展開・折りたたみ
  - 検索フィルタリング機能と重要な質問の優先配置
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 10. Navigationコンポーネント実装
  - `src/components/features/landing/Navigation.tsx`を作成し、スティッキーナビゲーションを実装
  - スクロール検知による表示状態変更（useScrollPositionフック使用）
  - ログイン・無料登録ボタンの常時表示
  - モバイルメニューのハンバーガーメニュー実装
  - _Requirements: 7.1, 7.2, 8.1_

## メインページ統合

- [x] 11. ランディングページServer Component統合
  - `src/app/(dashboard)/page.tsx`ファイルを更新し、すべてのランディングセクションを統合したメインページを実装
  - React Server Componentとしての最適化（静的データの事前取得）
  - 適切なSEOメタデータ（title、description、OpenGraph）の設定
  - セクション間の適切なスペーシングとレイアウト調整
  - _Requirements: すべての要件の統合が必要_

- [x] 12. レスポンシブデザインとモバイル最適化
  - 全コンポーネントにTailwind CSSレスポンシブクラス（sm:、md:、lg:）を適用
  - モバイル（375px）、タブレット（768px）、デスクトップ（1024px+）の3ブレークポイント対応
  - タッチフレンドリーなUI要素（最小44pxタッチターゲット）の実装
  - 画面サイズに応じたレイアウト自動調整機能
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

## インタラクティブ機能

- [x] 13. アニメーション実装とパフォーマンス最適化
  - Framer Motionを使用したスクロール連動アニメーション（機能セクション、価値提案セクション）
  - 60FPSを維持するためのwill-changeプロパティとGPU加速の適用
  - Intersection Observerを使用した効率的な表示領域検知
  - prefers-reduced-motionメディアクエリによるアクセシビリティ対応
  - _Requirements: 2.4, 9.3, 9.4_

- [ ] 14. CTAボタンと認証フロー統合
  - 全CTAボタンのBetter Auth認証フロー（/auth/register）へのリダイレクト実装
  - Loading状態とエラーハンドリングの実装
  - 複数CTA位置（ヒーロー、ナビゲーション、セクション末尾）での一貫したデザイン
  - フォーム送信のProgressive Enhancement（JavaScript無効時の対応）
  - _Requirements: 1.4, 7.1, 7.3, 7.4_

## テスト実装

- [ ] 15. コンポーネントユニットテスト実装
  - `src/components/features/landing/__tests__/`ディレクトリを作成し、各コンポーネントのユニットテストを実装
  - Testing Library Reactを使用したコンポーネントレンダリングテスト
  - アクセシビリティテスト（axe-core）とユーザーインタラクションテスト
  - モック化されたhooksとアニメーションライブラリのテスト
  - _Requirements: すべての要件のコンポーネントテストが必要_

- [ ] 16. E2Eテストとパフォーマンステスト実装
  - `tests/e2e/landing-page.spec.ts`ファイルを作成し、ランディングページの完全なユーザーフローテストを実装
  - 変換フロー（ランディング→認証→ダッシュボード）のE2Eテスト
  - Core Web Vitals（LCP、FCP、CLS）のパフォーマンステスト
  - クロスブラウザ・レスポンシブデバイステスト
  - _Requirements: 9.1, 9.2, すべての要件のE2E検証が必要_

## 最終調整とポリッシュ

- [ ] 17. パフォーマンス最適化と品質保証
  - 画像の最適化（WebP/AVIF対応、適切なサイズ設定）
  - バンドルサイズ分析とコード分割（Dynamic imports）
  - メタデータとSEO最適化の最終確認
  - アクセシビリティ（WCAG AA）準拠の最終検証
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 18. 統合テストと本番準備
  - 全機能の統合テスト実行と品質確認
  - TypeScript型チェック（`bun tsc`）とBiome linting（`bun check`）の実行
  - 本番ビルド（`bun build`）のテストと最適化確認
  - テストカバレッジ（85%目標）の達成確認
  - _Requirements: すべての要件の最終検証が必要_