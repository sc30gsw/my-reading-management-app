# Reading Management Application

## 概要

本アプリケーションは、メンタルマップ機能を中心とした個人向け読書管理Webアプリケーションです。。読書を単なる消費活動ではなく、意図的な学習・成長の機会として捉え直すためのツールを目指します。モダンなフロントエンド・バックエンド技術を統合し、型安全性とパフォーマンスを両立した設計を採用しています。

### 主要機能
- ✅ メンタルモデルの作成・表示・更新・削除
- ✅ 読書管理
- ✅ レスポンシブUI（shadcn/ui + Tailwind CSS）
- ✅ リアルタイムデータ更新（Server Actions + キャッシュ管理）
- ✅ 型安全なAPI（Hono RPC + Zod）
- ✅ 包括的テストカバレッジ（Vitest + Playwright）

## アーキテクチャ概要

本アプリケーションは、**Next.js 15 + Hono BFF (Backend for Frontend)** によるハイブリッドアーキテクチャを採用しています。

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   BFF (Hono)     │    │   Database      │
│                 │    │                  │    │                 │
│ • React 19 RSC  │◄──►│ • Type-safe RPC  │◄──►│ • Turso(LibSQL) │
│ • Server Actions│    │ • Zod OpenAPI    │    │ • Drizzle ORM   │
│ • Client Comps  │    │ • Route Handlers │    │ • Schema-driven │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### データフロー
1. **Server Components**: サーバーサイドでデータ取得・初期レンダリング
2. **Client Components**: ユーザーインタラクション・フォーム処理
3. **Server Actions**: Mutationによるデータ更新・キャッシュ無効化
4. **RPC Client**: 型安全なAPI呼び出し（HonoクライアントとInferResponseType）

### 設計原則
- **Server-First**: RSCによるサーバーサイド最適化
- **Type Safety**: エンドツーエンド型安全性
- **Performance**: 最小限のJavaScriptバンドル
- **Testability**: 各レイヤーの独立テスト可能性
- **Maintainability**: Feature-driven設計による責務分離

## 環境構築
以下の手順にしたがい、環境構築を行ってください

### 1. envファイルの作成
```bash
# you can pick out any env file's name you like.
touch .env .env.test
```

### 2. envファイルに以下の内容を記述
#### 2.1 開発環境
```ts: .env
NEXT_PUBLIC_APP_BASE_URL = http://localhost:3000

DATABASE_URL = <database-url>
DATABASE_AUTH_TOKEN = <database-auth-token>

BETTER_AUTH_SECRET = <your-better-auth-secret>
```

#### 2.2 テスト環境
```ts: .env.test
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
DATABASE_URL=file:./test.db

BETTER_AUTH_SECRET = <your-better-auth-secret>
```

### 3. 依存関係のインストール
```bash
bun i
```

### 4. 開発サーバーの起動
```bash
bun dev
```