/**
 * API Documentation Page Redirect
 * Redirects to the Swagger UI documentation
 */

import { redirect } from 'next/navigation';

export default function ApiPage() {
  redirect('/docs');
}
