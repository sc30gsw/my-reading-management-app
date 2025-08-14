# Project Structure - 読書管理アプリケーション

*Inclusion Mode: Always Included*  
*Generated: 2025-01-15*

## Root Directory Organization

```
my-reading-management-app/
├── .claude/                    # Claude Code設定・要件定義
│   ├── CLAUDE.md              # プロジェクト指示・開発ルール
│   └── requirement.md         # 要件定義書
├── .kiro/                     # Kiro spec-driven development
│   └── steering/              # ステアリングドキュメント
├── src/                       # アプリケーションソースコード
├── tests/                     # E2Eテスト（Playwright）
├── tests-examples/            # テストサンプル
├── scripts/                   # ビルド・セットアップスクリプト
├── public/                    # 静的ファイル
├── package.json               # 依存関係・スクリプト定義
├── tsconfig.json              # TypeScript設定
├── next.config.ts             # Next.js設定
├── drizzle.config.ts          # Drizzle ORM設定
├── vitest.config.ts           # Vitest設定
├── playwright.config.ts       # Playwright E2E設定
└── biome.jsonc                # Biome linter/formatter設定
```

## Subdirectory Structures

### `/src` - Application Source Code

```
src/
├── app/                       # Next.js App Router
│   ├── api/                   # API Routes
│   │   └── [[...route]]/      # Hono RPC + Auth統合
│   ├── (auth)/                # 認証関連ページ群
│   ├── (dashboard)/           # ダッシュボード・メイン機能
│   ├── layout.tsx             # Root Layout
│   ├── page.tsx               # Home Page
│   └── globals.css            # Global Styles
├── components/                # React Components
│   ├── ui/                    # UI Component Library
│   │   └── shadcn/            # shadcn/ui components
│   ├── features/              # Feature-specific components
│   │   ├── auth/              # 認証関連コンポーネント
│   │   ├── books/             # 本管理コンポーネント
│   │   ├── mental-maps/       # メンタルマップコンポーネント
│   │   └── stats/             # 統計・分析コンポーネント
│   └── providers/             # Context Providers
├── lib/                       # Utility Libraries
│   ├── auth.ts                # Better Auth設定
│   ├── auth-client.ts         # Auth Client
│   ├── rpc.ts                 # Hono RPC Client
│   ├── upfetch.ts             # API Client設定
│   └── utils.ts               # Utility Functions
├── db/                        # Database Layer
│   ├── schema.ts              # Drizzle Schema定義
│   └── index.ts               # Database Connection
├── hooks/                     # Custom React Hooks
├── types/                     # TypeScript Type Definitions
├── utils/                     # Pure Utility Functions
└── env.ts                     # Environment Variables
```

### `/tests` - Testing Infrastructure

```
tests/
├── e2e/                       # End-to-End Tests
│   ├── auth.spec.ts           # 認証フローテスト
│   ├── books.spec.ts          # 本管理機能テスト
│   ├── mental-maps.spec.ts    # メンタルマップ機能テスト
│   └── stats.spec.ts          # 統計機能テスト
├── fixtures/                  # テストデータ
└── utils/                     # テストユーティリティ
```

### `/scripts` - Build & Setup Scripts

```
scripts/
├── setup-test-db.ts           # テストDB初期化
├── migrate.ts                 # マイグレーション実行
└── seed.ts                    # データシード（開発用）
```

## Code Organization Patterns

### Feature-Driven Architecture

**bulletproof-react**準拠のFeature-based組織:

```
src/components/features/[feature-name]/
├── components/               # Feature固有のコンポーネント
│   ├── feature-list.tsx      # リスト表示コンポーネント
│   ├── feature-form.tsx      # フォームコンポーネント
│   └── feature-card.tsx      # カード表示コンポーネント
├── hooks/                   # Feature固有のhooks
│   ├── use-feature-list.ts    # データ取得hook
│   └── use-feature-form.ts    # フォーム管理hook
├── types/                   # Feature固有の型定義
└── utils/                   # Feature固有のユーティリティ
```

### Server/Client Component分離

```typescript
// Server Component (データ取得・初期レンダリング)
// src/app/(dashboard)/books/page.tsx
export default async function BooksPage() {
  const books = await getBooks(); // Server-side data fetching
  return <BooksList books={books} />;
}

// Client Component (インタラクション・状態管理)
// src/components/features/books/BooksList.tsx
'use client';
export function BooksList({ books }: { books: Book[] }) {
  // Client-side interactivity
}
```

### API Route組織

```
src/app/api/[[...route]]/
├── route.ts                   # Main Hono app entry
└── auth/[...auth]/route.ts    # Better Auth integration
```

Hono RPC構造:
```typescript
// Internal API organization
/api/hono/
├── books                      # 本管理API
├── mental-maps               # メンタルマップAPI
├── stats                     # 統計API
└── auth                      # 認証API（Better Auth管理）
```

## File Naming Conventions

