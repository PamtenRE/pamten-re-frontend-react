/**
 * Custom server.js for local Azure App Service testing
 * This file mimics Azure's behavior by delegating to the standalone Next.js server
 * 
 * For actual Azure deployment, the standalone server.js from nextjs/standalone/ is used directly.
 * This file is only for local testing with `npm run start:azure`
 */

const path = require('path');

// Delegate to the standalone Next.js server generated during build
const standaloneServerPath = path.join(__dirname, 'nextjs', 'standalone', 'server.js');

try {
  // Azure App Service provides PORT via environment variable
  // Default to 8080 for local testing (Azure uses dynamic port, typically 8080)
  if (!process.env.PORT) {
    process.env.PORT = '8080';
  }

  console.log(`Starting Next.js server on port ${process.env.PORT}...`);
  require(standaloneServerPath);
} catch (error) {
  console.error('Failed to boot standalone Next.js server:', error);
  console.error('\nMake sure you have run `npm run build` first to generate the standalone build.');
  process.exit(1);
}
