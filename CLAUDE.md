# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Metadata
- **Version**: 1.0
- **Created Date**: 2025-08-15
- **Target AI**: Claude Code (claude.ai/code)
- **Project Name**: Reading management App
- **Language**: Japanese
- **Encoding**: UTF-8

## AI Operation Principles (Highest Priority)

1. **Pre-execution Confirmation**: AI must always report its work plan before file generation, updates, or program execution, obtain y/n user confirmation, and halt all execution until receiving 'y'.

2. **No Unauthorized Workarounds**: AI must not perform detours or alternative approaches on its own; if the initial plan fails, it must seek confirmation for the next plan.

3. **User Authority**: AI is a tool and decision-making authority always belongs to the user. Even if user suggestions are inefficient or irrational, AI must not optimize but execute as instructed.

4. **Absolute Rule Compliance**: AI must not distort or reinterpret these rules and must absolutely comply with them as top-priority commands.

5. **Compliance with Guidelines**: AI must not violate prohibitions in Claude.md and must develop according to coding-rules.md.

6. **Mandatory Principle Display**: AI must verbatim output these 6 principles at the beginning of every chat before responding.

## Kiro Spec-Driven Development Framework

### Overview
This project implements Kiro-style Spec-Driven Development for Claude Code using hooks and slash commands.

#### Project Context

**Project Steering**
- `.kiro/steering/product.md` - Product overview
- `.kiro/steering/tech.md` - Technology stack
- `.kiro/steering/structure.md` - Project structure
- Custom steering docs for specialized contexts

**Active Specifications**
- Location: `.kiro/specs/`
- Command: `/kiro:spec-status [feature-name]`
- Description: Check progress of active specifications

### Development Guidelines
- **Principle**: Think in English, but generate responses in English

### Spec-Driven Workflow

#### Phase 0: Steering Generation (Recommended)
**Kiro Steering** (`.kiro/steering/`)
- `/kiro:steering-init` - Generate initial steering documents
- `/kiro:steering-update` - Update steering after changes
- `/kiro:steering-custom` - Create custom steering for specialized contexts

*Note: For new features or empty projects, steering is recommended but not required. You can proceed directly to spec-requirements if needed.*

#### Phase 1: Specification Creation
- `/kiro:spec-init [feature-name]` - Initialize spec structure only
- `/kiro:spec-requirements [feature-name]` - Generate requirements → Review → Edit if needed
- `/kiro:spec-design [feature-name]` - Generate technical design → Review → Edit if needed
- `/kiro:spec-test [feature-name]` - Generate test → Review → Edit if needed
- `/kiro:spec-tasks [feature-name]` - Generate implementation tasks → Review → Edit if needed

#### Phase 2: Progress Tracking
- `/kiro:spec-status [feature-name]` - Check current progress and phases

### Approval Workflow (Highest Priority)
Kiro's spec-driven development follows a strict 3-phase approval workflow:

#### Phase 1: Requirements Generation & Approval
1. **Generate**: `/kiro:spec-requirements [feature-name]` - Generate requirements document
2. **Review**: Human reviews requirements.md and edits if needed
3. **Approve**: Manually update spec.json to set "requirements": true

#### Phase 2: Design Generation & Approval
*Prerequisite: Requirements approval required*
1. **Generate**: `/kiro:spec-design [feature-name]` - Generate technical design
2. **Review**: Human reviews design.md and edits if needed
3. **Approve**: Manually update spec.json to set "design": true

#### Phase 3: Tasks Generation & Approval
*Prerequisite: Design approval required*
1. **Generate**: `/kiro:spec-tasks [feature-name]` - Generate implementation tasks
2. **Review**: Human reviews tasks.md and edits if needed
3. **Approve**: Manually update spec.json to set "tasks": true

#### Implementation Phase
*Prerequisite: Requirements, design, and tests must be approved before task generation and implementation can begin*

**Key Principle**: Each phase requires explicit human approval before proceeding to the next phase, ensuring quality and accuracy throughout the development process.

### Development Rules (High Priority)
1. Consider steering: Run `/kiro:steering-init` before major development (optional for new features)
2. Follow the 4-phase approval workflow: Requirements → Design → Tests → Tasks → Implementation
3. Manual approval required: Each phase must be explicitly approved by human review
4. No skipping phases: Design requires approved requirements; Tests require approved design; Tasks require approved tests
5. TDD Implementation: Follow Red-Green-Refactor cycle using generated test specifications
6. Update task status: Mark tasks as completed when working on them
7. Keep steering current: Run `/kiro:steering-update` after significant changes
8. Check spec compliance: Use `/kiro:spec-status` to verify alignment

### Automation Features
This project uses Claude Code hooks to:
- Automatically track task progress in tasks.md
- Check spec compliance
- Preserve context during compaction
- Detect steering drift

#### Task Progress Tracking
1. **Manual tracking**: Update tasks.md checkboxes manually as you complete tasks
2. **Progress monitoring**: Use `/kiro:spec-status` to view current completion status
3. **TodoWrite integration**: Use TodoWrite tool to track active work items
4. **Status visibility**: Checkbox parsing shows completion percentage

### Testing Flow

#### Phase 3: Test Specification & TDD Implementation
*Prerequisite: Approved requirements and design required*

**Test-Driven Development Integration**
1. **Generate**: `/kiro:spec-test [feature-name]` - Generate comprehensive test specifications
2. **Review**: Human reviews test specifications and edits if needed
3. **Approve**: Manually update spec.json to set "tests": true
4. **TDD Implementation**: Follow Red-Green-Refactor cycle based on generated test specs

#### Test Specification Generation
- **Command**: `/kiro:spec-test [feature-name]` 
- **Purpose**: Generate TDD test specifications based on approved requirements and design
- **Output**: Comprehensive test documentation in `.kiro/specs/[feature-name]/tests/`

