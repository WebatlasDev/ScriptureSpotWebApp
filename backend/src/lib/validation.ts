/**
 * Validation utilities using Zod
 * Equivalent to FluentValidation in C#
 */

import { z } from 'zod';

export { z };

/**
 * Validate request data against a Zod schema
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

/**
 * Create API error response
 */
export function createErrorResponse(errors: string[], status: number = 400) {
  return Response.json(
    {
      success: false,
      errors,
    },
    { status }
  );
}

/**
 * Create API success response
 */
export function createSuccessResponse<T>(data: T, status: number = 200) {
  return Response.json(
    {
      success: true,
      data,
    },
    { status }
  );
}
