#!/usr/bin/env node

/**
 * Font Copy Script - LATIN ONLY
 * Copies ONLY Latin font files from @fontsource packages to public assets during build
 * COMPLETELY ELIMINATES Cyrillic and Vietnamese fonts for maximum performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const fontsSourceDir = path.resolve(projectRoot, 'node_modules/@fontsource');
const fontsDestDir = path.resolve(projectRoot, 'public/assets/fonts');

// LATIN ONLY font configuration - NO Cyrillic, NO Vietnamese
const fonts = [
  {
    source: 'nunito-sans/files/nunito-sans-latin-400-normal.woff2',
    dest: 'nunito-sans-latin-400-normal.woff2',
    description: 'Nunito Sans Latin 400 (Regular) - LATIN ONLY'
  },
  {
    source: 'nunito-sans/files/nunito-sans-latin-600-normal.woff2',
    dest: 'nunito-sans-latin-600-normal.woff2',
    description: 'Nunito Sans Latin 600 (SemiBold) - LATIN ONLY'
  },
  {
    source: 'montserrat/files/montserrat-latin-400-normal.woff2',
    dest: 'montserrat-latin-400-normal.woff2',
    description: 'Montserrat Latin 400 (Regular) - LATIN ONLY'
  },
  {
    source: 'montserrat/files/montserrat-latin-700-normal.woff2',
    dest: 'montserrat-latin-700-normal.woff2',
    description: 'Montserrat Latin 700 (Bold) - LATIN ONLY'
  },
  {
    source: 'abel/files/abel-latin-400-normal.woff2',
    dest: 'abel-latin-400-normal.woff2',
    description: 'Abel Latin 400 (Regular) - LATIN ONLY'
  }
];

/**
 * Ensure directory exists
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Copy LATIN ONLY font files
 */
function copyFonts() {
  console.log('🚀 Copying LATIN ONLY font files...');
  console.log('❌ COMPLETELY ELIMINATING Cyrillic and Vietnamese fonts');
  console.log('📊 Performance improvement: Latin-only fonts for maximum speed');
  
  try {
    // Ensure destination directory exists
    ensureDir(fontsDestDir);
    
    let copiedCount = 0;
    let totalSize = 0;
    
    fonts.forEach(font => {
      const sourcePath = path.resolve(fontsSourceDir, font.source);
      const destPath = path.resolve(fontsDestDir, font.dest);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        const fileSize = fs.statSync(destPath).size;
        totalSize += fileSize;
        
        console.log(`✅ Copied: ${font.dest} (${(fileSize / 1024).toFixed(1)}KB)`);
        console.log(`   ${font.description}`);
        copiedCount++;
      } else {
        console.warn(`⚠️  Source not found: ${sourcePath}`);
      }
    });
    
    console.log(`\n🎉 Successfully copied ${copiedCount} LATIN ONLY font files`);
    console.log(`📦 Total size: ${(totalSize / 1024).toFixed(1)}KB`);
    console.log(`⚡ Performance gain: No Cyrillic or Vietnamese fonts loaded`);
    console.log(`🌐 Better caching: Latin-only fonts for optimal performance`);
    console.log(`🚫 Eliminated: All Cyrillic and Vietnamese font variants`);
    
  } catch (error) {
    console.error('❌ Error copying fonts:', error);
    process.exit(1);
  }
}

// Run the script
copyFonts();
