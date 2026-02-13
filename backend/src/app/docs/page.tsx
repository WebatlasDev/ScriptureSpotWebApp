/**
 * Swagger UI Documentation Page
 * Standard OpenAPI/Swagger UI for API documentation
 */

'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <SwaggerUI
      url="/api/docs"
      docExpansion="list"
      defaultModelsExpandDepth={1}
      defaultModelExpandDepth={1}
      displayRequestDuration={true}
      filter={true}
      tryItOutEnabled={true}
    />
  );
}