### React Components
- **PascalCase**: `BookCard.tsx`, `MentalMapForm.tsx`
- **Feature prefix**: `BooksList.tsx`, `BooksForm.tsx`
- **Suffix convention**:
  - `*Form.tsx`: フォームコンポーネント
  - `*List.tsx`: リスト表示コンポーネント
  - `*Card.tsx`: カード表示コンポーネント
  - `*Dialog.tsx`: モーダルコンポーネント
  - `*Page.tsx`: ページコンポーネント

### Hooks & Utils
- **camelCase**: `useBookList.ts`, `useMentalMap.ts`
- **Prefix convention**:
  - `use*`: Custom React hooks
  - `get*`: データ取得関数
  - `create*`: データ作成関数
  - `with*`: HOC関数

### API & Schema
- **kebab-case**: `mental-maps.ts`, `user-profile.ts`
- **Descriptive naming**: `book-status.ts`, `reading-stats.ts`

### Configuration Files
- **kebab-case**: `next.config.ts`, `drizzle.config.ts`
- **Standard extensions**: `.ts`, `.js`, `.json`, `.jsonc`

## Import Organization

### Path Mapping
```typescript
// tsconfig.json
{
  "paths": {
    "~/*": ["./src/*"]
  }
}
```

### Import Order (Biome規則)
```typescript
// 1. Node modules
import React from 'react';
import { NextRequest } from 'next/server';

// 2. Internal absolute imports
import { Button } from '~/components/ui/shadcn/button';
import { db } from '~/db';

// 3. Relative imports
import './styles.css';
import { localFunction } from './utils';
```

### Import Convention
```typescript
// Named imports（推奨）
import { Button, Dialog } from '~/components/ui/shadcn';

// Default imports（React component等）
import BookCard from '~/components/features/books/BookCard';

// Type imports
import type { Book, MentalMap } from '~/types';
```

## Key Architectural Principles

### 1. Separation of Concerns
- **Presentation Layer**: React Components（UI logic）
- **Business Logic Layer**: Custom hooks & utilities
- **Data Access Layer**: Drizzle ORM & API routes
- **Validation Layer**: Zod schemas

### 2. Type Safety
```typescript
// Database → API → Frontend 型の一貫性
export type Book = typeof books.$inferSelect;
export type NewBook = typeof books.$inferInsert;

// API Response型の自動生成
export type BookListResponse = InferResponseType<typeof bookApi.list>;
```

### 3. Server-Client Boundary
```typescript
// Server Components: データ取得
async function ServerPage() {
  const data = await getServerData();
  return <ClientComponent data={data} />;
}

// Client Components: インタラクション
'use client';
function ClientComponent({ data }: Props) {
  const [state, setState] = useState(data);
  // Interactive logic
}
```

### 4. Progressive Enhancement
```typescript
// Conform: JavaScript無効でも動作
export function BookForm() {
  return (
    <form action={createBookAction}>
      {/* Form works without JavaScript */}
    </form>
  );
}
```

### 5. Feature Isolation
```
features/books/
├── components/     # Books固有のUI
├── hooks/          # Books固有のロジック
├── types/          # Books固有の型
└── utils/          # Books固有のユーティリティ
```

### 6. Testing Strategy
```
src/                           tests/
├── components/                ├── unit/
│   └── BookCard.tsx          │   └── BookCard.test.tsx
└── features/books/           └── e2e/
    └── hooks/                    └── books.spec.ts
        └── useBooks.ts
```

## Configuration Files Detail

### Next.js Configuration
```typescript
// next.config.ts
const config: NextConfig = {
  experimental: {
    reactCompiler: true,    // React Compiler有効
    turbo: {}              // Turbopack設定
  }
};
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,          // 厳密モード
    "target": "ES2017",      // ターゲット環境
    "moduleResolution": "bundler",
    "paths": {
      "~/*": ["./src/*"]     // エイリアス設定
    }
  }
}
```

### Database Configuration
```typescript
// drizzle.config.ts
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "turso"
} satisfies Config;
```

## Development Workflow

### 1. Feature Development
```bash
# 1. Feature branch作成
git checkout -b feature/mental-maps

# 2. Schema更新（必要時）
bun drizzle-kit generate
bun drizzle-kit migrate

# 3. 開発
bun dev

# 4. テスト
bun test:unit
bun test:e2e

# 5. Code quality
bun check
```

### 2. File Creation Pattern
```
1. Schema定義 (src/db/schema.ts)
2. Type定義 (src/types/)
3. API Routes (src/app/api/)
4. Server Components (src/app/)
5. Client Components (src/components/)
6. Tests (tests/)
```

### 3. Quality Gates
- **TypeScript**: `bun tsc` - 型チェック
- **Linting**: `bun lint` - コード品質
- **Formatting**: `bun format` - コード整形
- **Unit Tests**: `bun test:unit` - ロジックテスト
- **E2E Tests**: `bun test:e2e` - 統合テスト

---

*この構造は、メンテナンス性、テスト容易性、開発効率を最大化するために設計されています。*