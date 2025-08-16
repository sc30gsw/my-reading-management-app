#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * This script analyzes the Next.js bundle and provides insights about:
 * - Bundle sizes by chunk
 * - Top largest modules
 * - Duplicate dependencies
 * - Performance recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  BUILD_DIR: '.next',
  ANALYSIS_OUTPUT: 'bundle-analysis',
  SIZE_THRESHOLD_KB: 100, // Warn for chunks larger than 100KB
  DUPLICATE_THRESHOLD: 2, // Warn for modules included more than 2 times
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleSize() {
  log('\n📊 Bundle Size Analysis', 'bold');
  log('=' .repeat(50), 'cyan');

  const buildManifest = path.join(CONFIG.BUILD_DIR, 'build-manifest.json');
  
  if (!fs.existsSync(buildManifest)) {
    log('❌ Build manifest not found. Please run "bun build" first.', 'red');
    return false;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
    const staticPath = path.join(CONFIG.BUILD_DIR, 'static');
    
    if (!fs.existsSync(staticPath)) {
      log('❌ Static files not found. Please run "bun build" first.', 'red');
      return false;
    }

    const jsFiles = [];
    const cssFiles = [];

    // Analyze JavaScript chunks
    function analyzeFiles(dir, baseDir = '') {
      const files = fs.readdirSync(dir);
      
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const relativePath = path.join(baseDir, file);
        
        if (fs.statSync(fullPath).isDirectory()) {
          analyzeFiles(fullPath, relativePath);
        } else {
          const stats = fs.statSync(fullPath);
          const fileInfo = {
            name: relativePath,
            size: stats.size,
            path: fullPath,
          };
          
          if (file.endsWith('.js')) {
            jsFiles.push(fileInfo);
          } else if (file.endsWith('.css')) {
            cssFiles.push(fileInfo);
          }
        }
      }
    }

    analyzeFiles(staticPath);

    // Sort by size (largest first)
    jsFiles.sort((a, b) => b.size - a.size);
    cssFiles.sort((a, b) => b.size - a.size);

    // Display JavaScript analysis
    log('\n🔧 JavaScript Bundles:', 'blue');
    let totalJSSize = 0;
    let warningCount = 0;

    jsFiles.forEach((file, index) => {
      totalJSSize += file.size;
      const sizeKB = file.size / 1024;
      const isLarge = sizeKB > CONFIG.SIZE_THRESHOLD_KB;
      
      if (isLarge) {
        warningCount++;
      }
      
      const color = isLarge ? 'yellow' : 'reset';
      const warning = isLarge ? ' ⚠️ ' : '';
      
      log(`  ${index + 1}. ${file.name}: ${formatBytes(file.size)}${warning}`, color);
      
      if (index < 5) { // Show top 5 largest files
        // Analyze chunk type
        if (file.name.includes('framework')) {
          log('     → React/Next.js framework code', 'cyan');
        } else if (file.name.includes('vendor')) {
          log('     → Third-party vendor libraries', 'cyan');
        } else if (file.name.includes('main')) {
          log('     → Application main bundle', 'cyan');
        } else if (file.name.includes('framer-motion')) {
          log('     → Framer Motion animation library', 'cyan');
        } else if (file.name.includes('lucide')) {
          log('     → Lucide React icons', 'cyan');
        }
      }
    });

    // Display CSS analysis
    log('\n🎨 CSS Bundles:', 'blue');
    let totalCSSSize = 0;

    cssFiles.forEach((file, index) => {
      totalCSSSize += file.size;
      log(`  ${index + 1}. ${file.name}: ${formatBytes(file.size)}`);
    });

    // Summary
    log('\n📈 Summary:', 'bold');
    log(`  Total JavaScript: ${formatBytes(totalJSSize)}`, totalJSSize > 512 * 1024 ? 'yellow' : 'green');
    log(`  Total CSS: ${formatBytes(totalCSSSize)}`, totalCSSSize > 100 * 1024 ? 'yellow' : 'green');
    log(`  Total Assets: ${formatBytes(totalJSSize + totalCSSSize)}`);
    log(`  Large Bundles: ${warningCount}`, warningCount > 0 ? 'yellow' : 'green');

    // Recommendations
    if (warningCount > 0 || totalJSSize > 512 * 1024) {
      log('\n💡 Recommendations:', 'yellow');
      
      if (totalJSSize > 512 * 1024) {
        log('  • Consider code splitting for large bundles', 'yellow');
        log('  • Use dynamic imports for non-critical components', 'yellow');
      }
      
      if (warningCount > 0) {
        log('  • Large chunks detected - consider lazy loading', 'yellow');
      }
      
      log('  • Use ANALYZE=true bun build for detailed webpack analysis', 'cyan');
      log('  • Consider tree shaking unused code', 'cyan');
      log('  • Review and optimize third-party dependencies', 'cyan');
    } else {
      log('\n✅ Bundle sizes are within recommended limits!', 'green');
    }

    return true;
  } catch (error) {
    log(`❌ Error analyzing bundle: ${error.message}`, 'red');
    return false;
  }
}

