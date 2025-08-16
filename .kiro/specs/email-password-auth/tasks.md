# Implementation Tasks

## データベース・設定基盤

- [ ] 1. 認証ミドルウェアとセッション管理
  - `src/middleware.ts`でBetter Authセッション管理ミドルウェアを実装
  - セッションCookie設定（HttpOnly, Secure, SameSite）を構成
  - 保護されたルート（`/`）でのセッション検証を設定
  - 未認証ユーザーの`/sign-in`リダイレクトロジックを実装
  - セッション期限切れ（24時間）の自動処理を確認
  - _Requirements: REQ-4.2, REQ-4.3, REQ-4.4, REQ-5.3_

## 認証バリデーション（TDD実装）

- [ ] 2. Zodバリデーションスキーマとエラーハンドラー
  - **Red**: `src/features/auth/types/schemas/sign-up-schema.spec.ts`で失敗テストを作成
  - **Red**: `src/features/auth/types/schemas/sign-in-schema.spec.ts`で失敗テストを作成
  - **Green**: `src/features/auth/types/schemas/sign-up-schema.ts`でsignUpSchemaを実装（email、password、name検証）
  - **Green**: `src/features/auth/types/schemas/sign-in-schema.ts`でsignInSchemaを実装（email、password検証）
  - **Green**: `src/features/auth/utils/error-handler.ts`でAuthErrorHandlerクラスを実装
  - **Refactor**: バリデーションルールの最適化とエラーメッセージの改善
  - _Requirements: REQ-1.2, REQ-1.3, REQ-1.4, REQ-2.2_

- [ ] 3. Zodスキーマのエッジケーステスト
  - **Red**: 境界値テスト（メール長、パスワード長）の失敗テストを追加
  - **Red**: 特殊文字、Unicode、SQLインジェクション試行のテストを追加
  - **Green**: バリデーションスキーマでエッジケースを適切に処理する実装
  - **Refactor**: 不要な重複ロジックの除去とパフォーマンス最適化
  - _Requirements: REQ-5.5, REQ-1.4_

## Server Actions（TDD実装）

- [ ] 4. ユーザー登録Server Action
  - **Red**: `src/features/auth/actions/sign-up.spec.ts`で失敗テストを作成
  - **Green**: `src/features/auth/actions/sign-up.ts`でregisterActionを実装
  - Better Auth `signUpEmail` APIとConform統合でユーザー作成処理
  - 重複メールチェック（Drizzleクエリ）とエラーハンドリング
  - **Refactor**: エラーレスポンス形式の統一とパフォーマンス改善
  - _Requirements: REQ-1.1, REQ-1.2, REQ-6.1_

- [ ] 5. ログインServer Action
  - **Red**: `src/features/auth/actions/sign-in.spec.ts`で失敗テストを作成
  - **Green**: `src/features/auth/actions/sign-in.ts`でsignInActionを実装
  - Better Auth `signInEmail` APIとセッション作成処理
  - 認証失敗時のエラーハンドリングとセキュリティ対策
  - **Refactor**: 認証フローの最適化とエラーレスポンスの改善
  - _Requirements: REQ-2.1, REQ-2.2, REQ-6.2_

- [ ] 6. ログアウトとプロフィール更新Action
  - **Red**: ログアウト・プロフィール更新の失敗テストを作成
  - **Green**: `src/features/auth/actions/sign-out.ts`でログアウトAction実装
  - **Green**: `src/features/auth/actions/update-profile.ts`でプロフィール更新Action実装
  - Better Auth `signOut` APIとセッション無効化処理
  - プロフィール情報（名前、目標設定）の更新ロジック
  - **Refactor**: セッション管理とデータ更新の最適化
  - _Requirements: REQ-2.3, REQ-3.2, REQ-4.5_

## UIコンポーネント（TDD実装）

- [ ] 7. SignUpFormコンポーネント
  - **Red**: `src/components/features/sign-up-form.spec.tsx`で失敗テストを作成
  - **Green**: `src/components/features/sign-up-form.tsx`でフォームコンポーネント実装
  - Conform + shadcn/ui統合でプログレッシブエンハンスメント対応
  - リアルタイムバリデーション、エラー表示、ローディング状態管理
  - **Refactor**: コンポーネント分割とアクセシビリティ改善
  - _Requirements: REQ-1.1, REQ-1.5_

- [ ] 8. SignInFormコンポーネント
  - **Red**: `src/components/features/sign-in-form.spec.tsx`で失敗テストを作成
  - **Green**: `src/components/features/sign-in-form.tsx`でログインフォーム実装
  - Conform統合、パスワード表示切り替え、「Remember me」機能
  - エラー状態表示とユーザビリティ向上
  - **Refactor**: フォーム再利用性とパフォーマンス最適化
  - _Requirements: REQ-2.1, REQ-2.5_

