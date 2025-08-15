# Test Coverage Configuration

## Coverage Requirements

### Overall Coverage Targets
- **Line Coverage**: ≥85% (全体)
- **Branch Coverage**: ≥85% (条件分岐)
- **Function Coverage**: ≥90% (関数)
- **Statement Coverage**: ≥85% (文)

### Component-Specific Targets

#### Unit Tests (Vitest)
```typescript
// vitest.config.ts - Coverage configuration
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/dist/**',
        '**/.next/**'
      ],
      include: [
        'src/**/*.{js,ts,jsx,tsx}',
        'features/**/*.{js,ts,jsx,tsx}',
        'lib/**/*.{js,ts,jsx,tsx}'
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 90,
          lines: 85,
          statements: 85
        },
        // 認証機能の厳格な基準
        'features/auth/**': {
          branches: 90,
          functions: 95,
          lines: 90,
          statements: 90
        },
        // Server Actionsの厳格な基準
        '**/actions.ts': {
          branches: 95,
          functions: 100,
          lines: 95,
          statements: 95
        },
        // スキーマ検証の厳格な基準
        '**/schemas/*.ts': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      }
    }
  }
})
```

#### Component Tests Coverage
```typescript
// Component-specific coverage requirements
const componentCoverageRequirements = {
  'RegisterForm': {
    userInteractions: 100,    // 全ユーザー操作パターン
    errorStates: 100,         // 全エラー状態
    loadingStates: 100,       // 全ローディング状態
    formValidation: 100       // 全バリデーションルール
  },
  'LoginForm': {
    userInteractions: 100,
    errorStates: 100,
    loadingStates: 100,
    authenticationFlows: 100  // 全認証フロー
  },
  'ProfileForm': {
    userInteractions: 100,
    dataManagement: 100,      // データ管理機能
    validationRules: 100      // バリデーションルール
  }
}
```

#### Hook Tests Coverage
```typescript
// Hook-specific coverage requirements
const hookCoverageRequirements = {
  'useSignIn': {
    stateTransitions: 100,    // 全状態遷移
    errorHandling: 100,       // 全エラーハンドリング
    asyncOperations: 100,     // 全非同期操作
    callbackExecution: 100    // 全コールバック実行
  },
  'useSignUp': {
    stateTransitions: 100,
    errorHandling: 100,
    asyncOperations: 100,
    callbackExecution: 100
  }
}
```

### API Integration Coverage
```typescript
// API integration coverage requirements
const apiCoverageRequirements = {
  'serverActions': {
    successPaths: 100,        // 全成功パス
    errorPaths: 100,          // 全エラーパス
    validationErrors: 100,    // 全バリデーションエラー
    authErrors: 100,          // 全認証エラー
    databaseOperations: 100   // 全データベース操作
  },
  'betterAuthIntegration': {
    apiCalls: 100,           // 全API呼び出し
    responseHandling: 100,    // 全レスポンス処理
    errorResponses: 100       // 全エラーレスポンス
  }
}
```

### E2E Coverage Requirements
```typescript
// E2E test coverage requirements
const e2eCoverageRequirements = {
  'userJourneys': {
    registrationFlow: 100,    // 登録フロー完全カバレッジ
    loginFlow: 100,          // ログインフロー完全カバレッジ
    logoutFlow: 100,         // ログアウトフロー完全カバレッジ
    sessionManagement: 100,   // セッション管理完全カバレッジ
    errorRecovery: 90        // エラー回復シナリオ
  },
  'browserCompatibility': {
    chrome: 100,             // Chrome完全サポート
    firefox: 100,            // Firefox完全サポート
    safari: 90,              // Safari基本サポート
    edge: 90                 // Edge基本サポート
  },
  'deviceTypes': {
    desktop: 100,            // デスクトップ完全サポート
    tablet: 90,              // タブレット基本サポート
    mobile: 100              // モバイル完全サポート
  }
}
```

## Coverage Exclusions

