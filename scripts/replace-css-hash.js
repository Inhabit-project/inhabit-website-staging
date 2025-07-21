const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist/assets');
const htmlPath = path.join(__dirname, '../dist/index.html');

// Encuentra el archivo CSS generado por Vite
const cssFile = fs.readdirSync(distDir).find(f => f.startsWith('index-') && f.endsWith('.css'));
if (!cssFile) throw new Error('No se encontró el CSS principal en dist/assets');

const cssPath = `/assets/${cssFile}`;

// Lee el HTML y reemplaza el marcador
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace(/<!-- INICIO_CSS_AUTOMATICO -->(.|\n)*?<!-- FIN_CSS_AUTOMATICO -->/, `<!-- INICIO_CSS_AUTOMATICO -->\n<link rel="preload" as="style" href="${cssPath}" />\n<link rel="stylesheet" href="${cssPath}" media="print" onload="this.media='all'">\n<noscript>\n  <link rel="stylesheet" href="${cssPath}">\n</noscript>\n<!-- FIN_CSS_AUTOMATICO -->`);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('CSS principal inyectado automáticamente en index.html'); 