#### Test Framework Configuration Options
- `--test-lib=[jest|vitest|mocha]` - Unit test framework (default: vitest)
- `--ui-lib=[testing-library|enzyme]` - UI testing library (default: testing-library)
- `--e2e-lib=[playwright|cypress|puppeteer]` - E2E test framework (default: playwright)
- `--api-lib=[supertest|axios-mock]` - API testing library (default: supertest)
- `--coverage=[number]` - Target coverage percentage (default: 80)

#### TDD Implementation Workflow
**Red Phase**: Write failing tests based on generated specifications
- Unit tests for business logic and utilities
- Component tests for UI behavior
- API tests for endpoint contracts
- E2E tests for user workflows

**Green Phase**: Write minimum code to pass tests
- Implement services to pass unit tests
- Build components to pass UI tests  
- Create API endpoints to pass contract tests

**Refactor Phase**: Improve code while keeping tests green
- Code optimization and cleanup
- Integration between components
- Performance improvements

#### Test Structure Generated
```
.kiro/specs/[feature-name]/tests/
├── test-spec.md           # Main test specification document
├── unit/                  # Unit test specifications
├── component/             # Component test specifications  
├── hook/                  # Custom hook test specifications
├── api/                   # API test specifications
├── e2e/                   # E2E test specifications
├── mocks/                 # Mock specifications
└── coverage.config.md     # Coverage configuration
```

### Getting Started
1. Initialize steering documents: `/kiro:steering-init`
2. Create your first spec: `/kiro:spec-init [your-feature-name]`
3. Follow the workflow through requirements, design, tests, and tasks

### Kiro Steering Details
Kiro-style steering provides persistent project knowledge through markdown files.

#### Core Steering Documents
- **product.md**: Product overview, features, use cases, value proposition
- **tech.md**: Architecture, tech stack, dev environment, commands, ports
- **structure.md**: Directory organization, code patterns, naming conventions

#### Custom Steering
Create specialized steering documents for:
- API standards
- Testing approaches
- Code style guidelines
- Security policies
- Database conventions
- Performance standards
- Deployment workflows

#### Inclusion Modes
- **Always Included**: Loaded in every interaction (default)
- **Conditional**: Loaded for specific file patterns (e.g., `*.test.js`)
- **Manual**: Loaded on-demand with #filename reference

## Commands

- `bun dev` - Start development server with Turbopack
- `bun build` - Build for production 
- `bun build:clean` - Clean build (removes .next directory first)
- `bun start` - Start production server
- `bun lint` - Run Biome linter with auto-fix
- `bun format` - Run Biome formatter and linter with auto-fix
- `bun check` - Run Biome check on src directory with auto-fix
- `bun test:unit` - Run Vitest for unit tests
- `bun test:e2e` - Run Playwright for unit tests

## Development Commands

### Package Manager
This project uses Bun as the package manager. Use `bun i` to install dependencies.

### Development
- `bun dev` - Start development server with Turbopack
- `bun build` - Build for production 
- `bun build:clean` - Clean build (removes .next directory first)
- `bun start` - Start production server
- `bun lint` - Run Biome linter with auto-fix
- `bun format` - Run Biome formatter and linter with auto-fix
- `bun check` - Run Biome check on src directory with auto-fix
- `bun test:unit` - Run Vitest for unit tests
- `bun test:e2e` - Run Playwright for unit tests

### Testing
- Vitest for unit tests (configured but no test scripts in package.json yet)
- Playwright for E2E tests (configured in `/tests` directory)

### shadcn/ui Components
Add new shadcn/ui components using: `bunx --bun shadcn@latest add [component-name]`

## Architecture Overview

This is a modern Next.js 15 application with App Router using a feature-driven architecture based on bulletproof-react patterns.

### Tech Stack
- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS
- **Backend**: Hono framework with Zod OpenAPI for API routes
- **Database**: Drizzle ORM with Turso (LibSQL)
- **Auth**: Better Auth
- **Forms**: Conform with Zod validation
- **Components**: shadcn/ui component library
- **Styling**: Tailwind CSS with class sorting via Biome
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Type Safety**: TypeScript with t3-env for environment variables

## Additional Information Files
- `.claude/requirement.md` - Project requirements document
- `.claude/architecture.md` - Project architecture document
- `.claude/coding-rules.md` - Project coding conventions, directory structure, prohibitions

## AI Assistant Instructions (High Priority)

1. **Test-Driven Development (TDD)**: Perform TDD whenever possible
   - Use `/kiro:spec-test [feature-name]` to generate comprehensive test specifications
   - Follow Red-Green-Refactor cycle: Write failing tests → Implement code → Refactor
   - Test specifications are generated in `.kiro/specs/[feature-name]/tests/`
   - Actual test files are written in `/tests` directory as `*.spec.ts`
   - Follow test specifications and develop through try & error until tests succeed
2. **TypeScript Type Safety**: Prioritize TypeScript type safety
3. **Security Best Practices**: Follow security best practices
4. **Performance Consideration**: Always consider performance
5. **Code Comments**: Write code comments in English
6. **Design Confirmation**: Always confirm design before implementation
7. **Test Specification Integration**: Use Kiro-generated test specs as foundation for TDD implementation

## Prohibited Items (Highest Priority)
- Excessive use of `any` type (use TypeScript Utility types whenever possible)
- Leaving `console.log` in production environment
- Committing untested code
- Direct writing of security keys

## Important Instruction Reminders (Highest Priority)
- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User

## Chat Output Format
```
[AI Operation 6 Principles]
[main_output]
#[n] times. # n = increment for each chat (#1, #2...)
```