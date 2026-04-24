import fs from 'fs';
import path from 'path';

const docsDir = 'public/docs';
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.html') && f !== 'navbar.html');

files.forEach(file => {
  const filePath = path.join(docsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove Top Navbar placeholder and content before main
  // Matches from <!-- Top Navbar --> to <main...
  content = content.replace(/<!-- Top Navbar -->[\s\S]*?(?=<main)/i, '<!-- Navbar injected by script.js -->\n  ');

  // 2. Remove mobile toggle button
  content = content.replace(/<button id="mobile-toggle"[\s\S]*?<\/button>/gi, '');

  // 3. Remove sidebar aside block
  content = content.replace(/<aside id="sidebar"[\s\S]*?<\/aside>/gi, '<!-- Sidebar injected by script.js -->');

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned up ${file}`);
});