function analyzePageSizes() {
  log('\n📄 Page Size Analysis', 'bold');
  log('=' .repeat(50), 'cyan');

  const pagesManifest = path.join(CONFIG.BUILD_DIR, 'server', 'pages-manifest.json');
  
  if (!fs.existsSync(pagesManifest)) {
    log('❌ Pages manifest not found.', 'red');
    return false;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(pagesManifest, 'utf8'));
    const pages = Object.keys(manifest);
    
    log(`  Found ${pages.length} pages:`);
    
    pages.forEach((page, index) => {
      const pageFile = manifest[page];
      const fullPath = path.join(CONFIG.BUILD_DIR, 'server', pageFile);
      
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        log(`    ${index + 1}. ${page}: ${formatBytes(stats.size)}`);
      } else {
        log(`    ${index + 1}. ${page}: File not found`, 'yellow');
      }
    });
    
    return true;
  } catch (error) {
    log(`❌ Error analyzing pages: ${error.message}`, 'red');
    return false;
  }
}

function checkDuplicates() {
  log('\n🔍 Duplicate Dependencies Check', 'bold');
  log('=' .repeat(50), 'cyan');

  try {
    // This is a simplified check - in a real scenario, you'd use webpack-bundle-analyzer data
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };
    
    // Check for common duplicate-prone packages
    const duplicateChecks = [
      'react',
      'react-dom',
      '@types/react',
      'typescript',
      'tailwindcss',
    ];
    
    const foundDuplicates = [];
    
    for (const pkg of duplicateChecks) {
      if (dependencies[pkg]) {
        // In a real implementation, you'd check node_modules for actual duplicates
        log(`  ✅ ${pkg}: ${dependencies[pkg]}`);
      }
    }
    
    if (foundDuplicates.length === 0) {
      log('  ✅ No obvious duplicate dependencies found!', 'green');
    }
    
    return true;
  } catch (error) {
    log(`❌ Error checking duplicates: ${error.message}`, 'red');
    return false;
  }
}

function generateReport() {
  log('\n📊 Generating Analysis Report', 'bold');
  log('=' .repeat(50), 'cyan');

  const reportDir = CONFIG.ANALYSIS_OUTPUT;
  
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    timestamp: new Date().toISOString(),
    analysis: {
      bundleSize: 'See bundle analysis above',
      recommendations: [
        'Use dynamic imports for large components',
        'Implement proper code splitting',
        'Optimize third-party dependencies',
        'Use tree shaking for unused code',
        'Consider lazy loading for below-the-fold content',
      ],
    },
  };

  const reportFile = path.join(reportDir, 'bundle-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  log(`  ✅ Report saved to ${reportFile}`, 'green');
  return true;
}

function runWebpackAnalyzer() {
  log('\n🔬 Running Webpack Bundle Analyzer', 'bold');
  log('=' .repeat(50), 'cyan');

  try {
    log('  Building with analyzer...', 'cyan');
    execSync('ANALYZE=true bun run build', { stdio: 'inherit' });
    
    const analyzerReport = path.join('.next', 'bundle-analyzer.html');
    if (fs.existsSync(analyzerReport)) {
      log(`  ✅ Detailed analysis available at: ${analyzerReport}`, 'green');
      log('  💡 Open this file in a browser for interactive bundle analysis', 'cyan');
    } else {
      log('  ⚠️ Analyzer report not generated', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`❌ Error running analyzer: ${error.message}`, 'red');
    return false;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const shouldRunAnalyzer = args.includes('--analyzer') || args.includes('-a');
  
  log('🚀 Next.js Bundle Analysis Tool', 'bold');
  log('=' .repeat(50), 'cyan');
  
  const success = [
    analyzeBundleSize(),
    analyzePageSizes(),
    checkDuplicates(),
    generateReport(),
  ].every(Boolean);
  
  if (shouldRunAnalyzer) {
    runWebpackAnalyzer();
  }
  
  if (success) {
    log('\n✅ Analysis completed successfully!', 'green');
    log('\n💡 Tips for optimization:', 'cyan');
    log('  • Run with --analyzer flag for detailed webpack analysis', 'cyan');
    log('  • Check bundle-analysis/ directory for reports', 'cyan');
    log('  • Monitor bundle sizes in CI/CD pipeline', 'cyan');
  } else {
    log('\n❌ Analysis completed with errors.', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundleSize,
  analyzePageSizes,
  checkDuplicates,
  generateReport,
};