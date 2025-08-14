# 要件定義書: 読書管理アプリケーション

*生成日時: 2025-01-15*  
*ヒアリングモードによる要件定義*

## 📋 ヒアリング結果サマリー

**原案**: Reading books management app  
**ヒアリングによる詳細化**:
- **コア機能**: メンタルマップ（読書前の意図設定）を中心とした読書管理
- **対象ユーザー**: 個人の読書愛好者
- **データ入力**: 手動入力のみ（外部API不使用）
- **認証方式**: メール/パスワードによるシンプル認証
- **利用形態**: 個人利用専用（共有機能なし）

---

## 1. システム概要

### 1.1 プロダクトビジョン
読書を単なる消費活動ではなく、意図的な学習・成長の機会として捉え直すための個人向け読書管理アプリケーション。「メンタルマップ」という独自機能により、読書前に目的・期待・変化目標を明確化し、より深い読書体験を実現する。

### 1.2 コアバリュー
- **意図的読書**: 読む前に「なぜ」「何を」「どう変わるか」を明確化
- **シンプルさ**: 必要最小限の機能で最大の価値を提供
- **個人最適化**: 個人の読書スタイルに合わせた柔軟な記録

### 1.3 期待される成果
- 読書の目的意識向上
- 学習効果の最大化
- 読書習慣の定着
- 成長の可視化

---

## 2. 機能要件

### 2.1 メンタルマップ機能（最重要機能）

#### 2.1.1 概要
読書前に作成する意図設定ツール。各本に対して3つのセクション×3項目ずつを記録。

#### 2.1.2 3つのセクション

**セクション1: なぜこの本を読むのか（理由）**
- 項目1: 1つ目の理由
- 項目2: 2つ目の理由
- 項目3: 3つ目の理由

**セクション2: この本から何を学べるか（期待する学び）**
- 項目1: 1つ目の学び
- 項目2: 2つ目の学び
- 項目3: 3つ目の学び

**セクション3: 読後どう変わりたいか（変化目標）**
- 項目1: 1つ目の変化
- 項目2: 2つ目の変化
- 項目3: 3つ目の変化

#### 2.1.3 ユーザーストーリー

```
As a 読書愛好者
I want to 読書前にメンタルマップを作成する
So that 読書の目的を明確にし、学習効果を最大化できる

受け入れ基準:
- [ ] 3つのセクションそれぞれに3つの項目を入力できる
- [ ] 入力内容を保存・編集できる
- [ ] 本ごとにメンタルマップを管理できる
- [ ] 作成日時が記録される
```

### 2.2 本の管理機能

#### 2.2.1 本の登録
- 手動入力による本情報の登録
- 必須項目: タイトル、著者
- 任意項目: ISBN、出版社、出版年、ページ数、カバー画像URL、カテゴリ

#### 2.2.2 読書ステータス管理
- 3つのステータス: 読みたい / 読書中 / 読了
- ステータス変更時の日付記録
- 読了日の記録

#### 2.2.3 ユーザーストーリー

```
As a ユーザー
I want to 本を登録し、読書ステータスを管理する
So that 自分の読書リストを整理できる

受け入れ基準:
- [ ] 本の基本情報を入力できる
- [ ] 読書ステータスを変更できる
- [ ] 読了日を記録できる
- [ ] 登録した本の一覧を表示できる
```

### 2.3 読書記録機能

#### 2.3.1 読了記録
- 読了日の記録
- 5段階評価（★1〜5）
- 感想メモ（任意、最大1000文字）

#### 2.3.2 ユーザーストーリー

```
As a ユーザー
I want to 読了した本の記録を残す
So that 読書履歴を振り返ることができる

受け入れ基準:
- [ ] 読了日を設定できる
- [ ] 5段階で評価できる
- [ ] 簡単な感想を記録できる
```

### 2.4 読書統計・分析機能

#### 2.4.1 基本統計
- 総読書数（読了本の総数）
- 月間読書数
- 年間読書数
- カテゴリ別読書数

#### 2.4.2 分析ビュー
- 月別読書推移グラフ
- カテゴリ別円グラフ
- 評価分布

#### 2.4.3 ユーザーストーリー

```
As a ユーザー
I want to 読書統計を確認する
So that 自分の読書傾向を把握できる

受け入れ基準:
- [ ] ダッシュボードで統計サマリーを表示
- [ ] 期間を指定して統計を確認できる
- [ ] グラフで視覚的に確認できる
```

### 2.5 認証・ユーザー管理

#### 2.5.1 認証機能
- メール/パスワードによるユーザー登録
- ログイン/ログアウト

#### 2.5.2 ユーザープロフィール
- 表示名
- プロフィール画像（任意）
- 読書目標設定（月間/年間）

---

## 3. 非機能要件