- [ ] 9. ProfileFormとAuthLayoutコンポーネント
  - **Red**: プロフィールフォームとレイアウトの失敗テストを作成
  - **Green**: `src/components/features/auth/profile-form.tsx`でプロフィール編集実装
  - **Green**: `src/components/features/auth/auth-layout.tsx`で認証ページレイアウト実装
  - プロフィール情報更新、アバター設定、読書目標管理
  - 認証ページ共通レイアウト、ナビゲーション、レスポンシブ対応
  - **Refactor**: レイアウト一貫性とモバイル最適化
  - _Requirements: REQ-3.1, REQ-3.3, REQ-3.4, REQ-3.5_

## カスタムフック（TDD実装）

- [ ] 10. useSignInとuseSignUpフック
  - **Red**: `src/hooks/auth/use-sign-in.spec.ts`で失敗テストを作成
  - **Red**: `src/hooks/auth/use-sign-up.spec.ts`で失敗テストを作成
  - **Green**: `src/hooks/auth/use-sign-in.ts`でログイン状態管理フック実装
  - **Green**: `src/hooks/auth/use-sign-up.ts`で登録状態管理フック実装
  - useActionState、ルーター統合、トースト通知の成功・失敗コールバック
  - **Refactor**: フック間の共通ロジック抽出と再利用性向上
  - _Requirements: REQ-1.1, REQ-2.1_

- [ ] 11. useProfileとuseSessionフック
  - **Red**: プロフィール・セッション管理フックの失敗テストを作成
  - **Green**: `src/hooks/auth/use-profile.ts`でプロフィール管理フック実装
  - **Refactor**: 状態管理の最適化とメモリリーク防止
  - _Requirements: REQ-3.1, REQ-4.1, REQ-4.2_

## ページ統合

- [ ] 12. 認証ページ（sign-in・sign-up）の作成
  - `src/app/(auth)/sign-in/page.tsx`でログインページ実装
  - `src/app/(auth)/sign-up/page.tsx`で登録ページ実装
  - `src/app/(auth)/layout.tsx`で認証専用レイアウト実装
  - Server ComponentとClient Componentの適切な分離
  - メタデータ（title、description）とSEO最適化
  - _Requirements: REQ-1.5, REQ-2.5_

- [ ] 14. プロフィールページと保護されたルート
  - `src/app/(dashboard)/profile/page.tsx`でプロフィールページ実装
  - `src/app/(dashboard)/layout.tsx`で認証必須レイアウト実装
  - 認証状態に基づくナビゲーション表示制御
  - ログアウト機能統合とセッション期限切れ対応
  - _Requirements: REQ-3.1, REQ-4.4_

- [ ] 15. ナビゲーションとルーティング統合
  - `src/components/navigation/auth-nav.tsx`で認証状態ナビゲーション実装
  - 認証済み・未認証ユーザー向けメニューの動的表示
  - ページ間のスムーズな遷移とローディング状態
  - アクセシビリティ対応（キーボードナビゲーション、スクリーンリーダー）
  - _Requirements: REQ-2.5, REQ-4.4_

## エラーハンドリングとセキュリティ

- [ ] 16. グローバルエラーハンドリング
  - `src/components/error-boundary.tsx`でエラー境界コンポーネント実装
  - `src/app/error.tsx`でページレベルエラーハンドリング実装
  - ネットワークエラー、認証エラー、バリデーションエラーの分類処理
  - ユーザーフレンドリーなエラーメッセージとリカバリー機能
  - _Requirements: REQ-5.2, REQ-1.2, REQ-2.2_

- [ ] 17. セキュリティ強化とテスト
  - CSRF保護、XSS対策、SQLインジェクション防止の実装確認
  - パスワードハッシュ化（Argon2）とHTTPS強制の設定確認
  - セキュリティヘッダー（CSP、HSTS等）の設定
  - セキュリティテストケースの実行と脆弱性チェック
  - _Requirements: REQ-5.1, REQ-5.2, REQ-5.3, REQ-5.4, REQ-5.5_

## E2E統合とテスト

- [ ] 18. E2Eテストスイートの実装
  - `tests/e2e/auth-flow.spec.ts`で認証フロー全体のE2Eテスト実装
  - ユーザー登録→ログイン→プロフィール更新→ログアウトの完全フロー
  - エラーシナリオ（無効入力、ネットワークエラー）のテスト
  - ブラウザ間互換性テスト（Chrome、Firefox、Safari）
  - _Requirements: All requirements need E2E validation_

- [ ] 19. テストカバレッジ検証と最終調整
  - ユニット・統合・E2Eテストの実行と85%カバレッジ達成確認
  - パフォーマンステスト（ログイン応答時間<200ms、セッション検証<50ms）
  - アクセシビリティテスト（WCAG 2.1 AA準拠）
  - モバイル・デスクトップでの動作確認と最終調整
  - _Requirements: All requirements need comprehensive testing_