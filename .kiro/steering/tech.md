# Technology Stack - 読書管理アプリケーション

*Inclusion Mode: Always Included*  
*Generated: 2025-01-15*

## Architecture

### High-Level System Design
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   BFF (Hono)     │    │   Database      │
│                 │    │                  │    │                 │
│ • React 19 RSC  │◄──►│ • Type-safe RPC  │◄──►│ • Turso(LibSQL) │
│ • Server Actions│    │ • Zod OpenAPI    │    │ • Drizzle ORM   │
│ • Client Comps  │    │ • Route Handlers │    │ • Schema-driven │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Design Principles
- **Server-First**: React Server Components による初期レンダリング最適化
- **Type Safety**: エンドツーエンド型安全性（Frontend ↔ API ↔ Database）
- **Performance**: 最小限のJavaScriptバンドル、RSCによる高速化
- **BFF Pattern**: フロントエンド専用APIによる最適化されたデータ取得
- **Feature-Driven**: bulletproof-react準拠のディレクトリ構成

## Frontend

### Core Framework
- **Next.js**: `15.4.6` (App Router)
  - React Server Components (RSC) でサーバーサイドレンダリング
  - Server Actions によるMutation処理
  - Turbopack による高速開発環境
- **React**: `19.1.0`
  - React Compiler対応 (`babel-plugin-react-compiler`)
  - Concurrent Features活用

### UI & Styling
- **shadcn/ui**: モダンなコンポーネントライブラリ
  - `@radix-ui/react-dialog`: `^1.1.15`
  - `@radix-ui/react-slot`: `^1.2.3`
  - Compound Componentsパターン
- **Tailwind CSS**: `^4` (最新版)
  - `@tailwindcss/postcss`: PostCSS統合
  - `tailwind-merge`: クラス結合最適化
  - `class-variance-authority`: 型安全なvariant管理
- **Styling**: 
  - `clsx`: 条件付きクラス名結合
  - `next-themes`: ダークモード対応
  - `tw-animate-css`: アニメーション拡張

### State Management & Forms
- **nuqs**: `^2.4.3` - URL State Synchronization
  - 検索フィルタやページネーションの状態管理
  - Server Components との連携
- **Conform**: `^1.8.2` - Progressive Form Enhancement
  - `@conform-to/react`: React統合
  - `@conform-to/zod`: Zod Validationと連携
  - Server Actions との型安全な統合

### Utilities & Helpers
- **date-fns**: `^4.1.0` - 日付操作ライブラリ
- **remeda**: `^2.30.0` - 関数型ユーティリティ
- **lucide-react**: `^0.539.0` - アイコンライブラリ
- **sonner**: `^2.0.7` - トースト通知

## Backend

### API Framework
- **Hono**: `^4.9.1` - Edge-first Web Framework
  - Route Handlers: `/api/[[...route]]/route.ts`
  - RPC Client: 型安全なクライアント・サーバー通信
  - OpenAPI Documentation自動生成
- **@hono/zod-openapi**: `^1.1.0` - Zod統合OpenAPI
- **@scalar/hono-api-reference**: `^0.9.13` - API Documentation UI

### Validation & Type Safety
- **Zod**: `^4.0.17` - Schema Validation
  - Request/Response型定義
  - Form Validation
  - Environment Variables検証
- **TypeScript**: `^5` - Static Type Checking
  - Strict mode有効
  - Path mapping: `~/` → `./src/`

### Authentication
- **Better Auth**: `^1.3.6` - Modern Authentication
  - Email/Password認証
  - セッション管理
  - TypeScript-first設計
  - `/api/[[...route]]/auth/[...auth]/route.ts`

### Networking & Fetching
- **up-fetch**: `^2.3.0` - Enhanced fetch wrapper
- **react-call**: `^1.8.1` - React integration for API calls

## Database

### ORM & Database Client
- **Drizzle ORM**: `^0.44.4` - TypeScript-first ORM
  - Schema-first development
  - 型安全なクエリ
  - Migration management
- **@libsql/client**: `^0.15.11` - Turso/LibSQL client
- **Turso**: LibSQL-based edge database
  - SQLite互換
  - エッジロケーション対応
  - 自動スケーリング