### Files Excluded from Coverage
```typescript
// coverage.exclude.ts
export const coverageExclusions = [
  // Configuration files
  '**/*.config.{js,ts,mjs}',
  '**/next.config.js',
  '**/tailwind.config.js',
  '**/biome.json',
  
  // Type definitions
  '**/*.d.ts',
  '**/types/**',
  
  // Test files
  '**/*.test.{js,ts,jsx,tsx}',
  '**/*.spec.{js,ts,jsx,tsx}',
  '**/tests/**',
  '**/test-utils/**',
  '**/mocks/**',
  
  // Build output
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  
  // Dependencies
  '**/node_modules/**',
  
  // Generated files
  '**/drizzle/**',
  '**/migrations/**',
  
  // Development utilities
  '**/dev-tools/**',
  '**/storybook/**'
]
```

### Logical Exclusions
```typescript
// Functions/branches excluded from coverage requirements
export const logicalExclusions = {
  // Error handling for "should never happen" scenarios
  impossibleStates: [
    'default case in exhaustive switch statements',
    'unreachable code after throws',
    'development-only assertions'
  ],
  
  // External service failures
  externalServiceFailures: [
    'Better Auth service unavailable',
    'Database connection failures',
    'Network timeouts'
  ],
  
  // Browser-specific code
  browserSpecific: [
    'IE11 compatibility code',
    'Safari-specific workarounds',
    'Feature detection fallbacks'
  ]
}
```

## Coverage Reporting

### Report Formats
```typescript
// Coverage report configuration
export const reportFormats = {
  // Development
  text: {
    purpose: 'Console output during development',
    target: 'developers',
    frequency: 'every test run'
  },
  
  // CI/CD Pipeline
  lcov: {
    purpose: 'SonarQube and GitHub integration',
    target: 'automated tools',
    frequency: 'every commit'
  },
  
  // Team Review
  html: {
    purpose: 'Detailed team review',
    target: 'team members',
    frequency: 'weekly reports',
    path: './coverage/html/index.html'
  },
  
  // JSON for automation
  json: {
    purpose: 'Automated analysis and trending',
    target: 'scripts and automation',
    frequency: 'every test run',
    path: './coverage/coverage-final.json'
  }
}
```

### Coverage Thresholds by Test Type

#### Unit Test Thresholds
```typescript
export const unitTestThresholds = {
  // Auth schemas (100% required)
  'schemas/auth': {
    lines: 100,
    functions: 100,
    branches: 100,
    statements: 100
  },
  
  // Server Actions (95% required)
  'actions/auth': {
    lines: 95,
    functions: 100,
    branches: 95,
    statements: 95
  },
  
  // Utility functions (90% required)
  'utils/auth': {
    lines: 90,
    functions: 95,
    branches: 90,
    statements: 90
  },
  
  // Error handlers (100% required)
  'errors/auth': {
    lines: 100,
    functions: 100,
    branches: 100,
    statements: 100
  }
}
```

#### Integration Test Thresholds
```typescript
export const integrationTestThresholds = {
  // API integration (100% required)
  'api-integration': {
    endpointCoverage: 100,      // 全エンドポイント
    errorScenarios: 100,        // 全エラーシナリオ
    authenticationFlows: 100,   // 全認証フロー
    dataValidation: 100         // 全データ検証
  },
  
  // Database integration (95% required)
  'database-integration': {
    queryOperations: 95,        // データベースクエリ
    transactionHandling: 100,   // トランザクション処理
    constraintValidation: 100   // 制約検証
  }
}
```

### Coverage Monitoring

#### Trend Tracking
```typescript
// Coverage trend configuration
export const coverageTrending = {
  // Historical tracking
  storage: {
    format: 'json',
    retention: '6 months',
    path: './coverage/history/'
  },
  
  // Alert thresholds
  alerts: {
    coverageDecrease: 2,        // 2%以上の低下でアラート
    uncoveredNewCode: 80,       // 新規コードの80%未満でアラート
    criticalPathUncovered: 0    // クリティカルパスの未カバーでアラート
  },
  
  // Reporting intervals
  reports: {
    daily: 'summary',
    weekly: 'detailed',
    monthly: 'comprehensive'
  }
}
```

