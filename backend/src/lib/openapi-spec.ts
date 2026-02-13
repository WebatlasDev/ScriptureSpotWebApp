/**
 * Complete OpenAPI 3.0 Specification
 * All 50+ ScriptureSpot API endpoints fully documented
 */

// Get the base URL from environment variable
const getServers = () => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  return [
    { url: baseUrl, description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development' }
  ];
};

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ScriptureSpot API',
    version: '1.0.0',
    description: 'REST API for Biblical content, commentaries, and search',
    contact: {
      name: 'ScriptureSpot',
      email: 'support@scripturespot.com'
    },
    license: {
      name: 'MIT'
    }
  },
  servers: getServers(),
  tags: [
    { name: 'Bible', description: 'Bible content' },
    { name: 'Authors', description: 'Commentary authors' },
    { name: 'Commentaries', description: 'Biblical commentaries' },
    { name: 'Search', description: 'Search content' },
    { name: 'User', description: 'User bookmarks' },
    { name: 'Exploration', description: 'Study tools' },
    { name: 'Forms', description: 'Contact and subscriptions' },
    { name: 'SEO', description: 'Sitemaps' },
    { name: 'Data Import', description: 'Import tools' }
  ],
  components: {
    securitySchemes: {
      ClerkAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: '__session',
        description: 'Clerk authentication session cookie'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' }
        }
      },
      BibleVersion: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'King James Version' },
          abbreviation: { type: 'string', example: 'KJV' },
          language: { type: 'string', example: 'English' },
          description: { type: 'string', nullable: true },
          publishYear: { type: 'integer', nullable: true }
        }
      },
      BibleBook: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          versionId: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Genesis' },
          slug: { type: 'string', example: 'genesis' },
          number: { type: 'integer', example: 1 },
          testament: { type: 'string', enum: ['OT', 'NT'] },
          chapterCount: { type: 'integer' }
        }
      },
      BibleChapter: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          bookId: { type: 'string', format: 'uuid' },
          number: { type: 'integer' },
          verseCount: { type: 'integer' }
        }
      },
      BibleVerse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          chapterId: { type: 'string', format: 'uuid' },
          number: { type: 'integer' },
          text: { type: 'string' }
        }
      },
      Author: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Augustine of Hippo' },
          slug: { type: 'string' },
          born: { type: 'integer', nullable: true },
          died: { type: 'integer', nullable: true },
          imageUrl: { type: 'string', nullable: true }
        }
      },
      Commentary: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          authorId: { type: 'string', format: 'uuid' },
          author: { $ref: '#/components/schemas/Author' },
          excerpts: { type: 'array', items: { type: 'object' } }
        }
      },
      Bookmark: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string' },
          verseId: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['verse', 'chapter', 'book'] },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/api/bible/versions': {
      get: {
        tags: ['Bible'],
        summary: 'List all Bible versions',
        description: 'Returns all available Bible translations/versions',
        responses: {
          '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/BibleVersion' } } } } },
          '500': { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/api/bible/books': {
      get: {
        tags: ['Bible'],
        summary: 'List all Bible books',
        description: 'Returns all books of the Bible ordered by book number',
        responses: {
          '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/BibleBook' } } } } }
        }
      }
    },
    '/api/bible/chapters': {
      get: {
        tags: ['Bible'],
        summary: 'List chapters in a book',
        description: 'Returns all chapters for a specific Bible book',
        parameters: [
          { name: 'bookId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Bible book ID' },
          { name: 'versionId', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Bible version ID (optional)' }
        ],
        responses: {
          '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/BibleChapter' } } } } },
          '400': { description: 'Missing bookId parameter' }
        }
      }
    },
    '/api/bible/verses': {
      get: {
        tags: ['Bible'],
        summary: 'List verses in a chapter',
        description: 'Returns all verses for a specific chapter',
        parameters: [
          { name: 'chapterId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' }, description: 'Chapter ID' }
        ],
        responses: {
          '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/BibleVerse' } } } } }
        }
      }
    },
    '/api/bible/verses/versions': {
      get: {
        tags: ['Bible'],
        summary: 'Get verse in multiple versions',
        description: 'Returns the same verse across different Bible translations',
        parameters: [
          { name: 'verseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'versionIds', in: 'query', schema: { type: 'string' }, description: 'Comma-separated version IDs' }
        ],
        responses: {
          '200': { description: 'Success' }
        }
      }
    },
    '/api/bible/verse/version': {
      get: {
        tags: ['Bible'],
        summary: 'Get specific verse version',
        description: 'Returns a single verse in a specific translation',
        parameters: [
          { name: 'verseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'versionId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success' }
        }
      }
    },
    '/api/bible/verse/range': {
      get: {
        tags: ['Bible'],
        summary: 'Get verse range',
        description: 'Returns multiple consecutive verses as formatted HTML',
        parameters: [
          { name: 'startVerseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'endVerseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'versionId', in: 'query', schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Returns HTML formatted verse range' }
        }
      }
    },
    '/api/bible/verse/cross-references': {
      get: {
        tags: ['Exploration'],
        summary: 'Get verse cross-references',
        description: 'Returns related verses that reference or are referenced by this verse',
        parameters: [
          { name: 'verseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Array of cross-references' }
        }
      }
    },
    '/api/bible/verse/takeaways': {
      get: {
        tags: ['Exploration'],
        summary: 'Get verse takeaways',
        description: 'Returns curated insights and teaching points for a verse',
        parameters: [
          { name: 'verseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Array of takeaways with author info' }
        }
      }
    },
    '/api/bible/book/overview': {
      get: {
        tags: ['Bible'],
        summary: 'Get book overview',
        description: 'Returns comprehensive overview of a Bible book including structure, themes, and summary',
        parameters: [
          { name: 'bookId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Book overview with themes and structure' }
        }
      }
    },
    '/api/authors': {
      get: {
        tags: ['Authors'],
        summary: 'List all authors',
        description: 'Returns all commentary authors with biographical information',
        responses: {
          '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Author' } } } } }
        }
      }
    },
    '/api/authors/commentaries/verse': {
      get: {
        tags: ['Commentaries'],
        summary: 'Get commentaries for a verse',
        description: 'Returns all available commentaries for a specific verse',
        parameters: [
          { name: 'verseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'requestType', in: 'query', schema: { type: 'string', enum: ['full', 'preview'] } },
          { name: 'maxLength', in: 'query', schema: { type: 'integer' } }
        ],
        responses: {
          '200': { description: 'Success - Array of commentaries with excerpts' }
        }
      }
    },
    '/api/authors/commentaries/chapter': {
      get: {
        tags: ['Commentaries'],
        summary: 'Get commentaries for a chapter',
        description: 'Returns commentaries covering an entire chapter',
        parameters: [
          { name: 'chapterId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } },
          { name: 'requestType', in: 'query', schema: { type: 'string', enum: ['full', 'preview'] } }
        ],
        responses: {
          '200': { description: 'Success' }
        }
      }
    },
    '/api/authors/commentaries/availability': {
      get: {
        tags: ['Commentaries'],
        summary: 'Check book commentary availability',
        description: 'Returns which books have commentary available',
        responses: {
          '200': { description: 'Success - Map of book IDs to availability' }
        }
      }
    },
    '/api/authors/commentaries/chapter/availability': {
      get: {
        tags: ['Commentaries'],
        summary: 'Check chapter commentary availability',
        description: 'Returns which chapters in a book have commentary',
        parameters: [
          { name: 'bookId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Array of chapter numbers with commentary' }
        }
      }
    },
    '/api/search': {
      get: {
        tags: ['Search'],
        summary: 'Search all content',
        description: 'Full-text search across verses, commentaries, authors using Elasticsearch',
        parameters: [
          { name: 'query', in: 'query', required: true, schema: { type: 'string' }, description: 'Search query', example: 'faith hope love' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'pageSize', in: 'query', schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': { description: 'Success - Grouped search results by type' },
          '400': { description: 'Missing query parameter' }
        }
      }
    },
    '/api/search/balanced': {
      get: {
        tags: ['Search'],
        summary: 'Balanced search results',
        description: 'Returns search results balanced across different content types',
        parameters: [
          { name: 'query', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
        ],
        responses: {
          '200': { description: 'Success - Balanced results across content types' }
        }
      }
    },
    '/api/user/bookmarks': {
      get: {
        tags: ['User'],
        summary: 'List user bookmarks',
        description: 'Returns all bookmarks for the authenticated user',
        security: [{ ClerkAuth: [] }],
        parameters: [
          { name: 'bookmarkType', in: 'query', schema: { type: 'string', enum: ['verse', 'chapter', 'book'] } }
        ],
        responses: {
          '200': { description: 'Success', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Bookmark' } } } } },
          '401': { description: 'Unauthorized - authentication required' }
        }
      }
    },
    '/api/user/bookmarks/detailed': {
      get: {
        tags: ['User'],
        summary: 'Get detailed bookmarks',
        description: 'Returns bookmarks with full verse/chapter content',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Success - Bookmarks with expanded content' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/user/bookmark': {
      post: {
        tags: ['User'],
        summary: 'Create bookmark',
        description: 'Creates a new bookmark for the authenticated user',
        security: [{ ClerkAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['entityId', 'bookmarkType'],
                properties: {
                  entityId: { type: 'string', format: 'uuid' },
                  bookmarkType: { type: 'string', enum: ['verse', 'chapter', 'book'] }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Bookmark created' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['User'],
        summary: 'Delete bookmark',
        description: 'Removes a bookmark for the authenticated user',
        security: [{ ClerkAuth: [] }],
        parameters: [
          { name: 'entityId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Bookmark deleted' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/exploration/interlinear/verse': {
      get: {
        tags: ['Exploration'],
        summary: 'Get interlinear text for verse',
        description: 'Returns word-by-word interlinear translation with original Hebrew/Greek',
        parameters: [
          { name: 'verseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Array of interlinear words with translations' }
        }
      }
    },
    '/api/exploration/interlinear/chapter': {
      get: {
        tags: ['Exploration'],
        summary: 'Get interlinear text for chapter',
        description: 'Returns interlinear translation for entire chapter',
        parameters: [
          { name: 'chapterId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Chapter interlinear data' }
        }
      }
    },
    '/api/exploration/lexicon/entry': {
      get: {
        tags: ['Exploration'],
        summary: 'Get lexicon entry',
        description: 'Returns Strong\'s lexicon entry with definition and usage',
        parameters: [
          { name: 'strongsNumber', in: 'query', required: true, schema: { type: 'string' }, example: 'H430' }
        ],
        responses: {
          '200': { description: 'Success - Lexicon entry with definition' }
        }
      }
    },
    '/api/exploration/lexicon/verse/references': {
      get: {
        tags: ['Exploration'],
        summary: 'Get verse lexicon references',
        description: 'Returns all Strong\'s numbers used in a verse',
        parameters: [
          { name: 'verseId', in: 'query', required: true, schema: { type: 'string', format: 'uuid' } }
        ],
        responses: {
          '200': { description: 'Success - Array of Strong\'s references' }
        }
      }
    },
    '/api/verse-of-the-day': {
      get: {
        tags: ['SEO'],
        summary: 'Get verse of the day',
        description: 'Returns the featured verse of the day',
        responses: {
          '200': { description: 'Success - Verse with metadata' }
        }
      }
    },
    '/api/landing-pages': {
      get: {
        tags: ['SEO'],
        summary: 'Get landing page',
        description: 'Returns SEO-optimized landing page content',
        parameters: [
          { name: 'slug', in: 'query', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Success - Landing page with components' },
          '404': { description: 'Page not found' }
        }
      }
    },
    '/api/landing-pages/generate': {
      post: {
        tags: ['SEO'],
        summary: 'Generate landing pages',
        description: 'Generates SEO landing pages from keywords',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Pages generated' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/seo/sitemap/index': {
      get: {
        tags: ['SEO'],
        summary: 'Get sitemap index',
        description: 'Returns XML sitemap index',
        responses: {
          '200': { description: 'Sitemap index XML', content: { 'application/xml': { schema: { type: 'string' } } } }
        }
      }
    },
    '/api/seo/sitemap/{identifier}': {
      get: {
        tags: ['SEO'],
        summary: 'Get sitemap',
        description: 'Returns specific sitemap XML',
        parameters: [
          { name: 'identifier', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '200': { description: 'Sitemap XML', content: { 'application/xml': { schema: { type: 'string' } } } }
        }
      }
    },
    '/api/forms/contact': {
      post: {
        tags: ['Forms'],
        summary: 'Submit contact form',
        description: 'Sends a contact form message',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'message'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Message sent' },
          '400': { description: 'Invalid data' }
        }
      }
    },
    '/api/forms/subscribe': {
      post: {
        tags: ['Forms'],
        summary: 'Subscribe to newsletter',
        description: 'Subscribes email to newsletter',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Subscribed' }
        }
      }
    },
    '/api/forms/unsubscribe': {
      post: {
        tags: ['Forms'],
        summary: 'Unsubscribe from newsletter',
        description: 'Removes email from newsletter',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Unsubscribed' }
        }
      }
    },
    '/api/forms/resubscribe': {
      post: {
        tags: ['Forms'],
        summary: 'Resubscribe to newsletter',
        description: 'Reactivates newsletter subscription',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', format: 'email' }
                }
              }
            }
          }
        },
        responses: {
          '200': { description: 'Resubscribed' }
        }
      }
    },
    '/api/data-imports/import/authors': {
      post: {
        tags: ['Data Import'],
        summary: 'Import authors',
        description: 'Imports author data from Google Sheets',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/import/authors/commentaries/tsv': {
      post: {
        tags: ['Data Import'],
        summary: 'Import commentaries from TSV',
        description: 'Imports commentary data from TSV file',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/import/bible/book/overviews': {
      post: {
        tags: ['Data Import'],
        summary: 'Import book overviews',
        description: 'Imports Bible book overviews',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/import/bible/verse/takeaways': {
      post: {
        tags: ['Data Import'],
        summary: 'Import verse takeaways',
        description: 'Imports verse teaching takeaways',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/import/exploration/bible-verse-cross-references': {
      post: {
        tags: ['Data Import'],
        summary: 'Import cross-references',
        description: 'Imports verse cross-reference data',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/import/exploration/interlinears': {
      post: {
        tags: ['Data Import'],
        summary: 'Import interlinear data',
        description: 'Imports Hebrew/Greek interlinear text',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/import/exploration/strong-lexicons': {
      post: {
        tags: ['Data Import'],
        summary: 'Import Strong\'s lexicons',
        description: 'Imports Strong\'s concordance data',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/import/exploration/catechisms': {
      post: {
        tags: ['Data Import'],
        summary: 'Import catechisms',
        description: 'Imports catechism questions and answers',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/cache/clear': {
      post: {
        tags: ['Data Import'],
        summary: 'Clear cache',
        description: 'Clears Redis cache',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Cache cleared' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/data-imports/search/refresh': {
      post: {
        tags: ['Data Import'],
        summary: 'Refresh search index',
        description: 'Reindexes all content in Elasticsearch',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Reindexing started' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/bible-imports/versions': {
      get: {
        tags: ['Data Import'],
        summary: 'List importable Bible versions',
        description: 'Returns available Bible versions for import',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Available versions' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/bible-imports/import/bibles/folder': {
      post: {
        tags: ['Data Import'],
        summary: 'Import Bible from folder',
        description: 'Imports Bible XML files from folder',
        security: [{ ClerkAuth: [] }],
        responses: {
          '200': { description: 'Import completed' },
          '401': { description: 'Unauthorized' }
        }
      }
    }
  }
};