### Database Schema Design
```typescript
// Core Tables
Users: id, email, name, avatarUrl, monthlyGoal, yearlyGoal
Books: id, userId, title, author, isbn, status, rating, notes
MentalMaps: id, bookId, userId, reason1-3, learning1-3, change1-3
```

## Development Environment

### Package Manager & Runtime
- **Bun**: JavaScript runtime & package manager
  - 高速なパッケージインストール
  - TypeScript built-in support
  - Node.js互換性

### Code Quality & Formatting
- **Biome**: `2.2.0` - Linter & Formatter
  - ESLint + Prettier代替
  - 高速なlinting
  - Import sorting
  - TypeScript support

### Environment Management
- **@t3-oss/env-nextjs**: `^0.13.8` - Type-safe environment variables
- **dotenv**: `^17.2.1` - Environment file loading
- **server-only**: `^0.0.1` - Server-side code protection

## Testing

### Unit Testing
- **Vitest**: `^3.2.4` - Fast unit test runner
  - ES modules support
  - TypeScript built-in
  - Jest compatibility
- **@vitest/coverage-v8**: `^3.2.4` - Coverage reporting
- **jsdom**: `^26.1.0` - DOM simulation

### Component Testing
- **@testing-library/react**: `^16.3.0` - React component testing
- **@testing-library/jest-dom**: `^6.7.0` - Custom matchers

### E2E Testing
- **Playwright**: `^1.54.2` - End-to-end testing
  - Cross-browser testing
  - UI testing
  - API testing

## Common Commands

### Development
```bash
# 開発サーバー起動（Turbopack）
bun dev

# 本番ビルド
bun build

# クリーンビルド
bun build:clean

# 本番サーバー起動
bun start
```

### Code Quality
```bash
# TypeScript型チェック
bun tsc

# Biome linting（自動修正）
bun lint

# Biome formatting（自動修正）
bun format

# Biome check（lint + format）
bun check
```

### Testing
```bash
# ユニットテスト実行
bun test:unit

# E2Eテスト実行
bun test:e2e

# テストDB準備
bun test:e2e:setup
```

### Database
```bash
# Drizzle migration実行
bun drizzle-kit migrate

# Drizzle studio起動
bun drizzle-kit studio
```

## Environment Variables

### Development (.env)
```bash
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
DATABASE_URL=<turso-database-url>
DATABASE_AUTH_TOKEN=<turso-auth-token>
BETTER_AUTH_SECRET=<32-character-secret>
```

### Test (.env.test)
```bash
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
DATABASE_URL=file:./test.db
BETTER_AUTH_SECRET=<32-character-secret>
```

## Port Configuration

### Development Ports
- **Next.js Dev Server**: `3000` (default)
- **Drizzle Studio**: `4983` (default)
- **Test Database**: SQLite file-based

### API Routes
- **Main API**: `/api/[[...route]]/*` (Hono RPC)
- **Auth**: `/api/[[...route]]/auth/[...auth]/*` (Better Auth)
- **OpenAPI Docs**: `/api/[[...route]]/reference` (Scalar)

## Performance Considerations

### Frontend Optimization
- **React Server Components**: サーバーサイドレンダリング
- **Turbopack**: 高速バンドラー
- **Code Splitting**: Dynamic imports
- **Image Optimization**: Next.js built-in

### Backend Optimization
- **Edge Runtime**: Hono edge-first design
- **Connection Pooling**: Drizzle ORM built-in
- **Query Optimization**: 型安全なクエリ構築

### Database Optimization
- **Edge Locations**: Turso global distribution
- **SQLite Performance**: インメモリキャッシュ
- **Schema Indexing**: 適切なインデックス設計

## Security Features

### Authentication Security
- **Better Auth**: セキュアなセッション管理
- **Password Hashing**: Argon2による暗号化
- **CSRF Protection**: Built-in protection

### Application Security
- **Input Validation**: Zod schema validation
- **XSS Protection**: React automatic escaping
- **SQL Injection**: Drizzle ORM parameterized queries
- **HTTPS Only**: 本番環境での強制

---

*この技術スタックは、型安全性、パフォーマンス、開発効率を最大化するために設計されています。*