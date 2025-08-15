#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes images for the Next.js application:
 * - Converts images to modern formats (WebP, AVIF)
 * - Generates responsive image sizes
 * - Compresses images for optimal performance
 * - Creates optimized placeholder images
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  INPUT_DIR: 'public/images',
  OUTPUT_DIR: 'public/optimized',
  SIZES: [375, 640, 768, 1024, 1280, 1536],
  FORMATS: ['webp', 'avif', 'jpg'],
  QUALITY: {
    webp: 80,
    avif: 75,
    jpg: 85,
  },
  PLACEHOLDER_SIZE: 20, // Size for blur placeholder
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

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function checkSharpAvailable() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    log('❌ Sharp not found. Installing...', 'yellow');
    try {
      execSync('bun add sharp', { stdio: 'inherit' });
      return true;
    } catch (installError) {
      log('❌ Failed to install Sharp. Please install manually: bun add sharp', 'red');
      return false;
    }
  }
}

async function optimizeImage(inputPath, outputDir, filename) {
  if (!checkSharpAvailable()) {
    return false;
  }

  const sharp = require('sharp');
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    log(`  Processing ${filename} (${metadata.width}x${metadata.height})...`, 'cyan');
    
    const results = {
      original: fs.statSync(inputPath).size,
      optimized: {},
    };
    
    // Generate responsive sizes for each format
    for (const format of CONFIG.FORMATS) {
      const formatDir = path.join(outputDir, format);
      ensureDirectoryExists(formatDir);
      
      for (const size of CONFIG.SIZES) {
        // Skip if image is smaller than target size
        if (metadata.width && metadata.width < size) continue;
        
        const outputPath = path.join(
          formatDir,
          `${path.parse(filename).name}-${size}w.${format}`
        );
        
        const quality = CONFIG.QUALITY[format] || 80;
        
        await image
          .resize(size, null, {
            withoutEnlargement: true,
            fit: 'inside',
          })
          .toFormat(format, { quality })
          .toFile(outputPath);
        
        const outputSize = fs.statSync(outputPath).size;
        results.optimized[`${format}-${size}w`] = outputSize;
      }
    }
    
    // Generate blur placeholder
    const placeholderDir = path.join(outputDir, 'placeholders');
    ensureDirectoryExists(placeholderDir);
    
    const placeholderPath = path.join(
      placeholderDir,
      `${path.parse(filename).name}-placeholder.jpg`
    );
    
    const placeholderBuffer = await image
      .resize(CONFIG.PLACEHOLDER_SIZE, CONFIG.PLACEHOLDER_SIZE, {
        fit: 'inside',
      })
      .blur(1)
      .jpeg({ quality: 20 })
      .toBuffer();
    
    fs.writeFileSync(placeholderPath, placeholderBuffer);
    
    // Generate base64 data URL for inline placeholders
    const placeholderBase64 = `data:image/jpeg;base64,${placeholderBuffer.toString('base64')}`;
    
    results.placeholder = {
      size: placeholderBuffer.length,
      dataUrl: placeholderBase64,
    };
    
    return results;
  } catch (error) {
    log(`❌ Error processing ${filename}: ${error.message}`, 'red');
    return false;
  }
}

