export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>ScriptureSpot API</h1>
      <p>Welcome to the ScriptureSpot API - migrated from C# to Next.js</p>
      
      <h2>API Documentation</h2>
      <p>The API is available at <code>/api</code></p>
      
      <h3>Available Endpoints:</h3>
      <ul>
        <li><code>/api/authors</code> - Author and commentary endpoints (5)</li>
        <li><code>/api/bible</code> - Bible books, chapters, verses (10)</li>
        <li><code>/api/exploration</code> - Interlinear and lexicon (4)</li>
        <li><code>/api/search</code> - Search functionality (2)</li>
        <li><code>/api/user</code> - User bookmarks (4)</li>
        <li><code>/api/forms</code> - Contact and subscriptions (4)</li>
        <li><code>/api/landing-pages</code> - Dynamic pages (2)</li>
        <li><code>/api/seo</code> - Sitemaps and keywords (4)</li>
        <li><code>/api/verse-of-the-day</code> - Daily verse (1)</li>
        <li><code>/api/bible-imports</code> - Import Bibles (2, admin)</li>
        <li><code>/api/data-imports</code> - Data imports (14, admin)</li>
      </ul>
      
      <p><strong>Total: 53 API endpoints</strong></p>
      
      <h3>Technology Stack:</h3>
      <ul>
        <li>Next.js 14+ with App Router</li>
        <li>TypeScript</li>
        <li>Prisma ORM</li>
        <li>PostgreSQL (Supabase-ready), Redis, Elasticsearch</li>
        <li>Clerk Authentication</li>
      </ul>
    </main>
  );
}
