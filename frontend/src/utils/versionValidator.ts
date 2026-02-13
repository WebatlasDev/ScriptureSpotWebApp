import agent from '@/app/api/agent';
import { env } from '@/types/env';

export async function isValidVersion(version: string): Promise<boolean> {
  try {
    const versions = await agent.Bible.listBibleVersions({});
    if (Array.isArray(versions)) {
      return versions.some(
        (v: { abbreviation?: string }) =>
          v.abbreviation?.toLowerCase() === version.toLowerCase()
      );
    }
  } catch {
  }
  // Fallback to default version if API check fails
  return version.toLowerCase() === env.defaultVersion.toLowerCase();
}
