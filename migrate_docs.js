import fs from 'fs';
import path from 'path';

const docsDir = 'c:\\Users\\Sairam nayak\\OneDrive\\Documents\\Downloads\\CodeCanvas\\public\\docs';

function migrateFile(filePath) {
    if (filePath.endsWith('index.html') || filePath.endsWith('navbar.html') || filePath.endsWith('sidebar.html')) {
        return; // Skip these
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove hardcoded sidebar
    const sidebarRegex = /<aside id="sidebar"[\s\S]*?<\/aside>/g;
    content = content.replace(sidebarRegex, '<!-- Sidebar injected by script.js -->');

    // 2. Remove hardcoded mobile toggle
    const toggleRegex = /<button id="mobile-toggle"[\s\S]*?<\/button>/g;
    content = content.replace(toggleRegex, '');

    // 3. Remove hardcoded header if any
    const headerRegex = /<header id="header-wrapper"[\s\S]*?<\/header>/g;
    content = content.replace(headerRegex, '<!-- Navbar injected by script.js -->');

    // 4. Ensure script.js is included before </body>
    if (!content.includes('script.js')) {
        content = content.replace('</body>', '  <script src="script.js"></script>\n</body>');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Migrated: ${path.basename(filePath)}`);
}

const files = fs.readdirSync(docsDir);
files.forEach(file => {
    if (file.endsWith('.html')) {
        migrateFile(path.join(docsDir, file));
    }
});
