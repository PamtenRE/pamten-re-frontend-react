/**
 * Custom server.js for Azure App Service deployment
 * This file is used by Azure's IISNode to start the Next.js application
 */

const path = require('path');

// Delegate to the standalone Next.js server generated during build
const standaloneServerPath = path.join(__dirname, 'nextjs', 'standalone', 'server.js');

try {
  // Ensure a sensible default port for Azure (falls back to 3000 locally)
  if (!process.env.PORT) {
    process.env.HOST = '8181';
    process.env.PORT = process.env.PORT || 8080;
  }

  //Run the Next.js standalone server
  require(standaloneServerPath);
} catch (error) {
  console.error('Failed to boot standalone Next.js server:', error);
  process.exit(1);
}