async function processImages() {
  log('🖼️  Image Optimization Tool', 'bold');
  log('=' .repeat(50), 'cyan');
  
  ensureDirectoryExists(CONFIG.INPUT_DIR);
  ensureDirectoryExists(CONFIG.OUTPUT_DIR);
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'];
  const imageFiles = fs.readdirSync(CONFIG.INPUT_DIR)
    .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));
  
  if (imageFiles.length === 0) {
    log('No images found in the input directory.', 'yellow');
    log(`Please add images to ${CONFIG.INPUT_DIR}`, 'cyan');
    return;
  }
  
  log(`Found ${imageFiles.length} images to process:`, 'blue');
  
  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const filename of imageFiles) {
    const inputPath = path.join(CONFIG.INPUT_DIR, filename);
    const result = await optimizeImage(inputPath, CONFIG.OUTPUT_DIR, filename);
    
    if (result) {
      results.push({ filename, ...result });
      totalOriginalSize += result.original;
      
      // Calculate total optimized size (using WebP as primary)
      const webpSizes = Object.entries(result.optimized)
        .filter(([key]) => key.startsWith('webp-'))
        .map(([, size]) => size);
      
      if (webpSizes.length > 0) {
        totalOptimizedSize += Math.min(...webpSizes);
      }
    }
  }
  
  // Generate optimization report
  log('\n📊 Optimization Results:', 'bold');
  log('=' .repeat(50), 'cyan');
  
  results.forEach(result => {
    const webpSizes = Object.entries(result.optimized)
      .filter(([key]) => key.startsWith('webp-'));
    
    const bestWebp = webpSizes.reduce((best, [key, size]) => 
      size < best.size ? { key, size } : best, 
      { key: '', size: Infinity }
    );
    
    const savings = result.original - bestWebp.size;
    const savingsPercent = ((savings / result.original) * 100).toFixed(1);
    
    log(`  ${result.filename}:`);
    log(`    Original: ${formatBytes(result.original)}`);
    log(`    Best WebP: ${formatBytes(bestWebp.size)} (${savingsPercent}% smaller)`, 'green');
    log(`    Placeholder: ${formatBytes(result.placeholder.size)}`);
  });
  
  const totalSavings = totalOriginalSize - totalOptimizedSize;
  const totalSavingsPercent = ((totalSavings / totalOriginalSize) * 100).toFixed(1);
  
  log('\n📈 Total Savings:', 'bold');
  log(`  Original total: ${formatBytes(totalOriginalSize)}`);
  log(`  Optimized total: ${formatBytes(totalOptimizedSize)}`, 'green');
  log(`  Total saved: ${formatBytes(totalSavings)} (${totalSavingsPercent}%)`, 'green');
  
  // Generate manifest file
  generateImageManifest(results);
  
  log('\n✅ Image optimization completed!', 'green');
  log('\n💡 Usage tips:', 'cyan');
  log('  • Use the generated manifest for Next.js Image component', 'cyan');
  log('  • Placeholders can be used for blur effects while loading', 'cyan');
  log('  • Consider using AVIF format for even better compression', 'cyan');
}