#### Quality Gates
```typescript
// Quality gate configuration for CI/CD
export const qualityGates = {
  // Pre-commit hooks
  preCommit: {
    minimumCoverage: 80,        // 80%以上でコミット許可
    newCodeCoverage: 85,        // 新規コードは85%以上
    criticalPathCoverage: 100   // クリティカルパスは100%
  },
  
  // Pull request gates
  pullRequest: {
    overallCoverage: 85,        // 全体カバレッジ85%以上
    diffCoverage: 90,           // 差分カバレッジ90%以上
    regressionTolerance: 1      // 1%以下の回帰まで許容
  },
  
  // Release gates
  release: {
    overallCoverage: 90,        // 全体カバレッジ90%以上
    authFeatureCoverage: 95,    // 認証機能95%以上
    zeroUncoveredCritical: true // クリティカルパス100%
  }
}
```

## Coverage Analysis Tools

### Custom Coverage Analysis
```typescript
// tools/coverage-analysis.ts
export class CoverageAnalyzer {
  
  // 未カバレッジの高リスクエリアを特定
  identifyHighRiskUncovered(coverageData: CoverageData): RiskArea[] {
    return coverageData.files
      .filter(file => file.isAuthenticationRelated)
      .filter(file => file.coverage.lines < 90)
      .map(file => ({
        file: file.path,
        risk: this.calculateRisk(file),
        uncoveredLines: file.uncoveredLines,
        criticalPaths: file.criticalPaths.filter(path => !path.covered)
      }))
  }
  
  // カバレッジトレンド分析
  analyzeTrends(historicalData: HistoricalCoverage[]): TrendAnalysis {
    return {
      overallTrend: this.calculateTrend(historicalData, 'overall'),
      authFeatureTrend: this.calculateTrend(historicalData, 'auth'),
      regressionRisk: this.assessRegressionRisk(historicalData),
      recommendations: this.generateRecommendations(historicalData)
    }
  }
  
  // テストギャップ分析
  analyzeTestGaps(requirements: Requirements[], tests: TestSuite[]): TestGap[] {
    return requirements
      .filter(req => !this.isFullyCovered(req, tests))
      .map(req => ({
        requirement: req.id,
        missingTests: this.identifyMissingTests(req, tests),
        priority: req.priority,
        effort: this.estimateEffort(req)
      }))
  }
}
```

### Coverage Reporting Dashboard
```typescript
// Coverage dashboard configuration
export const dashboardConfig = {
  // Real-time metrics
  realTimeMetrics: [
    'overall-coverage-percentage',
    'auth-feature-coverage',
    'critical-path-coverage',
    'new-code-coverage'
  ],
  
  // Historical charts
  historicalCharts: [
    'coverage-trend-6months',
    'test-execution-time-trend',
    'failure-rate-trend'
  ],
  
  // Alert indicators
  alertIndicators: [
    'coverage-regression-alert',
    'failing-tests-alert',
    'uncovered-critical-path-alert'
  ],
  
  // Export options
  exportOptions: [
    'pdf-report',
    'csv-data',
    'json-api'
  ]
}
```

## Implementation Guidelines

### Coverage Collection Strategy
1. **Run-time collection**: V8 coverage provider for accurate metrics
2. **Source mapping**: TypeScript source maps for accurate line mapping
3. **Incremental collection**: Only collect coverage for changed files in CI
4. **Multi-environment**: Separate coverage for different test environments

### Coverage Enforcement
1. **Pre-commit hooks**: Prevent commits below threshold
2. **CI/CD gates**: Block deployments with insufficient coverage
3. **PR reviews**: Automated coverage reports in pull requests
4. **Release criteria**: Coverage requirements for production releases

### Coverage Optimization
1. **Test prioritization**: Focus on high-impact, low-coverage areas
2. **Redundancy elimination**: Remove duplicate test scenarios
3. **Efficiency improvement**: Optimize test execution time vs coverage gain
4. **Strategic testing**: Target business-critical paths with higher coverage