### 3.1 パフォーマンス要件
- ページロード時間: 3秒以内（初回）、1秒以内（キャッシュあり）
- API応答時間: 200ms以内（95パーセンタイル）
- 同時接続ユーザー数: 100人（初期目標）

### 3.2 セキュリティ要件
- HTTPS通信の強制
- パスワードのハッシュ化（Argon2）
- セッション管理（Better Auth）
- CSRF対策
- XSS対策（React自動エスケープ）
- SQL インジェクション対策（Drizzle ORM）

### 3.3 可用性要件
- 稼働率: 99%以上
- データバックアップ: 日次
- エラー時のグレースフルデグレード

### 3.4 ユーザビリティ要件
- レスポンシブデザイン（モバイル/タブレット/デスクトップ）
- ダークモード対応
- アクセシビリティ: WCAG 2.1 Level AA準拠
- 日本語UI

---

## 4. 技術仕様

### 4.1 技術スタック

#### フロントエンド
- **Framework**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **Component Library**: shadcn/ui
- **State Management**: nuqs (URL state)
- **Form Handling**: Conform + Zod

#### バックエンド
- **API Framework**: Hono 4.9.1
- **Validation**: Zod + Zod OpenAPI
- **Authentication**: Better Auth 1.3.6
- **Runtime**: Node.js (via Bun)

#### データベース
- **ORM**: Drizzle ORM 0.44.4
- **Database**: Turso (LibSQL)
- **Client**: @libsql/client

#### 開発環境
- **Package Manager**: Bun
- **Linter/Formatter**: Biome
- **Testing**: Vitest (Unit) + Playwright (E2E)

### 4.2 アーキテクチャ

```
┌─────────────────────────────────────┐
│         Next.js App Router          │
│  (React Server Components + Client) │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Hono API (BFF Pattern)        │
│     /api/hono/* endpoints           │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│        Business Logic Layer         │
│    (Services, Validators)           │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Data Access Layer              │
│      (Drizzle ORM + Turso)         │
└─────────────────────────────────────┘
```

### 4.3 データモデル

#### Users Table
```typescript
{
  id: string (UUID)
  email: string (unique)
  name: string
  avatarUrl?: string
  monthlyGoal?: number
  yearlyGoal?: number
  createdAt: datetime
  updatedAt: datetime
}
```

#### Books Table
```typescript
{
  id: string (UUID)
  userId: string (FK)
  title: string
  author: string
  isbn?: string
  publisher?: string
  publishedYear?: number
  pageCount?: number
  coverImageUrl?: string
  category?: string
  status: 'want_to_read' | 'reading' | 'completed'
  statusChangedAt: datetime
  completedAt?: datetime
  rating?: number (1-5)
  notes?: string
  createdAt: datetime
  updatedAt: datetime
}
```

#### MentalMaps Table
```typescript
{
  id: string (UUID)
  bookId: string (FK)
  userId: string (FK)
  
  // なぜ読むのか
  reason1: string
  reason2: string
  reason3: string
  
  // 何を学べるか
  learning1: string
  learning2: string
  learning3: string
  
  // どう変わりたいか
  change1: string
  change2: string
  change3: string
  
  createdAt: datetime
  updatedAt: datetime
}
```

#### ReadingSessions Table (将来拡張用)
```typescript
{
  id: string (UUID)
  bookId: string (FK)
  userId: string (FK)
  startedAt: datetime
  endedAt?: datetime
  pagesRead?: number
  notes?: string
}
```

### 4.4 API エンドポイント設計

#### 認証 API
- Better Auth管理

#### 本管理 API
- `GET /api/hono/books` - 本一覧取得
- `POST /api/hono/books` - 本登録
- `GET /api/hono/books/:id` - 本詳細取得
- `PUT /api/hono/books/:id` - 本情報更新
- `DELETE /api/hono/books/:id` - 本削除
- `PATCH /api/hono/books/:id/status` - ステータス更新

#### メンタルマップ API
- `GET /api/hono/mental-maps/:bookId` - メンタルマップ取得
- `POST /api/hono/mental-maps` - メンタルマップ作成
- `PUT /api/hono/mental-maps/:id` - メンタルマップ更新
- `DELETE /api/hono/mental-maps/:id` - メンタルマップ削除

#### 統計 API
- `GET /api/hono/stats/summary` - 統計サマリー
- `GET /api/hono/stats/monthly` - 月別統計
- `GET /api/hono/stats/category` - カテゴリ別統計

---

## 5. UI/UX 設計

### 5.1 画面構成

#### 5.1.1 公開ページ
- `/` - ランディングページ
- `/login` - ログイン
- `/register` - ユーザー登録
- `/reset-password` - パスワードリセット

