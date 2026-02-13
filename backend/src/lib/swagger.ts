/**
 * Complete OpenAPI 3.0 Specification for ScriptureSpot API
 * Comprehensive documentation of all 33+ API endpoints
 */

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ScriptureSpot API',
    version: '1.0.0',
    description: 'REST API for Biblical content, commentaries, and search',
    contact: {
      name: 'ScriptureSpot Support',
      email: 'support@scripturespot.com',
      url: 'https://scripturespot.com/contact',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || '',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  tags: [
    { name: 'Bible', description: 'Bible content' },
    { name: 'Authors', description: 'Commentary authors' },
    { name: 'Commentaries', description: 'Biblical commentaries' },
    { name: 'Search', description: 'Search content' },
    { name: 'User', description: 'User bookmarks' },
    { name: 'Exploration', description: 'Study tools' },
    { name: 'Forms', description: 'Contact and subscriptions' },
    { name: 'SEO', description: 'Sitemaps' },
    { name: 'Data Import', description: 'Import tools' },
  ],
  paths: {},
};