function generateImageManifest(results) {
  const manifest = {
    timestamp: new Date().toISOString(),
    images: {},
  };
  
  results.forEach(result => {
    const name = path.parse(result.filename).name;
    
    manifest.images[name] = {
      original: {
        filename: result.filename,
        size: result.original,
      },
      formats: {},
      placeholder: result.placeholder.dataUrl,
    };
    
    // Organize by format
    CONFIG.FORMATS.forEach(format => {
      const formatSizes = Object.entries(result.optimized)
        .filter(([key]) => key.startsWith(`${format}-`))
        .map(([key, size]) => {
          const width = parseInt(key.split('-')[1].replace('w', ''));
          return { width, size, filename: `${name}-${width}w.${format}` };
        });
      
      if (formatSizes.length > 0) {
        manifest.images[name].formats[format] = formatSizes;
      }
    });
  });
  
  const manifestPath = path.join(CONFIG.OUTPUT_DIR, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  log(`  📄 Manifest saved to ${manifestPath}`, 'green');
  
  // Generate TypeScript types
  generateImageTypes(manifest);
}

function generateImageTypes(manifest) {
  const imageNames = Object.keys(manifest.images);
  
  const typesContent = `// Auto-generated image types
// Generated on ${new Date().toISOString()}

export type OptimizedImage = {
  original: {
    filename: string;
    size: number;
  };
  formats: {
    [format: string]: Array<{
      width: number;
      size: number;
      filename: string;
    }>;
  };
  placeholder: string;
}

export type ImageManifest = {
  timestamp: string;
  images: {
    [key: string]: OptimizedImage;
  };
}

// Available image names
export type ImageName = ${imageNames.map(name => `'${name}'`).join(' | ')};

// Utility function to get image by name
export function getOptimizedImage(name: ImageName): OptimizedImage | undefined {
  const manifest: ImageManifest = require('../public/optimized/image-manifest.json');
  return manifest.images[name];
}

// Utility function to get responsive image sources
export function getResponsiveSources(name: ImageName, format: 'webp' | 'avif' | 'jpg' = 'webp') {
  const image = getOptimizedImage(name);
  if (!image || !image.formats[format]) return [];
  
  return image.formats[format].map(size => ({
    src: \`/optimized/\${format}/\${size.filename}\`,
    width: size.width,
    size: size.size,
  }));
}

// Utility function to generate srcSet for responsive images
export function generateSrcSet(name: ImageName, format: 'webp' | 'avif' | 'jpg' = 'webp'): string {
  const sources = getResponsiveSources(name, format);
  return sources.map(source => \`\${source.src} \${source.width}w\`).join(', ');
}
`;
  
  const typesPath = path.join(CONFIG.OUTPUT_DIR, 'image-types.ts');
  fs.writeFileSync(typesPath, typesContent);
  
  log(`  📝 TypeScript types saved to ${typesPath}`, 'green');
}

// Usage example generator
function generateUsageExample() {
  const exampleContent = `// Example usage of optimized images in Next.js

import Image from 'next/image';
import { getOptimizedImage, generateSrcSet } from './public/optimized/image-types';

// Example 1: Using the Image component with optimized images
export function OptimizedImageExample() {
  const heroImage = getOptimizedImage('hero-image');
  
  if (!heroImage) return null;
  
  return (
    <Image
      src="/optimized/webp/hero-image-1280w.webp"
      alt="Hero image"
      width={1280}
      height={720}
      placeholder="blur"
      blurDataURL={heroImage.placeholder}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// Example 2: Using picture element for format selection
export function ResponsiveImageExample() {
  return (
    <picture>
      <source 
        srcSet={generateSrcSet('hero-image', 'avif')} 
        type="image/avif" 
      />
      <source 
        srcSet={generateSrcSet('hero-image', 'webp')} 
        type="image/webp" 
      />
      <img 
        src="/optimized/jpg/hero-image-1280w.jpg"
        alt="Hero image"
        loading="lazy"
      />
    </picture>
  );
}

// Example 3: Using CSS background images
export function BackgroundImageExample() {
  const heroImage = getOptimizedImage('hero-image');
  
  const backgroundImageStyle = {
    backgroundImage: \`url('/optimized/webp/hero-image-1280w.webp')\`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  return (
    <div 
      style={backgroundImageStyle}
      className="h-96 w-full"
    />
  );
}
`;
  
  const examplePath = path.join(CONFIG.OUTPUT_DIR, 'usage-examples.tsx');
  fs.writeFileSync(examplePath, exampleContent);
  
  log(`  📚 Usage examples saved to ${examplePath}`, 'green');
}

// CLI handling
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    log('🖼️  Image Optimization Tool', 'bold');
    log('\nUsage: node scripts/optimize-images.js [options]', 'cyan');
    log('\nOptions:');
    log('  --help, -h     Show this help message');
    log('  --examples     Generate usage examples');
    log('\nThis tool will:');
    log('  • Convert images to WebP and AVIF formats');
    log('  • Generate responsive image sizes');
    log('  • Create blur placeholders');
    log('  • Generate TypeScript types and manifest');
    return;
  }
  
  processImages().then(() => {
    if (args.includes('--examples')) {
      generateUsageExample();
    }
  }).catch(error => {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

module.exports = {
  optimizeImage,
  processImages,
  generateImageManifest,
};