#### 5.1.2 認証後ページ
- `/dashboard` - ダッシュボード（統計サマリー）
- `/books` - 本一覧
- `/books/new` - 本の新規登録
- `/books/:id` - 本の詳細
- `/books/:id/mental-map` - メンタルマップ編集
- `/books/:id/edit` - 本情報編集
- `/profile` - プロフィール設定
- `/stats` - 詳細統計

### 5.2 コンポーネント設計

#### 共通コンポーネント
- `Header` - ナビゲーションヘッダー
- `Footer` - フッター
- `Layout` - レイアウトラッパー
- `Button` - ボタン（shadcn/ui）
- `Form` - フォーム要素（Conform）
- `Card` - カードコンポーネント
- `Dialog` - モーダルダイアログ

#### 機能別コンポーネント
- `BookCard` - 本のカード表示
- `BookList` - 本のリスト表示
- `MentalMapForm` - メンタルマップ入力フォーム
- `MentalMapView` - メンタルマップ表示
- `StatusBadge` - 読書ステータスバッジ
- `RatingStars` - 評価星表示
- `StatsChart` - 統計グラフ
- `ReadingProgress` - 読書進捗表示

### 5.3 デザインシステム

#### カラーパレット
- Primary: Blue系（信頼、知識）
- Secondary: Green系（成長、達成）
- Accent: Orange系（注目、重要）
- Neutral: Gray系
- Error: Red系
- Success: Green系

#### タイポグラフィ
- 見出し: Noto Sans JP (Bold)
- 本文: Noto Sans JP (Regular)
- サイズ: 16px基準のレム単位

#### スペーシング
- 8px グリッドシステム
- コンポーネント間: 16px/24px/32px
- セクション間: 48px/64px

---

## 6. 実装フェーズ

### Phase 1: MVP（2-3週間）
1. 認証機能実装
2. 本の基本CRUD
3. メンタルマップ機能
4. 基本的なUI実装

### Phase 2: 統計機能（1-2週間）
1. 読書統計API
2. ダッシュボード
3. グラフ表示

### Phase 3: UX改善（1週間）
1. レスポンシブ対応
2. ダークモード
3. パフォーマンス最適化

### Phase 4: 拡張機能（将来）
1. 読書セッション記録
2. メンタルマップと実際の学びの比較
3. エクスポート機能
4. ソーシャル機能

---

## 7. テスト戦略

### 7.1 ユニットテスト
- ビジネスロジック
- バリデーション
- ユーティリティ関数
- カバレッジ目標: 80%

### 7.2 統合テスト
- API エンドポイント
- データベース操作
- 認証フロー

### 7.3 E2Eテスト
- ユーザー登録〜ログイン
- 本の登録〜メンタルマップ作成
- 読書ステータス変更フロー

---

## 8. 制約事項と前提条件

### 8.1 制約事項
- 外部書籍APIは使用しない（手動入力のみ）
- 個人利用に特化（共有機能なし）
- 日本語UIのみ
- 初期は Web版のみ（ネイティブアプリなし）

### 8.2 前提条件
- ユーザーはメールアドレスを持っている
- モダンブラウザを使用（Chrome, Firefox, Safari, Edge最新版）
- JavaScript有効
- インターネット接続必須

---

## 9. 成功指標

### 9.1 技術的指標
- ページロード時間 < 3秒
- API応答時間 < 200ms
- エラー率 < 1%
- テストカバレッジ > 80%

### 9.2 ビジネス指標
- ユーザー登録数
- アクティブユーザー率（週1回以上利用）
- メンタルマップ作成率（登録本の80%以上）
- 継続率（3ヶ月後も利用）

---

## 10. リスクと対策

### 10.1 技術的リスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| Turso DBの制限 | 中 | 使用量モニタリング、必要時に他DBへ移行 |
| パフォーマンス劣化 | 高 | キャッシング戦略、CDN活用 |
| セキュリティ脆弱性 | 高 | 定期的な依存関係更新、セキュリティ監査 |

### 10.2 ビジネスリスク
| リスク | 影響度 | 対策 |
|--------|--------|------|
| ユーザー定着率低下 | 高 | オンボーディング改善、チュートリアル追加 |
| 機能の複雑化 | 中 | MVP機能に集中、ユーザーフィードバック重視 |

---

## 付録A: 用語集

- **メンタルマップ**: 読書前に作成する意図設定ツール（3×3の記録）
- **BFF**: Backend for Frontend（フロントエンド専用のバックエンド）
- **RSC**: React Server Components
- **Turso**: エッジ対応のSQLiteベースのデータベースサービス

## 付録B: 参考資料

- [Next.js App Router Documentation](https://nextjs.org/docs)
- [Better Auth Documentation](https://better-auth.com)
- [Hono Documentation](https://hono.dev)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [shadcn/ui Components](https://ui.shadcn.com)

---

*この要件定義書は、ヒアリングモードによる対話的な要件収集を経て生成されました。*