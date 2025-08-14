---
description: Create or update Kiro steering documents intelligently based on project state
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Glob, Grep, LS, mcp__serena__check_onboarding_performed, mcp__serena__delete_memory, mcp__serena__find_file, mcp__serena__find_referencing_symbols, mcp__serena__find_symbol, mcp__serena__get_symbols_overview, mcp__serena__insert_after_symbol, mcp__serena__insert_before_symbol, mcp__serena__list_dir, mcp__serena__list_memories, mcp__serena__onboarding, mcp__serena__read_memory, mcp__serena__remove_project, mcp__serena__replace_regex, mcp__serena__replace_symbol_body, mcp__serena__restart_language_server, mcp__serena__search_for_pattern, mcp__serena__switch_modes, mcp__serena__think_about_collected_information, mcp__serena__think_about_task_adherence, mcp__serena__think_about_whether_you_are_done, mcp__serena__write_memory
---

# Kiro Steering Management

Intelligently create or update steering documents in `.kiro/steering/` to maintain accurate project knowledge for spec-driven development. This command detects existing documents and handles them appropriately.

## Existing Files Check

### Current steering documents status
- Product overview: Use mcp__serena__find_file to check if .kiro/steering/product.md exists
- Technology stack: Use mcp__serena__find_file to check if .kiro/steering/tech.md exists  
- Project structure: Use mcp__serena__find_file to check if .kiro/steering/structure.md exists
- Custom steering files: Use mcp__serena__list_dir with relative_path .kiro/steering/ to count custom files

## Project Analysis

### Current Project State
- Project files: Use mcp__serena__search_for_pattern to find source files (*.py, *.js, *.ts, *.jsx, *.tsx, *.java, *.go, *.rs)
- Configuration files: Use mcp__serena__find_file to locate config files (package.json, requirements.txt, pom.xml, Cargo.toml, go.mod, pyproject.toml, tsconfig.json)
- Documentation: Use mcp__serena__find_file to find documentation files (README*, CHANGELOG*, LICENSE*, *.md)

### Recent Changes (if updating)
- Last steering update: Use Bash tool to check git log for .kiro/steering/ directory
- Commits since last steering update: Use Bash tool to analyze recent commits
- Working tree status: Use Bash tool to check git status

### Existing Documentation
- Main README: @README.md
- Package configuration: @package.json
- Python requirements: @requirements.txt
- TypeScript config: @tsconfig.json
- Project documentation: @docs/

## Smart Update Strategy

Based on the existing files check above, this command will:

### For NEW files (showing "📝 Not found"):
Generate comprehensive initial content covering all aspects of the project.

### For EXISTING files (showing "✅ EXISTS"):
1. **Preserve user customizations** - Any manual edits or custom sections
2. **Update factual information** - Dependencies, file structures, commands
3. **Add new sections** - Only if significant new capabilities exist
4. **Mark deprecated content** - Rather than deleting
5. **Maintain formatting** - Keep consistent with existing style

## Inclusion Modes for Core Steering Files

The three core steering files (product.md, tech.md, structure.md) are designed to be **Always Included** - loaded in every AI interaction to provide consistent project context.

### Understanding Inclusion Modes
- **Always Included (Default for core files)**: Loaded in every interaction - ensures consistent project knowledge
- **Conditional**: Loaded only when working with matching file patterns (mainly for custom steering)  
- **Manual**: Referenced on-demand with @filename syntax (for specialized contexts)

### Core Files Strategy
- `product.md`: Always - Business context needed for all development decisions
- `tech.md`: Always - Technical constraints affect all code generation
- `structure.md`: Always - Architectural decisions impact all file organization

## Task: Create or Update Steering Documents

### 1. Product Overview (`product.md`)

#### For NEW file:
Generate comprehensive product overview including:
- **Product Overview**: Brief description of what the product is
- **Core Features**: Bulleted list of main capabilities
- **Target Use Case**: Specific scenarios the product addresses
- **Key Value Proposition**: Unique benefits and differentiators

#### For EXISTING file:
Update only if there are:
- **New features** added to the product
- **Removed features** or deprecated functionality
- **Changed use cases** or target audience
- **Updated value propositions** or benefits

### 2. Technology Stack (`tech.md`)

#### For NEW file:
Document the complete technology landscape:
- **Architecture**: High-level system design
- **Frontend**: Frameworks, libraries, build tools (if applicable)
- **Backend**: Language, framework, server technology (if applicable)
- **Development Environment**: Required tools and setup
- **Common Commands**: Frequently used development commands
- **Environment Variables**: Key configuration variables
- **Port Configuration**: Standard ports used by services

#### For EXISTING file:
Check for changes in:
- **New dependencies** added via package managers
- **Removed libraries** or frameworks
- **Version upgrades** of major dependencies
- **New development tools** or build processes
- **Changed environment variables** or configuration
- **Modified port assignments** or service architecture

### 3. Project Structure (`structure.md`)

#### For NEW file:
Outline the codebase organization:
- **Root Directory Organization**: Top-level structure with descriptions
- **Subdirectory Structures**: Detailed breakdown of key directories
- **Code Organization Patterns**: How code is structured
- **File Naming Conventions**: Standards for naming files and directories
- **Import Organization**: How imports/dependencies are organized
- **Key Architectural Principles**: Core design decisions and patterns

#### For EXISTING file:
Look for changes in:
- **New directories** or major reorganization
- **Changed file organization** patterns
- **New or modified naming conventions**
- **Updated architectural patterns** or principles
- **Refactored code structure** or module boundaries

### 4. Custom Steering Files
If custom steering files exist:
- **Preserve them** - Do not modify unless specifically outdated
- **Check relevance** - Note if they reference removed features
- **Suggest new custom files** - If new specialized areas emerge

## Instructions

1. **Create `.kiro/steering/` directory** if it doesn't exist
2. **Check existing files** to determine create vs update mode
3. **Analyze the codebase** using native tools (Glob, Grep, LS)
4. **For NEW files**: Generate comprehensive initial documentation
5. **For EXISTING files**: 
   - Read current content first
   - Preserve user customizations and comments
   - Update only factual/technical information
   - Maintain existing structure and style
6. **Use clear markdown formatting** with proper headers and sections
7. **Include concrete examples** where helpful for understanding
8. **Focus on facts over assumptions** - document what exists
9. **Follow spec-driven development principles**

## Important Principles

### Security Guidelines
- **Never include sensitive data**: No API keys, passwords, database credentials, or personal information
- **Review before commit**: Always review steering content before version control
- **Team sharing consideration**: Remember steering files are shared with all project collaborators

### Content Quality Guidelines  
- **Single domain focus**: Each steering file should cover one specific area
- **Clear, descriptive content**: Provide concrete examples and rationale for decisions
- **Regular maintenance**: Review and update steering files after major project changes
- **Actionable guidance**: Write specific, implementable guidelines rather than abstract principles

### Preservation Strategy
- **User sections**: Any section not in the standard template should be preserved
- **Custom examples**: User-added examples should be maintained
- **Comments**: Inline comments or notes should be kept
- **Formatting preferences**: Respect existing markdown style choices

### Update Philosophy
- **Additive by default**: Add new information rather than replacing
- **Mark deprecation**: Use strikethrough or [DEPRECATED] tags
- **Date significant changes**: Add update timestamps for major changes
- **Explain changes**: Brief notes on why something was updated

The goal is to maintain living documentation that stays current while respecting user customizations, supporting effective spec-driven development without requiring users to worry about losing their work.
ultrathink